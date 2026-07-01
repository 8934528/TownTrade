import React from 'react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onEdit?: (product: Product) => void;
  onDelete?: (id: number) => void;
  onAddToCart?: (product: Product) => void;
  isOwner?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onEdit, onDelete, onAddToCart, isOwner = false }) => {
  return (
    <div className={`card h-100 product-card border ${product.stock <= product.low_stock_threshold ? 'border-danger-subtle' : ''}`}>
      {product.image_url ? (
        <img 
          src={product.image_url} 
          className="card-img-top object-fit-cover" 
          alt={product.name} 
          style={{ height: '160px' }}
        />
      ) : (
        <div className="bg-light d-flex align-items-center justify-content-center border-bottom text-muted" style={{ height: '160px' }}>
          <i className="bi bi-box-seam display-6"></i>
        </div>
      )}
      <div className="card-body d-flex flex-column p-3">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <h6 className="card-title fw-bold mb-0 text-truncate" style={{ maxWidth: '75%' }}>{product.name}</h6>
          <span className="badge bg-primary bg-opacity-10 text-primary fw-bold">R{product.price}</span>
        </div>
        {product.category && (
          <small className="text-secondary d-block mb-2">{product.category}</small>
        )}
        <p className="card-text small text-secondary flex-grow-1 mb-3" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {product.description || 'No description available.'}
        </p>

        {/* Stock status indicator */}
        <div className="mb-3">
          {product.stock === 0 ? (
            <span className="badge bg-danger bg-opacity-10 text-danger">Out of stock</span>
          ) : product.stock <= product.low_stock_threshold ? (
            <span className="badge bg-warning bg-opacity-10 text-warning">
              Low Stock: {product.stock} left
            </span>
          ) : (
            <span className="badge bg-success bg-opacity-10 text-success">
              Stock: {product.stock}
            </span>
          )}
        </div>

        {isOwner ? (
          <div className="d-flex gap-2 mt-auto">
            {onEdit && (
              <button type="button" className="btn btn-outline-primary btn-sm flex-fill" onClick={() => onEdit(product)}>
                <i className="bi bi-pencil me-1"></i> Edit
              </button>
            )}
            {onDelete && (
              <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => onDelete(product.id)}>
                <i className="bi bi-trash"></i>
              </button>
            )}
          </div>
        ) : (
          onAddToCart && (
            <button 
              type="button"
              className="btn btn-primary btn-sm w-100 mt-auto" 
              disabled={product.stock === 0} 
              onClick={() => onAddToCart(product)}
            >
              <i className="bi bi-cart-plus me-1"></i> Add to Cart
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default ProductCard;
