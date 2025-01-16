import Medusa from "@medusajs/medusa-js"

const MEDUSA_BACKEND_URL = import.meta.env.PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"

// Create a new Medusa client
const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })

export async function getRegions() {
  const { regions } = await medusa.regions.list();
  return regions;
}

// Modify existing functions to support regions
export async function getProducts(regionId) {
  const { products } = await medusa.products.list({
    region_id: regionId
  });
  return { products };
}

export async function getProduct(productId, regionId) {
  const { product } = await medusa.products.retrieve(productId, {
    region_id: regionId
  });
  return { product };
}

export async function getVariant(variantId) {
  const { variant } = await medusa.variants.retrieve(variantId)
  return { variant }
}

export async function createCart() {
  return await medusa.carts.create()
}

export async function getCart(cartId) {
  return await medusa.carts.retrieve(cartId)
}

export async function addCartItem(cartId, variantId, quantity) {
  return await medusa.carts.lineItems.create(cartId, {
    variant_id: variantId,
    quantity: quantity
  })
}

export async function updateCartItem(cartId, lineItemId, quantity) {
  return await medusa.carts.lineItems.update(cartId, lineItemId, {
    quantity: quantity
  })
}

export async function deleteCartItem(cartId, lineItemId) {
  return await medusa.carts.lineItems.delete(cartId, lineItemId)
}