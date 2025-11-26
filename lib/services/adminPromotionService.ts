import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface AdminPromotionFilters {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
    active?: boolean;
}

export interface CreatePromotionData {
    code: string;
    type: 'percentage' | 'fixed';
    discount_value: number;
    description: string;
    min_order_value?: number;
    max_discount_value?: number;
    valid_from: string;
    valid_until: string;
    usage_limit: number;
    status: 'active' | 'inactive';
}

export interface UpdatePromotionData {
    type?: 'percentage' | 'fixed';
    discount_value?: number;
    description?: string;
    min_order_value?: number;
    max_discount_value?: number;
    valid_from?: string;
    valid_until?: string;
    usage_limit?: number;
    status?: 'active' | 'inactive';
}

// ========== ADMIN PROMOTION SERVICE ==========

const adminPromotionService = {
    /**
     * Get all promotions/coupons
     * GET /admin/promotions
     */
    getAllPromotions: async (filters?: AdminPromotionFilters): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return apiClient.get(`/admin/promotions?${params.toString()}`);
    },

    /**
     * Get promotion details by ID
     * GET /admin/promotions/:id
     */
    getPromotionById: async (id: number): Promise<AxiosResponse> => {
        return apiClient.get(`/admin/promotions/${id}`);
    },

    /**
     * Create new promotion/coupon code
     * POST /admin/promotions
     */
    createPromotion: async (data: CreatePromotionData): Promise<AxiosResponse> => {
        return apiClient.post('/admin/promotions', data);
    },

    /**
     * Update promotion details
     * PUT /admin/promotions/:id
     */
    updatePromotion: async (id: number, data: UpdatePromotionData): Promise<AxiosResponse> => {
        return apiClient.put(`/admin/promotions/${id}`, data);
    },

    /**
     * Delete promotion
     * DELETE /admin/promotions/:id
     */
    deletePromotion: async (id: number): Promise<AxiosResponse> => {
        return apiClient.delete(`/admin/promotions/${id}`);
    },

    /**
     * Toggle promotion status
     * POST /admin/promotions/:id/toggle
     */
    togglePromotionStatus: async (id: number): Promise<AxiosResponse> => {
        return apiClient.post(`/admin/promotions/${id}/toggle`);
    },

    /**
     * Get promotion usage statistics
     * GET /admin/promotions/:code/usage
     */
    getPromotionUsage: async (code: string): Promise<AxiosResponse> => {
        return apiClient.get(`/admin/promotions/${code}/usage`);
    },
};

export default adminPromotionService;
