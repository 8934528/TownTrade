import { useState, useEffect, useCallback } from 'react';
import { ordersService } from '../../../services/orders';
import type { Order } from '../../../types';
import OrderStatusBadge from '../../../components/OrderStatusBadge';
import EmptyState from '../../../components/EmptyState';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface OrdersFromCustomersProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const OrdersFromCustomers = ({ showNotification }: OrdersFromCustomersProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const list = await ordersService.listBusinessOrders();
      setOrders(list);
    } catch (err) {
      console.error(err);
      showNotification('Failed to fetch business orders.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      await Promise.resolve();
      if (mounted) {
        fetchOrders();
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [fetchOrders]);

  const handleUpdateStatus = async (orderId: number, status: string) => {
    try {
      await ordersService.updateStatus(orderId, status);
      showNotification(`Order status updated to: ${status}`, 'success');
      fetchOrders();
      setSelectedOrder(null);
    } catch {
      showNotification('Failed to update status.', 'error');
    }
  };

  const handleViewOrder = async (order: Order) => {
    try {
      const fullOrder = await ordersService.getById(order.id);
      setSelectedOrder(fullOrder);
    } catch {
      showNotification('Failed to retrieve order details.', 'error');
    }
  };

  return (
    <div className="orders-template">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold text-primary mb-0">Customer Orders</h5>
        <button type="button" className="btn btn-outline-primary btn-sm" onClick={fetchOrders}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {loading ? (
        <LoadingSpinner message="Loading orders..." />
      ) : orders.length === 0 ? (
        <EmptyState
          icon="bi-truck"
          title="No Orders Yet"
          message="When customers buy your products online, their orders will appear here."
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Tracking Code</th>
                <th>Total</th>
                <th>Type</th>
                <th>Paid</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="fw-bold text-primary">#{order.id}</td>
                  <td><code>{order.tracking_code}</code></td>
                  <td className="fw-bold">R{order.total_amount}</td>
                  <td>
                    <span className="badge bg-secondary bg-opacity-10 text-secondary">
                      <i className={`bi bi-${order.delivery_type === 'delivery' ? 'truck' : 'shop'} me-1`}></i>
                      {order.delivery_type}
                    </span>
                  </td>
                  <td>
                    {order.is_paid ? (
                      <span className="badge bg-success bg-opacity-10 text-success">Yes</span>
                    ) : (
                      <span className="badge bg-danger bg-opacity-10 text-danger">No</span>
                    )}
                  </td>
                  <td>
                    <OrderStatusBadge status={order.status} />
                  </td>
                  <td>{new Date(order.created_at).toLocaleDateString()}</td>
                  <td>
                    <div className="btn-group btn-group-sm">
                      <button 
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => handleViewOrder(order)}
                        title="View Details"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      {order.status === 'pending' && (
                        <button 
                          type="button"
                          className="btn btn-outline-success"
                          onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                          title="Confirm Order"
                        >
                          <i className="bi bi-check-circle"></i>
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button 
                          type="button"
                          className="btn btn-outline-info"
                          onClick={() => handleUpdateStatus(order.id, 'preparing')}
                          title="Start Preparing"
                        >
                          <i className="bi bi-play-fill"></i>
                        </button>
                      )}
                      {order.status === 'preparing' && (
                        <button 
                          type="button"
                          className="btn btn-outline-success"
                          onClick={() => handleUpdateStatus(order.id, 'ready')}
                          title="Mark Ready"
                        >
                          <i className="bi bi-gift-fill"></i>
                        </button>
                      )}
                      {order.status === 'ready' && order.delivery_type === 'delivery' && (
                        <button 
                          type="button"
                          className="btn btn-outline-warning"
                          onClick={() => handleUpdateStatus(order.id, 'out_for_delivery')}
                          title="Dispatch Delivery"
                        >
                          <i className="bi bi-truck"></i>
                        </button>
                      )}
                      {order.status === 'out_for_delivery' && (
                        <button 
                          type="button"
                          className="btn btn-outline-success"
                          onClick={() => handleUpdateStatus(order.id, 'delivered')}
                          title="Complete Order"
                        >
                          <i className="bi bi-check2-all"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal for Order Details & Status updates */}
      {selectedOrder && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">Order Details #{selectedOrder.id}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedOrder(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3 mb-4">
                  <div className="col-md-6">
                    <small className="text-secondary d-block">Tracking Code</small>
                    <span className="fw-bold"><code>{selectedOrder.tracking_code}</code></span>
                  </div>
                  <div className="col-md-6">
                    <small className="text-secondary d-block">Order Date</small>
                    <span className="fw-bold">{new Date(selectedOrder.created_at).toLocaleString()}</span>
                  </div>
                  <div className="col-md-6">
                    <small className="text-secondary d-block">Delivery Type</small>
                    <span className="fw-bold text-uppercase">{selectedOrder.delivery_type}</span>
                  </div>
                  {selectedOrder.delivery_address && (
                    <div className="col-md-6">
                      <small className="text-secondary d-block">Delivery Address</small>
                      <span className="fw-bold">{selectedOrder.delivery_address}</span>
                    </div>
                  )}
                  {selectedOrder.delivery_notes && (
                    <div className="col-12">
                      <small className="text-secondary d-block">Notes</small>
                      <span className="fw-bold">{selectedOrder.delivery_notes}</span>
                    </div>
                  )}
                </div>

                <h6 className="fw-bold border-bottom pb-2 mb-3">Order Items</h6>
                <div className="table-responsive">
                  <table className="table table-sm">
                    <thead>
                      <tr>
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Qty</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items?.map((item) => (
                        <tr key={item.id}>
                          <td>{item.product_name}</td>
                          <td>R{item.unit_price}</td>
                          <td>{item.quantity}</td>
                          <td className="fw-bold">R{item.subtotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top">
                  <span className="fs-5 fw-bold">Total Amount:</span>
                  <span className="fs-5 fw-bold text-primary">R{selectedOrder.total_amount}</span>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setSelectedOrder(null)}>Close</button>
                <div className="btn-group">
                  <button type="button" className="btn btn-danger" onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}>Cancel Order</button>
                  <button type="button" className="btn btn-success" onClick={() => handleUpdateStatus(selectedOrder.id, 'confirmed')}>Accept Order</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersFromCustomers;
