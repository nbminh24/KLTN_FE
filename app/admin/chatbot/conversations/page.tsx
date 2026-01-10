'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, X, MessageSquare, Bot, User, Loader2, Send } from 'lucide-react';
import adminChatbotService from '@/lib/services/adminChatbotService';
import handoffService from '@/lib/services/handoffService';

type Tab = 'all' | 'human_active';

interface Message {
  id: number;
  sender: 'customer' | 'bot' | 'admin';
  message: string;
  intent?: string | null;
  created_at: string;
}

interface Conversation {
  id: number;
  customer: {
    id: number;
    name: string;
    email: string;
  } | null;
  visitor_id: string | null;
  status: string;
  message_count: number;
  created_at: string;
  updated_at: string;
  messages?: Message[];
}

function ConversationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterIntent, setFilterIntent] = useState<string>('all');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [sending, setSending] = useState(false);

  // Read tab from query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'human_active') {
      setActiveTab('human_active');
    } else {
      setActiveTab('all');
    }
  }, [searchParams]);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
  }, [activeTab, searchQuery, filterStatus]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      setError('');

      let response;
      if (activeTab === 'human_active') {
        // Fetch both pending and active human conversations
        const adminData = localStorage.getItem('admin');
        const adminId = adminData ? JSON.parse(adminData).id : 1;

        const [pendingRes, activeRes] = await Promise.all([
          handoffService.getPendingConversations(),
          handoffService.getActiveConversations(adminId),
        ]);
        const allHumanConvs = [
          ...(pendingRes.data.conversations || []),
          ...(activeRes.data.conversations || []),
        ];
        response = { data: { data: allHumanConvs } };
      } else {
        response = await adminChatbotService.getConversations({
          search: searchQuery || undefined,
        });
      }

      setConversations(response.data.data || response.data.conversations || []);
    } catch (err: any) {
      console.error('Error fetching conversations:', err);
      setError('Unable to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchConversationDetails = async (convId: number) => {
    try {
      const response = await adminChatbotService.getConversationById(convId.toString());
      const conv = response.data;
      setSelectedConversation({
        ...conv.session,
        messages: conv.messages,
      });
    } catch (err) {
      console.error('Error fetching conversation details:', err);
    }
  };

  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffMs = now.getTime() - time.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() || sending || !selectedConversation) return;

    try {
      setSending(true);
      const adminData = localStorage.getItem('admin');
      const adminId = adminData ? JSON.parse(adminData).id : 1;

      await handoffService.sendAdminMessage(selectedConversation.id, adminId, messageInput.trim());
      setMessageInput('');
      await fetchConversationDetails(selectedConversation.id);
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((conv) => {
    const customerName = conv.customer?.name || `Visitor ${conv.visitor_id}`;
    const matchesSearch = customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.id.toString().includes(searchQuery);

    return matchesSearch;
  });

  const getIntentColor = (intent: string) => {
    const colors: Record<string, string> = {
      'Product Inquiry': 'bg-blue-100 text-blue-700',
      'Order Status': 'bg-green-100 text-green-700',
      'Shipping Info': 'bg-purple-100 text-purple-700',
      'Return Policy': 'bg-yellow-100 text-yellow-700',
      'Payment': 'bg-red-100 text-red-700',
      'Size Guide': 'bg-pink-100 text-pink-700',
    };
    return colors[intent] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    if (status === 'Resolved') return 'bg-green-100 text-green-700';
    if (status === 'Unresolved') return 'bg-yellow-100 text-yellow-700';
    if (status === 'Escalated') return 'bg-red-100 text-red-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/chatbot" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Lịch Sử Hội Thoại</h1>
          <p className="text-gray-600 mt-1">Xem tất cả các cuộc trò chuyện với chatbot</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab('all');
            router.push('/admin/chatbot/conversations');
          }}
          className={`px-4 py-3 font-semibold transition relative ${activeTab === 'all'
            ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
            : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          Tất Cả
        </button>
        <button
          onClick={() => {
            setActiveTab('human_active');
            router.push('/admin/chatbot/conversations?tab=human_active');
          }}
          className={`px-4 py-3 font-semibold transition relative ${activeTab === 'human_active'
            ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
            : 'text-gray-600 hover:text-gray-800'
            }`}
        >
          Hỗ Trợ Trực Tiếp
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo ID hoặc tên khách hàng..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm"
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm"
          >
            <option value="all">Tất Cả Trạng Thái</option>
            <option value="Resolved">Đã Giải Quyết</option>
            <option value="Unresolved">Chưa Giải Quyết</option>
            <option value="Escalated">Đã Chuyển Tiếp</option>
          </select>
          <select
            value={filterIntent}
            onChange={(e) => setFilterIntent(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm"
          >
            <option value="all">Tất Cả Ý Định</option>
            <option value="Product Inquiry">Hỏi Sản Phẩm</option>
            <option value="Order Status">Trạng Thái Đơn Hàng</option>
            <option value="Shipping Info">Thông Tin Giao Hàng</option>
            <option value="Return Policy">Chính Sách Trả Hàng</option>
            <option value="Payment">Thanh Toán</option>
            <option value="Size Guide">Hướng Dẫn Size</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Khách Hàng</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Trạng Thái</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Ý Định</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Tin Nhắn</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Thời Gian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredConversations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy cuộc trò chuyện nào
                  </td>
                </tr>
              ) : (
                filteredConversations.map((conv) => (
                  <tr
                    key={conv.id}
                    onClick={() => fetchConversationDetails(conv.id)}
                    className="hover:bg-gray-50 transition cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-[#4880FF]">
                        #{conv.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-[#202224]">
                        {conv.customer?.name || `Visitor ${conv.visitor_id}`}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(conv.status)}`}>
                        {conv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-500">-</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{conv.message_count}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">{getRelativeTime(conv.updated_at)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Conversation Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedConversation(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#202224]">
                    Cuộc Trò Chuyện #{selectedConversation.id}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedConversation.customer?.name || `Khách ${selectedConversation.visitor_id}`} • {getRelativeTime(selectedConversation.updated_at)}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedConversation.status)}`}>
                  {selectedConversation.status}
                </span>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                {selectedConversation.messages && selectedConversation.messages.length > 0 ? (
                  selectedConversation.messages.map((msg) => (
                    <div key={msg.id} className={`flex gap-3 ${msg.sender === 'bot' ? 'justify-end' : ''}`}>
                      {msg.sender === 'customer' && (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className={`flex-1 max-w-xl ${msg.sender === 'bot' ? 'flex flex-col items-end' : ''}`}>
                        <span className="text-xs text-gray-500 mb-1 block">
                          {new Date(msg.created_at).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div
                          className={`rounded-lg p-4 ${msg.sender === 'customer'
                              ? 'bg-gray-100'
                              : msg.sender === 'admin'
                                ? 'bg-green-100'
                                : 'bg-[#4880FF] text-white'
                            }`}
                        >
                          <p className="text-sm whitespace-pre-line">{msg.message}</p>
                          {msg.intent && (
                            <span className="text-xs opacity-75 mt-1 block">Ý định: {msg.intent}</span>
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
                ) : (
                  <p className="text-center text-gray-500 py-8">Chưa có tin nhắn trong cuộc trò chuyện này</p>
                )}
              </div>
            </div>

            {/* Modal Footer - Reply Input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  placeholder="Nhập tin nhắn của bạn..."
                  disabled={sending}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] disabled:opacity-50 disabled:bg-gray-50 text-sm"
                />
                <button
                  type="submit"
                  disabled={!messageInput.trim() || sending}
                  className="px-4 py-2 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
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
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConversationsPage() {
  return (
    <Suspense fallback={
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#4880FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading conversations...</p>
          </div>
        </div>
      </div>
    }>
      <ConversationsContent />
    </Suspense>
  );
}
