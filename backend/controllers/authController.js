const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const sendEmail = require('../utils/sendEmail');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const sendOtpEmail = async ({ name, email, otp }) => {
  const message = `
    <h2>Welcome to Saha Traditions, ${name}!</h2>
    <p>Use the OTP below to verify your account. This OTP expires in 10 minutes.</p>
    <p>Your one-time verification OTP is: <strong>${otp}</strong></p>
  `;

  await sendEmail({
    email,
    subject: 'Saha Traditions - Verify your account',
    message
  });
};

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists && userExists.isVerified) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    if (userExists && !userExists.isVerified) {
      userExists.name = name || userExists.name;
      userExists.password = password ? await bcrypt.hash(password, 10) : userExists.password;
      userExists.otpHash = otpHash;
      userExists.otpExpiresAt = otpExpiresAt;
      await userExists.save();
      await sendOtpEmail({ name: userExists.name, email: userExists.email, otp });
      return res.status(200).json({
        message: 'OTP sent to email. Please verify to continue.',
        email: userExists.email
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otpHash,
      otpExpiresAt,
      isVerified: false
    });

    await sendOtpEmail({ name, email, otp });

    return res.status(201).json({
      message: 'OTP sent to email. Please verify to continue.',
      email: user.email
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: 'Email and OTP are required.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });
    if (user.isVerified) return res.status(400).json({ message: 'User already verified.' });
    if (!user.otpHash || !user.otpExpiresAt) {
      return res.status(400).json({ message: 'OTP not requested. Please register again.' });
    }
    if (user.otpExpiresAt < new Date()) {
      return res.status(400).json({ message: 'OTP expired. Please register again.' });
    }

    const isMatch = await bcrypt.compare(otp.toString(), user.otpHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid OTP.' });

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    return res.json({ message: 'Account verified. You can now login.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      if (!user.isVerified) {
        return res.status(403).json({ message: 'Please verify your account before logging in.' });
      }
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, verifyOtp, loginUser, getUsers };
