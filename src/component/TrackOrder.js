import React, { useState } from "react";
import "../TrackOrder.css";

const TrackOrder = () => {
  const [orderId, setOrderId] = useState("");
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");
  const statusSteps = ["Placed", "Processing", "Shipped", "Out for Delivery", "Delivered"];

  const getActiveStepIndex = (status) => {
    if (!status) return -1;
    const cleanedStatus = status.trim().toLowerCase();
    const index = statusSteps.findIndex(step => step.toLowerCase() === cleanedStatus);
    console.log("getActiveStepIndex -> status:", status, "cleaned:", cleanedStatus, "index:", index);
    return index;
  };

  if (orderData && orderData.length > 0) {
    console.log("Fetched order status:", orderData[0].status);
  }

  const handleTrackOrder = async () => {
    if (!orderId) return setError("Please enter your Order ID");

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/orders/track/${orderId}`);
      if (!res.ok) throw new Error("Order not found");

      const data = await res.json();
      console.log("Fetched order status:", data.status);
      setOrderData([data]);
      setError("");
    } catch (err) {
      setOrderData(null);
      setError(err.message);
    }
  };

  const parseShippingAddress = (address) => {
    return typeof address === "string" ? JSON.parse(address) : address;
  };

  const formatShippingAddress = (address) => {
    const a = parseShippingAddress(address);
    return (
      <>
        <p><strong>Name:</strong> {a.firstName} {a.lastName}</p>
        <p><strong>Email:</strong> {a.email}</p>
        <p><strong>Address:</strong> {a.address}</p>
        <p><strong>City:</strong> {a.city}</p>
        <p><strong>Postal Code:</strong> {a.postalCode}</p>
        <p><strong>Phone:</strong> {a.phone}</p>
        <p><strong>Country:</strong> {a.deliveryCountry}</p>
      </>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const iso = dateString.replace(" ", "T");
    const date = new Date(iso);
    return isNaN(date) ? "Invalid Date" : date.toLocaleString();
  };

  return (
    <div className="container track-order-container">
      <h2 className="mb-4 text-center">Track Your Order</h2>

      <div className="search-bar-container">
        <input
          type="text"
          className="form-control"
          placeholder="Enter Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <button onClick={handleTrackOrder}>Track Order</button>
      </div>

      {error && <p className="text-danger text-center">{error}</p>}

      {orderData && orderData.length > 0 && (
        <div className="order-details mt-5">
          <div className="order-details-left">
            <div className="details-section">
              <h4 className="mb-3 text-center">Order Details</h4>
              <h5 className="mt-4">Order Status:</h5>

              <div className="order-status-stepper">
                {(() => {
                  const activeStepIndex = getActiveStepIndex(orderData[0].status);
                  console.log("Active step index for rendering:", activeStepIndex);
                  return statusSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`step ${index <= activeStepIndex ? "active" : ""}`}
                    >
                      <div className="circle">{index + 1}</div>
                      <div className="label">{step}</div>
                    </div>
                  ));
                })()}
              </div>

              <br />
              <p><strong>Order ID:</strong> {orderData[0].order_id}</p>
              <p><strong>Total Price:</strong> ${orderData[0].total_price}</p>
              <p><strong>Payment Method:</strong> {orderData[0].payment_method}</p>

              <h5 className="mt-4">Shipping Address:</h5>
              {formatShippingAddress(orderData[0].shipping_address)}

              <p><strong>Placed On:</strong> {formatDate(orderData[0].created_at)}</p>
            </div>
          </div>

          <div className="vertical-line d-none d-md-block"></div>

          <div className="order-details-right">
            <div className="details-section">
              <h4 className="mb-3 text-center">Product Details</h4>
              <div className="row">
                {orderData[0].products.map((item, index) => (
                  <div key={index} className="col-md-4 mb-4">
                    <div className="product-item">
                      <img
                        src={`/images/${item.product_image}`}
                        alt={item.product_name}
                        className="product-img"
                      />
                      <div>
                        <h5>{item.product_name}</h5>
                        <p>{item.product_description}</p>
                        <p><strong>Price:</strong> ${item.product_price}</p>
                        <p><strong>Quantity:</strong> {item.quantity}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrackOrder;
