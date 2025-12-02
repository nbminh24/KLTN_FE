import apiClient from '../../client';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface AdminLoginData {
    email: string;
    password: string;
}

export interface AdminAuthResponse {
    message: string;
    access_token: string;
    admin: {
        id: number;
        name: string;
        email: string;
        role: string;
    };
}

// ========== ADMIN AUTHENTICATION SERVICE ==========

const adminAuthService = {
    /**
     * Admin login
     * POST /api/v1/admin/auth/login
     */
    login: async (data: AdminLoginData): Promise<AxiosResponse<AdminAuthResponse>> => {
        return apiClient.post('/api/v1/admin/auth/login', data);
    },
};

export default adminAuthService;
