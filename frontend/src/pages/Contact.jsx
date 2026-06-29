import React, { useState } from 'react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import '../styles/contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form submission handler - just UI, no backend logic
    setSubmitted(true);
    setTimeout(() => {
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setSubmitted(false);
    }, 3000);
  };

  return (
    <div className="page contact-page">
      <div className="section-header">
        <div>
          <h2 className="section-title">Contact Us</h2>
          <p className="subtle-text">We'd love to hear from you. Get in touch with our team.</p>
        </div>
      </div>

      <div className="contact-container">
        {/* Contact Form */}
        <div className="contact-form-section">
          {submitted && (
            <div className="success-message">
              ✓ Thank you for reaching out! We'll get back to you soon.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="form-group">
              <label htmlFor="fullName" className="form-label">Full Name</label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="subject" className="form-label">Subject</label>
              <Input
                id="subject"
                name="subject"
                type="text"
                value={formData.subject}
                onChange={handleChange}
                placeholder="What is this about?"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="message" className="form-label">Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us more..."
                rows="6"
                className="form-textarea"
                required
              ></textarea>
            </div>

            <Button type="submit" size="lg" className="btn-submit">
              Send Message
            </Button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="contact-info-section">
          <div className="info-card">
            <div className="info-icon">📍</div>
            <h3>Visit Us</h3>
            <p>
              88 Market Road<br />
              Bhopal, India
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">📞</div>
            <h3>Call Us</h3>
            <p>
              +91 044-12345678<br />
              Mon - Fri: 9AM - 6PM
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">✉️</div>
            <h3>Email Us</h3>
            <p>
              support@sahatraditions.com<br />
              We respond within 24 hours
            </p>
          </div>

          <div className="info-card">
            <div className="info-icon">🕐</div>
            <h3>Hours</h3>
            <p>
              Monday - Friday: 9:00 AM - 6:00 PM<br />
              Saturday: 10:00 AM - 4:00 PM<br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="faq-section">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '40px' }}>Frequently Asked Questions</h2>
        
        <div className="faq-grid">
          <div className="faq-item">
            <h4>How quickly will I receive my order?</h4>
            <p>Most orders are delivered within 3-5 business days. You'll receive a tracking number via email once your order ships.</p>
          </div>

          <div className="faq-item">
            <h4>What is your return policy?</h4>
            <p>We offer 30-day returns on most items. Items must be unused and in original packaging. Visit our <a href="/returnpolicy" className="faq-link">Return Policy</a> page for details.</p>
          </div>

          <div className="faq-item">
            <h4>Do you offer international shipping?</h4>
            <p>Currently, we ship within India. We're working on expanding our shipping options. Contact us for more information.</p>
          </div>

          <div className="faq-item">
            <h4>What payment methods do you accept?</h4>
            <p>We accept all major payment methods through our secure Razorpay gateway, including debit cards, credit cards, and digital wallets.</p>
          </div>

          <div className="faq-item">
            <h4>Can I cancel my order?</h4>
            <p>Orders can be cancelled within 24 hours of placement. Please contact us immediately if you wish to cancel.</p>
          </div>

          <div className="faq-item">
            <h4>How can I track my order?</h4>
            <p>You'll receive a tracking number via email. You can also check your order status in your profile under "My Orders".</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
