// Wishlist management utilities

export interface WishlistItem {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating?: number;
  discount?: number;
  addedAt: string; // ISO timestamp
}

const WISHLIST_STORAGE_KEY = 'lecas_wishlist';

// Get wishlist from localStorage
export function getWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const wishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
    return wishlist ? JSON.parse(wishlist) : [];
  } catch (error) {
    console.error('Error reading wishlist:', error);
    return [];
  }
}

// Save wishlist to localStorage
export function saveWishlist(wishlist: WishlistItem[]): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    // Dispatch event for wishlist count update
    window.dispatchEvent(new Event('wishlist-updated'));
  } catch (error) {
    console.error('Error saving wishlist:', error);
  }
}

// Check if item is in wishlist
export function isInWishlist(id: string): boolean {
  const wishlist = getWishlist();
  return wishlist.some(item => item.id === id);
}

// Add item to wishlist
export function addToWishlist(item: Omit<WishlistItem, 'addedAt'>): boolean {
  const wishlist = getWishlist();
  
  // Check if already in wishlist
  if (wishlist.some(w => w.id === item.id)) {
    return false; // Already exists
  }

  wishlist.push({
    ...item,
    addedAt: new Date().toISOString(),
  });

  saveWishlist(wishlist);
  return true;
}

// Remove item from wishlist
export function removeFromWishlist(id: string): void {
  let wishlist = getWishlist();
  wishlist = wishlist.filter(item => item.id !== id);
  saveWishlist(wishlist);
}

// Toggle item in wishlist (add if not exists, remove if exists)
export function toggleWishlist(item: Omit<WishlistItem, 'addedAt'>): boolean {
  if (isInWishlist(item.id)) {
    removeFromWishlist(item.id);
    return false; // Removed
  } else {
    addToWishlist(item);
    return true; // Added
  }
}

// Clear wishlist
export function clearWishlist(): void {
  saveWishlist([]);
}

// Get wishlist count
export function getWishlistCount(): number {
  return getWishlist().length;
}

// Move item from wishlist to cart
export function moveToCart(id: string): WishlistItem | null {
  const wishlist = getWishlist();
  const item = wishlist.find(w => w.id === id);
  
  if (item) {
    removeFromWishlist(id);
    return item;
  }
  
  return null;
}
