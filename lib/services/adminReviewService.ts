import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface AdminReviewFilters {
    page?: number;
    limit?: number;
    product_id?: number;
    rating?: number;
    status?: string;
}

export interface UpdateReviewStatusData {
    status: 'approved' | 'rejected';
}

// ========== ADMIN REVIEW SERVICE ==========

const adminReviewService = {
    /**
     * Get all reviews with filters
     * GET /admin/reviews
     */
    getAllReviews: async (filters?: AdminReviewFilters): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return apiClient.get(`/admin/reviews?${params.toString()}`);
    },

    /**
     * Approve or reject review
     * PATCH /admin/reviews/:id/status
     */
    updateReviewStatus: async (id: number, data: UpdateReviewStatusData): Promise<AxiosResponse> => {
        return apiClient.patch(`/admin/reviews/${id}/status`, data);
    },

    /**
     * Delete review
     * DELETE /admin/reviews/:id
     */
    deleteReview: async (id: number): Promise<AxiosResponse> => {
        return apiClient.delete(`/admin/reviews/${id}`);
    },
};

export default adminReviewService;
