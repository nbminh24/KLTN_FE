import apiClient from '../apiClient';
import { AxiosResponse } from 'axios';

export interface AdminPromotion {
    id: number;
    name: string;
    type: 'voucher' | 'flash_sale';
    discount_value: number;
    discount_type: 'percentage' | 'fixed_amount';
    number_limited?: number;
    start_date: string;
    end_date: string;
    status: 'scheduled' | 'active' | 'expired';
    // Extended fields for display
    used_count?: number;
}

export interface CreatePromotionData {
    name: string;
    type: 'voucher' | 'flash_sale';
    discount_value: number;
    discount_type: 'percentage' | 'fixed_amount';
    number_limited?: number;
    start_date: string;
    end_date: string;
    status?: 'scheduled' | 'active' | 'expired';
}

export interface PromotionsListResponse {
    promotions: AdminPromotion[];
    total: number;
    page: number;
    limit: number;
}

const adminPromotionService = {
    /**
     * Get all promotions
     * GET /admin/promotions
     */
    getPromotions: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
        active?: boolean;
    }): Promise<AxiosResponse<PromotionsListResponse>> => {
        return apiClient.get('/admin/promotions', { params });
    },

    /**
     * Get promotion by ID
     * GET /admin/promotions/:id
     */
    getPromotionById: async (id: number): Promise<AxiosResponse<AdminPromotion>> => {
        return apiClient.get(`/admin/promotions/${id}`);
    },

    /**
     * Create promotion
     * POST /admin/promotions
     */
    createPromotion: async (data: CreatePromotionData): Promise<AxiosResponse<AdminPromotion>> => {
        return apiClient.post('/admin/promotions', data);
    },

    /**
     * Update promotion
     * PUT /admin/promotions/:id
     */
    updatePromotion: async (id: number, data: Partial<CreatePromotionData>): Promise<AxiosResponse<AdminPromotion>> => {
        return apiClient.put(`/admin/promotions/${id}`, data);
    },

    /**
     * Delete promotion
     * DELETE /admin/promotions/:id
     */
    deletePromotion: async (id: number): Promise<AxiosResponse<void>> => {
        return apiClient.delete(`/admin/promotions/${id}`);
    },
};

export default adminPromotionService;
