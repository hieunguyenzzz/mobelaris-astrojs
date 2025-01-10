import React, { useState, useEffect } from 'react';
import { getCart } from '../utils/medusa';
import CartItem from './CartItem';

const CartContents = () => {
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      try {
        const cartData = await getCart(cartId);
        setCart(cartData.cart);
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
    window.addEventListener('cartUpdated', fetchCart);
    return () => window.removeEventListener('cartUpdated', fetchCart);
  }, []);

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <p>Loading your cart...</p>
        <style jsx>{`
          .loading {
            text-align: center;
            padding: 2rem;
          }
          .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #2c5282;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 1rem;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="64" 
          height="64" 
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
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart to see them here.</p>
        <a href="/" className="continue-shopping">Continue Shopping</a>
        <style jsx>{`
          .empty-cart {
            text-align: center;
            padding: 4rem 2rem;
            color: #4a5568;
          }
          svg {
            color: #a0aec0;
            margin-bottom: 1rem;
          }
          h2 {
            margin-bottom: 0.5rem;
            color: #2d3748;
          }
          .continue-shopping {
            display: inline-block;
            margin-top: 1.5rem;
            padding: 0.75rem 1.5rem;
            background-color: #2c5282;
            color: white;
            text-decoration: none;
            border-radius: 4px;
          }
        `}</style>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum: number, item: any) => sum + (item.unit_price * item.quantity) / 100,
    0
  );

  return (
    <div className="cart-container">
      <div className="cart-items">
        {cart.items.map((item: any) => (
          <CartItem
            key={item.id}
            item={item}
            cartId={cart.id}
            onUpdate={fetchCart}
          />
        ))}
      </div>
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>{total.toFixed(2)} {cart.region.currency_code}</span>
        </div>
        <div className="summary-row">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>
        <div className="summary-total">
          <span>Total</span>
          <span>{total.toFixed(2)} {cart.region.currency_code}</span>
        </div>
        <button 
          className="checkout-button"
          onClick={() => {
            console.log('Proceeding to checkout...');
          }}
        >
          Proceed to Checkout
        </button>
      </div>
      <style jsx>{`
        .cart-container {
          display: grid;
          grid-template-columns: 1fr 350px;
          gap: 2rem;
          align-items: start;
        }

        .cart-items {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .cart-summary {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          position: sticky;
          top: 2rem;
        }

        .cart-summary h3 {
          margin: 0 0 1.5rem 0;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
          color: #2d3748;
        }

        .summary-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          color: #4a5568;
        }

        .summary-total {
          display: flex;
          justify-content: space-between;
          margin: 1.5rem 0;
          padding-top: 1rem;
          border-top: 2px solid #e2e8f0;
          font-weight: 600;
          font-size: 1.1rem;
          color: #2d3748;
        }

        .checkout-button {
          width: 100%;
          padding: 1rem;
          background-color: #2c5282;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: background-color 0.2s;
        }

        .checkout-button:hover {
          background-color: #2a4365;
        }

        @media (max-width: 768px) {
          .cart-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default CartContents; 