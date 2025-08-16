import React from 'react';

export const PaymentMethod = ({ selectedMethod, onSelectPaymentMethod }) => {
  return (
    <div>
      <h5 style={{ color: 'black' }}>Payment</h5>

      <div
        className="payment-method-item"
        style={{
          border: '1px solid #ccc',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '10px',
        }}
        onClick={() => onSelectPaymentMethod('COD')}
      >
        <div className="payment-method-details">
          <h5>Cash on Delivery</h5>
          <p>Pay with cash when the order is delivered.</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethod;
