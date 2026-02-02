import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { OrderCreate } from '../types';
import orderService from '../services/orderService';

export default function AddOrder() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<OrderCreate>({
    order_number: '',
    num_products: 0,
    final_price: 0,
    status: 'Pending',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'num_products' || name === 'final_price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.order_number.trim()) {
      setError('Order number is required');
      return;
    }
    try {
      setLoading(true);
      await orderService.create(formData);
      navigate('/my-orders');
    } catch {
      setError('Error creating order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Add Order</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Order Number:</label>
          <input
            type="text"
            name="order_number"
            value={formData.order_number}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Number of Products:</label>
          <input
            type="number"
            name="num_products"
            value={formData.num_products}
            onChange={handleChange}
            min={0}
          />
        </div>
        <div>
          <label>Final Price:</label>
          <input
            type="number"
            name="final_price"
            value={formData.final_price}
            onChange={handleChange}
            min={0}
            step="0.01"
          />
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <br />
        <button type="submit" disabled={loading}>
          {loading ? 'Saving...' : 'Create Order'}
        </button>
        <button type="button" onClick={() => navigate('/my-orders')}>
          Cancel
        </button>
      </form>
    </div>
  );
}
