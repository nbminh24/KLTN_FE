import apiClient from '../apiClient';
import { AxiosResponse } from 'axios';

export interface SupportTicket {
    id: number;
    ticket_code: string;
    customer_id?: number;
    customer_email?: string;
    subject: string;
    message?: string;
    status: 'pending' | 'in_progress' | 'resolved' | 'closed';
    source: 'contact_form' | 'email' | 'chat';
    priority: 'low' | 'medium' | 'high';
    user_id?: number;
    created_at: string;
    updated_at: string;
    replies?: TicketReply[];
    // Extended fields for display
    customer_name?: string;
}

export interface TicketReply {
    id: number;
    ticket_id: number;
    admin_id?: number;
    body: string;
    created_at: string;
    // Extended field for display
    admin_name?: string;
}

export interface TicketsListResponse {
    tickets: SupportTicket[];
    total: number;
    page: number;
    limit: number;
}

export interface ReplyTicketData {
    body: string;
}

const adminSupportService = {
    /**
     * Get all support tickets
     * GET /admin/support-tickets
     */
    getTickets: async (params?: {
        page?: number;
        limit?: number;
        status?: string;
        priority?: string;
        search?: string;
    }): Promise<AxiosResponse<TicketsListResponse>> => {
        return apiClient.get('/admin/support-tickets', { params });
    },

    /**
     * Get ticket by ID
     * GET /admin/support-tickets/:id
     */
    getTicketById: async (id: number): Promise<AxiosResponse<SupportTicket>> => {
        return apiClient.get(`/admin/support-tickets/${id}`);
    },

    /**
     * Reply to ticket
     * POST /admin/support-tickets/:id/reply
     */
    replyToTicket: async (id: number, data: ReplyTicketData): Promise<AxiosResponse<TicketReply>> => {
        return apiClient.post(`/admin/support-tickets/${id}/reply`, data);
    },

    /**
     * Update ticket status
     * PATCH /admin/support-tickets/:id/status
     */
    updateTicketStatus: async (id: number, status: string): Promise<AxiosResponse<SupportTicket>> => {
        return apiClient.patch(`/admin/support-tickets/${id}/status`, { status });
    },

    /**
     * Get status counts
     * GET /admin/support-tickets/status-counts
     */
    getStatusCounts: async (): Promise<AxiosResponse<{
        open: number;
        in_progress: number;
        resolved: number;
        closed: number;
    }>> => {
        return apiClient.get('/admin/support-tickets/status-counts');
    },
};

export default adminSupportService;
