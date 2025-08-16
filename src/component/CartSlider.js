import React from "react";
import { useCart } from './CartContext';
import { Link, useNavigate } from "react-router-dom";
import { FaShoppingCart, FaTimes, FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import "../CartSlider.css";
import "bootstrap/dist/css/bootstrap.min.css";

const CartSlider = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const handleIncrease = (id, quantity) => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrease = (id, quantity) => {
    if (quantity > 1) {
      updateQuantity(id, quantity - 1);
    }
  };

  const handleCheckout = () => {
    onClose();
    navigate("/checkout");
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className={`cart-slider ${isOpen ? "open" : ""}`}>
      <div className="cart-slider-header d-flex justify-content-between align-items-center p-3 border-bottom">
        <h4 className="mb-0 text-dark">Your Cart</h4>
        <button className="btn-close" onClick={onClose}>
          <FaTimes size={20} />
        </button>
      </div>

      <div className="cart-slider-body p-3">
        {cartItems.length > 0 ? (
          cartItems.map((item) => (
            <div key={item.id} className="cart-item mb-3">
              <div className="d-flex align-items-center justify-content-between">
                <div className="cart-item-details d-flex">
                  <img
                    src={item.image ? `/images/${item.image}` : "/images/default-image.jpg"}
                    alt={item.name}
                    className="cart-item-image"
                  />
                  <div className="ms-3">
                    <Link to={`/product/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <h6 className="cart-item-title">{item.name}</h6>
                    </Link>
                    <p className="cart-item-price">${Number(item.price).toFixed(2)}</p>
                  </div>
                </div>
                <div className="cart-item-actions">
                  <div className="d-flex align-items-center">
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleDecrease(item.id, item.quantity)}
                    >
                      <FaMinus />
                    </button>
                    <span className="badge bg-secondary mx-2">{item.quantity}</span>
                    <button
                      className="btn btn-sm btn-outline-secondary"
                      onClick={() => handleIncrease(item.id, item.quantity)}
                    >
                      <FaPlus />
                    </button>
                  </div>
                  <button
                    className="btn btn-sm btn-danger mt-2"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <FaTrash size={14} /> Remove
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-muted mt-4">
            <FaShoppingCart size={40} className="mb-2 text-secondary" />
            <br />
            Your cart is empty
          </p>
        )}
      </div>

      {cartItems.length > 0 && (
        <div className="cart-slider-footer p-3 border-top">
          <div className="d-flex justify-content-between mb-2">
            <strong>Total:</strong>
            <span>${totalPrice.toFixed(2)}</span>
          </div>

          <div className="d-flex flex-column">
            <Link to="/cart" className="btn btn-secondary mb-2" onClick={onClose}>
              View Cart
            </Link>
            <button className="btn btn-dark" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartSlider;
