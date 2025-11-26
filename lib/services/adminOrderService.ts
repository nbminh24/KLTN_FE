import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface AdminOrderFilters {
    page?: number;
    limit?: number;
    status?: string;
    customer_email?: string;
}

export interface UpdateOrderStatusData {
    status: string;
}

// ========== ADMIN ORDER SERVICE ==========

const adminOrderService = {
    /**
     * Get all orders from all customers
     * GET /admin/orders
     */
    getAllOrders: async (filters?: AdminOrderFilters): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return apiClient.get(`/admin/orders?${params.toString()}`);
    },

    /**
     * Update order status
     * PUT /admin/orders/:id/status
     */
    updateOrderStatus: async (id: number, data: UpdateOrderStatusData): Promise<AxiosResponse> => {
        return apiClient.put(`/admin/orders/${id}/status`, data);
    },

    /**
     * Get order status counts
     * GET /admin/orders/status-counts
     */
    getOrderStatusCounts: async (): Promise<AxiosResponse> => {
        return apiClient.get('/admin/orders/status-counts');
    },
};

export default adminOrderService;
