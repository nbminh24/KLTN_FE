import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface AnalyticsStats {
    total_revenue: number;
    new_orders: number;
    avg_order_value: number;
    ai_escalated: number;
}

export interface SalesOverviewData {
    date: string;
    revenue: number;
    orders: number;
}

// ========== ADMIN ANALYTICS SERVICE ==========

const adminAnalyticsService = {
    /**
     * Get dashboard KPIs
     * GET /admin/analytics/stats
     */
    getStats: async (period?: '7d' | '30d' | '90d'): Promise<AxiosResponse<AnalyticsStats>> => {
        const params = new URLSearchParams();
        if (period) params.append('period', period);
        return apiClient.get(`/admin/analytics/stats?${params.toString()}`);
    },

    /**
     * Get sales overview chart data by date
     * GET /admin/analytics/sales-overview
     */
    getSalesOverview: async (period?: '7d' | '30d' | '90d'): Promise<AxiosResponse<{ data: SalesOverviewData[] }>> => {
        const params = new URLSearchParams();
        if (period) params.append('period', period);
        return apiClient.get(`/admin/analytics/sales-overview?${params.toString()}`);
    },

    /**
     * Get product-specific analytics
     * GET /admin/products/:id/analytics
     */
    getProductAnalytics: async (id: number): Promise<AxiosResponse> => {
        return apiClient.get(`/admin/products/${id}/analytics`);
    },

    /**
     * Get variant sales distribution (Pie Chart)
     * GET /admin/products/:id/variant-sales
     */
    getVariantSales: async (id: number): Promise<AxiosResponse> => {
        return apiClient.get(`/admin/products/${id}/variant-sales`);
    },

    /**
     * Get rating distribution chart data
     * GET /admin/products/:id/rating-distribution
     */
    getRatingDistribution: async (id: number): Promise<AxiosResponse> => {
        return apiClient.get(`/admin/products/${id}/rating-distribution`);
    },
};

export default adminAnalyticsService;
