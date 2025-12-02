import apiClient from './apiClient';
import { AxiosResponse } from 'axios';
import type {
    CheckoutPayload,
    CreateOrderResponse,
    CreatePaymentUrlPayload,
    CreatePaymentUrlResponse,
} from '@/lib/types/backend';

// ========== CHECKOUT & PAYMENT SERVICE ==========

const checkoutService = {
    /**
     * Create order from cart items (Step 1 of checkout)
     * POST /api/v1/checkout
     * 
     * Request body:
     * - address_id: ID of customer address
     * - payment_method: 'cod' | 'vnpay'
     * - shipping_fee: calculated shipping fee
     * - notes: optional order notes
     * - coupon_codes: optional array of promotion codes
     */
    createOrder: async (data: CheckoutPayload): Promise<AxiosResponse<CreateOrderResponse>> => {
        return apiClient.post('/api/v1/checkout', data);
    },

    /**
     * Generate VNPAY payment URL for order (Step 2 of checkout)
     * POST /api/v1/payment/create_url
     * 
     * FIXED: Changed from /api/v1/checkout/create-payment-url to /api/v1/payment/create_url
     * according to API_TECHNICAL_SPECIFICATION.md
     * 
     * Returns payment URL with signed checksum for VNPAY gateway
     */
    createPaymentUrl: async (data: CreatePaymentUrlPayload): Promise<AxiosResponse<CreatePaymentUrlResponse>> => {
        return apiClient.post('/api/v1/payment/create_url', data);
    },

    /**
     * VNPAY return URL callback (Step 3)
     * GET /api/v1/payment/vnpay_return
     * 
     * This endpoint is typically called by VNPAY redirect after payment.
     * Frontend should extract query params from URL and pass them here.
     * Backend will validate signature and update order/payment status.
     */
    handleVnpayReturn: async (queryParams: Record<string, string>): Promise<AxiosResponse<{
        success: boolean;
        order_id: number;
        order_code: string;
        message: string;
    }>> => {
        const params = new URLSearchParams(queryParams);
        return apiClient.get(`/api/v1/payment/vnpay_return?${params.toString()}`);
    },
};

export default checkoutService;
