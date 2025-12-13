// ========================================
// BACKEND API TYPE DEFINITIONS
// Generated from API_TECHNICAL_SPECIFICATION.md
// ========================================

// ========== ENUMS ==========

export enum OrderFulfillmentStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PROCESSING = 'processing',
    SHIPPED = 'shipped',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export enum PaymentStatus {
    PENDING = 'pending',
    PAID = 'paid',
    FAILED = 'failed',
}

export enum PaymentMethod {
    COD = 'cod',
    VNPAY = 'vnpay',
}

export enum ProductStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
}

export enum PromotionDiscountType {
    PERCENTAGE = 'percentage',
    FIXED = 'fixed',
}

// ========== CORE ENTITIES ==========

export interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    thumbnail_url?: string;
    parent_id?: number;
    created_at: string;
    updated_at: string;
}

export interface Size {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
}

export interface Color {
    id: number;
    name: string;
    hex_code: string;
    created_at: string;
    updated_at: string;
}

export interface ProductVariant {
    id: number;
    product_id: number;
    size_id: number;
    color_id: number;
    sku: string;
    total_stock: number;
    reserved_stock: number;
    reorder_point: number;
    status: ProductStatus;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    // Extended fields from JOIN (flat structure)
    size_name?: string;
    color_name?: string;
    color_hex?: string;
    available_stock?: number;
    images?: string[];
    // Nested object structure (from API)
    size?: {
        id: number;
        name: string;
    };
    color?: {
        id: number;
        name: string;
        hex_code: string;
    };
}

export interface Product {
    id: number;
    category_id: number;
    name: string;
    slug: string;
    description?: string;
    full_description?: string;
    cost_price: number;
    selling_price: number;
    status: ProductStatus;
    thumbnail_url?: string;
    average_rating: number;
    total_reviews: number;
    attributes: Record<string, any>; // JSONB field
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    // Extended fields
    category?: Category;
    variants?: ProductVariant[];
    images?: string[];
    available_sizes?: string[];
    available_colors?: Array<{ name: string; hex: string }>;
}

export interface CartItem {
    id: number;
    cart_id: number;
    variant_id: number;
    quantity: number;
    added_at: string;
    // Extended fields from JOIN
    product_id?: number;
    product_name?: string;
    product_slug?: string;
    size_name?: string;
    color_name?: string;
    color_hex?: string;
    price?: number;
    image_url?: string;
    available_stock?: number;
}

export interface Cart {
    id: number;
    customer_id?: number;
    visitor_id?: string;
    created_at: string;
    updated_at: string;
    items?: CartItem[];
}

export interface CustomerAddress {
    id: number;
    customer_id: number;
    recipient_name: string;
    phone: string;
    address_line: string;
    ward?: string;
    district?: string;
    city?: string;
    is_default: boolean;
    created_at: string;
    updated_at: string;
}

export interface OrderItem {
    id: number;
    order_id: number;
    variant_id: number;
    quantity: number;
    price_at_purchase: number;
    created_at: string;
    // Extended fields
    product_name?: string;
    product_slug?: string;
    size_name?: string;
    color_name?: string;
    image_url?: string;
}

export interface OrderStatusHistory {
    id: number;
    order_id: number;
    status: OrderFulfillmentStatus;
    admin_id?: number;
    note?: string;
    created_at: string;
    // Extended fields
    admin_name?: string;
}

export interface Order {
    id: number;
    customer_id?: number;
    order_code: string;
    customer_email: string;
    shipping_address: string;
    shipping_phone: string;
    recipient_name: string;
    fulfillment_status: OrderFulfillmentStatus;
    payment_status: PaymentStatus;
    payment_method: PaymentMethod;
    shipping_fee: number;
    total_amount: number;
    notes?: string;
    created_at: string;
    updated_at: string;
    // Extended fields
    items?: OrderItem[];
    status_history?: OrderStatusHistory[];
}

export interface Payment {
    id: number;
    transaction_id: string;
    order_id: number;
    amount: number;
    provider: string;
    payment_method: string;
    status: PaymentStatus;
    response_data: Record<string, any>; // JSON field
    created_at: string;
    updated_at: string;
}

