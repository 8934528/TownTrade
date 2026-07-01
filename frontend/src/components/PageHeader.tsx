import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="bg-card border-bottom py-4 mb-4">
      <div className="container">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3">
          <div>
            <h1 className="fs-2 fw-bold text-primary mb-1">{title}</h1>
            {subtitle && <p className="text-secondary small mb-0">{subtitle}</p>}
          </div>
          {actions && <div className="d-flex gap-2 flex-wrap">{actions}</div>}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
