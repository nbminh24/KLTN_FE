import apiClient from '../apiClient';
import { AxiosResponse } from 'axios';

export interface InventoryItem {
    variant_id: number;
    product_id: number;
    product_name: string;
    size: string;
    color: string;
    sku: string;
    current_stock: number;
    reserved_stock: number;
    available_stock: number;
    reorder_level: number;
    last_restocked_at?: string;
}

export interface InventoryHistory {
    id: number;
    variant_id: number;
    product_name: string;
    size: string;
    color: string;
    change_type: 'restock' | 'sale' | 'return' | 'adjustment';
    quantity_change: number;
    previous_stock: number;
    new_stock: number;
    reason?: string;
    created_by: string;
    created_at: string;
}

export interface RestockData {
    variant_id: number;
    quantity: number;
}

export interface CreateRestockBatchData {
    admin_id: number;
    type: 'Manual' | 'Auto';
    items: Array<{
        variant_id: number;
        quantity: number;
    }>;
}

export interface InventoryListResponse {
    items: InventoryItem[];
    total: number;
    page: number;
    limit: number;
}

export interface InventoryHistoryResponse {
    history: InventoryHistory[];
    total: number;
    page: number;
    limit: number;
}

const adminInventoryService = {
    /**
     * Get inventory overview
     * GET /admin/inventory
     */
    getInventory: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        low_stock?: boolean;
        out_of_stock?: boolean;
    }): Promise<AxiosResponse<InventoryListResponse>> => {
        return apiClient.get('/admin/inventory', { params });
    },

    /**
     * Get inventory history
     * GET /admin/inventory/history
     */
    getInventoryHistory: async (params?: {
        page?: number;
        limit?: number;
        variant_id?: number;
        change_type?: string;
        start_date?: string;
        end_date?: string;
    }): Promise<AxiosResponse<InventoryHistoryResponse>> => {
        return apiClient.get('/admin/inventory/history', { params });
    },

    /**
     * Restock product
     * POST /admin/inventory/restock
     */
    restockProduct: async (data: RestockData): Promise<AxiosResponse<{
        message: string;
        new_stock: number;
    }>> => {
        return apiClient.post('/admin/inventory/restock', data);
    },

    /**
     * Batch restock - Creates a restock batch with items
     * POST /admin/inventory/restock/batch
     */
    createRestockBatch: async (data: CreateRestockBatchData): Promise<AxiosResponse<{
        batch_id: number;
        success_count: number;
        error_count: number;
        errors?: Array<{ variant_id: number; message: string }>;
    }>> => {
        return apiClient.post('/admin/inventory/restock/batch', data);
    },

    /**
     * Get restock history/batches
     * GET /admin/inventory/restock/history
     */
    getRestockHistory: async (params?: {
        page?: number;
        limit?: number;
        type?: string;
        start_date?: string;
        end_date?: string;
    }): Promise<AxiosResponse<{
        batches: Array<{
            id: number;
            admin_id: number;
            type: string;
            created_at: string;
            items_count: number;
            admin_name?: string;
        }>;
        total: number;
        page: number;
        limit: number;
    }>> => {
        return apiClient.get('/admin/inventory/restock/history', { params });
    },
};

export default adminInventoryService;
