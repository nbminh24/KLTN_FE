import apiClient from './apiClient';
import { AxiosResponse } from 'axios';
import type {
    ProductReview,
    CreateReviewPayload,
    ReviewableItemsResponse,
} from '@/lib/types/backend';

// ========== REVIEW SERVICE ==========

const reviewService = {
    /**
     * Submit product review
     * POST /reviews
     * 
     * Requires authentication. Customer can only review purchased products.
     * Must provide order_item_id to verify purchase.
     */
    submitReview: async (data: CreateReviewPayload): Promise<AxiosResponse<{
        message: string;
        review: ProductReview;
    }>> => {
        return apiClient.post('/reviews', data);
    },

    /**
     * Get list of products customer can review
     * GET /reviews/account/reviewable-items
     * 
     * Returns delivered orders that haven't been reviewed yet.
     */
    getReviewableItems: async (): Promise<AxiosResponse<ReviewableItemsResponse>> => {
        return apiClient.get('/reviews/account/reviewable-items');
    },

    /**
     * Get my submitted reviews
     * GET /reviews/customers/me/reviews
     * 
     * Requires authentication.
     */
    getMyReviews: async (): Promise<AxiosResponse<{ reviews: ProductReview[] }>> => {
        return apiClient.get('/reviews/customers/me/reviews');
    },
};

export default reviewService;
