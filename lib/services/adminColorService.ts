import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface ColorFilters {
    page?: number;
    limit?: number;
    search?: string;
}

export interface CreateColorData {
    name: string;
    hex_code: string;
}

export interface UpdateColorData {
    name?: string;
    hex_code?: string;
}

// ========== ADMIN COLOR SERVICE ==========

const adminColorService = {
    /**
     * Get all colors with pagination
     * GET /api/v1/admin/colors
     */
    getAllColors: async (filters?: ColorFilters): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return apiClient.get(`/api/v1/admin/colors?${params.toString()}`);
    },

    /**
     * Get all colors for dropdown
     * GET /api/v1/admin/colors/all
     */
    getAllColorsDropdown: async (): Promise<AxiosResponse> => {
        return apiClient.get('/api/v1/admin/colors/all');
    },

    /**
     * Create new color
     * POST /api/v1/admin/colors
     */
    createColor: async (data: CreateColorData): Promise<AxiosResponse> => {
        return apiClient.post('/api/v1/admin/colors', data);
    },

    /**
     * Update color
     * PUT /api/v1/admin/colors/:id
     */
    updateColor: async (id: number, data: UpdateColorData): Promise<AxiosResponse> => {
        return apiClient.put(`/api/v1/admin/colors/${id}`, data);
    },
};

export default adminColorService;
