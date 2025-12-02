import apiClient from '../apiClient';
import { AxiosResponse } from 'axios';

export interface Color {
    id: number;
    name: string;
    hex_code?: string;
}

const adminColorService = {
    /**
     * Get all colors
     * GET /api/v1/admin/colors
     */
    getColors: async (): Promise<AxiosResponse<Color[]>> => {
        return apiClient.get('/api/v1/admin/colors');
    },

    /**
     * Create color
     * POST /api/v1/admin/colors
     */
    createColor: async (data: { name: string; hex_code?: string }): Promise<AxiosResponse<Color>> => {
        return apiClient.post('/api/v1/admin/colors', data);
    },

    /**
     * Update color
     * PUT /api/v1/admin/colors/:id
     */
    updateColor: async (id: number, data: { name?: string; hex_code?: string }): Promise<AxiosResponse<Color>> => {
        return apiClient.put(`/api/v1/admin/colors/${id}`, data);
    },

    /**
     * Delete color
     * DELETE /api/v1/admin/colors/:id
     */
    deleteColor: async (id: number): Promise<AxiosResponse<void>> => {
        return apiClient.delete(`/api/v1/admin/colors/${id}`);
    },
};

export default adminColorService;
