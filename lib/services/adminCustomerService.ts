import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface AdminCustomerFilters {
    page?: number;
    limit?: number;
    search?: string;
}

export interface UpdateCustomerStatusData {
    status: 'active' | 'inactive';
}

// ========== ADMIN CUSTOMER SERVICE ==========

const adminCustomerService = {
    /**
     * Get all customers with order stats and spending
     * GET /admin/customers
     */
    getAllCustomers: async (filters?: AdminCustomerFilters): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return apiClient.get(`/admin/customers?${params.toString()}`);
    },

    /**
     * Get customer details with orders, addresses, total spending
     * GET /admin/customers/:id
     */
    getCustomerById: async (id: number): Promise<AxiosResponse> => {
        return apiClient.get(`/admin/customers/${id}`);
    },

    /**
     * Activate/Deactivate customer account
     * PATCH /admin/customers/:id/status
     */
    updateCustomerStatus: async (id: number, data: UpdateCustomerStatusData): Promise<AxiosResponse> => {
        return apiClient.patch(`/admin/customers/${id}/status`, data);
    },
};

export default adminCustomerService;
