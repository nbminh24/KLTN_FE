import apiClient from './apiClient';
import { AxiosResponse } from 'axios';
import type {
    Customer,
    CustomerAddress,
    ProfileResponse,
    AddressesResponse,
    UpdateProfilePayload,
    AddAddressPayload,
    UpdateAddressPayload,
    ChangePasswordPayload,
} from '@/lib/types/backend';

// ========== USER/ACCOUNT SERVICE ==========

const userService = {
    // ===== PROFILE MANAGEMENT =====

    /**
     * Get customer profile information
     * GET /account/profile
     * 
     * Requires authentication.
     */
    getProfile: async (): Promise<AxiosResponse<ProfileResponse>> => {
        return apiClient.get('/account/profile');
    },

    /**
     * Update customer profile
     * PUT /account/profile
     * 
     * Updatable fields: full_name, phone, gender, date_of_birth, avatar_url
     */
    updateProfile: async (data: UpdateProfilePayload): Promise<AxiosResponse<{ customer: Customer }>> => {
        return apiClient.put('/account/profile', data);
    },

    /**
     * Change password
     * PUT /account/password
     * 
     * Requires current password for verification.
     */
    changePassword: async (data: ChangePasswordPayload): Promise<AxiosResponse<{ message: string }>> => {
        return apiClient.put('/account/password', data);
    },

    // ===== ADDRESS MANAGEMENT =====

    /**
     * Get all customer addresses
     * GET /account/addresses
     * 
     * Returns list of saved addresses with default flag.
     */
    getAddresses: async (): Promise<AxiosResponse<AddressesResponse>> => {
        return apiClient.get('/account/addresses');
    },

    /**
     * Get single address by ID
     * GET /account/addresses/:id
     */
    getAddressById: async (id: number): Promise<AxiosResponse<{ address: CustomerAddress }>> => {
        return apiClient.get(`/account/addresses/${id}`);
    },

    /**
     * Add new address
     * POST /account/addresses
     * 
     * If is_default=true, will unset other default addresses.
     */
    addAddress: async (data: AddAddressPayload): Promise<AxiosResponse<{ address: CustomerAddress }>> => {
        return apiClient.post('/account/addresses', data);
    },

    /**
     * Update existing address
     * PUT /account/addresses/:id
     */
    updateAddress: async (id: number, data: UpdateAddressPayload): Promise<AxiosResponse<{ address: CustomerAddress }>> => {
        return apiClient.put(`/account/addresses/${id}`, data);
    },

    /**
     * Delete address
     * DELETE /account/addresses/:id
     * 
     * Cannot delete if it's the only address.
     */
    deleteAddress: async (id: number): Promise<AxiosResponse<{ message: string }>> => {
        return apiClient.delete(`/account/addresses/${id}`);
    },

    /**
     * Set address as default
     * PATCH /account/addresses/:id/set-default
     * 
     * Will unset other default addresses automatically.
     */
    setDefaultAddress: async (id: number): Promise<AxiosResponse<{ message: string }>> => {
        return apiClient.patch(`/account/addresses/${id}/set-default`);
    },
};

export default userService;