export interface Promotion {
    id: number;
    name: string;
    description?: string;
    discount_type: PromotionDiscountType;
    discount_value: number;
    start_date?: string;
    end_date?: string;
    number_limited?: number;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface Customer {
    id: number;
    email: string;
    full_name?: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    date_of_birth?: string;
    avatar_url?: string;
    status: 'active' | 'inactive';
    email_verified: boolean;
    created_at: string;
    updated_at: string;
}

export interface ProductReview {
    id: number;
    product_id: number;
    customer_id: number;
    order_item_id: number;
    rating: number;
    comment?: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    updated_at: string;
    // Extended fields
    customer_name?: string;
    customer_avatar?: string;
}

// ========== API REQUEST PAYLOADS ==========

export interface ProductSearchParams {
    page?: number;
    limit?: number;
    category_slug?: string;
    search?: string;
    min_price?: number;
    max_price?: number;
    min_rating?: number;
    colors?: string; // comma-separated color IDs: "1,2,3"
    sizes?: string; // comma-separated size IDs: "1,2,3"
    sort_by?: 'newest' | 'price_asc' | 'price_desc' | 'rating';
    attributes?: Record<string, string>; // JSONB filters
}

export interface AddToCartPayload {
    variant_id: number;
    quantity: number;
}

export interface UpdateCartItemPayload {
    quantity: number;
}

export interface ApplyCouponPayload {
    code: string;
}

export interface CheckoutPayload {
    address_id: number;
    payment_method: PaymentMethod;
    shipping_fee: number;
    notes?: string;
    coupon_codes?: string[];
}

export interface CreatePaymentUrlPayload {
    order_id: number;
}

export interface UpdateProfilePayload {
    full_name?: string;
    phone?: string;
    gender?: 'male' | 'female' | 'other';
    date_of_birth?: string;
    avatar_url?: string;
}

export interface AddAddressPayload {
    recipient_name: string;
    phone: string;
    address_line: string;
    ward?: string;
    district?: string;
    city?: string;
    is_default?: boolean;
}

export interface UpdateAddressPayload extends Partial<AddAddressPayload> { }

export interface ChangePasswordPayload {
    current_password: string;
    new_password: string;
}

export interface CreateReviewPayload {
    product_id: number;
    order_item_id: number;
    rating: number;
    comment?: string;
}

// ========== API RESPONSE TYPES ==========

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
}

export interface ProductsResponse {
    data: Product[];
    products?: Product[];
    metadata: PaginationMeta;
}

export interface CartResponse {
    cart_id: number;
    customer_id?: number;
    items: Array<{
        id: number;
        cart_id: number;
        variant_id: number;
        quantity: number;
        product: {
            id: number;
            name: string;
            slug: string;
            thumbnail_url: string;
        };
        variant: {
            id: number;
            sku: string;
            size: string;
            color: string;
            color_hex: string;
            price: number;
            available_stock: number;
            status: string;
            image_url?: string;
        };
        subtotal: number;
        is_available: boolean;
        stock_message?: string | null;
    }>;
    summary: {
        items_count: number;
        subtotal: number;
        shipping_fee: number;
        discount: number;
        total: number;
    };
    unavailable_items: number;
    created_at: string;
    updated_at: string;
}

export interface CreateOrderResponse {
    order_id: number;
    order_code: string;
    total_amount: number;
    message: string;
}

export interface CreatePaymentUrlResponse {
    payment_url: string;
}

export interface OrdersResponse {
    orders: Order[];
    metadata: PaginationMeta;
}

export interface OrderDetailResponse {
    order: Order;
    items: OrderItem[];
    status_history: OrderStatusHistory[];
}

export interface TrackOrderResponse {
    order: Order;
    items: OrderItem[];
    history: OrderStatusHistory[];
}

export interface AddressesResponse {
    addresses: CustomerAddress[];
}

export interface ProfileResponse {
    customer: Customer;
}

export interface ReviewableItemsResponse {
    items: Array<{
        order_id: number;
        order_code: string;
        order_item_id: number;
        product_id: number;
        product_name: string;
        product_image: string;
        variant_info: string;
        purchased_at: string;
    }>;
}

export interface PromotionsResponse {
    promotions: Promotion[];
}

export interface ValidatePromotionResponse {
    valid: boolean;
    message: string;
    discount_amount: number;
    applied_promotions: Array<{
        name: string;
        type: PromotionDiscountType;
        discount_type: PromotionDiscountType;
        discount_value: number;
        calculated_discount: number;
    }>;
    invalid_reasons: string[];
}

// ========== UTILITY TYPES ==========

export interface ApiError {
    statusCode: number;
    message: string;
    error: string;
    details?: string[];
}

export type OrderFilterParams = {
    page?: number;
    limit?: number;
    status?: OrderFulfillmentStatus;
    payment_status?: PaymentStatus;
    search?: string;
};
