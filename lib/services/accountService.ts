import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface UserProfile {
    id: number;
    email: string;
    name: string;
    // Note: phone is NOT in customer profile
    // Phone numbers are stored in customer_addresses table
}

export interface UpdateProfileData {
    name?: string;
    // Note: phone is NOT supported in profile update
    // Phone numbers are managed in addresses, not in customer profile
}

export interface ChangePasswordData {
    old_password: string;
    new_password: string;
}

export interface Address {
    id?: number;
    address_type?: 'Home' | 'Office';
    detailed_address?: string; // Old format (backward compatible)
    phone_number: string;
    is_default: boolean;
    // New format (post-merger 7/2025)
    province?: string;
    ward?: string;
    street_address?: string;
    latitude?: number;
    longitude?: number;
    address_source?: 'gps' | 'manual';
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
     * Backend returns: { data: Address[] }
     */
    getAddresses: async (): Promise<AxiosResponse<{ data: Address[] } | { addresses: Address[] }>> => {
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
