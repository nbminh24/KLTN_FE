'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Send, Loader2, X, User, Bot } from 'lucide-react';
import handoffService from '@/lib/services/handoffService';
import adminChatbotService from '@/lib/services/adminChatbotService';

interface Message {
    id: number;
    sender: 'customer' | 'bot' | 'admin';
    message: string;
    intent?: string | null;
    created_at: string;
}

interface Session {
    id: number;
    customer: {
        id: number;
        name: string;
        email: string;
    } | null;
    visitor_id: string | null;
    status: string;
    handoff_reason: string | null;
    handoff_requested_at: string | null;
    message_count: number;
}

export default function ChatPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.id as string;
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const [session, setSession] = useState<Session | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [messageInput, setMessageInput] = useState('');
    const [sending, setSending] = useState(false);
    const [accepting, setAccepting] = useState(false);

    useEffect(() => {
        if (sessionId) {
            fetchConversation();
            const interval = setInterval(fetchConversation, 3000);
            return () => clearInterval(interval);
        }
    }, [sessionId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchConversation = async () => {
        try {
            if (loading) setError('');
            const response = await adminChatbotService.getConversationById(sessionId);
            const data = response.data;
            setSession(data.session);
            setMessages(data.messages || []);
        } catch (err: any) {
            console.error('Error fetching conversation:', err);
            if (loading) setError('Unable to load conversation');
        } finally {
            setLoading(false);
        }
    };

    const handleAcceptConversation = async () => {
        try {
            setAccepting(true);
            const adminData = localStorage.getItem('admin');
            const adminId = adminData ? JSON.parse(adminData).id : 1;
            await handoffService.acceptConversation(parseInt(sessionId), adminId);
            await fetchConversation();
        } catch (err) {
            console.error('Error accepting conversation:', err);
            alert('Failed to accept conversation');
        } finally {
            setAccepting(false);
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!messageInput.trim() || sending) return;

        try {
            setSending(true);
            const adminData = localStorage.getItem('admin');
            const adminId = adminData ? JSON.parse(adminData).id : 1;
            await handoffService.sendAdminMessage(parseInt(sessionId), adminId, messageInput.trim());
            setMessageInput('');
            await fetchConversation();
        } catch (err) {
            console.error('Error sending message:', err);
            alert('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const handleCloseConversation = async () => {
        if (!confirm('Are you sure you want to close this conversation?')) return;

        try {
            const adminData = localStorage.getItem('admin');
            const adminId = adminData ? JSON.parse(adminData).id : 1;
            await handoffService.closeConversation(parseInt(sessionId), adminId);
            router.push('/admin/chatbot');
        } catch (err) {
            console.error('Error closing conversation:', err);
            alert('Failed to close conversation');
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[#4880FF] mx-auto mb-4" />
                    <p className="text-gray-600">Đang tải cuộc trò chuyện...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                    <p className="text-red-800 mb-4">{error}</p>
                    <button
                        onClick={fetchConversation}
                        className="px-4 py-2 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                    >
                        Thử Lại
                    </button>
                </div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="p-6">
                <div className="text-center text-gray-600">Không tìm thấy cuộc trò chuyện</div>
            </div>
        );
    }

    const customerName = session.customer?.name || `Khách ${session.visitor_id}`;
    const isPending = session.status === 'human_pending';

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/chatbot" className="p-2 hover:bg-gray-100 rounded-lg transition">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-[#202224]">{customerName}</h1>
                            <p className="text-sm text-gray-600">
                                Phiên #{sessionId} • {session.message_count} tin nhắn
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${session.status === 'human_active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                            }`}>
                            {session.status === 'human_active' ? 'Đang Xử Lý' : 'Chờ Xử Lý'}
                        </span>
                        <button
                            onClick={handleCloseConversation}
                            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition"
                        >
                            Đóng Cuộc Trò Chuyện
                        </button>
                    </div>
                </div>
                {session.handoff_reason && (
                    <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <span className="font-semibold">Lý do chuyển:</span> {session.handoff_reason}
                        </p>
                    </div>
                )}
            </div>

            {/* Accept Banner */}
            {isPending && (
                <div className="bg-yellow-50 border-b border-yellow-200 px-6 py-4">
                    <div className="flex items-center justify-between">
                        <p className="text-sm text-yellow-800">
                            Cuộc trò chuyện này đang chờ bạn tiếp nhận.
                        </p>
                        <button
                            onClick={handleAcceptConversation}
                            disabled={accepting}
                            className="px-4 py-2 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50"
                        >
                            {accepting ? 'Đang tiếp nhận...' : 'Tiếp Nhận Cuộc Trò Chuyện'}
                        </button>
                    </div>
                </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-4xl mx-auto space-y-4">
                    {messages.length === 0 ? (
                        <p className="text-center text-gray-500 py-8">Chưa có tin nhắn</p>
                    ) : (
                        messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex gap-3 ${msg.sender === 'bot' || msg.sender === 'admin' ? 'justify-end' : ''
                                    }`}
                            >
                                {msg.sender === 'customer' && (
                                    <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                <div
                                    className={`flex-1 max-w-xl ${msg.sender === 'bot' || msg.sender === 'admin' ? 'flex flex-col items-end' : ''
                                        }`}
                                >
                                    <span className="text-xs text-gray-500 mb-1 block">
                                        {new Date(msg.created_at).toLocaleTimeString('en-US', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </span>
                                    <div
                                        className={`rounded-lg p-4 ${msg.sender === 'customer'
                                            ? 'bg-gray-100 text-gray-800'
                                            : msg.sender === 'admin'
                                                ? 'bg-green-500 text-white'
                                                : 'bg-[#4880FF] text-white'
                                            }`}
                                    >
                                        <p className="text-sm whitespace-pre-line">{msg.message}</p>
                                        {msg.intent && (
                                            <span className="text-xs opacity-75 mt-1 block">Intent: {msg.intent}</span>
                                        )}
                                    </div>
                                </div>
                                {msg.sender === 'bot' && (
                                    <div className="w-10 h-10 bg-[#4880FF] rounded-full flex-shrink-0 flex items-center justify-center">
                                        <Bot className="w-5 h-5 text-white" />
                                    </div>
                                )}
                                {msg.sender === 'admin' && (
                                    <div className="w-10 h-10 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center">
                                        <User className="w-5 h-5 text-white" />
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="bg-white border-t border-gray-200 px-6 py-4">
                <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                            placeholder="Nhập tin nhắn của bạn..."
                            disabled={sending}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] disabled:opacity-50 disabled:bg-gray-50"
                        />
                        <button
                            type="submit"
                            disabled={!messageInput.trim() || sending}
                            className="px-6 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {sending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Đang gửi
                                </>
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    Gửi
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
