/**
 * Database Model Interfaces
 * Source: DB_SCHEMA.md
 * 
 * These interfaces match the database schema exactly.
 * Use these as the source of truth for data types.
 */

import {
    CustomerStatus,
    AdminRole,
    AddressType,
    ProductStatus,
    CategoryStatus,
    VariantStatus,
    OrderFulfillmentStatus,
    PaymentStatus,
    PaymentMethod,
    ReviewStatus,
    PromotionType,
    DiscountType,
    PromotionStatus,
    PageStatus,
    SupportTicketStatus,
    SupportTicketSource,
    SupportTicketPriority,
    RestockType,
    NotificationStatus,
} from './enums';

// ========== USER MODELS ==========

export interface Customer {
    id: number;
    name: string | null;
    email: string; // UNIQUE, NOT NULL
    password_hash?: string; // Should not be sent to frontend
    status: CustomerStatus; // DEFAULT 'inactive'
    created_at: string; // ISO timestamp
    updated_at: string;
    refresh_token?: string | null;
    refresh_token_expires?: string | null;
}

export interface Admin {
    id: number;
    name: string | null;
    email: string; // UNIQUE, NOT NULL
    password_hash?: string; // Should not be sent to frontend
    role: AdminRole; // NOT NULL
}

export interface CustomerAddress {
    id: number;
    customer_id: number; // FK to customers(id)
    is_default: boolean; // DEFAULT false
    address_type: AddressType; // DEFAULT 'Home'
    detailed_address: string; // NOT NULL
    phone_number: string; // NOT NULL
}

// ========== PRODUCT MODELS ==========

export interface Category {
    id: number;
    name: string; // NOT NULL
    slug: string; // UNIQUE, NOT NULL
    status: CategoryStatus; // DEFAULT 'active'
}

export interface Product {
    id: number;
    category_id: number | null; // FK to categories(id)
    name: string; // NOT NULL
    slug: string; // UNIQUE, NOT NULL
    description: string | null;
    full_description: string | null;
    cost_price: number | null;
    selling_price: number; // NOT NULL
    status: ProductStatus; // DEFAULT 'active'
    thumbnail_url: string | null;
    average_rating: number; // DEFAULT 0.00
    total_reviews: number; // DEFAULT 0
    created_at: string;
    updated_at: string;
}

export interface Size {
    id: number;
    name: string; // NOT NULL
    sort_order: number; // DEFAULT 0
}

export interface Color {
    id: number;
    name: string; // NOT NULL
    hex_code: string | null;
}

export interface ProductVariant {
    id: number;
    product_id: number; // FK to products(id), NOT NULL
    size_id: number | null; // FK to sizes(id)
    color_id: number | null; // FK to colors(id)
    name: string | null;
    sku: string; // UNIQUE, NOT NULL
    total_stock: number; // DEFAULT 0
    reserved_stock: number; // DEFAULT 0
    reorder_point: number; // DEFAULT 0
    status: VariantStatus; // DEFAULT 'active'
}

export interface ProductImage {
    id: number;
    variant_id: number; // FK to product_variants(id), NOT NULL
    image_url: string; // NOT NULL
    is_main: boolean; // DEFAULT false
}

// ========== CART MODELS ==========

export interface Cart {
    id: number;
    customer_id: number | null; // FK to customers(id), UNIQUE
    session_id: string | null; // UNIQUE
    created_at: string;
    updated_at: string;
}

export interface CartItem {
    id: number;
    cart_id: number; // FK to carts(id), NOT NULL
    variant_id: number; // FK to product_variants(id), NOT NULL
    quantity: number; // NOT NULL, CHECK (quantity > 0)
}

// ========== ORDER MODELS ==========

export interface Order {
    id: number;
    customer_id: number | null; // FK to customers(id)
    customer_email: string | null;
    shipping_address: string; // NOT NULL
    shipping_phone: string; // NOT NULL
    fulfillment_status: OrderFulfillmentStatus; // DEFAULT 'pending'
    payment_status: PaymentStatus; // DEFAULT 'unpaid'
    payment_method: PaymentMethod; // DEFAULT 'cod'
    shipping_fee: number; // DEFAULT 0
    total_amount: number; // NOT NULL
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number; // FK to orders(id), NOT NULL
    variant_id: number; // FK to product_variants(id), NOT NULL
    quantity: number; // NOT NULL
    price_at_purchase: number; // NOT NULL
}

