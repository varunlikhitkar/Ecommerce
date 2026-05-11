import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h3>Saha Traditions</h3>
          <p className="subtle-text">Premium E-Commerce Platform.</p>
        </div>

        <div className="footer-links">
          <Link to="/about">About Us</Link>
          <Link to="/return">Return Policy</Link>
          <Link to="/disclaimer">Disclaimer</Link>
        </div>

        <div className="footer-meta">
          &copy; {new Date().getFullYear()} Saha Traditions. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
