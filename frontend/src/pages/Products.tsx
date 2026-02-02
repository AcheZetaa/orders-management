import { useState, useEffect } from 'react';
import type { Product, ProductCreate } from '../types';
import productService from '../services/productService';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [formData, setFormData] = useState<ProductCreate>({ name: '', unit_price: 0 });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await productService.getAll();
      setProducts(data);
      setError(null);
    } catch {
      setError('Error loading products');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    try {
      if (editingProduct) {
        await productService.update(editingProduct.id, formData);
      } else {
        await productService.create(formData);
      }
      await loadProducts();
      resetForm();
    } catch {
      setError(editingProduct ? 'Error updating product' : 'Error creating product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({ name: product.name, unit_price: Number(product.unit_price) });
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await productService.delete(deleteId);
      setProducts(products.filter(p => p.id !== deleteId));
      setDeleteId(null);
    } catch {
      setError('Error deleting product');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingProduct(null);
    setFormData({ name: '', unit_price: 0 });
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Products</h1>
      <button className="btn-primary" onClick={() => setShowForm(true)}>+ New Product</button>
      <br /><br />
      {error && <p className="error">{error}</p>}

      {showForm && (
        <div className="modal">
          <h3>{editingProduct ? 'Edit Product' : 'Add Product'}</h3>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Enter product name"
            />
          </div>
          <div className="form-group">
            <label>Unit Price</label>
            <input
              type="number"
              value={formData.unit_price}
              onChange={(e) => setFormData({ ...formData, unit_price: Number(e.target.value) })}
              min={0}
              step="0.01"
            />
          </div>
          <br />
          <button className="btn-primary" onClick={handleSubmit}>{editingProduct ? 'Save' : 'Create'}</button>
          <button onClick={resetForm}>Cancel</button>
        </div>
      )}

      {deleteId && (
        <div className="modal">
          <h3>Confirm Delete</h3>
          <p>Are you sure you want to delete this product?</p>
          <button className="btn-danger" onClick={handleDelete}>Yes, Delete</button>
          <button onClick={() => setDeleteId(null)}>Cancel</button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Unit Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan={4}>No products found.</td>
            </tr>
          ) : (
            products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>${Number(product.unit_price).toFixed(2)}</td>
                <td>
                  <button onClick={() => handleEdit(product)}>Edit</button>
                  {' '}
                  <button onClick={() => setDeleteId(product.id)}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
