import React from "react";

export const OrderReview = ({ orderDetails }) => {
  return (
    <div>
      <h4>Review Your Order</h4>
      <div>
        <strong>Shipping Address:</strong>
        <p>{orderDetails.shippingAddress.name}</p>
        <p>{orderDetails.shippingAddress.street}</p>
        <p>{orderDetails.shippingAddress.city}</p>
        <p>{orderDetails.shippingAddress.phone}</p>
        <p>{orderDetails.shippingAddress.postalCode}</p>
      </div>
      <div>
        <h5>Items:</h5>
        {orderDetails.cartItems.map((item) => (
          <div key={item.id}>
            <span>{item.name} x {item.quantity}</span>
            <span>Rs {item.price * item.quantity}</span>
          </div>
        ))}
      </div>
      <div>
        <strong>Total: Rs {orderDetails.totalPrice}</strong>
      </div>
    </div>
  );
};

export default OrderReview;
