import apiClient from '../apiClient';
import { AxiosResponse } from 'axios';

export interface AdminOrder {
    id: number;
    customer_id?: number;
    customer_email: string;
    shipping_address: string;
    shipping_phone: string;
    fulfillment_status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    payment_status: 'unpaid' | 'paid';
    payment_method: string;
    shipping_fee: number;
    total_amount: number;
    created_at: string;
    updated_at: string;
    items?: OrderItem[];
    status_history?: StatusHistory[];
    // Extended fields for display
    customer_name?: string;
}

export interface OrderItem {
    id: number;
    variant_id: number;
    product_name: string;
    product_image: string;
    size: string;
    color: string;
    quantity: number;
    price: number;
    subtotal: number;
}

export interface StatusHistory {
    status: string;
    changed_at: string;
    changed_by: string;
    note?: string;
}

export interface OrdersListResponse {
    orders?: AdminOrder[];
    data?: AdminOrder[];
    total?: number;
    page?: number;
    limit?: number;
    total_pages?: number;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface UpdateOrderStatusData {
    status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
    note?: string;
}

const adminOrderService = {
    /**
     * Get all orders (admin)
     * GET /admin/orders
     */
    getOrders: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        payment_status?: string;
        search?: string;
        start_date?: string;
        end_date?: string;
        sort_by?: string;
        order?: 'asc' | 'desc';
    }): Promise<AxiosResponse<OrdersListResponse>> => {
        return apiClient.get('/admin/orders', { params });
    },

    /**
     * Get order detail (admin)
     * GET /admin/orders/:id
     */
    getOrderById: async (id: number): Promise<AxiosResponse<AdminOrder>> => {
        return apiClient.get(`/admin/orders/${id}`);
    },

    /**
     * Update order status
     * PUT /admin/orders/:id/status
     */
    updateOrderStatus: async (id: number, data: UpdateOrderStatusData): Promise<AxiosResponse<AdminOrder>> => {
        return apiClient.put(`/admin/orders/${id}/status`, data);
    },

    /**
     * Update payment status
     * PUT /admin/orders/:id/payment-status
     */
    updatePaymentStatus: async (id: number, paymentStatus: 'paid' | 'unpaid'): Promise<AxiosResponse<AdminOrder>> => {
        return apiClient.put(`/admin/orders/${id}/payment-status`, { payment_status: paymentStatus });
    },

    /**
     * Get order statistics
     * GET /admin/orders/statistics
     */
    getOrderStatistics: async (params?: {
        start_date?: string;
        end_date?: string;
    }): Promise<AxiosResponse<{
        total_orders: number;
        pending_orders: number;
        processing_orders: number;
        completed_orders: number;
        cancelled_orders: number;
        total_revenue: number;
    }>> => {
        return apiClient.get('/admin/orders/statistics', { params });
    },

    /**
     * Export orders to CSV
     * GET /admin/orders/export
     */
    exportOrders: async (params?: {
        status?: string;
        start_date?: string;
        end_date?: string;
    }): Promise<AxiosResponse<Blob>> => {
        return apiClient.get('/admin/orders/export', {
            params,
            responseType: 'blob',
        });
    },
};

export default adminOrderService;
