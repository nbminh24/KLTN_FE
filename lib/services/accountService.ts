import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface UserProfile {
    id: number;
    email: string;
    name: string;
    phone?: string;
}

export interface UpdateProfileData {
    name?: string;
    phone?: string;
}

export interface ChangePasswordData {
    old_password: string;
    new_password: string;
}

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

// ========== ACCOUNT SERVICE ==========

const accountService = {
    /**
     * Get customer profile
     * GET /account/profile
     */
    getProfile: async (): Promise<AxiosResponse<UserProfile>> => {
        return apiClient.get('/account/profile');
    },

    /**
     * Update customer profile
     * PUT /account/profile
     */
    updateProfile: async (data: UpdateProfileData): Promise<AxiosResponse> => {
        return apiClient.put('/account/profile', data);
    },

    /**
     * Change password
     * PUT /account/password
     */
    changePassword: async (data: ChangePasswordData): Promise<AxiosResponse> => {
        return apiClient.put('/account/password', data);
    },

    /**
     * Get saved addresses
     * GET /account/addresses
     */
    getAddresses: async (): Promise<AxiosResponse<{ addresses: Address[] }>> => {
        return apiClient.get('/account/addresses');
    },

    /**
     * Add new address
     * POST /account/addresses
     */
    addAddress: async (data: Address): Promise<AxiosResponse> => {
        return apiClient.post('/account/addresses', data);
    },

    /**
     * Update address
     * PUT /account/addresses/:id
     */
    updateAddress: async (id: number, data: Address): Promise<AxiosResponse> => {
        return apiClient.put(`/account/addresses/${id}`, data);
    },

    /**
     * Delete address
     * DELETE /account/addresses/:id
     */
    deleteAddress: async (id: number): Promise<AxiosResponse> => {
        return apiClient.delete(`/account/addresses/${id}`);
    },
};

export default accountService;
