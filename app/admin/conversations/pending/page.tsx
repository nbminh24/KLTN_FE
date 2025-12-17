'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Clock, User, Loader2, Phone, Mail } from 'lucide-react';
import handoffService, { PendingConversation } from '@/lib/services/handoffService';
import { showToast } from '@/components/Toast';

function PendingConversationsContent() {
    const router = useRouter();
    const [conversations, setConversations] = useState<PendingConversation[]>([]);
    const [loading, setLoading] = useState(true);
    const [accepting, setAccepting] = useState<number | null>(null);

    useEffect(() => {
        fetchConversations();

        // Poll for new conversations every 30 seconds
        const interval = setInterval(fetchConversations, 30000);

        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => clearInterval(interval);
    }, []);

    const fetchConversations = async () => {
        try {
            const response = await handoffService.getPendingConversations();
            const newConversations = response.data.conversations;

            // Show notification if new requests
            if (conversations.length > 0 && newConversations.length > conversations.length) {
                showNotification('New customer waiting for support!');
            }

            setConversations(newConversations);
        } catch (error) {
            console.error('Failed to fetch pending conversations:', error);
            showToast('Failed to load conversations', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message: string) => {
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification('Customer Support', {
                body: message,
                icon: '/logo.png',
            });
        }
    };

    const handleAcceptConversation = async (sessionId: number) => {
        try {
            setAccepting(sessionId);

            // Get admin ID from localStorage
            const adminData = localStorage.getItem('admin');
            if (!adminData) {
                showToast('Admin session not found', 'error');
                return;
            }

            const admin = JSON.parse(adminData);
            const adminId = admin.id;

            await handoffService.acceptConversation(sessionId, adminId);
            showToast('Conversation accepted', 'success');

            // Redirect to active conversations
            router.push(`/admin/conversations/active?session=${sessionId}`);
        } catch (error) {
            console.error('Failed to accept conversation:', error);
            showToast('Failed to accept conversation', 'error');
        } finally {
            setAccepting(null);
        }
    };

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        const diffDays = Math.floor(diffHours / 24);
        return `${diffDays}d ago`;
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-[#202224]">Pending Conversations</h1>
                    <p className="text-gray-600 mt-1">Customers waiting for human support</p>
                </div>
                <button
                    onClick={fetchConversations}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                    🔄 Refresh
                </button>
            </div>

            {/* Stats Card */}
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 rounded-lg">
                        <Clock className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Waiting for Support</p>
                        <p className="text-4xl font-bold">{conversations.length}</p>
                    </div>
                </div>
            </div>

            {/* Conversations List */}
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                        <p className="text-gray-600 mt-4">Loading conversations...</p>
                    </div>
                ) : conversations.length === 0 ? (
                    <div className="p-12 text-center">
                        <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600 font-medium">No pending requests</p>
                        <p className="text-sm text-gray-500 mt-2">New handoff requests will appear here</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {conversations.map((conv) => (
                            <div
                                key={conv.session_id}
                                className="p-6 hover:bg-gray-50 transition"
                            >
                                <div className="flex items-start justify-between gap-6">
                                    {/* Customer Info */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="p-2 bg-blue-100 rounded-full">
                                                <User className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-gray-900">
                                                    {conv.customer?.name || `Guest ${conv.visitor_id?.substring(0, 8)}`}
                                                </h3>
                                                <p className="text-sm text-gray-600">Session #{conv.session_id}</p>
                                            </div>
                                        </div>

                                        {/* Contact Info */}
                                        {conv.customer && (
                                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="w-4 h-4" />
                                                    <span>{conv.customer.email}</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Metadata */}
                                        <div className="flex items-center gap-4 text-sm">
                                            {conv.handoff_reason && (
                                                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                                                    {conv.handoff_reason}
                                                </span>
                                            )}
                                            <span className="text-gray-500 flex items-center gap-1">
                                                <Clock className="w-4 h-4" />
                                                Waiting {formatRelativeTime(conv.handoff_requested_at)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Accept Button */}
                                    <button
                                        onClick={() => handleAcceptConversation(conv.session_id)}
                                        disabled={accepting === conv.session_id}
                                        className="px-6 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-2 whitespace-nowrap"
                                    >
                                        {accepting === conv.session_id ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Accepting...
                                            </>
                                        ) : (
                                            <>
                                                <MessageCircle className="w-5 h-5" />
                                                Accept
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function PendingConversationsPage() {
    return (
        <Suspense fallback={
            <div className="p-6 flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <PendingConversationsContent />
        </Suspense>
    );
}
