import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { OrderUpdate } from '../types';
import orderService from '../services/orderService';

export default function EditOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<OrderUpdate>({
    order_number: '',
    num_products: 0,
    final_price: 0,
    status: 'Pending',
  });

  useEffect(() => {
    if (id) {
      loadOrder(Number(id));
    }
  }, [id]);

  const loadOrder = async (orderId: number) => {
    try {
      const order = await orderService.getById(orderId);
      setFormData({
        order_number: order.order_number,
        num_products: order.num_products,
        final_price: Number(order.final_price),
        status: order.status,
      });
    } catch {
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'num_products' || name === 'final_price' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      setSaving(true);
      await orderService.update(Number(id), formData);
      navigate('/my-orders');
    } catch {
      setError('Error updating order');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Edit Order #{id}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Order Number:</label>
          <input
            type="text"
            name="order_number"
            value={formData.order_number || ''}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Number of Products:</label>
          <input
            type="number"
            name="num_products"
            value={formData.num_products || 0}
            onChange={handleChange}
            min={0}
          />
        </div>
        <div>
          <label>Final Price:</label>
          <input
            type="number"
            name="final_price"
            value={formData.final_price || 0}
            onChange={handleChange}
            min={0}
            step="0.01"
          />
        </div>
        <div>
          <label>Status:</label>
          <select name="status" value={formData.status || 'Pending'} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <br />
        <button type="submit" disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
        <button type="button" onClick={() => navigate('/my-orders')}>
          Cancel
        </button>
      </form>
    </div>
  );
}
