import apiClient from '../../client';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface WishlistItem {
    id: number;
    variant_id: number;
    product_id: number;
    product_name: string;
    product_slug: string;
    size_name: string;
    color_name: string;
    price: number;
    image_url: string;
    added_at: string;
}

export interface WishlistResponse {
    items: WishlistItem[];
    total: number;
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
     * GET /api/v1/wishlist
     * 
     * Requires authentication.
     */
    getWishlist: async (): Promise<AxiosResponse<WishlistResponse>> => {
        return apiClient.get('/api/v1/wishlist');
    },

    /**
     * Add or remove variant from wishlist (toggle)
     * POST /api/v1/wishlist/toggle
     * 
     * If variant exists in wishlist, it will be removed. Otherwise, it will be added.
     */
    toggleWishlist: async (data: ToggleWishlistPayload): Promise<AxiosResponse<ToggleWishlistResponse>> => {
        return apiClient.post('/api/v1/wishlist/toggle', data);
    },

    /**
     * Remove variant from wishlist
     * DELETE /api/v1/wishlist/:variantId
     */
    removeFromWishlist: async (variantId: number): Promise<AxiosResponse<{ message: string }>> => {
        return apiClient.delete(`/api/v1/wishlist/${variantId}`);
    },
};

export default wishlistService;
