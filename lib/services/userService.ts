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
    current_password: string;
    new_password: string;
}

// ========== USER SERVICE ==========

const userService = {
    /**
     * Get user profile
     * GET /users/profile
     */
    getProfile: async (): Promise<AxiosResponse<UserProfile>> => {
        return apiClient.get('/users/profile');
    },

    /**
     * Update user profile
     * PUT /users/profile
     */
    updateProfile: async (data: UpdateProfileData): Promise<AxiosResponse> => {
        return apiClient.put('/users/profile', data);
    },

    /**
     * Change user password
     * POST /users/change-password
     */
    changePassword: async (data: ChangePasswordData): Promise<AxiosResponse> => {
        return apiClient.post('/users/change-password', data);
    },
};

export default userService;
