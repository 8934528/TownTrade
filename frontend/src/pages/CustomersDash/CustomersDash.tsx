import { useState, useEffect, useCallback } from 'react';
import Cards from './templates/cards';
import Payment from './templates/payment';
import TrackOrder from './templates/track-order';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ordersService } from '../../services/orders';
import './CustomersDash.css';

interface CustomersDashProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const CustomersDash = ({ showNotification }: CustomersDashProps) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'payment' | 'track'>('cards');
  const [pendingOrderId, setPendingOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    activeOrders: 0,
    completedOrders: 0,
    savedCards: 2,
    loyaltyPoints: 120,
  });

  const loadStats = useCallback(async () => {
    try {
      setLoading(true);
      const orders = await ordersService.listMyOrders();
      const active = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;
      const completed = orders.filter(o => o.status === 'delivered').length;
      
      // Simulating loyalty points based on completed orders
      const points = 100 + completed * 15;

      setStats((prev) => ({
        ...prev,
        activeOrders: active,
        completedOrders: completed,
        loyaltyPoints: points,
      }));
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
        loadStats();
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [activeTab, loadStats]);

  const handleOrderPlaced = (orderId: number) => {
    setPendingOrderId(orderId);
    setActiveTab('payment');
  };

  const handlePaymentSuccess = () => {
    setPendingOrderId(null);
    setActiveTab('track');
    showNotification('Payment successful! You can now track your delivery.', 'success');
  };

  return (
    <div className="customer-dash">
      <PageHeader 
        title="Customer Dashboard" 
        subtitle="Browse local shops, place orders, and make payments online."
        actions={
          <button 
            type="button"
            className="btn btn-outline-primary"
            onClick={loadStats}
          >
            <i className="bi bi-arrow-clockwise me-1"></i> Refresh
          </button>
        }
      />

      {loading ? (
        <LoadingSpinner message="Updating dashboard..." />
      ) : (
        <div className="container py-2">
          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-4">
              <StatCard icon="bi-bag" label="Active Orders" value={stats.activeOrders} colorClass="primary" />
            </div>
            <div className="col-4">
              <StatCard icon="bi-check-circle" label="Completed" value={stats.completedOrders} colorClass="success" />
            </div>
            <div className="col-4">
              <StatCard icon="bi-star" label="Loyalty Points" value={`${stats.loyaltyPoints} pts`} colorClass="warning" />
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="bg-card rounded border">
            <div className="border-bottom">
              <ul className="nav nav-tabs border-0">
                <li className="nav-item flex-fill text-center">
                  <button 
                    type="button"
                    className={`nav-link border-0 w-100 ${activeTab === 'cards' ? 'active' : ''}`}
                    onClick={() => setActiveTab('cards')}
                  >
                    <i className="bi bi-shop me-1"></i> Stores
                  </button>
                </li>
                <li className="nav-item flex-fill text-center">
                  <button 
                    type="button"
                    className={`nav-link border-0 w-100 ${activeTab === 'payment' ? 'active' : ''}`}
                    onClick={() => setActiveTab('payment')}
                  >
                    <i className="bi bi-credit-card me-1"></i> Digital Pay
                  </button>
                </li>
                <li className="nav-item flex-fill text-center">
                  <button 
                    type="button"
                    className={`nav-link border-0 w-100 ${activeTab === 'track' ? 'active' : ''}`}
                    onClick={() => setActiveTab('track')}
                  >
                    <i className="bi bi-truck me-1"></i> Track Order
                  </button>
                </li>
              </ul>
            </div>

            <div className="p-3">
              {activeTab === 'cards' && (
                <Cards 
                  showNotification={showNotification} 
                  openModal={() => {}} 
                  onOrderPlaced={handleOrderPlaced}
                />
              )}
              {activeTab === 'payment' && (
                <Payment 
                  showNotification={showNotification} 
                  pendingOrderId={pendingOrderId}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              )}
              {activeTab === 'track' && (
                <TrackOrder showNotification={showNotification} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomersDash;
