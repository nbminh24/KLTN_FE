import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface SizeFilters {
    page?: number;
    limit?: number;
    search?: string;
}

export interface CreateSizeData {
    name: string;
    sort_order: number;
}

export interface UpdateSizeData {
    name?: string;
    sort_order?: number;
}

// ========== ADMIN SIZE SERVICE ==========

const adminSizeService = {
    /**
     * Get all sizes with pagination
     * GET /api/v1/admin/sizes
     */
    getAllSizes: async (filters?: SizeFilters): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return apiClient.get(`/api/v1/admin/sizes?${params.toString()}`);
    },

    /**
     * Get all sizes for dropdown
     * GET /api/v1/admin/sizes/all
     */
    getAllSizesDropdown: async (): Promise<AxiosResponse> => {
        return apiClient.get('/api/v1/admin/sizes/all');
    },

    /**
     * Create new size
     * POST /api/v1/admin/sizes
     */
    createSize: async (data: CreateSizeData): Promise<AxiosResponse> => {
        return apiClient.post('/api/v1/admin/sizes', data);
    },

    /**
     * Update size
     * PUT /api/v1/admin/sizes/:id
     */
    updateSize: async (id: number, data: UpdateSizeData): Promise<AxiosResponse> => {
        return apiClient.put(`/api/v1/admin/sizes/${id}`, data);
    },
};

export default adminSizeService;
