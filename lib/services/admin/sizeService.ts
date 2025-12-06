import apiClient from '../apiClient';
import { AxiosResponse } from 'axios';

export interface Size {
    id: number;
    name: string;
    sort_order: number;
}

const adminSizeService = {
    /**
     * Get all sizes (Public API)
     * GET /api/v1/sizes
     */
    getSizes: async (): Promise<AxiosResponse<{ sizes: Size[] }>> => {
        return apiClient.get('/api/v1/sizes');
    },

    /**
     * Create size
     * POST /api/v1/admin/sizes
     */
    createSize: async (data: { name: string; sort_order?: number }): Promise<AxiosResponse<Size>> => {
        return apiClient.post('/api/v1/admin/sizes', data);
    },

    /**
     * Update size
     * PUT /api/v1/admin/sizes/:id
     */
    updateSize: async (id: number, data: { name?: string; sort_order?: number }): Promise<AxiosResponse<Size>> => {
        return apiClient.put(`/api/v1/admin/sizes/${id}`, data);
    },

    /**
     * Delete size
     * DELETE /api/v1/admin/sizes/:id
     */
    deleteSize: async (id: number): Promise<AxiosResponse<void>> => {
        return apiClient.delete(`/api/v1/admin/sizes/${id}`);
    },
};

export default adminSizeService;
