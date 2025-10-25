// Centralized pricing and discount utilities

/**
 * Calculate discount amount from original price and discounted price
 */
export function calculateDiscountAmount(originalPrice: number, discountedPrice: number): number {
  return Math.max(0, originalPrice - discountedPrice);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscountPercentage(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) return 0;
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

/**
 * Apply discount percentage to price
 */
export function applyDiscountPercentage(price: number, discountPercent: number): number {
  return Math.round(price * (1 - discountPercent / 100));
}

/**
 * Format price to USD currency
 */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`;
}

/**
 * Format price without decimals
 */
export function formatPriceShort(price: number): string {
  return `$${Math.round(price)}`;
}

/**
 * Calculate cart totals
 */
export function calculateCartTotals(items: Array<{
  price: number;
  originalPrice?: number;
  quantity: number;
}>) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  const discount = items.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity;
    }
    return sum;
  }, 0);

  return {
    subtotal,
    discount,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
  };
}

/**
 * Calculate order total with delivery fee
 */
export function calculateOrderTotal(
  subtotal: number,
  discount: number,
  deliveryFee: number,
  promoDiscount: number = 0
): number {
  return Math.max(0, subtotal - discount - promoDiscount + deliveryFee);
}

/**
 * Validate promo code (mock - replace with API call)
 */
export function validatePromoCode(code: string, subtotal: number): {
  valid: boolean;
  discount: number;
  message: string;
} {
  const promoCodes: Record<string, { type: 'percentage' | 'fixed'; value: number; minOrder?: number }> = {
    'SAVE10': { type: 'percentage', value: 10, minOrder: 50 },
    'SAVE20': { type: 'percentage', value: 20, minOrder: 100 },
    'FLAT15': { type: 'fixed', value: 15, minOrder: 0 },
  };

  const promo = promoCodes[code.toUpperCase()];

  if (!promo) {
    return { valid: false, discount: 0, message: 'Invalid promo code' };
  }

  if (promo.minOrder && subtotal < promo.minOrder) {
    return {
      valid: false,
      discount: 0,
      message: `Minimum order of $${promo.minOrder} required`,
    };
  }

  const discount = promo.type === 'percentage' 
    ? Math.round(subtotal * promo.value / 100)
    : promo.value;

  return {
    valid: true,
    discount,
    message: `${promo.type === 'percentage' ? promo.value + '%' : '$' + promo.value} discount applied!`,
  };
}
