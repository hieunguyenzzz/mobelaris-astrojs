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

  return (
    <div className="cart-item">
      <div className="item-details">
        <h3>{item.title}</h3>
        <p className="variant">{item.variant.title}</p>
        <p className="price">
          {item.unit_price / 100} {item.variant.prices[0]?.currency_code}
        </p>
      </div>
      <div className="item-controls">
        <input
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
          disabled={loading}
        />
        <button onClick={handleRemove} disabled={loading}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem; 