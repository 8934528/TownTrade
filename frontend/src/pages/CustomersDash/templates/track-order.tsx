import { useState, useEffect, useCallback } from 'react';
import { ordersService } from '../../../services/orders';
import type { Order, TrackingInfo } from '../../../types';
import OrderStatusBadge from '../../../components/OrderStatusBadge';
import EmptyState from '../../../components/EmptyState';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface TrackOrderProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const TrackOrder = ({ showNotification }: TrackOrderProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchCode, setSearchCode] = useState('');
  const [trackedOrder, setTrackedOrder] = useState<TrackingInfo | null>(null);
  const [trackingLoading, setTrackingLoading] = useState(false);

  const fetchMyOrders = useCallback(async () => {
    try {
      setLoading(true);
      const list = await ordersService.listMyOrders();
      setOrders(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      await Promise.resolve();
      if (mounted) {
        fetchMyOrders();
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [fetchMyOrders]);

  const handleCancelOrder = async (orderId: number) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    try {
      await ordersService.cancel(orderId);
      showNotification('Order cancelled successfully.', 'success');
      fetchMyOrders();
    } catch (err) {
      const errorVal = err as { response?: { data?: { detail?: string } } };
      const errMsg = errorVal.response?.data?.detail || 'Failed to cancel order.';
      showNotification(errMsg, 'error');
    }
  };

  const handleSearchTracking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    try {
      setTrackingLoading(true);
      setTrackedOrder(null);
      const result = await ordersService.track(searchCode.trim());
      setTrackedOrder(result);
    } catch {
      showNotification('No active order found with that tracking code.', 'error');
    } finally {
      setTrackingLoading(false);
    }
  };

  const getProgressPercentage = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 15;
      case 'confirmed': return 35;
      case 'preparing': return 55;
      case 'ready': return 75;
      case 'out_for_delivery': return 90;
      case 'delivered': return 100;
      default: return 0;
    }
  };

  const activeOrders = orders.filter((o) => o.status !== 'delivered' && o.status !== 'cancelled');
  const pastOrders = orders.filter((o) => o.status === 'delivered' || o.status === 'cancelled');

  return (
    <div className="track-order-template">
      {/* Tracking search bar */}
      <div className="card p-3 mb-4">
        <h6 className="fw-bold text-primary mb-2">Track Any Order Code</h6>
        <form onSubmit={handleSearchTracking} className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="e.g. TT-A1B2C3D4"
            value={searchCode}
            onChange={(e) => setSearchCode(e.target.value)}
            required
          />
          <button type="submit" className="btn btn-primary btn-sm px-3" disabled={trackingLoading}>
            Track Order
          </button>
        </form>

        {trackingLoading && <LoadingSpinner message="Searching tracking database..." />}

        {trackedOrder && (
          <div className="mt-3 p-3 bg-light rounded border">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="fw-bold"><code>{trackedOrder.tracking_code}</code></span>
              <OrderStatusBadge status={trackedOrder.status} />
            </div>
            <p className="small mb-1"><strong>Business:</strong> {trackedOrder.business_name || 'N/A'}</p>
            <p className="small mb-2"><strong>Type:</strong> {trackedOrder.delivery_type}</p>
            <div className="progress mb-2" style={{ height: '6px' }}>
              <div className="progress-bar bg-primary" style={{ width: `${getProgressPercentage(trackedOrder.status)}%` }}></div>
            </div>
            <small className="text-secondary">Last updated: {new Date(trackedOrder.updated_at || trackedOrder.created_at).toLocaleString()}</small>
          </div>
        )}
      </div>

      {/* Active Orders */}
      <div className="mb-4">
        <h6 className="fw-bold text-primary mb-3">My Active Orders</h6>
        {loading ? (
          <LoadingSpinner message="Checking active order status..." />
        ) : activeOrders.length === 0 ? (
          <EmptyState
            icon="bi-bag-x"
            title="No Active Orders"
            message="You don't have any active orders. Go to the Shops tab to place an order!"
          />
        ) : (
          activeOrders.map((order) => (
            <div key={order.id} className="card p-3 mb-3 border">
              <div className="d-flex justify-content-between align-items-start mb-2">
                <div>
                  <span className="fw-bold d-block">Order ID #{order.id}</span>
                  <small className="text-secondary">Tracking: <code>{order.tracking_code}</code></small>
                </div>
                <OrderStatusBadge status={order.status} />
              </div>

              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="fw-bold text-primary">R{order.total_amount}</span>
                <span className="small text-secondary">Placed: {new Date(order.created_at).toLocaleDateString()}</span>
              </div>

              <div className="progress mb-3" style={{ height: '6px' }}>
                <div className="progress-bar bg-primary" style={{ width: `${getProgressPercentage(order.status)}%` }}></div>
              </div>

              <div className="d-flex gap-2">
                {order.status === 'pending' && (
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm w-100"
                    onClick={() => handleCancelOrder(order.id)}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order History */}
      <div>
        <h6 className="fw-bold text-primary mb-3">Past Orders</h6>
        {pastOrders.map((order) => (
          <div key={order.id} className="card p-3 mb-2">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <span className="fw-bold d-block">Order #{order.id}</span>
                <small className="text-secondary">{new Date(order.created_at).toLocaleDateString()}</small>
              </div>
              <div className="text-end">
                <span className="fw-bold d-block text-primary">R{order.total_amount}</span>
                <OrderStatusBadge status={order.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrackOrder;
