import { useState, useEffect, useCallback } from 'react';
import { paymentsService } from '../../../services/payments';
import { ordersService } from '../../../services/orders';
import type { Payment as PaymentType, Order } from '../../../types';
import EmptyState from '../../../components/EmptyState';
import LoadingSpinner from '../../../components/LoadingSpinner';

interface PaymentProps {
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  pendingOrderId: number | null;
  onPaymentSuccess: () => void;
}

const Payment = ({ showNotification, pendingOrderId, onPaymentSuccess }: PaymentProps) => {
  const [payments, setPayments] = useState<PaymentType[]>([]);
  const [loading, setLoading] = useState(false);
  const [pendingOrder, setPendingOrder] = useState<Order | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<'card' | 'mobile_money' | 'cash' | 'eft'>('card');
  const [processing, setProcessing] = useState(false);

  const fetchPaymentsHistory = useCallback(async () => {
    try {
      setLoading(true);
      const list = await paymentsService.listMyPayments();
      setPayments(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPendingOrderDetails = useCallback(async () => {
    if (!pendingOrderId) {
      setPendingOrder(null);
      return;
    }
    try {
      const order = await ordersService.getById(pendingOrderId);
      setPendingOrder(order);
    } catch (err) {
      console.error(err);
    }
  }, [pendingOrderId]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      await Promise.resolve();
      if (mounted) {
        fetchPaymentsHistory();
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [fetchPaymentsHistory]);

  useEffect(() => {
    let mounted = true;
    const run = async () => {
      await Promise.resolve();
      if (mounted) {
        fetchPendingOrderDetails();
      }
    };
    run();
    return () => {
      mounted = false;
    };
  }, [fetchPendingOrderDetails]);

  const handlePaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingOrder) return;

    try {
      setProcessing(true);
      const payRecord = await paymentsService.initiate({
        order_id: pendingOrder.id,
        method: selectedMethod,
        amount: pendingOrder.total_amount,
      });

      // Confirm automatically for cash and mobile money as per design
      if (selectedMethod === 'cash' || selectedMethod === 'mobile_money') {
        showNotification('Payment initialized and processed!', 'success');
      } else {
        // Card/EFT simulation: trigger webhook confirmation
        await paymentsService.confirm(payRecord.reference!);
        showNotification('Digital payment authorized successfully!', 'success');
      }

      onPaymentSuccess();
      fetchPaymentsHistory();
    } catch {
      showNotification('Payment gateway integration failed.', 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="payment-template">
      {pendingOrder && (
        <div className="card p-3 border-primary mb-4 bg-light">
          <h5 className="fw-bold text-primary mb-2">Pay Digitally for Order #{pendingOrder.id}</h5>
          <p className="small text-secondary mb-3">
            Please select your payment method to complete the online transaction.
          </p>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span>Total Amount:</span>
            <span className="fw-bold text-primary fs-4">R{pendingOrder.total_amount}</span>
          </div>

          <form onSubmit={handlePaySubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Select Payment Gateway / Method</label>
              <div className="row g-2">
                {(['card', 'mobile_money', 'cash', 'eft'] as const).map((method) => (
                  <div key={method} className="col-6">
                    <button
                      type="button"
                      className={`btn w-100 py-3 ${selectedMethod === method ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setSelectedMethod(method)}
                    >
                      <i className={`bi bi-${
                        method === 'card' ? 'credit-card' : method === 'mobile_money' ? 'phone' : method === 'cash' ? 'cash' : 'bank'
                      } d-block mb-1 fs-5`}></i>
                      <span className="small text-capitalize">{method.replace('_', ' ')}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary w-100"
              disabled={processing}
            >
              {processing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing Payment...
                </>
              ) : (
                <>
                  <i className="bi bi-shield-check me-2"></i> Pay R{pendingOrder.total_amount} Now
                </>
              )}
            </button>
          </form>
        </div>
      )}

      {/* Wallet Balance Card */}
      <div className="bg-primary text-white p-4 rounded mb-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <small>TownTrade Wallet Balance</small>
          <i className="bi bi-wallet2 fs-4"></i>
        </div>
        <h2 className="fw-bold mb-3">R450.00</h2>
        <button 
          type="button"
          className="btn btn-light"
          onClick={() => showNotification('Top Up coming soon!', 'info')}
        >
          <i className="bi bi-plus-circle me-2"></i> Top Up Wallet
        </button>
      </div>

      {/* Payment History */}
      <div>
        <h6 className="fw-bold text-primary mb-3">Transaction History</h6>
        {loading ? (
          <LoadingSpinner message="Retrieving transaction history..." />
        ) : payments.length === 0 ? (
          <EmptyState
            icon="bi-journal-text"
            title="No Transactions"
            message="Your online purchase payments will appear here."
          />
        ) : (
          payments.map((tx) => (
            <div key={tx.id} className="card p-3 mb-2">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="fw-bold d-block">Order ID #{tx.order_id}</span>
                  <small className="text-secondary">{new Date(tx.created_at).toLocaleString()}</small>
                </div>
                <div className="text-end">
                  <span className="fw-bold d-block text-primary">R{tx.amount}</span>
                  <span className={`badge bg-${tx.status === 'success' ? 'success' : 'warning'} bg-opacity-10 text-${tx.status === 'success' ? 'success' : 'warning'} mt-1`}>
                    <i className={`bi bi-${tx.status === 'success' ? 'check-circle' : 'hourglass'} me-1`}></i>
                    {tx.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Payment;
