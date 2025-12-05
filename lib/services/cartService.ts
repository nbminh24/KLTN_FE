import apiClient from './apiClient';
import { AxiosResponse } from 'axios';
import type {
    CartResponse,
    AddToCartPayload,
    UpdateCartItemPayload,
    ApplyCouponPayload,
} from '@/lib/types/backend';

// ========== CART SERVICE ==========

const cartService = {
    /**
     * Get shopping cart with all items and calculations
     * GET /cart
     */
    getCart: async (): Promise<AxiosResponse<CartResponse>> => {
        return apiClient.get('/cart');
    },

    /**
     * Add product variant to cart (or increase quantity if exists)
     * POST /cart/items
     */
    addToCart: async (data: AddToCartPayload): Promise<AxiosResponse<{ message: string }>> => {
        return apiClient.post('/cart/items', data);
    },

    /**
     * Update cart item quantity
     * PUT /cart/items/:id
     */
    updateCartItem: async (itemId: number, data: UpdateCartItemPayload): Promise<AxiosResponse<{ message: string }>> => {
        return apiClient.put(`/cart/items/${itemId}`, data);
    },

    /**
     * Remove item from cart
     * DELETE /cart/items/:id
     */
    removeCartItem: async (itemId: number): Promise<AxiosResponse<{ message: string }>> => {
        return apiClient.delete(`/cart/items/${itemId}`);
    },

    /**
     * Clear all items from cart
     * DELETE /cart/clear
     */
    clearCart: async (): Promise<AxiosResponse<{ message: string }>> => {
        return apiClient.delete('/cart/clear');
    },

    /**
     * Apply coupon/promotion code to cart
     * POST /cart/apply-coupon
     */
    applyCoupon: async (data: ApplyCouponPayload): Promise<AxiosResponse<CartResponse>> => {
        return apiClient.post('/cart/apply-coupon', data);
    },

    /**
     * Merge guest cart to customer cart after login
     * POST /cart/merge
     */
    mergeCart: async (sessionId: string): Promise<AxiosResponse<{ message: string }>> => {
        return apiClient.post('/cart/merge', { session_id: sessionId });
    },
};

export default cartService;
