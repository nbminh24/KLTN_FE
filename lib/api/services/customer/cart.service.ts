import apiClient from '../../client';
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
     * GET /api/v1/cart
     */
    getCart: async (): Promise<AxiosResponse<CartResponse>> => {
        return apiClient.get('/api/v1/cart');
    },

    /**
     * Add product variant to cart (or increase quantity if exists)
     * POST /api/v1/cart/items
     */
    addToCart: async (data: AddToCartPayload): Promise<AxiosResponse<{ message: string }>> => {
        return apiClient.post('/api/v1/cart/items', data);
    },

    /**
     * Update cart item quantity
     * PUT /api/v1/cart/items/:id
     */
    updateCartItem: async (itemId: number, data: UpdateCartItemPayload): Promise<AxiosResponse<{ message: string }>> => {
        return apiClient.put(`/api/v1/cart/items/${itemId}`, data);
    },

    /**
     * Remove item from cart
     * DELETE /api/v1/cart/items/:id
     */
    removeCartItem: async (itemId: number): Promise<AxiosResponse<{ message: string }>> => {
        return apiClient.delete(`/api/v1/cart/items/${itemId}`);
    },

    /**
     * Apply coupon/promotion code to cart
     * POST /api/v1/cart/apply-coupon
     */
    applyCoupon: async (data: ApplyCouponPayload): Promise<AxiosResponse<CartResponse>> => {
        return apiClient.post('/api/v1/cart/apply-coupon', data);
    },

    /**
     * Remove applied coupon from cart
     * DELETE /api/v1/cart/remove-coupon
     */
    removeCoupon: async (): Promise<AxiosResponse<CartResponse>> => {
        return apiClient.delete('/api/v1/cart/remove-coupon');
    },
};

export default cartService;
