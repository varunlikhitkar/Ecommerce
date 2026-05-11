const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Product = require('./models/Product');
const connectDB = require('./config/db');

dotenv.config();

connectDB();

const importData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const adminUser = await User.create({
      name: 'satyam',
      email: 'satyam@gmail.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true
    });


    const baseProducts = [
  {
    name: 'Wireless Noise-Cancelling Headphones',
    description: 'Immersive sound with active noise cancellation and 30-hour battery life.',
    price: 299.99,
    category: 'Electronics',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e',
    ratings: 4.8,
    numReviews: 42
  },
  {
    name: 'Minimalist Modern Chair',
    description: 'Ergonomic and stylish chair for living rooms or offices.',
    price: 159.0,
    category: 'Furniture',
    stock: 35,
    imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1',
    ratings: 4.3,
    numReviews: 18
  },

  // 🔥 Adding more products

  {
    name: 'Gaming Mechanical Keyboard',
    description: 'RGB backlit keyboard with blue switches.',
    price: 79.99,
    category: 'Electronics',
    stock: 40,
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8',
    ratings: 4.7,
    numReviews: 88
  },
  {
    name: '4K Ultra HD Monitor',
    description: '27-inch UHD display with stunning clarity.',
    price: 349.99,
    category: 'Electronics',
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf',
    ratings: 4.6,
    numReviews: 55
  },
  {
    name: 'Office Desk Lamp',
    description: 'LED lamp with adjustable brightness.',
    price: 29.99,
    category: 'Home',
    stock: 70,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c',
    ratings: 4.4,
    numReviews: 22
  },
  {
    name: 'Yoga Mat Premium',
    description: 'Non-slip yoga mat for all workouts.',
    price: 25.99,
    category: 'Fitness',
    stock: 90,
    imageUrl: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e',
    ratings: 4.5,
    numReviews: 66
  },
  {
    name: 'Smartphone Tripod Stand',
    description: 'Adjustable tripod for mobile photography.',
    price: 15.99,
    category: 'Accessories',
    stock: 100,
    imageUrl: 'https://images.unsplash.com/photo-1519183071298-a2962be96a13',
    ratings: 4.3,
    numReviews: 30
  },
  {
    name: 'Casual Denim Jacket',
    description: 'Stylish denim jacket for everyday wear.',
    price: 69.99,
    category: 'Clothing',
    stock: 50,
    imageUrl: 'https://images.unsplash.com/photo-1520975916090-3105956dac38',
    ratings: 4.6,
    numReviews: 40
  },
  {
    name: 'Wireless Mouse',
    description: 'Ergonomic mouse with long battery life.',
    price: 19.99,
    category: 'Electronics',
    stock: 80,
    imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04',
    ratings: 4.5,
    numReviews: 73
  },
  {
    name: 'Portable Power Bank',
    description: '10000mAh fast charging power bank.',
    price: 22.99,
    category: 'Electronics',
    stock: 65,
    imageUrl: 'https://images.unsplash.com/photo-1580910051074-3eb694886505',
    ratings: 4.4,
    numReviews: 50
  },

  // ⚡ Continue similar pattern...

  {
    name: 'Running Shoes',
    description: 'Lightweight running shoes with breathable fabric.',
    price: 75.0,
    category: 'Clothing',
    stock: 60,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    ratings: 4.7,
    numReviews: 120
  },
  {
    name: 'Wooden Coffee Table',
    description: 'Elegant wooden table for living room.',
    price: 199.99,
    category: 'Furniture',
    stock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1493666438817-866a91353ca9',
    ratings: 4.3,
    numReviews: 33
  },
  {
    name: 'Smart LED Bulb',
    description: 'WiFi-enabled color changing bulb.',
    price: 12.99,
    category: 'Home',
    stock: 120,
    imageUrl: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b',
    ratings: 4.6,
    numReviews: 90
  }
];

    const products = [
      ...baseProducts,
      ...Array.from({ length: 100 - baseProducts.length }, (_, i) => ({
        name: `Product ${i + baseProducts.length + 1}`,
        description: 'High-quality product with premium features.',
        price: +(Math.random() * 200 + 20).toFixed(2),
        category: ['Electronics', 'Home', 'Clothing', 'Fitness'][i % 4],
        stock: Math.floor(Math.random() * 100 + 10),
        imageUrl: `https://images.unsplash.com/photo-${1500000000000 + i}`,
        ratings: +(Math.random() * 1 + 4).toFixed(1),
        numReviews: Math.floor(Math.random() * 100)
      }))
    ];

    await Product.insertMany(products);

     

    
    console.log('✅ Data Imported Successfully!');
    process.exit();
  } catch (error) {
    console.error(`❌ Error with data import: ${error.message}`);
    process.exit(1);
  }
};

importData();
