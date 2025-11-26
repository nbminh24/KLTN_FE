import apiClient from './apiClient';
import { AxiosResponse } from 'axios';

// ========== INTERFACES ==========

export interface CreateSupportTicketData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export interface CreateSupportTicketResponse {
    message: string;
    ticket_id: number;
}

// ========== SUPPORT SERVICE ==========

const supportService = {
    /**
     * Submit customer support request/contact form
     * POST /support/tickets
     */
    createTicket: async (data: CreateSupportTicketData): Promise<AxiosResponse<CreateSupportTicketResponse>> => {
        return apiClient.post('/support/tickets', data);
    },
};

export default supportService;
