import apiClient from './apiClient';
import { AxiosResponse } from 'axios';
import type { Order as DBOrder, OrderItem as DBOrderItem, OrderStatusHistory as DBOrderStatusHistory } from '@/lib/types/models';
import type { OrderFulfillmentStatus, PaymentStatus, PaymentMethod } from '@/lib/types/enums';

// ========== INTERFACES ==========

// Re-export DB types
export type { OrderFulfillmentStatus, PaymentStatus, PaymentMethod };

// Extended order with populated item details for display
export interface OrderWithDetails extends DBOrder {
    items?: Array<DBOrderItem & {
        product_name?: string;
        size_name?: string;
        color_name?: string;
        image_url?: string;
    }>;
}

export interface OrderFilters {
    page?: number;
    limit?: number;
    status?: OrderFulfillmentStatus;
}

export interface OrdersResponse {
    data: OrderWithDetails[];
    metadata: {
        total: number;
        page: number;
        limit: number;
        total_pages: number;
    };
}

// Re-export with alias for backwards compatibility
export type Order = OrderWithDetails;
export type OrderItem = DBOrderItem;
export type OrderStatusHistory = DBOrderStatusHistory;

// ========== ORDER SERVICE ==========

const orderService = {
    /**
     * Get order history with pagination and filters
     * GET /orders
     */
    getOrders: async (filters?: OrderFilters): Promise<AxiosResponse<OrdersResponse>> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return apiClient.get(`/orders?${params.toString()}`);
    },

    /**
     * Get order details
     * GET /orders/:id
     */
    getOrderById: async (id: number): Promise<AxiosResponse<OrderWithDetails>> => {
        return apiClient.get(`/orders/${id}`);
    },

    /**
     * Get order status timeline/history
     * GET /orders/:id/status-history
     */
    getOrderStatusHistory: async (id: number): Promise<AxiosResponse<{ history: DBOrderStatusHistory[] }>> => {
        return apiClient.get(`/orders/${id}/status-history`);
    },

    /**
     * Cancel order (only if status is pending)
     * POST /orders/:id/cancel
     */
    cancelOrder: async (id: number): Promise<AxiosResponse> => {
        return apiClient.post(`/orders/${id}/cancel`);
    },
};

export default orderService;
