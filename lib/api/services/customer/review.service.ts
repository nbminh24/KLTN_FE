import apiClient from '../../client';
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
     * POST /api/v1/reviews
     * 
     * Requires authentication. Customer can only review purchased products.
     * Must provide order_item_id to verify purchase.
     */
    submitReview: async (data: CreateReviewPayload): Promise<AxiosResponse<{
        message: string;
        review: ProductReview;
    }>> => {
        return apiClient.post('/api/v1/reviews', data);
    },

    /**
     * Get list of products customer can review
     * GET /api/v1/reviews/account/reviewable-items
     * 
     * Returns delivered orders that haven't been reviewed yet.
     */
    getReviewableItems: async (): Promise<AxiosResponse<ReviewableItemsResponse>> => {
        return apiClient.get('/api/v1/reviews/account/reviewable-items');
    },
};

export default reviewService;
