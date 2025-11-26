import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface WishlistItem {
    id: number;
    variant_id: number;
    product_name: string;
    size: string;
    color: string;
    price: number;
    image_url: string;
    added_at: string;
}

export interface WishlistResponse {
    wishlist_items: WishlistItem[];
    total_items: number;
}

export interface ToggleWishlistData {
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
     * Add or remove variant from wishlist (toggle)
     * POST /wishlist/toggle
     */
    toggleWishlist: async (data: ToggleWishlistData): Promise<AxiosResponse<ToggleWishlistResponse>> => {
        return apiClient.post('/wishlist/toggle', data);
    },

    /**
     * Remove variant from wishlist
     * DELETE /wishlist/:variantId
     */
    removeFromWishlist: async (variantId: number): Promise<AxiosResponse> => {
        return apiClient.delete(`/wishlist/${variantId}`);
    },
};

export default wishlistService;
