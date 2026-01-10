'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Heart, Calendar, Ban, CheckCircle, MessageCircle, Headphones, X, Send, Search, User, Bot, Clock, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { use } from 'react';
import adminCustomerService, { CustomerDetail, ChatConversation, SupportTicket } from '@/lib/services/admin/customerService';
import adminSupportService from '@/lib/services/admin/supportService';
import { showToast } from '@/components/Toast';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [chatHistory, setChatHistory] = useState<ChatConversation[]>([]);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Chat History filters
  const [chatTab, setChatTab] = useState<'all' | 'unanswered'>('all');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatStatusFilter, setChatStatusFilter] = useState('all');
  const [chatIntentFilter, setChatIntentFilter] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState<ChatConversation | null>(null);

  // Support Inbox filters
  const [supportTab, setSupportTab] = useState<'pending' | 'in-progress' | 'resolved'>('pending');
  const [supportSearchQuery, setSupportSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    fetchCustomerDetail();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'chat') {
      fetchChatHistory();
    } else if (activeTab === 'support') {
      fetchSupportTickets();
    }
  }, [activeTab, id]);

  useEffect(() => {
    if (activeTab === 'support') {
      fetchSupportTickets();
    }
  }, [supportTab, currentPage]);

  useEffect(() => {
    fetchAddresses();
  }, [id]);

  const fetchCustomerDetail = async () => {
    try {
      setLoading(true);
      const response = await adminCustomerService.getCustomerById(parseInt(id));
      console.log('👤 Customer detail:', response.data);
      // Backend returns {data: {data: customer}} or {data: customer} structure
      const customerData = (response.data as any).data || response.data;
      setCustomer(customerData);
    } catch (error) {
      console.error('❌ Failed to fetch customer detail:', error);
      showToast('Không thể tải thông tin khách hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    try {
      setChatLoading(true);
      const response = await adminCustomerService.getChatHistory(parseInt(id), {
        page: 1,
        limit: 50,
        status: chatStatusFilter === 'all' ? undefined : chatStatusFilter as any
      });
      console.log('💬 Chat history:', response.data);
      setChatHistory(response.data.data || []);
    } catch (error) {
      console.error('❌ Failed to fetch chat history:', error);
      showToast('Không thể tải lịch sử chat', 'error');
    } finally {
      setChatLoading(false);
    }
  };

  const fetchSupportTickets = async () => {
    try {
      setTicketsLoading(true);
      const statusMap = {
        'pending': 'pending',
        'in-progress': 'replied',
        'resolved': 'resolved'
      };
      const response = await adminCustomerService.getSupportTickets(parseInt(id), {
        page: currentPage,
        limit: itemsPerPage,
        status: statusMap[supportTab] as any
      });
      console.log('🎫 Support tickets:', response.data);
      setSupportTickets(response.data.data || []);
    } catch (error) {
      console.error('❌ Failed to fetch support tickets:', error);
      showToast('Không thể tải support tickets', 'error');
    } finally {
      setTicketsLoading(false);
    }
  };

  const fetchAddresses = async () => {
    try {
      setAddressesLoading(true);
      const response = await adminCustomerService.getAddresses(parseInt(id));
      console.log('📍 Addresses:', response.data);
      setAddresses(response.data.data || []);
    } catch (error) {
      console.error('❌ Failed to fetch addresses:', error);
      // Don't show toast for addresses as it's not critical
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) {
      showToast('Vui lòng nhập nội dung email', 'warning');
      return;
    }

    try {
      const ticketId = parseInt(selectedTicket);
      await adminSupportService.replyToTicket(ticketId, {
        body: replyMessage
      });
      showToast('Đã gửi email thành công', 'success');
      setShowReplyModal(false);
      setReplyMessage('');
      setReplySubject('');
      // Refresh tickets
      fetchSupportTickets();
    } catch (error: any) {
      console.error('❌ Failed to send reply:', error);
      showToast(error.response?.data?.message || 'Không thể gửi email', 'error');
    }
  };

  const handleConversationClick = async (conv: ChatConversation) => {
    setSelectedConversation(conv);

    // If messages array is empty or not fully loaded, fetch full conversation
    if (!conv.messages || conv.messages.length === 0) {
      try {
        setMessagesLoading(true);
        const response = await adminCustomerService.getConversationMessages(
          parseInt(id),
          conv.id,
          { limit: 50, offset: 0 }
        );
        console.log('💬 Conversation messages:', response.data);

        // Update the conversation with fetched messages
        const updatedConv = {
          ...conv,
          messages: response.data.data.messages
        };
        setSelectedConversation(updatedConv);

        // Also update in chatHistory state for caching
        setChatHistory(prevHistory =>
          prevHistory.map(c =>
            c.id === conv.id ? updatedConv : c
          )
        );
      } catch (error: any) {
        console.error('❌ Failed to fetch conversation messages:', error);
        if (error.response?.status === 404) {
          showToast('Không tìm thấy cuộc hội thoại', 'error');
        } else if (error.response?.status === 403) {
          showToast('Không có quyền truy cập cuộc hội thoại này', 'error');
        } else {
          showToast('Không thể tải tin nhắn', 'error');
        }
      } finally {
        setMessagesLoading(false);
      }
    }
  };

  const formatCurrency = (amount: number) => {
    return (amount * 25000).toLocaleString('vi-VN') + ' đ';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return formatDate(dateString);
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!customer) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Không tìm thấy khách hàng</div>
      </div>
    );
  }

  // Filter conversations for Chat History
  const filteredConversations = chatHistory.filter(conv => {
    const matchesTab = chatTab === 'all' ||
      (chatTab === 'unanswered' && conv.status === 'unresolved');
    const matchesSearch = customer?.name?.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
      conv.id.toLowerCase().includes(chatSearchQuery.toLowerCase());
    const matchesStatus = chatStatusFilter === 'all' || conv.status === chatStatusFilter;
    const matchesIntent = chatIntentFilter === 'all' ||
      conv.intents.some(intent => intent.toLowerCase().includes(chatIntentFilter.toLowerCase()));
    return matchesTab && matchesSearch && matchesStatus && matchesIntent;
  });

  // Filter tickets 
  const filteredTickets = supportTickets.filter(ticket => {
    const matchesSearch =
      ticket.subject.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
      ticket.message.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
      ticket.id.toLowerCase().includes(supportSearchQuery.toLowerCase());
    return matchesSearch;
  });

  // Pagination for Support Inbox
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  // Helper functions
  const getIntentColor = (intent: string) => {
    const colors: Record<string, string> = {
      'Product Inquiry': 'bg-blue-100 text-blue-700',
      'Order Status': 'bg-green-100 text-green-700',
      'Shipping Info': 'bg-purple-100 text-purple-700',
      'Return Policy': 'bg-yellow-100 text-yellow-700',
      'Payment': 'bg-red-100 text-red-700',
      'Size Guide': 'bg-pink-100 text-pink-700',
      'Delivery': 'bg-indigo-100 text-indigo-700',
    };
    return colors[intent] || 'bg-gray-100 text-gray-700';
  };

  const getConvStatusColor = (status: string) => {
    if (status === 'resolved' || status === 'Resolved') return 'bg-green-100 text-green-700';
    if (status === 'unresolved' || status === 'Unresolved') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getTicketStatusColor = (status: string) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700';
    if (status === 'replied') return 'bg-blue-100 text-blue-700';
    if (status === 'resolved') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-700';
    if (priority === 'medium') return 'bg-orange-100 text-orange-700';
    if (priority === 'low') return 'bg-gray-100 text-gray-700';
    return 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#202224]">Chi tiết khách hàng</h1>
            <p className="text-gray-600 mt-1">ID: {customer.id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Mail className="w-4 h-4" />
            <span className="font-semibold text-sm">Gửi Email</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            <Ban className="w-4 h-4" />
            <span className="font-semibold text-sm">Khóa tài khoản</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-semibold text-sm transition flex items-center gap-2 ${activeTab === 'overview'
              ? 'border-b-2 border-[#4880FF] text-[#4880FF]'
              : 'text-gray-600 hover:text-[#4880FF]'
              }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-4 font-semibold text-sm transition flex items-center gap-2 ${activeTab === 'chat'
              ? 'border-b-2 border-[#4880FF] text-[#4880FF]'
              : 'text-gray-600 hover:text-[#4880FF]'
              }`}
          >
            <MessageCircle className="w-4 h-4" />
            Lịch sử chat
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-6 py-4 font-semibold text-sm transition flex items-center gap-2 ${activeTab === 'support'
              ? 'border-b-2 border-[#4880FF] text-[#4880FF]'
              : 'text-gray-600 hover:text-[#4880FF]'
              }`}
          >
            <Headphones className="w-4 h-4" />
            Hỗ trợ
          </button>
        </div>
      </div>

      {activeTab === 'overview' && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                  {customer.name?.charAt(0) || 'U'}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-[#202224]">{customer.name}</h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${customer.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                      {customer.status === 'active' ? 'Hoạt động' : 'Khóa'}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span className="text-sm">{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span className="text-sm">{customer.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">Tham gia {formatDate(customer.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Lịch sử đơn hàng</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#F1F4F9]">
                      <th className="px-4 py-3 text-left text-sm font-bold">Mã đơn</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Ngày</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Tổng tiền</th>
                      <th className="px-4 py-3 text-left text-sm font-bold">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {customer.recent_orders && customer.recent_orders.length > 0 ? (
                      customer.recent_orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <Link href={`/admin/orders/${order.id}`} className="font-semibold text-[#4880FF] hover:underline">
                              #{order.id}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{formatDate(order.created_at)}</td>
                          <td className="px-4 py-3 text-sm font-semibold">{formatCurrency(parseFloat(order.total_amount?.toString() || '0'))}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-gray-500">Chưa có đơn hàng</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Address */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Địa chỉ</h2>
                {addressesLoading && <Loader2 className="w-4 h-4 animate-spin text-gray-400" />}
              </div>
              {addresses && addresses.length > 0 ? (
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="p-4 border border-gray-200 rounded-lg hover:border-[#4880FF] transition">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start gap-3 flex-1">
                          <MapPin className="w-5 h-5 text-[#4880FF] flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-semibold text-sm">{addr.label || 'Địa chỉ'}</p>
                              {addr.is_default && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mb-1">{addr.name}</p>
                            <p className="text-sm text-gray-600">
                              {addr.address}, {addr.ward}, {addr.district}, {addr.city}
                            </p>
                            {addr.phone && (
                              <p className="text-sm text-gray-600 mt-1">
                                <Phone className="w-3 h-3 inline mr-1" />
                                {addr.phone}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Chưa có địa chỉ</p>
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Thống kê</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShoppingBag className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                      <p className="text-2xl font-bold text-blue-600">{customer.total_orders || 0}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Tổng chi tiêu</p>
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(customer.total_spent || 0)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-bold mb-4">Hoạt động gần đây</h2>
              <div className="space-y-3">
                {customer.recent_orders && customer.recent_orders.length > 0 ? (
                  customer.recent_orders.slice(0, 3).map((order, index) => (
                    <div key={order.id} className="flex gap-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div>
                        <p className="text-sm font-semibold">Đơn hàng #{order.id}</p>
                        <p className="text-xs text-gray-600">{formatDate(order.created_at)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Chưa có hoạt động</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chat History Tab */}
      {activeTab === 'chat' && (
        <div className="space-y-6">
          {/* Tabs */}
          <div className="flex items-center gap-4 border-b border-gray-200">
            <button
              onClick={() => setChatTab('all')}
              className={`px-4 py-3 font-semibold transition relative ${chatTab === 'all'
                ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setChatTab('unanswered')}
              className={`px-4 py-3 font-semibold transition relative ${chatTab === 'unanswered'
                ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              Câu hỏi chưa trả lời
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo ID hoặc tên khách hàng..."
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm"
                />
              </div>
              <select
                value={chatStatusFilter}
                onChange={(e) => setChatStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="Resolved">Đã giải quyết</option>
                <option value="Unresolved">Chưa giải quyết</option>
              </select>
              <select
                value={chatIntentFilter}
                onChange={(e) => setChatIntentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm"
              >
                <option value="all">Tất cả mục đích</option>
                <option value="Product Inquiry">Hỏi về sản phẩm</option>
                <option value="Order Status">Trạng thái đơn hàng</option>
                <option value="Shipping Info">Thông tin vận chuyển</option>
                <option value="Size Guide">Hướng dẫn chọn size</option>
                <option value="Delivery">Giao hàng</option>
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
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Trạng Thái</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Mục Đích</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Tin Nhắn</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Thời Gian</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredConversations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        Không tìm thấy cuộc trò chuyện
                      </td>
                    </tr>
                  ) : (
                    filteredConversations.map((conv) => (
                      <tr
                        key={conv.id}
                        onClick={() => handleConversationClick(conv)}
                        className="hover:bg-gray-50 transition cursor-pointer"
                      >
                        <td className="px-6 py-4">
                          <span className="font-mono text-sm font-semibold text-[#4880FF]">
                            #{conv.id}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getConvStatusColor(conv.status)}`}>
                            {conv.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {conv.intents.map((intent, i) => (
                              <span
                                key={i}
                                className={`px-2 py-1 rounded-full text-xs font-semibold ${getIntentColor(intent)}`}
                              >
                                {intent}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{conv.message_count}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{formatTimeAgo(conv.last_message_at)}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Support Inbox Tab */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          {/* Tabs & Search */}
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="flex items-center gap-4 border-b border-gray-200 px-4">
              <button
                onClick={() => { setSupportTab('pending'); setCurrentPage(1); }}
                className={`px-4 py-3 font-semibold transition relative ${supportTab === 'pending'
                  ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Chờ xử lý
              </button>
              <button
                onClick={() => { setSupportTab('in-progress'); setCurrentPage(1); }}
                className={`px-4 py-3 font-semibold transition relative ${supportTab === 'in-progress'
                  ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Đang xử lý
              </button>
              <button
                onClick={() => { setSupportTab('resolved'); setCurrentPage(1); }}
                className={`px-4 py-3 font-semibold transition relative ${supportTab === 'resolved'
                  ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                  : 'text-gray-600 hover:text-gray-800'
                  }`}
              >
                Đã giải quyết
              </button>
            </div>
            <div className="p-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm kiếm yêu cầu..."
                  value={supportSearchQuery}
                  onChange={(e) => setSupportSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                />
              </div>
            </div>
          </div>

          {/* Tickets Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Ticket List */}
            <div className="space-y-4">
              {paginatedTickets.length === 0 ? (
                <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
                  <Mail className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-600">Không tìm thấy yêu cầu</p>
                </div>
              ) : (
                <>
                  {paginatedTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket.id)}
                      className={`bg-white border-2 rounded-xl p-5 cursor-pointer transition hover:shadow-lg ${selectedTicket === ticket.id
                        ? 'border-[#4880FF]'
                        : 'border-gray-200'
                        }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-gray-500">{ticket.id}</span>
                            {ticket.ai_attempted && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                                AI Chuyển tiếp
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-lg mb-1">{ticket.subject}</h3>
                          <p className="text-sm text-gray-600">{customer.name} • {customer.email}</p>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getTicketStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-bold ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 line-clamp-2 mb-3">{ticket.message}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{new Date(ticket.created_at).toLocaleDateString()} • {new Date(ticket.created_at).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))}

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="bg-white border border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                          disabled={currentPage === 1}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          Trước
                        </button>
                        <span className="text-sm font-semibold text-gray-700">
                          Trang {currentPage} / {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Tiếp
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Ticket Detail */}
            <div className="sticky top-6">
              {selectedTicket ? (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="bg-gradient-to-r from-[#4880FF] to-blue-600 text-white p-6">
                    <p className="text-sm opacity-90 mb-1">{selectedTicket}</p>
                    <h2 className="text-2xl font-bold">{supportTickets.find(t => t.id === selectedTicket)?.subject}</h2>
                    <div className="flex items-center gap-2 text-sm mt-3">
                      <Mail className="w-4 h-4" />
                      <span>{customer.email}</span>
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-gray-800">{supportTickets.find(t => t.id === selectedTicket)?.message}</p>
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h3 className="font-bold mb-3">Hành Động</h3>
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            const ticket = supportTickets.find(t => t.id === selectedTicket);
                            if (ticket) {
                              setReplySubject(`Re: ${ticket.subject}`);
                              setReplyMessage('');
                              setShowReplyModal(true);
                            }
                          }}
                          className="flex-1 bg-[#4880FF] text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2"
                        >
                          <Send className="w-5 h-5" />
                          Trả lời
                        </button>
                        <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                          Giải quyết
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                  <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">Chưa chọn yêu cầu</h3>
                  <p className="text-gray-600">Chọn một yêu cầu để xem chi tiết</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Conversation Modal */}
      {selectedConversation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedConversation(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#202224]">
                    Conversation #{selectedConversation.id}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {customer?.name} • {formatTimeAgo(selectedConversation.last_message_at)}
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
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getConvStatusColor(selectedConversation.status)}`}>
                  {selectedConversation.status}
                </span>
                {selectedConversation.intents.map((intent: string, i: number) => (
                  <span
                    key={i}
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getIntentColor(intent)}`}
                  >
                    {intent}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {messagesLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-spin" />
                  <p className="text-gray-500 text-sm">Đang tải tin nhắn...</p>
                </div>
              ) : !selectedConversation.messages || selectedConversation.messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-700 mb-2">Không có tin nhắn</h3>
                  <p className="text-gray-500 text-sm mb-4">
                    Cuộc hội thoại này chưa có tin nhắn nào.
                  </p>
                  <p className="text-xs text-gray-400 font-mono">
                    Tổng số tin nhắn: {selectedConversation.message_count}
                  </p>
                </div>
              ) : chatTab === 'unanswered' ? (
                // Q&A Pairs for Unanswered tab
                <div className="space-y-6">
                  <h3 className="font-bold text-lg text-[#202224] mb-4">Unanswered Questions</h3>
                  {selectedConversation.messages
                    .filter((msg: any) => msg.role === 'user' || msg.content.includes('[No answer'))
                    .reduce((acc: any[][], msg: any, i: number, arr: any[]) => {
                      if (msg.role === 'user') {
                        const nextMsg = arr[i + 1];
                        if (nextMsg && nextMsg.content.includes('[No answer')) {
                          acc.push([msg, nextMsg]);
                        }
                      }
                      return acc;
                    }, [])
                    .map((pair: any, i: number) => (
                      <div key={i} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <User className="w-5 h-5 text-gray-600 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Question:</p>
                            <p className="text-sm text-gray-700">{pair[0].content}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 pt-3 border-t border-yellow-300">
                          <Bot className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-800">{pair[1].content}</p>
                            <p className="text-xs text-gray-500 mt-1">{new Date(pair[1].created_at).toLocaleTimeString('vi-VN')}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                // Full Conversation for All tab
                <div className="space-y-4">
                  {selectedConversation.messages.map((msg: any, i: number) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'bot' ? 'justify-end' : ''}`}>
                      {msg.role === 'user' && (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className={`flex-1 max-w-xl ${msg.role === 'bot' ? 'flex flex-col items-end' : ''}`}>
                        <span className="text-xs text-gray-500 mb-1 block">{new Date(msg.created_at).toLocaleTimeString('vi-VN')}</span>
                        <div
                          className={`rounded-lg p-4 ${msg.role === 'user' ? 'bg-gray-100' : 'bg-[#4880FF] text-white'
                            }`}
                        >
                          <p className="text-sm whitespace-pre-line">{msg.content}</p>
                        </div>
                      </div>
                      {msg.role === 'bot' && (
                        <div className="w-10 h-10 bg-[#4880FF] rounded-full flex-shrink-0 flex items-center justify-center">
                          <Bot className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowReplyModal(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-[#202224]">Trả Lời Yêu Cầu Hỗ Trợ</h2>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Đến</label>
                <input
                  type="text"
                  value={customer?.email || ''}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Tiêu Đề</label>
                <input
                  type="text"
                  value={replySubject}
                  onChange={(e) => setReplySubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  placeholder="Re: Tiêu đề yêu cầu"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-700">Nội Dung *</label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] resize-none"
                  placeholder="Viết nội dung trả lời tại đây..."
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200">
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyMessage.trim()}
                  className="px-6 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Gửi Email
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
