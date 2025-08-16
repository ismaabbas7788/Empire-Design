import React from "react";

export const OrderSummary = ({ cartItems, totalPrice }) => {
  if (!Array.isArray(cartItems)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="order-summary">
      <h4>Order Summary</h4>
      <div>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="d-flex justify-content-between align-items-center mb-3"
          >
            {/* Left section: image + name/quantity */}
            <div className="d-flex align-items-center">
              <img
                src={item.image ? `/images/${item.image}` : "/images/default-image.jpg"}
                alt={item.name}
                className="order-item-image me-3"
                style={{ width: "50px", height: "50px", objectFit: "cover" }}
              />
              <span>{item.name} x {item.quantity}</span>
            </div>

            {/* Right section: price */}
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <hr />
      <div className="d-flex justify-content-between">
        <strong>Total:</strong>
        <span>${totalPrice.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
