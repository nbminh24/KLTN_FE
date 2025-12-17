'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MessageCircle, X, User, Loader2, Send, Clock, CheckCircle } from 'lucide-react';
import handoffService, { ActiveConversation } from '@/lib/services/handoffService';
import chatService, { ChatMessage as ChatMessageType } from '@/lib/services/chatService';
import { showToast } from '@/components/Toast';

function ActiveConversationsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [conversations, setConversations] = useState<ActiveConversation[]>([]);
    const [selectedSession, setSelectedSession] = useState<number | null>(null);
    const [messages, setMessages] = useState<ChatMessageType[]>([]);
    const [adminMessage, setAdminMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);

    useEffect(() => {
        fetchConversations();

        // Poll for updates every 10 seconds
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Auto-select session from URL
        const sessionParam = searchParams.get('session');
        if (sessionParam) {
            const sessionId = parseInt(sessionParam, 10);
            if (!isNaN(sessionId)) {
                handleOpenConversation(sessionId);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (!selectedSession) return;

        // Poll messages when conversation is open
        const interval = setInterval(() => {
            loadMessages(selectedSession);
        }, 5000);

        return () => clearInterval(interval);
    }, [selectedSession]);

    const fetchConversations = async () => {
        try {
            const adminData = localStorage.getItem('admin');
            if (!adminData) return;

            const admin = JSON.parse(adminData);
            const response = await handoffService.getActiveConversations(admin.id);
            setConversations(response.data.conversations);
        } catch (error) {
            console.error('Failed to fetch active conversations:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadMessages = async (sessionId: number) => {
        try {
            const response = await chatService.getChatHistory(sessionId, { limit: 100 });
            setMessages(response.data.messages);
        } catch (error) {
            console.error('Failed to load messages:', error);
        }
    };

    const handleOpenConversation = async (sessionId: number) => {
        setSelectedSession(sessionId);
        setLoadingMessages(true);
        await loadMessages(sessionId);
        setLoadingMessages(false);
    };

    const handleSendMessage = async () => {
        if (!selectedSession || !adminMessage.trim()) return;

        try {
            setSending(true);

            const adminData = localStorage.getItem('admin');
            if (!adminData) {
                showToast('Admin session not found', 'error');
                return;
            }

            const admin = JSON.parse(adminData);
            await handoffService.sendAdminMessage(selectedSession, admin.id, adminMessage);

            setAdminMessage('');
            await loadMessages(selectedSession);
            showToast('Message sent', 'success');
        } catch (error) {
            console.error('Failed to send message:', error);
            showToast('Failed to send message', 'error');
        } finally {
            setSending(false);
        }
    };

    const handleCloseConversation = async (sessionId: number) => {
        if (!confirm('Close this conversation and return to bot mode?')) return;

        try {
            const adminData = localStorage.getItem('admin');
            if (!adminData) return;

            const admin = JSON.parse(adminData);
            await handoffService.closeConversation(sessionId, admin.id);

            showToast('Conversation closed', 'success');
            setSelectedSession(null);
            fetchConversations();
        } catch (error) {
            console.error('Failed to close conversation:', error);
            showToast('Failed to close conversation', 'error');
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
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
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const selectedConversation = conversations.find(c => c.session_id === selectedSession);

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-[#202224]">Active Conversations</h1>
                <p className="text-gray-600 mt-1">Manage your ongoing support conversations</p>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-white/20 rounded-lg">
                        <MessageCircle className="w-8 h-8" />
                    </div>
                    <div>
                        <p className="text-sm opacity-90">Active Conversations</p>
                        <p className="text-4xl font-bold">{conversations.length}</p>
                    </div>
                </div>
            </div>

            {/* Conversations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Conversations List */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-[#F1F4F9]">
                        <h2 className="font-semibold text-gray-900">Your Conversations</h2>
                    </div>
                    <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                        {loading ? (
                            <div className="p-12 text-center">
                                <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="p-12 text-center">
                                <CheckCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 font-medium">No active conversations</p>
                                <p className="text-sm text-gray-500 mt-2">Accept pending requests to start</p>
                            </div>
                        ) : (
                            conversations.map((conv) => (
                                <div
                                    key={conv.session_id}
                                    onClick={() => handleOpenConversation(conv.session_id)}
                                    className={`p-4 cursor-pointer transition ${selectedSession === conv.session_id
                                            ? 'bg-blue-50 border-l-4 border-blue-600'
                                            : 'hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <User className="w-4 h-4 text-gray-500" />
                                                <span className="font-semibold text-gray-900">
                                                    {conv.customer?.name || `Guest ${conv.visitor_id?.substring(0, 8)}`}
                                                </span>
                                            </div>
                                            {conv.customer?.email && (
                                                <p className="text-xs text-gray-600 mb-2">{conv.customer.email}</p>
                                            )}
                                            <p className="text-xs text-gray-500">
                                                Last activity: {formatRelativeTime(conv.updated_at)}
                                            </p>
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCloseConversation(conv.session_id);
                                            }}
                                            className="text-gray-400 hover:text-red-600 transition"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Interface */}
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col">
                    {selectedSession && selectedConversation ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-gray-200 bg-[#F1F4F9]">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {selectedConversation.customer?.name || `Guest ${selectedConversation.visitor_id?.substring(0, 8)}`}
                                        </h3>
                                        <p className="text-xs text-gray-600">Session #{selectedSession}</p>
                                    </div>
                                    <button
                                        onClick={() => handleCloseConversation(selectedSession)}
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50"
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>

                            {/* Messages */}
                            <div className="flex-1 p-4 overflow-y-auto max-h-[400px] space-y-3">
                                {loadingMessages ? (
                                    <div className="text-center py-12">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                                    </div>
                                ) : (
                                    messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div
                                                className={`max-w-[70%] rounded-lg px-4 py-2 ${msg.sender === 'customer'
                                                        ? 'bg-gray-100 text-gray-900'
                                                        : msg.sender === 'admin'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-green-100 text-green-900'
                                                    }`}
                                            >
                                                <div className="text-xs font-semibold mb-1 opacity-70">
                                                    {msg.sender === 'customer' ? 'Customer' : msg.sender === 'admin' ? 'You' : 'Bot'}
                                                </div>
                                                <p className="text-sm">{msg.message}</p>
                                                <p className="text-xs mt-1 opacity-60">
                                                    {formatTime(msg.created_at)}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Input Area */}
                            <div className="p-4 border-t border-gray-200">
                                <div className="flex gap-2">
                                    <textarea
                                        value={adminMessage}
                                        onChange={(e) => setAdminMessage(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        placeholder="Type your reply..."
                                        rows={3}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 resize-none"
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={!adminMessage.trim() || sending}
                                        className="px-6 py-2 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {sending ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center p-12">
                            <div className="text-center">
                                <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-600 font-medium">Select a conversation</p>
                                <p className="text-sm text-gray-500 mt-2">Choose from the list to start chatting</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ActiveConversationsPage() {
    return (
        <Suspense fallback={
            <div className="p-6 flex items-center justify-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
        }>
            <ActiveConversationsContent />
        </Suspense>
    );
}
