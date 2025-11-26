/**
 * Validation Utilities
 * Based on DB Schema constraints
 */

import { MIN_RATING, MAX_RATING, MIN_QUANTITY } from './enums';

// ========== VALIDATION FUNCTIONS ==========

/**
 * Validate product review rating
 * DB Constraint: CHECK (rating >= 1 AND rating <= 5)
 */
export function isValidRating(rating: number): boolean {
    return Number.isInteger(rating) && rating >= MIN_RATING && rating <= MAX_RATING;
}

/**
 * Validate quantity (cart items, restock items, etc.)
 * DB Constraint: CHECK (quantity > 0)
 */
export function isValidQuantity(quantity: number): boolean {
    return Number.isInteger(quantity) && quantity >= MIN_QUANTITY;
}

/**
 * Validate email format
 * Basic email validation
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate phone number (Vietnamese format)
 * Accepts: 0xxxxxxxxx or +84xxxxxxxxx
 */
export function isValidPhoneNumber(phone: string): boolean {
    const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}

/**
 * Validate slug format (URL-friendly)
 * Lowercase, alphanumeric, hyphens allowed
 */
export function isValidSlug(slug: string): boolean {
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    return slugRegex.test(slug);
}

/**
 * Validate hex color code
 * Accepts: #RRGGBB or #RGB
 */
export function isValidHexCode(hex: string): boolean {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(hex);
}

/**
 * Validate price/amount (must be positive)
 */
export function isValidPrice(price: number): boolean {
    return typeof price === 'number' && price > 0;
}

/**
 * Validate discount percentage (0-100)
 */
export function isValidDiscountPercentage(percentage: number): boolean {
    return typeof percentage === 'number' && percentage >= 0 && percentage <= 100;
}

// ========== ERROR MESSAGES ==========

export const ValidationErrors = {
    INVALID_RATING: `Rating must be an integer between ${MIN_RATING} and ${MAX_RATING}`,
    INVALID_QUANTITY: `Quantity must be at least ${MIN_QUANTITY}`,
    INVALID_EMAIL: 'Invalid email format',
    INVALID_PHONE: 'Invalid phone number format',
    INVALID_SLUG: 'Slug must contain only lowercase letters, numbers, and hyphens',
    INVALID_HEX_CODE: 'Invalid hex color code format',
    INVALID_PRICE: 'Price must be a positive number',
    INVALID_DISCOUNT_PERCENTAGE: 'Discount percentage must be between 0 and 100',
    REQUIRED_FIELD: 'This field is required',
    DUPLICATE_EMAIL: 'Email already exists',
    DUPLICATE_SLUG: 'Slug already exists',
    DUPLICATE_SKU: 'SKU already exists',
} as const;

// ========== FORM VALIDATION SCHEMAS ==========

/**
 * Validation schema for cart item quantity
 */
export const cartItemQuantityRules = {
    required: true,
    min: MIN_QUANTITY,
    type: 'number' as const,
};

/**
 * Validation schema for product review
 */
export const productReviewRules = {
    rating: {
        required: true,
        min: MIN_RATING,
        max: MAX_RATING,
        type: 'number' as const,
    },
    comment: {
        required: false,
        maxLength: 1000,
    },
};

/**
 * Validation schema for customer address
 */
export const customerAddressRules = {
    detailed_address: {
        required: true,
        minLength: 10,
    },
    phone_number: {
        required: true,
        pattern: /^(\+84|0)[0-9]{9,10}$/,
    },
};

/**
 * Validation schema for customer registration
 */
export const customerRegistrationRules = {
    name: {
        required: true,
        minLength: 2,
        maxLength: 100,
    },
    email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
        required: true,
        minLength: 8,
    },
};

/**
 * Validation schema for product creation
 */
export const productCreationRules = {
    name: {
        required: true,
        minLength: 3,
        maxLength: 200,
    },
    slug: {
        required: true,
        pattern: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    selling_price: {
        required: true,
        min: 0,
    },
    category_id: {
        required: true,
    },
};
