// Cart management utilities

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  size?: string;
  color?: string;
  maxStock?: number;
}

const CART_STORAGE_KEY = 'lecas_cart';

// Get cart from localStorage
export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
}

// Save cart to localStorage
export function saveCart(cart: CartItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    // Dispatch event for cart count update
    window.dispatchEvent(new Event('cart-updated'));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
}

// Add item to cart
export function addToCart(item: Omit<CartItem, 'quantity'>, quantity: number = 1): boolean {
  const cart = getCart();
  
  // Find existing item with same id, size, and color
  const existingIndex = cart.findIndex(
    (cartItem) =>
      cartItem.id === item.id &&
      cartItem.size === item.size &&
      cartItem.color === item.color
  );

  if (existingIndex >= 0) {
    // Update quantity of existing item
    const newQuantity = cart[existingIndex].quantity + quantity;
    
    // Check stock limit if available
    if (item.maxStock && newQuantity > item.maxStock) {
      return false; // Cannot add more than available stock
    }
    
    cart[existingIndex].quantity = newQuantity;
  } else {
    // Add new item
    cart.push({ ...item, quantity });
  }

  saveCart(cart);
  return true;
}

// Remove item from cart
export function removeFromCart(id: string, size?: string, color?: string): void {
  let cart = getCart();
  cart = cart.filter(
    (item) =>
      !(item.id === id && item.size === size && item.color === color)
  );
  saveCart(cart);
}

// Update item quantity
export function updateCartItemQuantity(
  id: string,
  quantity: number,
  size?: string,
  color?: string
): boolean {
  const cart = getCart();
  const index = cart.findIndex(
    (item) =>
      item.id === id && item.size === size && item.color === color
  );

  if (index >= 0) {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return true;
    }

    // Check stock limit
    if (cart[index].maxStock && quantity > cart[index].maxStock!) {
      return false;
    }

    cart[index].quantity = quantity;
    saveCart(cart);
    return true;
  }

  return false;
}

// Clear cart
export function clearCart(): void {
  saveCart([]);
}

// Get cart count
export function getCartCount(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
}

// Get cart subtotal
export function getCartSubtotal(): number {
  const cart = getCart();
  return cart.reduce((total, item) => total + item.price * item.quantity, 0);
}

// Calculate cart discount
export function getCartDiscount(): number {
  const cart = getCart();
  return cart.reduce((total, item) => {
    if (item.originalPrice) {
      return total + (item.originalPrice - item.price) * item.quantity;
    }
    return total;
  }, 0);
}
