import { useState, useEffect, useCallback } from 'react';
import Products from './templates/products';
import OrdersFromCustomers from './templates/orders-from-customers';
import Communications from './templates/communications';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import LoadingSpinner from '../../components/LoadingSpinner';
import { businessesService } from '../../services/businesses';
import { ordersService } from '../../services/orders';
import './BusinessesDash.css';

interface BusinessesDashProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
}

const BusinessesDash = ({ showNotification }: BusinessesDashProps) => {
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'communications'>('products');
  const [businessName, setBusinessName] = useState("Small Business");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    lowStock: 0,
    totalRevenue: 0,
  });

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const myBiz = await businessesService.getMyBusiness();
      setBusinessName(myBiz.name);

      const productsList = await businessesService.listProducts(myBiz.id);
      const ordersList = await ordersService.listBusinessOrders();

      const pending = ordersList.filter(o => o.status === 'pending').length;
      const lowStock = productsList.filter(p => p.stock <= p.low_stock_threshold).length;
      const revenue = ordersList
        .filter(o => o.status === 'delivered' || o.is_paid)
        .reduce((sum, o) => sum + Number(o.total_amount), 0);

      setStats({
        totalOrders: ordersList.length,
        pendingOrders: pending,
        totalProducts: productsList.length,
        lowStock,
        totalRevenue: revenue,
      });
    } catch (err) {
      console.error(err);
      showNotification('Could not load dashboard stats.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      await Promise.resolve();
      if (mounted) {
        loadDashboardData();
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [loadDashboardData]);

  const handleRefresh = () => {
    loadDashboardData();
    showNotification('Dashboard data refreshed!', 'success');
  };

  return (
    <div className="business-dash">
      <PageHeader 
        title="Business Dashboard" 
        subtitle={`Welcome back, ${businessName}`} 
        actions={
          <button 
            type="button"
            className="btn btn-outline-primary"
            onClick={handleRefresh}
          >
            <i className="bi bi-arrow-clockwise me-1"></i>
            Refresh
          </button>
        }
      />

      {loading ? (
        <LoadingSpinner message="Calculating dashboard statistics..." />
      ) : (
        <div className="container py-2">
          {/* Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-6 col-md-4 col-lg-2">
              <StatCard icon="bi-box-seam" label="Total Orders" value={stats.totalOrders} colorClass="primary" />
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <StatCard icon="bi-clock-history" label="Pending" value={stats.pendingOrders} colorClass="warning" />
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <StatCard icon="bi-cup-straw" label="Products" value={stats.totalProducts} colorClass="success" />
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <StatCard icon="bi-exclamation-triangle" label="Low Stock" value={stats.lowStock} colorClass="danger" />
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <StatCard icon="bi-currency-dollar" label="Revenue" value={`R${stats.totalRevenue.toFixed(2)}`} colorClass="info" />
            </div>
            <div className="col-6 col-md-4 col-lg-2">
              <StatCard icon="bi-calendar-day" label="Status" value="Online" colorClass="secondary" />
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-card rounded border mb-4">
            <div className="border-bottom">
              <ul className="nav nav-tabs border-0">
                <li className="nav-item">
                  <button 
                    type="button"
                    className={`nav-link border-0 ${activeTab === 'products' ? 'active' : ''}`}
                    onClick={() => setActiveTab('products')}
                  >
                    <i className="bi bi-box me-2"></i>
                    Products
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    type="button"
                    className={`nav-link border-0 ${activeTab === 'orders' ? 'active' : ''}`}
                    onClick={() => setActiveTab('orders')}
                  >
                    <i className="bi bi-truck me-2"></i>
                    Orders
                    {stats.pendingOrders > 0 && (
                      <span className="badge bg-danger ms-2">{stats.pendingOrders}</span>
                    )}
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    type="button"
                    className={`nav-link border-0 ${activeTab === 'communications' ? 'active' : ''}`}
                    onClick={() => setActiveTab('communications')}
                  >
                    <i className="bi bi-chat-dots me-2"></i>
                    B2B Chat
                  </button>
                </li>
              </ul>
            </div>

            <div className="p-3">
              {activeTab === 'products' && (
                <Products showNotification={showNotification} />
              )}
              {activeTab === 'orders' && (
                <OrdersFromCustomers showNotification={showNotification} />
              )}
              {activeTab === 'communications' && (
                <Communications showNotification={showNotification} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessesDash;
