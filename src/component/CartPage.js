// CartPage.js
import React from 'react';
import { useCart } from './CartContext';
import { Link } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import OrderSummary from './OrderSummary';

import '../cartpage.css';

const CartPage = () => {
const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

const handleIncrease = (id, quantity) => updateQuantity(id, quantity + 1);

const handleDecrease = (id, quantity) => {
if (quantity > 1) updateQuantity(id, quantity - 1);
};

const totalPrice = cartItems.reduce(
(total, item) => total + Number(item.price) * item.quantity,
0
);

return ( <div className="cart-page container my-5"> <h2 className="text-center mb-4">Your Cart</h2>


  {cartItems.length > 0 ? (
    <div className="row">
      <div className="col-lg-8">
        <ul className="list-group">
          {cartItems.map(item => (
            <li key={item.id} className="list-group-item cart-item d-flex align-items-center">
               <img
                src={`/images/${item.image ? item.image : 'default-image.jpg'}`}
                alt={item.name}
                className="cart-image me-3"
              />
              <div className="flex-grow-1">
                <Link to={`/product/${item.id}`} className="text-decoration-none text-dark">
                  <h5 className="mb-1">{item.name}</h5>
                </Link>
                <small className="text-muted">${Number(item.price).toFixed(2)}</small>
              </div>
              <div className="d-flex align-items-center quantity-group me-3">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handleDecrease(item.id, item.quantity)}
                ><FaMinus /></button>
                <span className="mx-2 quantity-text">{item.quantity}</span>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => handleIncrease(item.id, item.quantity)}
                ><FaPlus /></button>
              </div>
              <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(item.id)}>
                <FaTrash />
              </button>
            </li>
          ))}
        </ul>

        <div className="d-flex justify-content-between align-items-center mt-4">
          <h4>Total: ${totalPrice.toFixed(2)}</h4>
          <div>
            <button className="btn btn-outline-danger me-2" onClick={clearCart}>
              <FaTrash /> Clear Cart
            </button>
            <Link to="/checkout" className="btn btn-dark ">Proceed to Checkout</Link>
          </div>
        </div>
      </div>

      <div className="col-lg-4">
<OrderSummary cartItems={cartItems} totalPrice={totalPrice} />
      </div>
    </div>
  ) : (
    <div className="text-center text-muted mt-5">
      <FaShoppingCart size={50} className="mb-3 text-secondary" />
      <h5>Your cart is empty</h5>
<Link to="/" className="custom-continue-btn mt-3">Continue Shopping</Link>
    </div>
  )}
</div>


);
};

export default CartPage;

