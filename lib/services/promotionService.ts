import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface Promotion {
    id: number;
    code: string;
    type: 'percentage' | 'fixed';
    discount_value: number;
    description: string;
    min_order_value?: number;
    valid_from: string;
    valid_until: string;
    usage_limit: number;
    used_count: number;
}

// ========== PROMOTION SERVICE ==========

const promotionService = {
    /**
     * Get active public promotions/coupons
     * GET /promotions/public
     */
    getPublicPromotions: async (type?: 'percentage' | 'fixed'): Promise<AxiosResponse<{ promotions: Promotion[] }>> => {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        return apiClient.get(`/promotions/public?${params.toString()}`);
    },
};

export default promotionService;
