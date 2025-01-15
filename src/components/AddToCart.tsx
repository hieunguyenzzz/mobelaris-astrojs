import React, {useState, useEffect} from 'react';
import {addCartItem, createCart, getCart} from '../utils/medusa';

interface AddToCartProps {
  variants: any[];
  onVariantChange?: (variant: any) => void;
  initialVariantHandle?: string;
}

const AddToCart: React.FC<AddToCartProps> = ({
  variants, 
  onVariantChange,
  initialVariantHandle
}) => {
  // Find initial variant based on handle or default to first variant
  const initialVariant = initialVariantHandle 
    ? variants.find(v => v.metadata?.handle === initialVariantHandle)
    : variants[0];

  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [quantity, setQuantity] = useState(1);
  const [cartId, setCartId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('cartId');
    }
    return null;
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (onVariantChange) {
      onVariantChange(selectedVariant);
    }
  }, []);

  const handleVariantChange = (variantId: string) => {
    const variant = variants.find(v => v.id === variantId);
    if (variant) {
      setSelectedVariant(variant);
      if (onVariantChange) {
        onVariantChange(variant);
      }
      // Update URL to just the variant handle
      const newUrl = `/${variant.metadata?.handle || ''}`;
      window.history.pushState({}, '', newUrl);
    }
  };

  const handleAddClick = async () => {
    setLoading(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      let cart_id = cartId
      if (!cart_id) {
        const cart = await createCart()
        cart_id = cart.cart.id
        setCartId(cart_id)
        if (typeof window !== 'undefined') {
          window.localStorage.setItem('cartId', cart_id)
        }
      }

      await addCartItem(cart_id, selectedVariant.id, quantity)
      setSuccessMessage('Added to cart')

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('cartUpdated'))
      }
      
      const updatedCart = await getCart(cart_id)
      console.log("Updated cart", {updatedCart})
    } catch (e) {
      console.error("Error adding to cart", {e})
      setErrorMessage('Error adding to cart')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '300px' }}>
      <select 
        value={selectedVariant.id}
        onChange={(e) => handleVariantChange(e.target.value)}
        style={{
          padding: '0.75rem',
          borderRadius: '4px',
          border: '1px solid #e2e8f0',
          marginBottom: '0.5rem',
          width: '100%'
        }}
      >
        {variants.map((variant) => (
          <option key={variant.id} value={variant.id}>
            {variant.title} - {variant.prices[0]?.amount / 100} {variant.prices[0]?.currency_code}
          </option>
        ))}
      </select>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input 
          type="number" 
          min={1} 
          value={quantity} 
          onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
          style={{
            padding: '0.5rem',
            width: '80px',
            borderRadius: '4px',
            border: '1px solid #e2e8f0'
          }}
        />
        <button 
          onClick={handleAddClick} 
          disabled={loading}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: loading ? '#cbd5e0' : '#2c5282',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            flex: 1
          }}
        >
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
      {successMessage && (
        <div style={{ color: 'green', padding: '0.5rem 0' }}>{successMessage}</div>
      )}
      {errorMessage && (
        <div style={{ color: 'red', padding: '0.5rem 0' }}>{errorMessage}</div>
      )}
    </div>
  );
};

export default AddToCart;