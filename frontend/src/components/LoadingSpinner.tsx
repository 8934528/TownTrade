import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  fullPage?: boolean;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ message = 'Loading...', fullPage = false }) => {
  const content = (
    <div className="d-flex flex-column align-items-center justify-content-center p-5">
      <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
        <span className="visually-hidden">Loading...</span>
      </div>
      <p className="text-secondary small fw-medium">{message}</p>
    </div>
  );

  if (fullPage) {
    return (
      <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{ zIndex: 1050 }}>
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
