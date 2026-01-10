import apiClient from '../apiClient';
import { AxiosResponse } from 'axios';

export interface AdminCustomer {
    id: number;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    created_at: string;
    total_orders: number;
    total_spent: number;
    status: 'active' | 'inactive';
}

export interface CustomerDetail extends AdminCustomer {
    recent_orders: Array<{
        id: number;
        total_amount: number;
        status: string;
        created_at: string;
    }>;
}

export interface ChatMessage {
    id: string;
    role: 'user' | 'bot' | 'admin';
    content: string;
    created_at: string;
}

export interface ChatConversation {
    id: string;
    customer_id: number;
    status: 'resolved' | 'unresolved';
    intents: string[];
    message_count: number;
    last_message_at: string;
    created_at: string;
    messages: ChatMessage[];
}

export interface ChatHistoryResponse {
    data: ChatConversation[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface ConversationMessagesResponse {
    data: {
        session: {
            id: string;
            customer_id: number;
            status: 'resolved' | 'unresolved';
            created_at: string;
            updated_at: string;
        };
        messages: ChatMessage[];
        total: number;
        has_more: boolean;
    };
}

export interface ChatStatistics {
    total_conversations: number;
    resolved_conversations: number;
    unresolved_conversations: number;
    total_messages: number;
    avg_messages_per_conversation: number;
    most_common_intents: Array<{ intent: string; count: number }>;
    last_conversation_at: string | null;
}

export interface SupportTicket {
    id: string;
    customer_id: number;
    customer_name: string;
    customer_email: string;
    subject: string;
    message: string;
    status: 'pending' | 'replied' | 'resolved';
    priority: 'high' | 'medium' | 'low';
    created_at: string;
    updated_at: string;
    ai_attempted: boolean;
    assigned_admin_id: number | null;
    order_id: number | null;
}

export interface SupportTicketsResponse {
    data: SupportTicket[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

export interface CustomerAddress {
    id: number;
    label: string;
    name: string;
    address: string;
    city: string;
    district: string;
    ward: string;
    phone: string;
    is_default: boolean;
    created_at: string;
}

export interface CustomersListResponse {
    customers?: AdminCustomer[];
    data?: AdminCustomer[];
    total?: number;
    page?: number;
    limit?: number;
    total_pages?: number;
    meta?: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}

const adminCustomerService = {
    /**
     * Get all customers
     * GET /admin/customers
     */
    getCustomers: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
        sort_by?: string;
        order?: 'asc' | 'desc';
    }): Promise<AxiosResponse<CustomersListResponse>> => {
        return apiClient.get('/admin/customers', { params });
    },

    /**
     * Get customer detail
     * GET /admin/customers/:id
     */
    getCustomerById: async (id: number): Promise<AxiosResponse<CustomerDetail>> => {
        return apiClient.get(`/admin/customers/${id}`);
    },

    /**
     * Get customer statistics
     * GET /admin/customers/statistics
     */
    getCustomerStatistics: async (): Promise<AxiosResponse<{
        total_customers: number;
        new_customers_this_month: number;
        active_customers: number;
    }>> => {
        return apiClient.get('/admin/customers/statistics');
    },

    /**
     * Get customer chat history
     * GET /admin/customers/:id/chat-history
     */
    getChatHistory: async (id: number, params?: {
        page?: number;
        limit?: number;
        status?: 'resolved' | 'unresolved' | 'all';
        include_messages?: boolean;
        message_limit?: number;
    }): Promise<AxiosResponse<ChatHistoryResponse>> => {
        return apiClient.get(`/admin/customers/${id}/chat-history`, { params });
    },

    /**
     * Get full conversation messages
     * GET /admin/customers/:customerId/chat-history/:sessionId/messages
     */
    getConversationMessages: async (customerId: number, sessionId: string, params?: {
        limit?: number;
        offset?: number;
    }): Promise<AxiosResponse<ConversationMessagesResponse>> => {
        return apiClient.get(`/admin/customers/${customerId}/chat-history/${sessionId}/messages`, { params });
    },

    /**
     * Get customer chat statistics
     * GET /admin/customers/:id/chat-statistics
     */
    getChatStatistics: async (id: number): Promise<AxiosResponse<{ data: ChatStatistics }>> => {
        return apiClient.get(`/admin/customers/${id}/chat-statistics`);
    },

    /**
     * Get customer support tickets
     * GET /admin/customers/:id/support-tickets
     */
    getSupportTickets: async (id: number, params?: {
        page?: number;
        limit?: number;
        status?: 'pending' | 'replied' | 'resolved';
        priority?: 'high' | 'medium' | 'low';
    }): Promise<AxiosResponse<SupportTicketsResponse>> => {
        return apiClient.get(`/admin/customers/${id}/support-tickets`, { params });
    },

    /**
     * Get customer addresses
     * GET /admin/customers/:id/addresses
     */
    getAddresses: async (id: number): Promise<AxiosResponse<{ data: CustomerAddress[] }>> => {
        return apiClient.get(`/admin/customers/${id}/addresses`);
    },
};

export default adminCustomerService;