export interface OrderStatusHistory {
    id: number;
    order_id: number; // FK to orders(id), NOT NULL
    status: OrderFulfillmentStatus; // NOT NULL
    admin_id: number | null; // FK to admins(id)
    created_at: string;
}

// ========== REVIEW MODELS ==========

export interface ProductReview {
    id: number;
    variant_id: number; // FK to product_variants(id), NOT NULL
    customer_id: number; // FK to customers(id), NOT NULL
    order_id: number; // FK to orders(id), NOT NULL
    rating: number; // NOT NULL, CHECK (rating >= 1 AND rating <= 5)
    comment: string | null;
    created_at: string;
    status: ReviewStatus; // DEFAULT 'pending'
}

// ========== WISHLIST MODELS ==========

export interface WishlistItem {
    id: number;
    customer_id: number; // FK to customers(id), NOT NULL
    variant_id: number; // FK to product_variants(id), NOT NULL
}

// ========== PROMOTION MODELS ==========

export interface Promotion {
    id: number;
    name: string; // NOT NULL
    type: PromotionType; // NOT NULL
    discount_value: number; // NOT NULL
    discount_type: DiscountType; // NOT NULL
    number_limited: number | null;
    start_date: string; // NOT NULL, ISO timestamp
    end_date: string; // NOT NULL, ISO timestamp
    status: PromotionStatus; // DEFAULT 'scheduled'
}

export interface PromotionProduct {
    id: number;
    promotion_id: number; // FK to promotions(id), NOT NULL
    product_id: number; // FK to products(id), NOT NULL
    flash_sale_price: number; // NOT NULL
}

export interface PromotionUsage {
    id: number;
    promotion_id: number; // FK to promotions(id), NOT NULL
    order_id: number; // FK to orders(id), NOT NULL
    customer_id: number; // FK to customers(id), NOT NULL
    created_at: string;
}

// ========== CMS MODELS ==========

export interface Page {
    id: number;
    title: string; // NOT NULL
    slug: string; // UNIQUE, NOT NULL
    content: string | null;
    status: PageStatus; // DEFAULT 'Draft'
    created_at: string;
    updated_at: string;
}

// ========== SUPPORT MODELS ==========

export interface SupportTicket {
    id: number;
    ticket_code: string; // UNIQUE, NOT NULL
    customer_id: number | null; // FK to customers(id)
    customer_email: string | null;
    subject: string; // NOT NULL
    status: SupportTicketStatus; // DEFAULT 'pending'
    source: SupportTicketSource; // DEFAULT 'contact_form'
    created_at: string;
    updated_at: string;
    user_id: number | null;
    message: string | null;
    priority: SupportTicketPriority; // DEFAULT 'medium'
}

export interface SupportTicketReply {
    id: number;
    ticket_id: number; // FK to support_tickets(id), NOT NULL
    admin_id: number | null; // FK to admins(id)
    body: string; // NOT NULL
    created_at: string;
}

// ========== INVENTORY MODELS ==========

export interface RestockBatch {
    id: number;
    admin_id: number; // FK to admins(id), NOT NULL
    type: RestockType; // DEFAULT 'Manual'
    created_at: string;
}

export interface RestockItem {
    id: number;
    batch_id: number; // FK to restock_batches(id), NOT NULL
    variant_id: number; // FK to product_variants(id), NOT NULL
    quantity: number; // NOT NULL, CHECK (quantity > 0)
}

// ========== NOTIFICATION MODELS ==========

export interface ProductNotification {
    id: string;
    user_id: number; // FK to customers(id), NOT NULL
    product_id: number; // FK to products(id), NOT NULL
    size: string | null;
    price_condition: number | null;
    status: NotificationStatus; // DEFAULT 'active'
    created_at: string;
    notified_at: string | null;
}
