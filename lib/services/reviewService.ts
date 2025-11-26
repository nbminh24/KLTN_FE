import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface SubmitReviewData {
    product_id: number;
    rating: number;
    comment: string;
}

export interface ReviewableItem {
    product_id: number;
    product_name: string;
    order_id: number;
    purchased_at: string;
    thumbnail_url: string;
}

// ========== REVIEW SERVICE ==========

const reviewService = {
    /**
     * Submit product review
     * POST /reviews
     */
    submitReview: async (data: SubmitReviewData): Promise<AxiosResponse> => {
        return apiClient.post('/reviews', data);
    },

    /**
     * Get list of products customer can review
     * GET /reviews/account/reviewable-items
     */
    getReviewableItems: async (): Promise<AxiosResponse<{ reviewable_items: ReviewableItem[] }>> => {
        return apiClient.get('/reviews/account/reviewable-items');
    },
};

export default reviewService;
