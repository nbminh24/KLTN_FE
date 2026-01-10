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
    product_count?: number;
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
    product_ids?: number[];
}

export interface PromotionsListResponse {
    promotions: AdminPromotion[];
    pagination: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const adminPromotionService = {
    /**
     * Get all promotions
     * GET /api/v1/promotions
     */
    getPromotions: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        search?: string;
        active?: boolean;
    }): Promise<AxiosResponse<PromotionsListResponse>> => {
        return apiClient.get('/api/v1/promotions', { params });
    },

    /**
     * Get promotion by ID
     * GET /api/v1/promotions/:id
     */
    getPromotionById: async (id: number): Promise<AxiosResponse<AdminPromotion>> => {
        return apiClient.get(`/api/v1/promotions/${id}`);
    },

    /**
     * Create promotion
     * POST /api/v1/promotions
     */
    createPromotion: async (data: CreatePromotionData): Promise<AxiosResponse<AdminPromotion>> => {
        return apiClient.post('/api/v1/promotions', data);
    },

    /**
     * Update promotion
     * PUT /api/v1/promotions/:id
     */
    updatePromotion: async (id: number, data: Partial<CreatePromotionData>): Promise<AxiosResponse<AdminPromotion>> => {
        return apiClient.put(`/api/v1/promotions/${id}`, data);
    },

    /**
     * Delete promotion
     * DELETE /api/v1/promotions/:id
     */
    deletePromotion: async (id: number): Promise<AxiosResponse<void>> => {
        return apiClient.delete(`/api/v1/promotions/${id}`);
    },
};

export default adminPromotionService;
