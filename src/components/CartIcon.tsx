import React, { useState, useEffect } from 'react';
import { getCart } from '../utils/medusa';

const CartIcon = () => {
  const [itemCount, setItemCount] = useState(0);

  const updateItemCount = async () => {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      try {
        const { cart } = await getCart(cartId);
        const count = cart?.items?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
        setItemCount(count);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
  };

  useEffect(() => {
    updateItemCount();
    window.addEventListener('cartUpdated', updateItemCount);
    return () => window.removeEventListener('cartUpdated', updateItemCount);
  }, []);

  return (
    <a href="/cart" className="cart-icon">
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1"></circle>
        <circle cx="20" cy="21" r="1"></circle>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
      </svg>
      {itemCount > 0 && (
        <span className="cart-count">{itemCount}</span>
      )}
      <style>{`
        .cart-icon {
          position: relative;
          color: white;
          text-decoration: none;
        }
        
        .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background-color: #e53e3e;
          color: white;
          border-radius: 50%;
          width: 18px;
          height: 18px;
          font-size: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      `}</style>
    </a>
  );
};

export default CartIcon; 