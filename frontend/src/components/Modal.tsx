import React, { useEffect } from 'react';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ show, onClose, title, children, size = 'md', footer }) => {
  useEffect(() => {
    if (show) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  if (!show) return null;

  const sizeClass = size === 'sm' ? 'modal-sm' : size === 'lg' ? 'modal-lg' : '';

  return (
    <div 
      className="modal show d-flex align-items-center" 
      style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', zIndex: 1055 }}
      onClick={onClose}
    >
      <div className={`modal-dialog modal-dialog-centered ${sizeClass}`} onClick={e => e.stopPropagation()}>
        <div className="modal-content border">
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold text-primary">{title}</h5>
            <button type="button" aria-label="Close" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            {children}
          </div>
          {footer !== undefined ? (
            footer && <div className="modal-footer border-top">{footer}</div>
          ) : (
            <div className="modal-footer border-top">
              <button type="button" className="btn btn-outline-secondary" onClick={onClose}>Close</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
