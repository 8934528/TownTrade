import React from 'react';

interface EmptyStateProps {
  icon: string;
  title: string;
  message: string;
  actionText?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message, actionText, onAction }) => {
  return (
    <div className="text-center py-5">
      <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-4 mb-3">
        <i className={`bi ${icon} display-4 text-primary`}></i>
      </div>
      <h5 className="fw-bold mb-2">{title}</h5>
      <p className="text-secondary small mb-4 mx-auto" style={{ maxWidth: '360px' }}>{message}</p>
      {actionText && onAction && (
        <button type="button" className="btn btn-primary" onClick={onAction}>
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
