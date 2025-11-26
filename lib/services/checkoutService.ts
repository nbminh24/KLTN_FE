import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface CreateOrderData {
    address_id: number;
    payment_method: string;
    shipping_fee: number;
    notes?: string;
}

export interface CreateOrderResponse {
    order_id: number;
    total_amount: number;
    message: string;
}

export interface CreatePaymentUrlData {
    order_id: number;
}

export interface CreatePaymentUrlResponse {
    paymentUrl: string;
}

// ========== CHECKOUT & PAYMENT SERVICE ==========

const checkoutService = {
    /**
     * Create order from cart items (Step 1 of checkout)
     * POST /api/v1/checkout
     */
    createOrder: async (data: CreateOrderData): Promise<AxiosResponse<CreateOrderResponse>> => {
        return apiClient.post('/api/v1/checkout', data);
    },

    /**
     * Generate VNPAY payment URL for order (Step 2 of checkout)
     * POST /api/v1/checkout/create-payment-url
     */
    createPaymentUrl: async (data: CreatePaymentUrlData): Promise<AxiosResponse<CreatePaymentUrlResponse>> => {
        return apiClient.post('/api/v1/checkout/create-payment-url', data);
    },

    /**
     * VNPAY return URL callback (Step 3)
     * This is typically called by VNPAY redirect, not directly by frontend
     * GET /api/v1/payment/vnpay-return
     */
    vnpayReturn: async (queryParams: string): Promise<AxiosResponse> => {
        return apiClient.get(`/api/v1/payment/vnpay-return?${queryParams}`);
    },
};

export default checkoutService;
