import { useState } from 'react';
import { getCart, createCart, addCartItem } from '../utils/medusa';

export const useCart = () => {
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('cartId');
    }
    return null;
  });

  const validateCart = async (cartId: string) => {
    try {
      const cart = await getCart(cartId);
      return cart.cart.id === cartId;
    } catch (e) {
      console.log("Cart validation failed", e);
      return false;
    }
  };

  const addToCart = async (variantId: string, quantity: number) => {
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      let cart_id = cartId;

      if (cart_id) {
        const isValid = await validateCart(cart_id);
        if (!isValid) {
          localStorage.removeItem('cartId');
          cart_id = null;
        }
      }

      if (!cart_id) {
        const cart = await createCart();
        cart_id = cart.cart.id;
        setCartId(cart_id);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('cartId', cart_id);
        }
      }

      await addCartItem(cart_id, variantId, quantity);
      setSuccessMessage('Added to cart');

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'));
      }

      const updatedCart = await getCart(cart_id);
      console.log("Updated cart", {updatedCart});
    } catch (e) {
      console.error("Error adding to cart", e);
      setErrorMessage('Error adding to cart. Please try again.');
      
      if (e.response?.status === 404) {
        localStorage.removeItem('cartId');
        setCartId(null);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    successMessage,
    errorMessage,
    addToCart
  };
}; 