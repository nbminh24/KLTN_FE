import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface WishlistItem {
    id: number;
    customer_id: number;
    variant_id: number;
    product: {
        id: number;
        name: string;
        slug: string;
        thumbnail_url: string;
        selling_price: number;
        average_rating: number;
    };
    variant: {
        id: number;
        sku: string;
        size: string;
        color: string;
        color_hex?: string;
        available_stock: number;
        in_stock: boolean;
    };
}

export interface WishlistResponse {
    data: WishlistItem[];
    count: number;
}

export interface ToggleWishlistPayload {
    variant_id: number;
}

export interface ToggleWishlistResponse {
    action: 'added' | 'removed';
    message: string;
}

// ========== WISHLIST SERVICE ==========

const wishlistService = {
    /**
     * Get customer's wishlist
     * GET /wishlist
     */
    getWishlist: async (): Promise<AxiosResponse<WishlistResponse>> => {
        return apiClient.get('/wishlist');
    },

    /**
     * Add variant to wishlist
     * POST /wishlist
     */
    addToWishlist: async (variantId: number): Promise<AxiosResponse<{ message: string; wishlist_item: any }>> => {
        return apiClient.post('/wishlist', { variant_id: variantId });
    },

    /**
     * Remove variant from wishlist
     * DELETE /wishlist/:variantId
     */
    removeFromWishlist: async (variantId: number): Promise<AxiosResponse<{ message: string }>> => {
        return apiClient.delete(`/wishlist/${variantId}`);
    },

    /**
     * Clear entire wishlist
     * DELETE /wishlist/clear
     */
    clearWishlist: async (): Promise<AxiosResponse<{ message: string; deleted_count: number }>> => {
        return apiClient.delete('/wishlist/clear');
    },
};

export default wishlistService;
