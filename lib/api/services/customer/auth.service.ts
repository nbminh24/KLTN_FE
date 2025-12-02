import apiClient from '../../client';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface RegisterData {
    email: string;
    password: string;
    name: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    refresh_token?: string;
    user: {
        id: number;
        email: string;
        name: string;
    };
}

export interface GoogleAuthData {
    auth_code: string;
}

export interface RefreshTokenData {
    refresh_token: string;
}

export interface ForgotPasswordData {
    email: string;
}

export interface VerifyResetTokenData {
    token: string;
}

export interface ResetPasswordData {
    token: string;
    newPassword: string;
}

export interface ActivateAccountData {
    token: string;
}

// ========== CUSTOMER AUTHENTICATION SERVICE ==========

const authService = {
    /**
     * Register new customer account
     * POST /api/v1/auth/register
     */
    register: async (data: RegisterData): Promise<AxiosResponse> => {
        return apiClient.post('/api/v1/auth/register', data);
    },

    /**
     * Activate account via email link (GET redirect)
     * GET /api/v1/auth/activate?token=xxx
     */
    activateAccountGet: async (token: string): Promise<AxiosResponse> => {
        return apiClient.get(`/api/v1/auth/activate?token=${token}`);
    },

    /**
     * Activate account via API call (POST)
     * POST /api/v1/auth/activate
     */
    activateAccount: async (data: ActivateAccountData): Promise<AxiosResponse> => {
        return apiClient.post('/api/v1/auth/activate', data);
    },

    /**
     * Login with email and password
     * POST /api/v1/auth/login
     */
    login: async (data: LoginData): Promise<AxiosResponse<AuthResponse>> => {
        return apiClient.post('/api/v1/auth/login', data);
    },

    /**
     * Google OAuth login
     * POST /api/v1/auth/google
     */
    googleLogin: async (data: GoogleAuthData): Promise<AxiosResponse<AuthResponse>> => {
        return apiClient.post('/api/v1/auth/google', data);
    },

    /**
     * Refresh access token
     * POST /api/v1/auth/refresh
     */
    refreshToken: async (data: RefreshTokenData): Promise<AxiosResponse> => {
        return apiClient.post('/api/v1/auth/refresh', data);
    },

    /**
     * Logout
     * POST /api/v1/auth/logout
     */
    logout: async (): Promise<AxiosResponse> => {
        return apiClient.post('/api/v1/auth/logout');
    },

    /**
     * Send password reset email
     * POST /api/v1/auth/forgot-password
     */
    forgotPassword: async (data: ForgotPasswordData): Promise<AxiosResponse> => {
        return apiClient.post('/api/v1/auth/forgot-password', data);
    },

    /**
     * Verify password reset token
     * POST /api/v1/auth/verify-reset-token
     */
    verifyResetToken: async (data: VerifyResetTokenData): Promise<AxiosResponse> => {
        return apiClient.post('/api/v1/auth/verify-reset-token', data);
    },

    /**
     * Reset password with token
     * POST /api/v1/auth/reset-password
     */
    resetPassword: async (data: ResetPasswordData): Promise<AxiosResponse> => {
        return apiClient.post('/api/v1/auth/reset-password', data);
    },
};

export default authService;
