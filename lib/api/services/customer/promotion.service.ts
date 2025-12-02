import apiClient from '../../client';
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
     * GET /api/v1/promotions/public
     * 
     * Returns only active promotions within valid date range.
     */
    getPublicPromotions: async (type?: PromotionDiscountType): Promise<AxiosResponse<PromotionsResponse>> => {
        const params = new URLSearchParams();
        if (type) params.append('type', type);
        return apiClient.get(`/api/v1/promotions/public?${params.toString()}`);
    },

    /**
     * Validate promotion codes
     * POST /api/v1/promotions/validate
     * 
     * Validates multiple promotion codes and calculates total discount.
     * Checks: expiry date, usage limit, status.
     */
    validatePromotions: async (codes: string[], cartTotal: number): Promise<AxiosResponse<ValidatePromotionResponse>> => {
        return apiClient.post('/api/v1/promotions/validate', {
            codes,
            cart_total: cartTotal,
        });
    },

    /**
     * Validate promotion mix logic
     * POST /api/v1/promotions/validate-mix
     * 
     * Checks if multiple promotions can be used together.
     * Rule: Cannot use 2 percentage OR 2 fixed promotions simultaneously.
     */
    validatePromotionMix: async (codes: string[], cartValue: number): Promise<AxiosResponse<{
        can_mix: boolean;
        message: string;
        explanation: string;
        valid_codes?: string[];
        total_discount?: number;
    }>> => {
        return apiClient.post('/api/v1/promotions/validate-mix', {
            coupon_codes: codes,
            cart_value: cartValue,
        });
    },
};

export default promotionService;
