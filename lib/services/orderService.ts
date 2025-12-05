import apiClient from './apiClient';
import { AxiosResponse } from 'axios';
import type {
    Order,
    OrdersResponse,
    OrderDetailResponse,
    OrderFilterParams,
    TrackOrderResponse,
} from '@/lib/types/backend';

// ========== ORDER SERVICE ==========

const orderService = {
    /**
     * Get customer's order history with pagination and filters
     * GET /api/v1/orders
     * 
     * Requires authentication. Returns orders for logged-in customer.
     */
    getMyOrders: async (params?: OrderFilterParams): Promise<AxiosResponse<OrdersResponse>> => {
        const queryParams = new URLSearchParams();

        if (params) {
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());
            if (params.status) queryParams.append('status', params.status);
            if (params.payment_status) queryParams.append('payment_status', params.payment_status);
            if (params.search) queryParams.append('search', params.search);
        }

        return apiClient.get(`/orders?${queryParams.toString()}`);
    },

    /**
     * Get order details with items and status history
     * GET /api/v1/orders/:id
     * 
     * Requires authentication. Customer can only view their own orders.
     */
    getOrderDetail: async (id: number): Promise<AxiosResponse<OrderDetailResponse>> => {
        return apiClient.get(`/orders/${id}`);
    },

    /**
     * Get order status timeline/history
     * GET /api/v1/orders/:id/status-history
     */
    getOrderStatusHistory: async (id: number): Promise<AxiosResponse<OrderDetailResponse>> => {
        return apiClient.get(`/orders/${id}/status-history`);
    },

    /**
     * Cancel order (only if status is pending or confirmed)
     * POST /api/v1/orders/:id/cancel
     * 
     * Requires authentication.
     */
    cancelOrder: async (id: number): Promise<AxiosResponse<{ message: string }>> => {
        return apiClient.post(`/orders/${id}/cancel`);
    },

    /**
     * Track order by order ID (public endpoint)
     * GET /api/v1/orders/track?order_id=123
     * 
     * No authentication required. For guest tracking via chatbot or public page.
     */
    trackOrderById: async (orderId: number): Promise<AxiosResponse<TrackOrderResponse>> => {
        return apiClient.get('/orders/track', {
            params: { order_id: orderId },
        });
    },

    /**
     * Track order by phone + email (public endpoint)
     * GET /api/v1/orders/track?phone=xxx&email=xxx
     * 
     * No authentication required. For guest tracking.
     */
    trackOrderByContact: async (phone: string, email: string): Promise<AxiosResponse<TrackOrderResponse>> => {
        return apiClient.get('/orders/track', {
            params: { phone, email },
        });
    },
};

export default orderService;
