import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface Address {
    id?: number;
    recipient_name: string;
    phone: string;
    address_line: string;
    city: string;
    district: string;
    ward: string;
    is_default: boolean;
}

// ========== ADDRESS SERVICE ==========

const addressService = {
    /**
     * Get all addresses for logged-in user
     * GET /addresses
     */
    getAll: async (): Promise<AxiosResponse<{ addresses: Address[] }>> => {
        return apiClient.get('/addresses');
    },

    /**
     * Create new shipping address
     * POST /addresses
     */
    create: async (data: Address): Promise<AxiosResponse> => {
        return apiClient.post('/addresses', data);
    },

    /**
     * Update existing address
     * PUT /addresses/:id
     */
    update: async (id: number, data: Address): Promise<AxiosResponse> => {
        return apiClient.put(`/addresses/${id}`, data);
    },

    /**
     * Delete address
     * DELETE /addresses/:id
     */
    delete: async (id: number): Promise<AxiosResponse> => {
        return apiClient.delete(`/addresses/${id}`);
    },
};

export default addressService;
