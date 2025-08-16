import React from "react";

export const PlaceOrderButton = ({ onPlaceOrder, disabled }) => {
  return (
    <button
      onClick={onPlaceOrder}
      className="button"
      disabled={disabled} // Disable the button if disabled is true
    >
      Complete Order
    </button>
  );
};

export default PlaceOrderButton;
