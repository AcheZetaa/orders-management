import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { OrderDetail, OrderItem, Product } from '../types';
import orderService from '../services/orderService';
import productService from '../services/productService';

export default function AddOrder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<OrderItem | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [deleteItemId, setDeleteItemId] = useState<number | null>(null);

  useEffect(() => {
    loadProducts();
    if (id) {
      loadOrder(Number(id));
    }
  }, [id]);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
      if (data.length > 0) setSelectedProduct(data[0].id);
    } catch {
      setError('Error loading products');
    }
  };

  const loadOrder = async (orderId: number) => {
    try {
      setLoading(true);
      const data = await orderService.getById(orderId);
      setOrder(data);
      setOrderNumber(data.order_number);
    } catch {
      setError('Order not found');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async () => {
    if (!orderNumber.trim()) {
      setError('Order number is required');
      return;
    }
    try {
      setSaving(true);
      const newOrder = await orderService.create({ order_number: orderNumber });
      navigate(`/add-order/${newOrder.id}`);
    } catch {
      setError('Error creating order');
    } finally {
      setSaving(false);
    }
  };

  const handleAddProduct = async () => {
    if (!order || !selectedProduct || quantity < 1) return;
    try {
      await orderService.addItem(order.id, { product_id: selectedProduct, quantity });
      await loadOrder(order.id);
      setShowModal(false);
      setQuantity(1);
    } catch {
      setError('Error adding product');
    }
  };

  const handleEditItem = async () => {
    if (!order || !editingItem) return;
    try {
      await orderService.updateItem(order.id, editingItem.id, { quantity });
      await loadOrder(order.id);
      setEditingItem(null);
      setQuantity(1);
    } catch {
      setError('Error updating product');
    }
  };

  const handleRemoveItem = async () => {
    if (!order || !deleteItemId) return;
    try {
      await orderService.removeItem(order.id, deleteItemId);
      await loadOrder(order.id);
      setDeleteItemId(null);
    } catch {
      setError('Error removing product');
    }
  };

  const handleSaveOrder = () => {
    navigate('/my-orders');
  };

  const isCompleted = order?.status === 'Completed';

  if (loading) return <p>Loading...</p>;

  if (!isEdit || !order) {
    return (
      <div>
        <h1>Add Order</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <div>
          <label>Order Number: </label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
          />
        </div>
        <div>
          <label>Date: </label>
          <input type="text" value={new Date().toLocaleDateString()} disabled />
        </div>
        <br />
        <button onClick={handleCreateOrder} disabled={saving}>
          {saving ? 'Creating...' : 'Create Order'}
        </button>
        <button onClick={() => navigate('/my-orders')}>Cancel</button>
      </div>
    );
  }

  return (
    <div>
      <h1>Edit Order #{order.id}</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isCompleted && <p style={{ color: 'orange' }}>This order is completed and cannot be modified.</p>}

      <div>
        <label>Order Number: </label>
        <input type="text" value={order.order_number} disabled />
      </div>
      <div>
        <label>Date: </label>
        <input type="text" value={new Date(order.date).toLocaleDateString()} disabled />
      </div>
      <div>
        <label># Products: </label>
        <input type="number" value={order.num_products} disabled />
      </div>
      <div>
        <label>Final Price: </label>
        <input type="text" value={`$${Number(order.final_price).toFixed(2)}`} disabled />
      </div>

      <br />
      {!isCompleted && (
        <button onClick={() => setShowModal(true)}>Add Product</button>
      )}

      {showModal && (
        <div style={{ border: '1px solid black', padding: '10px', margin: '10px 0' }}>
          <h3>Add Product</h3>
          <div>
            <label>Product: </label>
            <select value={selectedProduct} onChange={(e) => setSelectedProduct(Number(e.target.value))}>
              {products.map(p => (
                <option key={p.id} value={p.id}>{p.name} - ${Number(p.unit_price).toFixed(2)}</option>
              ))}
            </select>
          </div>
          <div>
            <label>Quantity: </label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} />
          </div>
          <button onClick={handleAddProduct}>Confirm</button>
          <button onClick={() => setShowModal(false)}>Cancel</button>
        </div>
      )}

      {editingItem && (
        <div style={{ border: '1px solid black', padding: '10px', margin: '10px 0' }}>
          <h3>Edit Product: {editingItem.product_name}</h3>
          <div>
            <label>Quantity: </label>
            <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} min={1} />
          </div>
          <button onClick={handleEditItem}>Save</button>
          <button onClick={() => setEditingItem(null)}>Cancel</button>
        </div>
      )}

      {deleteItemId && (
        <div style={{ border: '1px solid black', padding: '10px', margin: '10px 0' }}>
          <p>Are you sure you want to remove this product?</p>
          <button onClick={handleRemoveItem}>Yes, Remove</button>
          <button onClick={() => setDeleteItemId(null)}>Cancel</button>
        </div>
      )}

      <h3>Products in Order</h3>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Unit Price</th>
            <th>Qty</th>
            <th>Total Price</th>
            {!isCompleted && <th>Options</th>}
          </tr>
        </thead>
        <tbody>
          {order.items.length === 0 ? (
            <tr>
              <td colSpan={isCompleted ? 5 : 6}>No products added.</td>
            </tr>
          ) : (
            order.items.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.product_name}</td>
                <td>${Number(item.unit_price).toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>${Number(item.total_price).toFixed(2)}</td>
                {!isCompleted && (
                  <td>
                    <button onClick={() => { setEditingItem(item); setQuantity(item.quantity); }}>Edit</button>
                    {' '}
                    <button onClick={() => setDeleteItemId(item.id)}>Remove</button>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <br />
      <button onClick={handleSaveOrder}>Done</button>
    </div>
  );
}
