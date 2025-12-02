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
     * POST /api/v1/support/tickets
     * 
     * No authentication required. For guest and customer support requests.
     * Generates unique ticket_code for tracking.
     */
    createTicket: async (data: CreateSupportTicketPayload): Promise<AxiosResponse<CreateSupportTicketResponse>> => {
        return apiClient.post('/api/v1/support/tickets', data);
    },
};

export default supportService;
