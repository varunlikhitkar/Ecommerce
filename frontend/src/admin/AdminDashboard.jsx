import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import '../styles/admin.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await fetch('/api/analytics', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setStats(data);
        } else {
          if (res.status === 401) {
            navigate('/login');
          }
          setStats({ totalOrders: 0, totalProducts: 0, totalUsers: 0, totalRevenue: 0 });
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchStats();
  }, [user, navigate]);

  return (
    <div className="admin-page">
      <div className="admin-hero">
        <img src="/SahaLogo.png" alt="Logo" />
        <div>
          <h2>Admin Dashboard</h2>
          <p className="subtle-text">Welcome back, <span style={{ color: '#2B2B2B' }}>{user?.name}</span></p>
        </div>
      </div>

      {stats ? (
        <div className="stat-grid">
          <div className="stat-card">
            <h4>Total Orders</h4>
            <div className="stat-value">{stats.totalOrders}</div>
          </div>
          <div className="stat-card">
            <h4>Total Products</h4>
            <div className="stat-value">{stats.totalProducts}</div>
          </div>
          <div className="stat-card">
            <h4>Total Users</h4>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat-card">
            <h4>Total Revenue</h4>
            <div className="stat-value">₹{stats.totalRevenue.toFixed(2)}</div>
          </div>
        </div>
      ) : (
        <Loader label="Loading metrics" />
      )}

      <div className="section">
        <h3 style={{ marginBottom: '20px', color: '#D95C47' }}>Administrative Controls</h3>
        <div className="admin-actions">
          <Button onClick={() => navigate('/admin/add-product')}>+ Add Product</Button>
          <Button variant="secondary" onClick={() => navigate('/admin/products')}>📦 Manage Products</Button>
          <Button variant="secondary" onClick={() => navigate('/admin/orders')}>🚚 Manage Orders</Button>
          <Button variant="secondary" onClick={() => navigate('/admin/users')}>👥 Users Directory</Button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
