import apiClient from '../apiClient';
import { AxiosResponse } from 'axios';

export interface DashboardStats {
    total_orders: number;
    total_customers: number;
    total_products: number;
    total_revenue: number;
    pending_orders: number;
    recent_orders: Array<{
        id: number;
        customer_name: string;
        total_amount: number;
        status: string;
        created_at: string;
    }>;
}

export interface AnalyticsRevenue {
    labels: string[];
    data: number[];
    total_revenue: number;
    average_order_value: number;
}

export interface AnalyticsSales {
    total_sales: number;
    total_orders: number;
    average_order_value: number;
    conversion_rate: number;
}

export interface AnalyticsCustomers {
    total_customers: number;
    new_customers: number;
    returning_customers: number;
    customer_retention_rate: number;
}

export interface TopProduct {
    product_id: number;
    product_name: string;
    total_sold: number;
    revenue: number;
}

const dashboardService = {
    /**
     * Get dashboard statistics
     * GET /admin/dashboard/stats
     */
    getDashboardStats: async (params?: {
        days?: number;
    }): Promise<AxiosResponse<DashboardStats>> => {
        return apiClient.get('/admin/dashboard/stats', { params });
    },

    /**
     * Get revenue analytics
     * GET /admin/analytics/revenue
     */
    getRevenueAnalytics: async (params?: {
        start_date?: string;
        end_date?: string;
        period?: 'day' | 'week' | 'month' | 'year';
    }): Promise<AxiosResponse<AnalyticsRevenue>> => {
        return apiClient.get('/admin/analytics/revenue', { params });
    },

    /**
     * Get sales analytics
     * GET /admin/analytics/sales
     */
    getSalesAnalytics: async (params?: {
        start_date?: string;
        end_date?: string;
    }): Promise<AxiosResponse<AnalyticsSales>> => {
        return apiClient.get('/admin/analytics/sales', { params });
    },

    /**
     * Get customer analytics
     * GET /admin/analytics/customers
     */
    getCustomerAnalytics: async (params?: {
        start_date?: string;
        end_date?: string;
    }): Promise<AxiosResponse<AnalyticsCustomers>> => {
        return apiClient.get('/admin/analytics/customers', { params });
    },

    /**
     * Get top selling products
     * GET /admin/analytics/top-products
     */
    getTopProducts: async (params?: {
        limit?: number;
        start_date?: string;
        end_date?: string;
    }): Promise<AxiosResponse<{ products: TopProduct[] }>> => {
        return apiClient.get('/admin/analytics/top-products', { params });
    },

    /**
     * Get order trends
     * GET /admin/analytics/orders
     */
    getOrderTrends: async (params?: {
        start_date?: string;
        end_date?: string;
        period?: 'day' | 'week' | 'month';
    }): Promise<AxiosResponse<any>> => {
        return apiClient.get('/admin/analytics/orders', { params });
    },

    /**
     * Get category performance
     * GET /admin/analytics/categories
     */
    getCategoryPerformance: async (params?: {
        start_date?: string;
        end_date?: string;
    }): Promise<AxiosResponse<any>> => {
        return apiClient.get('/admin/analytics/categories', { params });
    },

    /**
     * Get promotion effectiveness
     * GET /admin/analytics/promotions
     */
    getPromotionAnalytics: async (params?: {
        start_date?: string;
        end_date?: string;
    }): Promise<AxiosResponse<any>> => {
        return apiClient.get('/admin/analytics/promotions', { params });
    },
};

export default dashboardService;
