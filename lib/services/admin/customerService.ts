import apiClient from '../apiClient';
import { AxiosResponse } from 'axios';

export interface AdminCustomer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    created_at: string;
    total_orders: number;
    total_spent: number;
    status: 'active' | 'inactive';
}

export interface CustomerDetail extends AdminCustomer {
    recent_orders: Array<{
        id: number;
        total_amount: number;
        status: string;
        created_at: string;
    }>;
}

export interface CustomersListResponse {
    customers?: AdminCustomer[];
    data?: AdminCustomer[];
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

const adminCustomerService = {
    /**
     * Get all customers
     * GET /admin/customers
     */
    getCustomers: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        sort_by?: string;
        order?: 'asc' | 'desc';
    }): Promise<AxiosResponse<CustomersListResponse>> => {
        return apiClient.get('/admin/customers', { params });
    },

    /**
     * Get customer detail
     * GET /admin/customers/:id
     */
    getCustomerById: async (id: number): Promise<AxiosResponse<CustomerDetail>> => {
        return apiClient.get(`/admin/customers/${id}`);
    },

    /**
     * Get customer statistics
     * GET /admin/customers/statistics
     */
    getCustomerStatistics: async (): Promise<AxiosResponse<{
        total_customers: number;
        new_customers_this_month: number;
        active_customers: number;
    }>> => {
        return apiClient.get('/admin/customers/statistics');
    },
};

export default adminCustomerService;
