import React, { useState } from 'react';
import API from '../api/axios';
import PaymentStatus from './PaymentStatus';

const Product = () => {
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Sample Product Details
  const product = {
    title: 'Full-Stack MERN Course',
    description: 'Complete hands-on guide to building production-ready apps with Razorpay integration.',
    price: 499,
    currency: 'INR',
  };

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage('');
    setVerificationResult(null);

    try {
      // Step 1: Create Order via Backend API (/payment/create-order)
      const { data } = await API.post('/payment/create-order', {
        amount: product.price,
        currency: product.currency,
      });

      if (data.status !== 'success' || !data.razorpayOrder) {
        throw new Error(data.message || 'Failed to create order on server');
      }

      const { razorpayOrder } = data;

      // Step 2: Configure Razorpay Options
      const options = {
        key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Razorpay Key ID (e.g. rzp_test_xxxxx)
        amount: razorpayOrder.amount, // Amount in paise
        currency: razorpayOrder.currency,
        name: 'Razorpay Payment Store',
        description: product.title,
        order_id: razorpayOrder.id,
        handler: async function (razorpayResponse) {
          // Step 3: Razorpay Popup completed, trigger verification backend call
          setLoading(false);
          setVerifying(true);

          try {
            const verifyRes = await API.post('/payment/verify-payment', {
              razorpay_order_id: razorpayResponse.razorpay_order_id,
              razorpay_payment_id: razorpayResponse.razorpay_payment_id,
              razorpay_signature: razorpayResponse.razorpay_signature,
            });

            setVerificationResult({
              success: verifyRes.data.success,
              message: verifyRes.data.message,
              paymentId: razorpayResponse.razorpay_payment_id,
              orderId: razorpayResponse.razorpay_order_id,
              amount: product.price,
              currency: product.currency,
              verifiedAt: new Date().toLocaleString(),
            });
          } catch (verifyErr) {
            console.error('Verification Error:', verifyErr);
            setVerificationResult({
              success: false,
              message: verifyErr.response?.data?.message || 'Payment Verification Failed',
              paymentId: razorpayResponse.razorpay_payment_id,
              orderId: razorpayResponse.razorpay_order_id,
              amount: product.price,
              currency: product.currency,
              verifiedAt: new Date().toLocaleString(),
            });
          } finally {
            setVerifying(false);
          }
        },
        prefill: {
          name: 'Shivam Kumar',
          email: 'shivam@example.com',
          contact: '9876543210',
        },
        theme: {
          color: '#6366f1',
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      // Step 4: Open Razorpay Checkout Popup
      if (window.Razorpay) {
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          console.error('Payment Failed:', response.error);
          setErrorMessage(response.error.description || 'Payment Failed');
          setLoading(false);
        });
        rzp.open();
      } else {
        throw new Error('Razorpay SDK script not loaded in index.html');
      }
    } catch (error) {
      console.error('Order Creation Error:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="product-card">
      <div className="product-image-container">
        <span className="product-tag">POPULAR</span>
        <div className="product-image-icon">🚀</div>
      </div>

      <h2 className="product-title">{product.title}</h2>
      <p className="product-description">{product.description}</p>

      <ul className="product-features">
        <li>
          <span className="feature-check">✓</span> 20+ Hours High-Quality Video Lessons
        </li>
        <li>
          <span className="feature-check">✓</span> Live Razorpay Payment Gateway Project
        </li>
        <li>
          <span className="feature-check">✓</span> Source Code & Lifetime Access
        </li>
      </ul>

      <div className="product-pricing">
        <div>
          <span className="price-label">One-time payment</span>
          <div className="price-amount">
            ₹{product.price} <span className="price-currency">{product.currency}</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="error-banner">
          ⚠️ {errorMessage}
        </div>
      )}

      <button className="pay-button" onClick={handlePayment} disabled={loading || verifying}>
        {loading ? (
          <>
            <div className="spinner"></div>
            <span>Creating Order...</span>
          </>
        ) : verifying ? (
          <>
            <div className="spinner"></div>
            <span>Verifying Signature...</span>
          </>
        ) : (
          <span>Pay Now ₹{product.price}</span>
        )}
      </button>

      {/* Render Payment Verification Status Modal */}
      {verificationResult && (
        <PaymentStatus
          verificationData={verificationResult}
          onReset={() => setVerificationResult(null)}
        />
      )}
    </div>
  );
};

export default Product;
