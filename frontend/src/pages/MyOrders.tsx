import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import type { Order, OrderStatus } from '../types';
import orderService from '../services/orderService';

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await orderService.getAll();
      setOrders(data);
      setError(null);
    } catch {
      setError('Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await orderService.delete(deleteId);
      setOrders(orders.filter(o => o.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError('Error deleting order');
    }
  };

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      const updated = await orderService.update(orderId, { status: newStatus });
      setOrders(orders.map(o => o.id === orderId ? updated : o));
    } catch {
      setError('Error updating status');
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>My Orders</h1>
      <button className="btn-primary" onClick={() => window.location.href = '/add-order'}>
        + New Order
      </button>
      <br /><br />
      {error && <p className="error">{error}</p>}

      {deleteId && (
        <div className="modal">
          <h3>Confirm Delete</h3>
          <p>Are you sure you want to delete order #{deleteId}?</p>
          <button className="btn-danger" onClick={handleDelete}>Yes, Delete</button>
          <button onClick={() => setDeleteId(null)}>Cancel</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Order #</th>
            <th>Date</th>
            <th># Products</th>
            <th>Final Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={7}>No orders found.</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.order_number}</td>
                <td>{order.date}</td>
                <td>{order.num_products}</td>
                <td>${Number(order.final_price).toFixed(2)}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="InProgress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </td>
                <td>
                  <Link to={`/add-order/${order.id}`}>Edit</Link>
                  {' '}
                  <button onClick={() => setDeleteId(order.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
