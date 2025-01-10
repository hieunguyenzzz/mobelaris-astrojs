import React, { useState } from 'react';
import { updateCartItem, deleteCartItem } from '../utils/medusa';

interface CartItemProps {
  item: any;
  cartId: string;
  onUpdate: () => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, cartId, onUpdate }) => {
  const [loading, setLoading] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    setLoading(true);
    try {
      await updateCartItem(cartId, item.id, newQuantity);
      onUpdate();
    } catch (error) {
      console.error('Error updating quantity:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    setLoading(true);
    try {
      await deleteCartItem(cartId, item.id);
      onUpdate();
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = () => {
    const price = item.unit_price / 100;
    const currency = item.variant?.prices?.[0]?.currency_code || 'USD';
    return `${price.toFixed(2)} ${currency}`;
  };

  return (
    <div className="cart-item">
      <div className="item-image">
        <img src={item.thumbnail || '/placeholder.png'} alt={item.title} />
      </div>
      <div className="item-details">
        <h3>{item.title}</h3>
        <p className="variant">{item.variant?.title || 'Default Variant'}</p>
        <p className="price">{formatPrice()}</p>
      </div>
      <div className="item-controls">
        <div className="quantity-controls">
          <button 
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={loading || item.quantity <= 1}
            className="quantity-btn"
          >
            -
          </button>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
            disabled={loading}
          />
          <button 
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={loading}
            className="quantity-btn"
          >
            +
          </button>
        </div>
        <button onClick={handleRemove} disabled={loading} className="remove-btn">
          Remove
        </button>
      </div>
      <div className="item-total">
        <p>Total: {(item.unit_price * item.quantity / 100).toFixed(2)} {item.variant?.prices?.[0]?.currency_code || 'USD'}</p>
      </div>
      <style jsx>{`
        .cart-item {
          display: grid;
          grid-template-columns: 100px 2fr 1fr 1fr;
          gap: 1.5rem;
          align-items: center;
          padding: 1.5rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .item-image img {
          width: 100%;
          height: 100px;
          object-fit: cover;
          border-radius: 4px;
        }

        .item-details h3 {
          margin: 0 0 0.5rem 0;
          font-size: 1.1rem;
          color: #2d3748;
        }

        .variant {
          color: #718096;
          font-size: 0.9rem;
          margin: 0.25rem 0;
        }

        .price {
          font-weight: 600;
          color: #2c5282;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .quantity-btn {
          width: 30px;
          height: 30px;
          padding: 0;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 4px;
          cursor: pointer;
        }

        .quantity-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        input {
          width: 50px;
          text-align: center;
          padding: 0.25rem;
          border: 1px solid #e2e8f0;
          border-radius: 4px;
        }

        .remove-btn {
          padding: 0.5rem 1rem;
          background-color: #fed7d7;
          color: #c53030;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.9rem;
        }

        .remove-btn:hover {
          background-color: #feb2b2;
        }

        .item-total {
          text-align: right;
          font-weight: 600;
          color: #2d3748;
        }
      `}</style>
    </div>
  );
};

export default CartItem; 