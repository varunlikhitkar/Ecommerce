import React, { useState, useContext } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { clearCart } from '../redux/cartSlice';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Loader from '../components/ui/Loader';
import EmptyState from '../components/ui/EmptyState';
import '../styles/cart.css';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: '', street: '', city: '', postalCode: '', country: ''
  });
  const [errors, setErrors] = useState({});
  const [isPaying, setIsPaying] = useState(false);

  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

  const validate = () => {
    const nextErrors = {};
    if (!address.fullName.trim()) nextErrors.fullName = 'Full name is required.';
    if (!address.street.trim()) nextErrors.street = 'Street address is required.';
    if (!address.city.trim()) nextErrors.city = 'City is required.';
    if (!address.postalCode.trim()) nextErrors.postalCode = 'Postal code is required.';
    if (!address.country.trim()) nextErrors.country = 'Country is required.';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePayment = async () => {
    try {
      setIsPaying(true);
      const orderRes = await fetch('/api/payment/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice })
      });
      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        // Razorpay unconfigured exception handler
        const fallback = window.confirm("Razorpay keys unconfigured on backend. Use Student Bypass Mode to place test order?");
        if (fallback) {
          return bypassPayment();
        } else {
          setIsPaying(false);
          return alert("Payment failed to initialize");
        }
      }

      const options = {
        key: 'rzp_test_dummykey123', // Student dummy fallback
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Saha Traditions',
        description: 'Test Transaction',
        order_id: orderData.id,
        handler: async function (response) {
          const verifyRes = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response)
          });
          if (verifyRes.ok) {
            const saveOrderRes = await fetch('/api/orders', {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${user.token}`
              },
              body: JSON.stringify({
                items: cartItems,
                totalAmount: totalPrice,
                address,
                paymentId: response.razorpay_payment_id
              })
            });

            if (saveOrderRes.ok) {
              dispatch(clearCart());
              navigate('/ordersuccess');
            } else {
              setIsPaying(false);
              alert('Order saving failed');
            }
          } else {
            setIsPaying(false);
            alert('Payment verification failed');
          }
        },
        prefill: {
          name: address.fullName,
          email: user?.email,
          contact: '9999999999'
        },
        theme: {
          color: '#D95C47'
        }
      };
      
      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (error) {
      console.error(error);
      setIsPaying(false);
    }
  };

  const bypassPayment = async () => {
    const saveOrderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        items: cartItems,
        totalAmount: totalPrice,
        address,
        paymentId: 'bypass_txn_' + Date.now()
      })
    });
    if (saveOrderRes.ok) {
      dispatch(clearCart());
      navigate('/ordersuccess');
    } else {
      setIsPaying(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      alert("Please login first");
      navigate('/login');
      return;
    }
    if (cartItems.length === 0) {
      alert('Your cart is empty');
      return;
    }
    if (!validate()) return;
    handlePayment();
  };

  return (
    <div className="page checkout-container">
      <div className="section-header">
        <div>
          <h2 className="section-title">Checkout</h2>
          <p className="subtle-text">Complete your order with secure payment.</p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <EmptyState
          title="Your cart is empty"
          description="Add items to your cart before checking out."
          action={<Button to="/shop">Browse Products</Button>}
        />
      ) : (
        <div className="checkout-grid">
          <div className="checkout-card">
            <div className="checkout-steps">
              <span className="step active">1. Shipping</span>
              <span className="step">2. Payment</span>
              <span className="step">3. Confirmation</span>
            </div>

            <form onSubmit={handleSubmit} className="shipping-form" noValidate>
              <div className="checkout-card-header">
                <div>
                  <h3>Shipping Address</h3>
                  <p className="subtle-text">We’ll deliver to this address.</p>
                </div>
                <div className="checkout-secure">🔒 100% secure checkout</div>
              </div>

              <div className="checkout-form-grid">
                <Input
                  label="Full Name"
                  name="fullName"
                  placeholder="Full Name"
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                  error={errors.fullName}
                  required
                />
                <Input
                  label="Street"
                  name="street"
                  placeholder="Street"
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  error={errors.street}
                  required
                  className="span-2"
                />
                <Input
                  label="City"
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  error={errors.city}
                  required
                />
                <Input
                  label="Postal Code"
                  name="postalCode"
                  placeholder="Postal Code"
                  value={address.postalCode}
                  onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                  error={errors.postalCode}
                  required
                />
                <Input
                  label="Country"
                  name="country"
                  placeholder="Country"
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  error={errors.country}
                  required
                  className="span-2"
                />
              </div>

              <div className="checkout-summary">
                <div className="checkout-note">
                  By placing the order, you agree to our terms & privacy policy.
                </div>
                <div className="checkout-total">
                  <span>Total to Pay</span>
                  <strong>₹{totalPrice.toFixed(2)}</strong>
                </div>
                <Button type="submit" size="lg" disabled={isPaying} className="checkout-pay-btn">
                  {isPaying ? 'Processing...' : 'Pay Now'}
                </Button>
                {isPaying && <Loader label="Processing payment" />}
              </div>
            </form>
          </div>

          <div className="checkout-summary-card">
            <div className="checkout-card-header">
              <div>
                <h3>Order Summary</h3>
                <p className="subtle-text">Review your items.</p>
              </div>
              <span className="checkout-badge">{cartItems.length} items</span>
            </div>

            <div className="checkout-items">
              {cartItems.map((item) => (
                <div key={item.productId || item._id} className="checkout-item">
                  <img src={item.imageUrl} alt={item.name} className="checkout-item-image" />
                  <div className="checkout-item-details">
                    <h4>{item.name}</h4>
                    <p className="subtle-text">Qty: {item.qty}</p>
                  </div>
                  <div className="checkout-item-price">₹{(item.price * item.qty).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="checkout-divider" />

            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Shipping</span>
              <span className="accent-text">Free</span>
            </div>
            <div className="checkout-summary-row">
              <span>Taxes</span>
              <span className="subtle-text">Included</span>
            </div>

            <div className="checkout-divider" />

            <div className="checkout-summary-row total">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>

            <div className="checkout-benefits">
              <div>✅ Free returns within 7 days</div>
              <div>🚚 Delivery in 3-5 business days</div>
              <div>🔐 Secure payments powered by Razorpay</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
