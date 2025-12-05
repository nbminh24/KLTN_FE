import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface CreateSupportTicketPayload {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
}

export interface CreateSupportTicketResponse {
    message: string;
    ticket_code: string;
    ticket_id: number;
}

// ========== SUPPORT SERVICE ==========

const supportService = {
    /**
     * Submit customer support request/contact form
     * POST /support/tickets
     * 
     * No authentication required. For guest and customer support requests.
     * Generates unique ticket_code for tracking.
     */
    createTicket: async (data: CreateSupportTicketPayload): Promise<AxiosResponse<CreateSupportTicketResponse>> => {
        return apiClient.post('/support/tickets', data);
    },

    /**
     * Get my support tickets
     * GET /customers/me/tickets
     * 
     * Requires authentication.
     */
    getMyTickets: async (params?: {
        status?: string;
        page?: number;
        limit?: number;
    }): Promise<AxiosResponse> => {
        const queryParams = new URLSearchParams();
        if (params) {
            if (params.status) queryParams.append('status', params.status);
            if (params.page) queryParams.append('page', params.page.toString());
            if (params.limit) queryParams.append('limit', params.limit.toString());
        }
        return apiClient.get(`/customers/me/tickets?${queryParams.toString()}`);
    },

    /**
     * Get ticket details
     * GET /tickets/:id
     */
    getTicketById: async (id: number): Promise<AxiosResponse> => {
        return apiClient.get(`/tickets/${id}`);
    },

    /**
     * Reply to ticket
     * POST /tickets/:id/reply
     * 
     * Requires authentication.
     */
    replyToTicket: async (id: number, message: string): Promise<AxiosResponse> => {
        return apiClient.post(`/tickets/${id}/reply`, { message });
    },
};

export default supportService;
