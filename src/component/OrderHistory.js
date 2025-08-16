import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    if (!user) {
      setLoading(false);
      setError("Please log in to see your order history.");
      return;
    }

    axios
      .get(`http://localhost:5000/api/orders/history/${user.id}`)
      .then((res) => {
        if (Array.isArray(res.data)) {
          setOrders(res.data);
        } else {
          setOrders([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch failed:", err);
        setError("Failed to load orders.");
        setLoading(false);
      });
  }, [user]);

  const parseShippingAddress = (address) => {
    if (!address) return {};
    try {
      return typeof address === "string" ? JSON.parse(address) : address;
    } catch {
      return {};
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    return isNaN(d) ? "Invalid Date" : d.toLocaleString();
  };

  if (loading) return <p className="text-center mt-5">Loading order history...</p>;
  if (error) return <p className="text-danger text-center mt-5">{error}</p>;
  if (orders.length === 0) return <p className="text-center mt-5">No previous orders found.</p>;

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-primary">Your Order History</h2>

      {orders.map((order) => {
        const addr = parseShippingAddress(order.shipping_address);
        return (
          <div key={order.order_id} className="card order-card mb-4 shadow-sm">
            <div className="card-header bg-white d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Order #{order.order_id}</h5>
                <small className="text-muted">Placed on: {formatDate(order.created_at)}</small>
              </div>
              <span className="badge bg-success">{order.status || "Completed"}</span>
            </div>

            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <p>
                    <strong>Shipping Address:</strong>
                    <br />
                    {addr.firstName && (
                      <>
                        {addr.firstName} {addr.lastName}
                        <br />
                      </>
                    )}
                    {addr.address && (
                      <>
                        {addr.address}
                        <br />
                      </>
                    )}
                    {(addr.city || addr.postalCode) && (
                      <>
                        {addr.city}, {addr.postalCode}
                        <br />
                      </>
                    )}
                    {addr.deliveryCountry && (
                      <>
                        {addr.deliveryCountry}
                        <br />
                      </>
                    )}
                    {addr.email ? (
                      <a
                        href={`mailto:${addr.email}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ textDecoration: "underline" }}
                      >
                        {addr.email}
                      </a>
                    ) : (
                      <span className="text-muted">Email not provided</span>
                    )}
                  </p>
                </div>

                <div className="col-md-3">
                  <p>
                    <strong>Payment Method:</strong>
                    <br />
                    {order.payment_method}
                  </p>
                </div>

                <div className="col-md-3 text-md-end">
                  <p className="total-price">
                    <strong>Total Price:</strong>
                    <br />${Number(order.total_price || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <h6 className="mb-3">Items</h6>
              <div className="table-responsive">
                <table className="table table-bordered table-hover align-middle mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price (Each)</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.product_name}</td>
                        <td>{item.quantity}</td>
                        <td>${Number(item.product_price || 0).toFixed(2)}</td>
                        <td>${(Number(item.product_price || 0) * item.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderHistory;
