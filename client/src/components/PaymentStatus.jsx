import React from 'react';

const PaymentStatus = ({ verificationData, onReset }) => {
  const { success, paymentId, orderId, amount, currency, verifiedAt, message } = verificationData;

  return (
    <div className="receipt-modal-backdrop">
      <div className="receipt-modal-card">
        {/* Animated Status Icon */}
        <div className={`status-badge-circle ${success ? 'success' : 'failed'}`}>
          {success ? '✓' : '✕'}
        </div>

        <span className={`status-pill ${success ? 'status-pill-success' : 'status-pill-failed'}`}>
          {success ? 'PAYMENT VERIFIED' : 'VERIFICATION FAILED'}
        </span>

        <h2 className="receipt-title">
          {success ? 'Transaction Successful!' : 'Payment Verification Failed'}
        </h2>
        <p className="receipt-subtitle">
          {success
            ? 'Your payment was successfully verified against Razorpay servers and recorded in MongoDB.'
            : message || 'We could not verify the authenticity of this transaction signature.'}
        </p>

        {/* Transaction Summary Box */}
        <div className="receipt-details-box">
          <div className="detail-item">
            <span className="detail-label">Amount Paid</span>
            <span className="detail-value amount-highlight">
              ₹{amount} {currency || 'INR'}
            </span>
          </div>

          <div className="detail-divider"></div>

          <div className="detail-item">
            <span className="detail-label">Payment ID</span>
            <span className="detail-value mono">{paymentId || 'N/A'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Razorpay Order ID</span>
            <span className="detail-value mono">{orderId || 'N/A'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Security Signature</span>
            <span className="detail-value badge-security">
              {success ? 'HMAC-SHA256 Validated ✓' : 'Signature Mismatch ✕'}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Date & Time</span>
            <span className="detail-value">{verifiedAt || new Date().toLocaleString()}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="receipt-actions">
          {success && (
            <button className="btn-print" onClick={() => window.print()}>
              🖨️ Print Receipt
            </button>
          )}
          <button className="btn-primary-close" onClick={onReset}>
            Done / New Purchase
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentStatus;
