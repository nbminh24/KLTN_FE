import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface SupportTicketFilters {
    page?: number;
    limit?: number;
    status?: string;
}

export interface UpdateTicketData {
    status: string;
    admin_notes?: string;
}

export interface ReplyToTicketData {
    message: string;
}

// ========== ADMIN SUPPORT SERVICE ==========

const adminSupportService = {
    /**
     * Get all support tickets
     * GET /admin/support-tickets
     */
    getAllTickets: async (filters?: SupportTicketFilters): Promise<AxiosResponse> => {
        const params = new URLSearchParams();
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    params.append(key, value.toString());
                }
            });
        }
        return apiClient.get(`/admin/support-tickets?${params.toString()}`);
    },

    /**
     * Get support ticket detail
     * GET /admin/support-tickets/:id
     */
    getTicketById: async (id: number): Promise<AxiosResponse> => {
        return apiClient.get(`/admin/support-tickets/${id}`);
    },

    /**
     * Update support ticket status
     * PUT /admin/support/tickets/:id
     */
    updateTicket: async (id: number, data: UpdateTicketData): Promise<AxiosResponse> => {
        return apiClient.put(`/admin/support/tickets/${id}`, data);
    },

    /**
     * Admin reply to support ticket
     * POST /admin/support-tickets/:id/reply
     */
    replyToTicket: async (id: number, data: ReplyToTicketData): Promise<AxiosResponse> => {
        return apiClient.post(`/admin/support-tickets/${id}/reply`, data);
    },

    /**
     * Get support ticket status counts
     * GET /admin/support-tickets/status-counts
     */
    getTicketStatusCounts: async (): Promise<AxiosResponse> => {
        return apiClient.get('/admin/support-tickets/status-counts');
    },
};

export default adminSupportService;
