/**
 * TypeScript Enums and Constants
 * Source: DB_SCHEMA.md
 * 
 * These enums match the database constraints exactly to prevent typos
 * and ensure type safety across the application.
 */

// ========== CUSTOMER & USER ENUMS ==========

export enum CustomerStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum AdminRole {
    ADMIN = 'admin',
    SUPER_ADMIN = 'super_admin',
}

export enum AddressType {
    HOME = 'Home',
    OFFICE = 'Office',
    OTHER = 'Other',
}

// ========== PRODUCT ENUMS ==========

export enum ProductStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum CategoryStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum VariantStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

// ========== ORDER ENUMS ==========

export enum OrderFulfillmentStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export enum PaymentStatus {
    UNPAID = 'unpaid',
    PAID = 'paid',
    REFUNDED = 'refunded',
}

export enum PaymentMethod {
    COD = 'cod',
    VNPAY = 'vnpay',
    MOMO = 'momo',
}

// ========== REVIEW ENUMS ==========

export enum ReviewStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

// Review Rating: 1-5 (integer)
export const MIN_RATING = 1;
export const MAX_RATING = 5;

// ========== PROMOTION ENUMS ==========

export enum PromotionType {
    FLASH_SALE = 'flash_sale',
    COUPON = 'coupon',
}

export enum DiscountType {
    PERCENTAGE = 'percentage',
    FIXED = 'fixed',
}

export enum PromotionStatus {
    SCHEDULED = 'scheduled',
    ACTIVE = 'active',
    EXPIRED = 'expired',
    INACTIVE = 'inactive',
}

// ========== CMS ENUMS ==========

export enum PageStatus {
    DRAFT = 'Draft',
    PUBLISHED = 'published',
}

// ========== SUPPORT ENUMS ==========

export enum SupportTicketStatus {
    PENDING = 'pending',
    OPEN = 'open',
    RESOLVED = 'resolved',
    CLOSED = 'closed',
}

export enum SupportTicketSource {
    CONTACT_FORM = 'contact_form',
    CHATBOT = 'chatbot',
    EMAIL = 'email',
}

export enum SupportTicketPriority {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    URGENT = 'urgent',
}

// ========== INVENTORY ENUMS ==========

export enum RestockType {
    MANUAL = 'Manual',
    EXCEL_UPLOAD = 'Excel Upload',
}

// ========== NOTIFICATION ENUMS ==========

export enum NotificationStatus {
    ACTIVE = 'active',
    SENT = 'sent',
    CANCELLED = 'cancelled',
}

export enum NotificationType {
    RESTOCK = 'restock',
    PRICE_DROP = 'price_drop',
}

// ========== VALIDATION CONSTANTS ==========

// Quantity constraints
export const MIN_QUANTITY = 1; // CHECK (quantity > 0)

// Stock defaults
export const DEFAULT_STOCK = 0;
export const DEFAULT_RESERVED_STOCK = 0;
export const DEFAULT_REORDER_POINT = 0;

// Shipping
export const DEFAULT_SHIPPING_FEE = 0;

// Product ratings
export const DEFAULT_AVERAGE_RATING = 0.00;
export const DEFAULT_TOTAL_REVIEWS = 0;

// Sort order
export const DEFAULT_SORT_ORDER = 0;
