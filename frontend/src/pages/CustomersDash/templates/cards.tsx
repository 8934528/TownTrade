import { useState, useEffect, useCallback } from 'react';
import { businessesService } from '../../../services/businesses';
import { ordersService } from '../../../services/orders';
import type { Business, Product } from '../../../types';
import ProductCard from '../../../components/ProductCard';
import EmptyState from '../../../components/EmptyState';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface CardsProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  openModal: (title: string, body: string) => void;
  onOrderPlaced: (orderId: number) => void; // Callback to switch to payment tab with the placed order ID
}

const Cards = ({ showNotification, onOrderPlaced }: CardsProps) => {
  const [shops, setShops] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedShop, setSelectedShop] = useState<Business | null>(null);
  const [shopProducts, setShopProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  // Shopping Cart state
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>([]);

  // Checkout modal
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>('delivery');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);

  const fetchShops = useCallback(async () => {
    try {
      setLoading(true);
      const list = await businessesService.list();
      setShops(list);
    } catch (err) {
      console.error(err);
      showNotification('Failed to fetch businesses.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      await Promise.resolve();
      if (mounted) {
        fetchShops();
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [fetchShops]);

  const handleShopSelect = async (shop: Business) => {
    setSelectedShop(shop);
    setCart([]);
    try {
      setLoadingProducts(true);
      const products = await businessesService.listProducts(shop.id);
      setShopProducts(products);
    } catch {
      showNotification('Failed to fetch shop products.', 'error');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          showNotification(`Cannot add more. Only ${product.stock} available in stock.`, 'info');
          return prevCart;
        }
        showNotification(`${product.name} quantity increased in cart.`, 'success');
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      showNotification(`${product.name} added to cart.`, 'success');
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleRemoveFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShop || cart.length === 0) return;

    try {
      setPlacingOrder(true);
      const order = await ordersService.create({
        business_id: selectedShop.id,
        items: cart.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        delivery_type: deliveryType,
        delivery_address: deliveryType === 'delivery' ? deliveryAddress : undefined,
        delivery_notes: deliveryNotes,
      });

      showNotification('Order placed successfully!', 'success');
      setShowCheckoutModal(false);
      setCart([]);
      setSelectedShop(null);
      // Switch tab to payment tab
      onOrderPlaced(order.id);
    } catch (err) {
      const errorVal = err as { response?: { data?: { detail?: string } } };
      const errMsg = errorVal.response?.data?.detail || 'Failed to place order.';
      showNotification(errMsg, 'error');
    } finally {
      setPlacingOrder(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="cards-template">
      {selectedShop ? (
        <div>
          {/* Back button */}
          <button 
            type="button" 
            className="btn btn-outline-primary btn-sm mb-4"
            onClick={() => setSelectedShop(null)}
          >
            <i className="bi bi-arrow-left me-1"></i> Back to Shops
          </button>

          <div className="row g-3">
            {/* Products grid */}
            <div className={cart.length > 0 ? "col-lg-8" : "col-12"}>
              <div className="card p-3 mb-4">
                <div className="d-flex align-items-center justify-content-between mb-3 border-bottom pb-2">
                  <div>
                    <h5 className="fw-bold text-primary mb-0">{selectedShop.name}</h5>
                    <small className="text-secondary">{selectedShop.category} — {selectedShop.city || 'Local'}</small>
                  </div>
                  <span className="badge bg-success bg-opacity-10 text-success">
                    <i className="bi bi-star-fill text-warning me-1"></i>{selectedShop.rating || '5.0'}
                  </span>
                </div>

                {loadingProducts ? (
                  <LoadingSpinner message="Browsing products..." />
                ) : shopProducts.length === 0 ? (
                  <EmptyState
                    icon="bi-box"
                    title="No Products Available"
                    message="This store doesn't have any products listed at the moment."
                  />
                ) : (
                  <div className="row g-3">
                    {shopProducts.map((prod) => (
                      <div key={prod.id} className="col-sm-6 col-md-4">
                        <ProductCard
                          product={prod}
                          isOwner={false}
                          onAddToCart={handleAddToCart}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Cart sidebar */}
            {cart.length > 0 && (
              <div className="col-lg-4">
                <div className="card p-3 border-primary position-sticky" style={{ top: '100px' }}>
                  <h6 className="fw-bold text-primary border-bottom pb-2 mb-3">
                    <i className="bi bi-cart3 me-1"></i> Shopping Cart
                  </h6>
                  <ul className="list-group list-group-flush mb-3">
                    {cart.map((item) => (
                      <li key={item.product.id} className="list-group-item bg-transparent d-flex justify-content-between align-items-start px-0 py-2">
                        <div style={{ maxWidth: '70%' }}>
                          <span className="fw-bold small d-block">{item.product.name}</span>
                          <small className="text-secondary">R{item.product.price} x {item.quantity}</small>
                        </div>
                        <div className="text-end">
                          <span className="fw-bold small d-block">R{(item.product.price * item.quantity).toFixed(2)}</span>
                          <button 
                            type="button" 
                            className="btn btn-sm text-danger p-0 border-0 mt-1"
                            onClick={() => handleRemoveFromCart(item.product.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="d-flex justify-content-between align-items-center mb-4 pt-2 border-top">
                    <span className="fw-bold">Total:</span>
                    <span className="fw-bold text-primary fs-5">R{cartTotal.toFixed(2)}</span>
                  </div>

                  <button 
                    type="button" 
                    className="btn btn-primary w-100"
                    onClick={() => setShowCheckoutModal(true)}
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-primary mb-0">Local Township Businesses</h5>
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={fetchShops}>
              <i className="bi bi-arrow-clockwise me-1"></i> Refresh
            </button>
          </div>

          {loading ? (
            <LoadingSpinner message="Locating nearby shops..." />
          ) : shops.length === 0 ? (
            <EmptyState
              icon="bi-shop"
              title="No Shops Found"
              message="No small businesses are registered on TownTrade in your area yet."
            />
          ) : (
            <div className="row g-3">
              {shops.map((shop) => (
                <div className="col-md-4 col-sm-6" key={shop.id}>
                  <div className="card h-100 p-3 border">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <span className="fs-2">🏪</span>
                      <span className="badge bg-success bg-opacity-10 text-success">Open</span>
                    </div>
                    <h6 className="fw-bold mb-1">{shop.name}</h6>
                    <small className="text-secondary d-block mb-2">{shop.category}</small>
                    <p className="small text-secondary mb-3 text-truncate-2-lines">
                      {shop.description || 'No description provided.'}
                    </p>
                    <div className="d-flex flex-wrap gap-1 mb-3">
                      {shop.tags ? (
                        shop.tags.split(',').map((tag, idx) => (
                          <span key={idx} className="badge bg-primary bg-opacity-10 text-primary" style={{ fontSize: '0.7rem' }}>
                            #{tag.trim()}
                          </span>
                        ))
                      ) : (
                        <span className="text-secondary small" style={{ fontSize: '0.7rem' }}>No tags</span>
                      )}
                    </div>
                    <button 
                      type="button" 
                      className="btn btn-primary btn-sm w-100 mt-auto"
                      onClick={() => handleShopSelect(shop)}
                    >
                      Browse Store
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Set Delivery Details</h5>
                <button type="button" className="btn-close" onClick={() => setShowCheckoutModal(false)}></button>
              </div>
              <form onSubmit={handleCheckoutSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label small fw-bold">Delivery Type</label>
                    <select 
                      className="form-select"
                      value={deliveryType}
                      onChange={(e) => setDeliveryType(e.target.value as 'delivery' | 'pickup')}
                    >
                      <option value="delivery">Delivery</option>
                      <option value="pickup">Self-Pickup</option>
                    </select>
                  </div>

                  {deliveryType === 'delivery' && (
                    <div className="mb-3">
                      <label className="form-label small fw-bold">Delivery Address</label>
                      <input 
                        type="text" 
                        className="form-control"
                        placeholder="e.g. House 452, Zone 4, Township"
                        value={deliveryAddress}
                        onChange={(e) => setDeliveryAddress(e.target.value)}
                        required
                      />
                    </div>
                  )}

                  <div className="mb-3">
                    <label className="form-label small fw-bold">Order Notes / Instructions (Optional)</label>
                    <textarea 
                      className="form-control"
                      rows={2}
                      placeholder="e.g. Leave with neighbour if not home..."
                      value={deliveryNotes}
                      onChange={(e) => setDeliveryNotes(e.target.value)}
                    ></textarea>
                  </div>

                  <div className="alert alert-info py-2 small mb-0">
                    <i className="bi bi-info-circle me-1"></i>
                    Orders placed via TownTrade trigger instant SMS alerts to the shop owner.
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-secondary" onClick={() => setShowCheckoutModal(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={placingOrder}>
                    {placingOrder ? 'Placing Order...' : 'Place Order & Pay'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
