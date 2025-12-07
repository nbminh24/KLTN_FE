'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Clock, CheckCircle, Send, Search, Loader2, Tag } from 'lucide-react';
import adminSupportService, { SupportTicket } from '@/lib/services/admin/supportService';
import { showToast } from '@/components/Toast';

type TicketStatus = 'pending' | 'in_progress' | 'resolved' | 'closed';

function SupportInboxContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState<TicketStatus>('pending');
    const [searchQuery, setSearchQuery] = useState('');
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab === 'in-progress') {
            setFilterStatus('in_progress');
        } else if (tab === 'resolved') {
            setFilterStatus('resolved');
        } else if (tab === 'closed') {
            setFilterStatus('closed');
        } else {
            setFilterStatus('pending');
        }
    }, [searchParams]);

    useEffect(() => {
        fetchTickets();
    }, [filterStatus]);

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const response = await adminSupportService.getTickets({
                status: filterStatus,
                page: 1,
                limit: 100
            });
            setTickets(response.data.data || []);
        } catch (error) {
            console.error('Failed to fetch tickets:', error);
            showToast('Failed to load tickets', 'error');
            setTickets([]);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async () => {
        if (!selectedTicket || !replyMessage.trim()) return;

        try {
            await adminSupportService.replyToTicket(selectedTicket.id, {
                body: replyMessage
            });
            showToast('Reply sent successfully', 'success');
            setReplyMessage('');
            fetchTickets();
            setSelectedTicket(null);
        } catch (error) {
            console.error('Failed to reply:', error);
            showToast('Failed to send reply', 'error');
        }
    };

    const handleTabChange = (status: TicketStatus) => {
        setFilterStatus(status);
        const tabMap: Record<TicketStatus, string> = {
            'pending': 'pending',
            'in_progress': 'in-progress',
            'resolved': 'resolved',
            'closed': 'closed'
        };
        router.push(`/admin/support-inbox?tab=${tabMap[status]}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'in_progress': return 'bg-blue-100 text-blue-700';
            case 'resolved': return 'bg-green-100 text-green-700';
            case 'closed': return 'bg-gray-100 text-gray-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'bg-red-100 text-red-700';
            case 'medium': return 'bg-yellow-100 text-yellow-700';
            case 'low': return 'bg-green-100 text-green-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getSourceBadge = (source: string) => {
        const badges = {
            'contact_form': { color: 'bg-blue-100 text-blue-700', label: 'Form' },
            'email': { color: 'bg-purple-100 text-purple-700', label: 'Email' },
            'chat': { color: 'bg-green-100 text-green-700', label: 'Chat' }
        };
        return badges[source as keyof typeof badges] || { color: 'bg-gray-100 text-gray-700', label: source };
    };

    const ticketsArray = Array.isArray(tickets) ? tickets : [];

    const filteredTickets = ticketsArray.filter(ticket =>
        ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ticket.ticket_code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const stats = {
        pending: ticketsArray.filter(t => t.status === 'pending').length,
        in_progress: ticketsArray.filter(t => t.status === 'in_progress').length,
        resolved: ticketsArray.filter(t => t.status === 'resolved').length,
        total: ticketsArray.length
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#202224]">Support Inbox</h1>
                <p className="text-gray-600 mt-1">Manage customer support requests</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <p className="text-sm text-gray-600 mb-1">In Progress</p>
                    <p className="text-3xl font-bold text-blue-600">{stats.in_progress}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <p className="text-sm text-gray-600 mb-1">Resolved</p>
                    <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
                </div>
                <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <p className="text-sm text-gray-600 mb-1">Total</p>
                    <p className="text-3xl font-bold text-gray-600">{stats.total}</p>
                </div>
            </div>

            {/* Tabs & Search */}
            <div className="bg-white border border-gray-200 rounded-xl">
                <div className="flex items-center gap-4 border-b border-gray-200 px-4">
                    <button
                        onClick={() => handleTabChange('pending')}
                        className={`px-4 py-3 font-semibold transition ${filterStatus === 'pending'
                            ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => handleTabChange('in_progress')}
                        className={`px-4 py-3 font-semibold transition ${filterStatus === 'in_progress'
                            ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        In Progress
                    </button>
                    <button
                        onClick={() => handleTabChange('resolved')}
                        className={`px-4 py-3 font-semibold transition ${filterStatus === 'resolved'
                            ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                            : 'text-gray-600 hover:text-gray-800'
                            }`}
                    >
                        Resolved
                    </button>
                </div>
                <div className="p-4">
                    <div className="relative">
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search by ticket code, email, or subject..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                        />
                    </div>
                </div>
            </div>

            {/* Tickets List */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full">
                    <thead className="bg-[#F1F4F9]">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Ticket</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Customer</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Source</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Priority</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Created</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                                </td>
                            </tr>
                        ) : filteredTickets.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                    No tickets found
                                </td>
                            </tr>
                        ) : (
                            filteredTickets.map((ticket) => (
                                <tr
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className="hover:bg-gray-50 transition cursor-pointer"
                                >
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-mono text-sm font-semibold text-blue-600">{ticket.ticket_code}</div>
                                            <div className="text-sm text-gray-900 font-medium">{ticket.subject}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{ticket.customer_email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${getSourceBadge(ticket.source).color}`}>
                                            {getSourceBadge(ticket.source).label}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(ticket.priority)}`}>
                                            {ticket.priority}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(ticket.status)}`}>
                                            {ticket.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(ticket.created_at).toLocaleDateString('vi-VN')}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Reply Modal */}
            {selectedTicket && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-start justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="font-mono text-sm font-semibold text-blue-600">{selectedTicket.ticket_code}</span>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(selectedTicket.status)}`}>
                                            {selectedTicket.status}
                                        </span>
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(selectedTicket.priority)}`}>
                                            {selectedTicket.priority}
                                        </span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-900">{selectedTicket.subject}</h2>
                                    <p className="text-sm text-gray-600 mt-1">{selectedTicket.customer_email}</p>
                                </div>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        <div className="p-6 border-b border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-700 mb-2">Message:</h3>
                            <p className="text-gray-800">{selectedTicket.message}</p>
                        </div>

                        <div className="p-6">
                            <h3 className="font-semibold mb-3">Reply</h3>
                            <textarea
                                value={replyMessage}
                                onChange={(e) => setReplyMessage(e.target.value)}
                                placeholder="Type your response..."
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] mb-4"
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="flex-1 px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleReply}
                                    disabled={!replyMessage.trim()}
                                    className="flex-1 px-6 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Send Reply
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function SupportInboxPage() {
    return (
        <Suspense fallback={
            <div className="p-6 flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <SupportInboxContent />
        </Suspense>
    );
}
