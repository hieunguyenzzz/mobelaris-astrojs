import React, {useState} from 'react';
import {addCartItem, createCart, getCart} from '../utils/medusa';

interface AddToCartProps {
  variants: any[];
}

const AddToCart: React.FC<AddToCartProps> = ({variants}) => {
  const [selectedVariant, setSelectedVariant] = useState(variants[0]);
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
        onChange={(e) => setSelectedVariant(variants.find(v => v.id === e.target.value))}
        style={{
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #ccc',
          marginBottom: '0.5rem'
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
            border: '1px solid #ccc'
          }}
        />
        <button 
          onClick={handleAddClick} 
          disabled={loading}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: loading ? '#ccc' : '#2c5282',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
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