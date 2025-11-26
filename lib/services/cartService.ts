import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface CartItem {
    id: number;
    variant_id: number;
    product_name: string;
    size: string;
    color: string;
    price: number;
    quantity: number;
    subtotal: number;
    image_url: string;
}

export interface CartResponse {
    cart_items: CartItem[];
    total: number;
    item_count: number;
}

export interface AddToCartData {
    variant_id: number;
    quantity: number;
}

export interface UpdateCartItemData {
    quantity: number;
}

export interface ApplyCouponData {
    code: string;
}

// ========== CART SERVICE ==========

const cartService = {
    /**
     * Get shopping cart with all items
     * GET /cart
     */
    getCart: async (): Promise<AxiosResponse<CartResponse>> => {
        return apiClient.get('/cart');
    },

    /**
     * Add variant to cart (or increase quantity if exists)
     * POST /cart/items
     */
    addToCart: async (data: AddToCartData): Promise<AxiosResponse> => {
        return apiClient.post('/cart/items', data);
    },

    /**
     * Update cart item quantity
     * PUT /cart/items/:id
     */
    updateCartItem: async (id: number, data: UpdateCartItemData): Promise<AxiosResponse> => {
        return apiClient.put(`/cart/items/${id}`, data);
    },

    /**
     * Remove item from cart
     * DELETE /cart/items/:id
     */
    removeCartItem: async (id: number): Promise<AxiosResponse> => {
        return apiClient.delete(`/cart/items/${id}`);
    },

    /**
     * Apply coupon/discount code to cart
     * POST /cart/apply-coupon
     */
    applyCoupon: async (data: ApplyCouponData): Promise<AxiosResponse> => {
        return apiClient.post('/cart/apply-coupon', data);
    },
};

export default cartService;
