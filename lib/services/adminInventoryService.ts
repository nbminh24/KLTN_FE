import apiClient, { createFormDataClient } from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface InventoryFilters {
    low_stock?: boolean;
}

export interface RestockData {
    items: Array<{
        variant_id: number;
        quantity: number;
    }>;
    notes?: string;
}

// ========== ADMIN INVENTORY SERVICE ==========

const adminInventoryService = {
    /**
     * Get inventory status for all products and variants
     * GET /admin/inventory
     */
    getInventory: async (filters?: InventoryFilters): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (filters?.low_stock !== undefined) {
            params.append('low_stock', filters.low_stock.toString());
        }
        return apiClient.get(`/admin/inventory?${params.toString()}`);
    },

    /**
     * Get inventory statistics
     * GET /admin/inventory/stats
     */
    getInventoryStats: async (): Promise<AxiosResponse> => {
        return apiClient.get('/admin/inventory/stats');
    },

    /**
     * Manual inventory restock
     * POST /admin/inventory/restock
     */
    manualRestock: async (data: RestockData): Promise<AxiosResponse> => {
        return apiClient.post('/admin/inventory/restock', data);
    },

    /**
     * Batch inventory restock via Excel upload
     * POST /admin/inventory/restock-batch
     */
    batchRestock: async (file: File): Promise<AxiosResponse> => {
        const formData = new FormData();
        formData.append('file', file);

        const formDataClient = createFormDataClient();
        return formDataClient.post('/admin/inventory/restock-batch', formData);
    },
};

export default adminInventoryService;
