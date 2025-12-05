import apiClient from './apiClient';
import { AxiosResponse } from 'axios';
import type {
    Promotion,
    PromotionsResponse,
    ValidatePromotionResponse,
    PromotionDiscountType,
} from '@/lib/types/backend';

// ========== PROMOTION SERVICE ==========

const promotionService = {
    /**
     * Get active public promotions/coupons
     * GET /promotions/public
     * 
     * Returns only active promotions within valid date range.
     */
    getPublicPromotions: async (type?: PromotionDiscountType): Promise<AxiosResponse<PromotionsResponse>> => {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        return apiClient.get(`/promotions/public?${params.toString()}`);
    },

    /**
     * Get active promotions
     * GET /promotions/active
     */
    getActivePromotions: async (): Promise<AxiosResponse<PromotionsResponse>> => {
        return apiClient.get('/promotions/active');
    },

    /**
     * Validate promotion codes
     * POST /promotions/validate
     * 
     * Validates multiple promotion codes and calculates total discount.
     * Checks: expiry date, usage limit, status.
     */
    validatePromotions: async (codes: string[], subtotal: number): Promise<AxiosResponse<ValidatePromotionResponse>> => {
        return apiClient.post('/promotions/validate', {
            codes,
            subtotal,
        });
    },

    /**
     * Validate promotion mix logic
     * POST /promotions/validate-mix
     * 
     * Checks if multiple promotions can be used together.
     * Rule: Cannot use 2 percentage OR 2 fixed promotions simultaneously.
     */
    validatePromotionMix: async (codes: string[]): Promise<AxiosResponse<{
        can_combine: boolean;
        message: string;
    }>> => {
        return apiClient.post('/promotions/validate-mix', {
            codes,
        });
    },
};

export default promotionService;
