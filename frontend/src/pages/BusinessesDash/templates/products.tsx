import { useState, useEffect, useCallback } from 'react';
import { businessesService } from '../../../services/businesses';
import { productsService } from '../../../services/products';
import type { Product, ProductCreate } from '../../../types';
import ProductCard from '../../../components/ProductCard';
import EmptyState from '../../../components/EmptyState';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface ProductsProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const Products = ({ showNotification }: ProductsProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState<ProductCreate>({
    name: '',
    description: '',
    price: 0,
    category: '',
    tags: '',
    stock: 0,
    low_stock_threshold: 5,
    image_url: '',
    is_featured: false
  });

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      const myBusiness = await businessesService.getMyBusiness();
      const list = await businessesService.listProducts(myBusiness.id);
      setProducts(list);
    } catch (err) {
      console.error(err);
      showNotification('Failed to load products.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      await Promise.resolve();
      if (mounted) {
        loadProducts();
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [loadProducts]);

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      tags: '',
      stock: 0,
      low_stock_threshold: 5,
      image_url: '',
      is_featured: false
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category || '',
      tags: product.tags || '',
      stock: product.stock,
      low_stock_threshold: product.low_stock_threshold,
      image_url: product.image_url || '',
      is_featured: product.is_featured
    });
    setShowEditModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price <= 0) {
      showNotification('Please enter a valid name and price.', 'error');
      return;
    }

    try {
      await productsService.create(formData);
      showNotification('Product added successfully!', 'success');
      setShowAddModal(false);
      loadProducts();
    } catch {
      showNotification('Failed to add product.', 'error');
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;

    try {
      await productsService.update(selectedProduct.id, formData);
      showNotification('Product updated successfully!', 'success');
      setShowEditModal(false);
      loadProducts();
    } catch {
      showNotification('Failed to update product.', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsService.delete(id);
      showNotification('Product deleted successfully.', 'success');
      loadProducts();
    } catch {
      showNotification('Failed to delete product.', 'error');
    }
  };

  return (
    <div className="products-template">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-primary mb-0">Product Inventory</h5>
        <button 
          type="button"
          className="btn btn-primary"
          onClick={handleOpenAdd}
        >
          <i className="bi bi-plus-circle me-1"></i>
          Add Product
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading your inventory..." />
      ) : products.length === 0 ? (
        <EmptyState
          icon="bi-box"
          title="No Products Yet"
          message="Start adding products to showcase in your store and manage your stock."
          actionText="Add Product"
          onAction={handleOpenAdd}
        />
      ) : (
        <div className="row g-3">
          {products.map((product) => (
            <div key={product.id} className="col-sm-6 col-md-4 col-lg-3">
              <ProductCard
                product={product}
                isOwner={true}
                onEdit={handleOpenEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Add New Product</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddModal(false)}></button>
              </div>
              <form onSubmit={handleAddSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold">Price (R)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">Stock Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. Bakery, Dairy, Staples"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Tags (comma-separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g. fresh, bread, sourdough"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Image URL (Optional)</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="https://example.com/product.jpg"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Product</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {showEditModal && selectedProduct && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Edit Product</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Product Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="row g-3 mb-3">
                    <div className="col-6">
                      <label className="form-label small fw-bold">Price (R)</label>
                      <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                        required
                      />
                    </div>
                    <div className="col-6">
                      <label className="form-label small fw-bold">Stock Quantity</label>
                      <input
                        type="number"
                        className="form-control"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Tags (comma-separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Description</label>
                    <textarea
                      className="form-control"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
