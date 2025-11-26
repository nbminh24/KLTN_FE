import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

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

// ========== ADMIN DASHBOARD SERVICE ==========

const adminDashboardService = {
    /**
     * Get dashboard statistics
     * GET /admin/dashboard/stats
     */
    getStats: async (): Promise<AxiosResponse<DashboardStats>> => {
        return apiClient.get('/admin/dashboard/stats');
    },
};

export default adminDashboardService;
