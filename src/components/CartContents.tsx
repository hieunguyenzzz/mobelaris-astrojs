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
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', fetchCart);
    return () => window.removeEventListener('cartUpdated', fetchCart);
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>
        <p>Add some items to your cart to see them here.</p>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum: number, item: any) => sum + (item.unit_price * item.quantity) / 100,
    0
  );

  return (
    <div className="cart-container">
      {cart.items.map((item: any) => (
        <CartItem
          key={item.id}
          item={item}
          cartId={cart.id}
          onUpdate={fetchCart}
        />
      ))}
      <div className="cart-summary">
        <h3>Cart Summary</h3>
        <p>Total: {total.toFixed(2)} {cart.region.currency_code}</p>
        <button 
          className="checkout-button"
          onClick={() => {
            // Add checkout logic here
            console.log('Proceeding to checkout...');
          }}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartContents; 