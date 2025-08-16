import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../OrderManagement.css';
import { FiEdit } from 'react-icons/fi';

const OrderManagement = () => {
  const [columns, setColumns] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/orders`);
      const data = res.data;

      if (data.length > 0) {
        setColumns(Object.keys(data[0]));
      } else {
        setColumns([]);
      }

      setOrders(data);
    } catch (err) {
      setError('Failed to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderDetails = async (orderId) => {
    setLoadingDetails(true);
    setDetailsError(null);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/orders/${orderId}`);
      setSelectedOrder(res.data);
    } catch (err) {
      setDetailsError('Failed to load order details.');
    } finally {
      setLoadingDetails(false);
    }
  };

  

  const openEditModal = (order) => {
    setSelectedOrder(order);
    setEditStatus(order.status || '');
    setEditModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_API_URL}/orders/${selectedOrder.order_id}`, {
        status: editStatus,
      });
      setEditModalOpen(false);
      setSelectedOrder(null);
      fetchOrders();
      Swal.fire('Success', 'Order status updated!', 'success');
    } catch (err) {
      Swal.fire('Error', 'Failed to update order status.', 'error');
    }
  };

  const filteredColumns = columns.filter(col => col !== 'created_at');

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Order Management</h2>

      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              {filteredColumns.map((col) => (
                <th key={col} className="border px-3 py-2 text-left">{col}</th>
              ))}
              <th className="border px-3 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={filteredColumns.length + 1} className="text-center p-4">
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((order, i) => (
                <tr key={i} className="border-t hover:bg-gray-100">
                  {filteredColumns.map((col) => {
                    if (col === 'order_id') {
                      return (
                        <td
                          key={col}
                          className="border px-3 py-2 cursor-pointer text-blue-600 underline"
                          onClick={() => fetchOrderDetails(order.order_id)}
                        >
                          {order[col]}
                        </td>
                      );
                    }

                    if (col === 'shipping_address') {
                      let addr = {};
                      try {
                        addr = JSON.parse(order[col]);
                      } catch {
                        addr = {};
                      }
                      return (
                        <td key={col} className="border px-3 py-2">
                          {addr.firstName
                            ? `${addr.firstName} ${addr.lastName}, ${addr.address}, ${addr.city}, ${addr.deliveryCountry}`
                            : ''}
                        </td>
                      );
                    }

                    return (
                      <td key={col} className="border px-3 py-2">
                        {order[col] !== null ? order[col].toString() : ''}
                      </td>
                    );
                  })}
                  <td className="border px-3 py-2 flex gap-2">
  <button
    className="p-2 bg-gray-200 rounded hover:bg-gray-300"
    onClick={() => openEditModal(order)}
    title="Edit Order"
  >
    <FiEdit className="text-blue-600" />
  </button>
</td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      {/* Order Details Modal */}
      {selectedOrder && !editModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
              aria-label="Close modal"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">Order Details - ID: {selectedOrder.order_id}</h3>

            {loadingDetails ? (
              <p>Loading details...</p>
            ) : detailsError ? (
              <p className="text-red-600">{detailsError}</p>
            ) : (
              <>
                <p><strong>Status:</strong> {selectedOrder.status}</p>

                <h4 className="mt-4 font-semibold">Shipping Address:</h4>
                <p>
                  {(() => {
                    try {
                      const addr = JSON.parse(selectedOrder.shipping_address);
                      return `${addr.firstName} ${addr.lastName}, ${addr.address}, ${addr.city}, ${addr.deliveryCountry}`;
                    } catch {
                      return '';
                    }
                  })()}
                </p>

                <h4 className="mt-4 font-semibold">Products Ordered:</h4>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <table className="w-full border mt-2">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border px-2 py-1 text-left">Product</th>
                        <th className="border px-2 py-1 text-right">Quantity</th>
                        <th className="border px-2 py-1 text-right">Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="border-t">
                          <td className="border px-2 py-1">{item.name}</td>
                          <td className="border px-2 py-1 text-right">{item.quantity}</td>
                          <td className="border px-2 py-1 text-right">${Number(item.price).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No products found for this order.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Edit Status Modal */}
      {editModalOpen && selectedOrder && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 font-bold text-xl"
            >
              &times;
            </button>
            <h3 className="text-xl font-semibold mb-4">
              Edit Order Status - ID: {selectedOrder.order_id}
            </h3>
            <label className="block mb-2 font-medium">Order Status:</label>
            <select
              className="border p-2 w-full mb-4"
              value={editStatus}
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="placed">Placed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Update Status
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderManagement;
