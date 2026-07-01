import React from 'react';

interface StatCardProps {
  icon: string; // Bootstrap icon class name
  label: string;
  value: string | number;
  colorClass?: string; // 'primary', 'success', 'warning', 'danger', 'info', etc.
}

const StatCard: React.FC<StatCardProps> = ({ icon, label, value, colorClass = 'primary' }) => {
  return (
    <div className="stat-card p-3 h-100 bg-card rounded border">
      <div className="d-flex align-items-center">
        <div className={`stat-icon bg-${colorClass} bg-opacity-10 me-3 d-flex align-items-center justify-content-center rounded-circle`} style={{ width: '48px', height: '48px' }}>
          <i className={`bi ${icon} text-${colorClass} fs-4`}></i>
        </div>
        <div>
          <small className="text-secondary d-block text-uppercase fw-semibold" style={{ fontSize: '0.75rem', letterSpacing: '0.05em' }}>{label}</small>
          <span className="fs-4 fw-bold text-primary">{value}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
