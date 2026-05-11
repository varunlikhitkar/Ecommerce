import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data.slice(0, 4)); // Featured products
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="page">
      <section className="hero-banner">
        <h1>Discover quality essentials for every lifestyle.</h1>
        <p>Shop premium products with secure checkout, fast delivery, and thoughtful curation.</p>
        <div style={{ marginTop: '28px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Button to="/shop" size="lg">Start Shopping</Button>
          <Button to="/about" variant="secondary" size="lg">Why Saha Traditions</Button>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="subtle-text">Handpicked items customers love right now.</p>
          </div>
          <Button to="/shop" variant="secondary">View All</Button>
        </div>

        {loading ? (
          <div className="product-grid">
            {[...Array(4)].map((_, idx) => (
              <div key={idx} className="product-card">
                <Skeleton style={{ height: '220px', width: '100%' }} />
                <div style={{ padding: '20px' }}>
                  <Skeleton style={{ height: '18px', width: '80%', marginBottom: '12px' }} />
                  <Skeleton style={{ height: '16px', width: '40%', marginBottom: '18px' }} />
                  <Skeleton style={{ height: '38px', width: '100%' }} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <h2 className="section-title">Why shop with us</h2>
            <p className="subtle-text">Premium experience from browsing to delivery.</p>
          </div>
        </div>
        <div className="product-grid">
          {[
            { title: 'Fast Delivery', description: 'Track orders and get updates with every shipment.' },
            { title: 'Secure Payments', description: 'Trusted payment providers and encrypted checkout.' },
            { title: 'Curated Products', description: 'Quality-checked items from vetted sellers.' },
            { title: '24/7 Support', description: 'We are here when you need help.' }
          ].map((item) => (
            <div key={item.title} className="product-card" style={{ padding: '24px' }}>
              <h3>{item.title}</h3>
              <p className="subtle-text">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
