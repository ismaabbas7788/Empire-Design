import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShippingForm } from "./ShippingForm";
import { PaymentMethod } from "./PaymentMethod";
import { PlaceOrderButton } from "./PlaceOrderButton";
import "../Checkout.css";
import { useCart } from "./CartContext";

const Checkout = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [totalPrice, setTotalPrice] = useState(0);
  const [isAddressSubmitted, setIsAddressSubmitted] = useState(false);
  const [userLoggedIn, setUserLoggedIn] = useState(true);

  // Separate messages for address and order
  const [addressMessage, setAddressMessage] = useState({ text: "", type: "" });
  const [orderMessage, setOrderMessage] = useState({ text: "", type: "" });

  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    setTotalPrice(total);
  }, [cartItems]);

  useEffect(() => {
    const savedAddress = localStorage.getItem("checkout_shippingAddress");
    const savedPayment = localStorage.getItem("checkout_paymentMethod");
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      setUserLoggedIn(false);
    }

    if (savedAddress) {
      setShippingAddress(JSON.parse(savedAddress));
      setIsAddressSubmitted(true);
    }

    if (savedPayment) {
      setPaymentMethod(savedPayment);
    }
  }, []);

  const handleAddressSubmit = (address) => {
    setShippingAddress(address);
    setIsAddressSubmitted(true);
    localStorage.setItem("checkout_shippingAddress", JSON.stringify(address));
    setAddressMessage({ text: "Shipping address submitted successfully.", type: "success" });
      setTimeout(() => {
      setAddressMessage({ text: "", type: "" });
    }, 3000)
  };

  const handlePaymentSubmit = (payment) => {
    setPaymentMethod(payment);
    localStorage.setItem("checkout_paymentMethod", payment);
  };

  const handlePlaceOrder = async () => {
    setOrderMessage({ text: "", type: "" }); // clear previous message

    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      localStorage.setItem("checkout_shippingAddress", JSON.stringify(shippingAddress));
      localStorage.setItem("checkout_paymentMethod", paymentMethod);
      setUserLoggedIn(false);
      return;
    }

    if (!isAddressSubmitted || !shippingAddress) {
      setOrderMessage({ text: "Please submit your shipping address before placing the order.", type: "error" });
      return;
    }

    const user = JSON.parse(storedUser);
    const userId = user.id;

    const orderItems = cartItems.map((item) => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
    }));

    const orderData = {
      orderItems,
      shippingAddress,
      paymentMethod: "Cash on Delivery",
      totalPrice,
      user_id: userId,
    };

    try {
      const response = await fetch("http://localhost:5000/api/orders/place-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) throw new Error("Order placement failed. Please try again later.");

      const data = await response.json();
      setOrderMessage({ text: `Order placed successfully! Your Order ID is ${data.orderId}`, type: "success" });

      clearCart();
      localStorage.removeItem("checkout_shippingAddress");
      localStorage.removeItem("checkout_paymentMethod");

      setTimeout(() => {
        navigate("/celebration");
      }, 2000);
    } catch (err) {
      console.error("Error placing order:", err);
      setOrderMessage({ text: err.message, type: "error" });
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login?redirect=/checkout");
  };

  const renderMessage = (msg) =>
    msg.text && (
      <div
        className={`message ${msg.type}`}
        style={{
          padding: "10px",
          borderRadius: "6px",
          marginTop: "10px",
          marginBottom: "10px",
          color: msg.type === "success" ? "#155724" : "#721c24",
          backgroundColor: msg.type === "success" ? "#d4edda" : "#f8d7da",
          border: `1px solid ${msg.type === "success" ? "#c3e6cb" : "#f5c6cb"}`,
        }}
      >
        {msg.text}
      </div>
    );

  return (
    <div className="checkout-container">
      <div className="checkout-sections">
        <div className="left-section">
          {/* Pass addressMessage here */}
          <ShippingForm
            onSubmit={handleAddressSubmit}
            initialData={shippingAddress}
            addressMessage={addressMessage}
          />

          <PaymentMethod selectedMethod={paymentMethod} onSelectPaymentMethod={handlePaymentSubmit} />
        </div>

        <div className="divider"></div>

        <div className="right-section">
          <div className="order-summary">
            <h3>Order Summary</h3>
            {cartItems.map((item) => (
              <div className="order-item" key={item.id}>
                <div className="item-info">
                  <img src={`/images/${item.image}`} alt={item.name} />
                  <div className="product-details">
                    <span>{item.name} x {item.quantity}</span>
                    <span>${item.price}</span>
                  </div>
                </div>
              </div>
            ))}

            <div className="pricing">
              <div className="subtotal">
                <span>Subtotal:</span>
                <span className="price">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="shipping">
                <span>Shipping:</span>
                <span className="price free-shipping">Free</span>
              </div>
              <div className="total">
                <span>Total:</span>
                <span className="price">${totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="place-order-btn">
            <PlaceOrderButton onPlaceOrder={handlePlaceOrder} disabled={cartItems.length === 0} />
            {renderMessage(orderMessage)}

            {!userLoggedIn && (
              <div style={{ marginTop: "10px", color: "#333", fontSize: "14px" }}>
                You need to log in first.{" "}
                <span
                  style={{
                    color: "blue",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                  onClick={handleLoginRedirect}
                >
                  Login
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
