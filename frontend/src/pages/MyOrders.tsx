import { useState, useEffect } from 'react';
import type { Order } from '../types';
import orderService from '../services/orderService';

export default function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>My Orders</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Order #</th>
            <th>Date</th>
            <th># Products</th>
            <th>Final Price</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan={6}>No orders found.</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.order_number}</td>
                <td>{order.date}</td>
                <td>{order.num_products}</td>
                <td>${order.final_price.toFixed(2)}</td>
                <td>{order.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
