import React from 'react';

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status }) => {
  const statusMap: Record<string, { class: string; icon: string; label: string }> = {
    pending: { class: 'bg-warning bg-opacity-10 text-warning border-warning-subtle', icon: 'bi-hourglass', label: 'Pending' },
    confirmed: { class: 'bg-primary bg-opacity-10 text-primary border-primary-subtle', icon: 'bi-check-circle', label: 'Confirmed' },
    preparing: { class: 'bg-info bg-opacity-10 text-info border-info-subtle', icon: 'bi-gear', label: 'Preparing' },
    ready: { class: 'bg-info bg-opacity-25 text-info border-info', icon: 'bi-gift', label: 'Ready' },
    out_for_delivery: { class: 'bg-warning text-dark border-warning', icon: 'bi-truck', label: 'Out for Delivery' },
    delivered: { class: 'bg-success bg-opacity-10 text-success border-success-subtle', icon: 'bi-check2-all', label: 'Delivered' },
    cancelled: { class: 'bg-danger bg-opacity-10 text-danger border-danger-subtle', icon: 'bi-x-circle', label: 'Cancelled' },
  };

  const current = statusMap[status.toLowerCase()] || { class: 'bg-secondary bg-opacity-10 text-secondary border-secondary-subtle', icon: 'bi-question-circle', label: status };

  return (
    <span className={`badge border ${current.class} d-inline-flex align-items-center gap-1 px-2 py-1`}>
      <i className={`bi ${current.icon}`}></i>
      {current.label}
    </span>
  );
};

export default OrderStatusBadge;
