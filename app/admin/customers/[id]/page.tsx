'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Heart, Calendar, Ban, CheckCircle, MessageCircle, Headphones, X, Send, Search, User, Bot, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { use } from 'react';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
  
  // Chat History filters
  const [chatTab, setChatTab] = useState<'all' | 'unanswered'>('all');
  const [chatSearchQuery, setChatSearchQuery] = useState('');
  const [chatStatusFilter, setChatStatusFilter] = useState('all');
  const [chatIntentFilter, setChatIntentFilter] = useState('all');
  const [selectedConversation, setSelectedConversation] = useState<any>(null);
  
  // Support Inbox filters
  const [supportTab, setSupportTab] = useState<'pending' | 'in-progress' | 'resolved'>('pending');
  const [supportSearchQuery, setSupportSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const customer = {
    id: id,
    name: 'Christine Brooks',
    email: 'christine@example.com',
    phone: '+1 234 567 8900',
    joined: '2023-08-15',
    lastOrder: '2024-01-15',
    status: 'Active',
    totalOrders: 12,
    totalSpent: 1245,
    averageOrder: 103.75,
  };

  const addresses = [
    {
      id: '1',
      label: 'Home',
      name: 'Christine Brooks',
      address: '089 Kutch Green Apt. 448',
      city: 'New York, NY 10001',
      phone: '+1 234 567 8900',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Office',
      name: 'Christine Brooks',
      address: '1234 Business Plaza',
      city: 'Brooklyn, NY 11201',
      phone: '+1 234 567 8901',
      isDefault: false,
    },
  ];

  const orders = [
    { id: 'ORD-001', date: '2024-01-15', items: 3, total: 467, status: 'Delivered' },
    { id: 'ORD-002', date: '2024-01-10', items: 2, total: 325, status: 'Delivered' },
    { id: 'ORD-003', date: '2023-12-28', items: 1, total: 145, status: 'Delivered' },
  ];

  const wishlist = [
    { name: 'Polo with Contrast Trims', price: 212, image: '/bmm32410_black_xl.webp' },
    { name: 'Black Striped T-shirt', price: 130, image: '/bmm32410_black_xl.webp' },
  ];

  // Mock Conversations (Chat History) - Table format
  const conversations = [
    {
      id: '1',
      customerId: id,
      customer: customer.name,
      status: 'Resolved',
      intents: ['Product Inquiry', 'Size Guide'],
      messages: 12,
      time: '2h ago',
      fullConversation: [
        { role: 'user' as const, text: 'Hi! Can you help me find a nice t-shirt for summer?', time: '14:30' },
        { role: 'bot' as const, text: 'Of course! I\'d be happy to help you find the perfect summer t-shirt. What style are you looking for?', time: '14:30' },
        { role: 'user' as const, text: 'Something casual and colorful, maybe with graphics?', time: '14:31' },
        { role: 'bot' as const, text: 'Great choice! We have some amazing graphic t-shirts. Let me show you our top picks...', time: '14:31' },
      ],
    },
    {
      id: '2',
      customerId: id,
      customer: customer.name,
      status: 'Unresolved',
      intents: ['Shipping Info'],
      messages: 5,
      time: '5h ago',
      fullConversation: [
        { role: 'user' as const, text: 'Do you ship internationally to Europe?', time: '10:15' },
        { role: 'bot' as const, text: '[No answer - Fallback]', time: '10:15' },
        { role: 'user' as const, text: 'What about express shipping options?', time: '10:16' },
        { role: 'bot' as const, text: '[No answer - Fallback]', time: '10:16' },
      ],
    },
    {
      id: '3',
      customerId: id,
      customer: customer.name,
      status: 'Resolved',
      intents: ['Order Status', 'Delivery'],
      messages: 8,
      time: '1d ago',
      fullConversation: [
        { role: 'user' as const, text: 'Where is my order ORD-001?', time: 'Yesterday' },
        { role: 'bot' as const, text: 'Let me check that for you. Your order is currently out for delivery!', time: 'Yesterday' },
        { role: 'user' as const, text: 'Great! Thanks!', time: 'Yesterday' },
      ],
    },
  ];

  // Mock Support Tickets - Card format
  const supportTickets = [
    {
      id: 'TKT-001',
      customerName: customer.name,
      customerEmail: customer.email,
      subject: 'Damaged item received',
      message: 'I received a damaged t-shirt in my order. The fabric has a tear on the side.',
      status: 'pending' as const,
      priority: 'high' as const,
      createdAt: '2024-01-16T09:30:00',
      aiAttempted: false,
    },
    {
      id: 'TKT-002',
      customerName: customer.name,
      customerEmail: customer.email,
      subject: 'Refund request for order ORD-002',
      message: 'I\'d like to request a refund for order ORD-002. The item doesn\'t fit properly.',
      status: 'replied' as const,
      priority: 'medium' as const,
      createdAt: '2024-01-12T14:20:00',
      aiAttempted: true,
    },
    {
      id: 'TKT-003',
      customerName: customer.name,
      customerEmail: customer.email,
      subject: 'Change delivery address',
      message: 'Can I change the delivery address for my recent order? I need it sent to my office instead.',
      status: 'resolved' as const,
      priority: 'low' as const,
      createdAt: '2024-01-08T16:00:00',
      aiAttempted: false,
    },
    {
      id: 'TKT-004',
      customerName: customer.name,
      customerEmail: customer.email,
      subject: 'Product quality question',
      message: 'Is the cotton organic? I have sensitive skin.',
      status: 'pending' as const,
      priority: 'low' as const,
      createdAt: '2024-01-20T11:15:00',
      aiAttempted: true,
    },
    {
      id: 'TKT-005',
      customerName: customer.name,
      customerEmail: customer.email,
      subject: 'Discount code not working',
      message: 'The discount code SUMMER20 isn\'t applying at checkout.',
      status: 'replied' as const,
      priority: 'medium' as const,
      createdAt: '2024-01-19T15:45:00',
      aiAttempted: false,
    },
    {
      id: 'TKT-006',
      customerName: customer.name,
      customerEmail: customer.email,
      subject: 'Order tracking issue',
      message: 'My tracking number shows no updates for 5 days.',
      status: 'pending' as const,
      priority: 'high' as const,
      createdAt: '2024-01-18T08:20:00',
      aiAttempted: true,
    },
    {
      id: 'TKT-007',
      customerName: customer.name,
      customerEmail: customer.email,
      subject: 'Exchange request',
      message: 'I want to exchange size M for size L.',
      status: 'resolved' as const,
      priority: 'medium' as const,
      createdAt: '2024-01-15T13:30:00',
      aiAttempted: false,
    },
  ];

  // Filter conversations for Chat History
  const filteredConversations = conversations.filter((conv) => {
    const matchesTab = chatTab === 'all' || 
                      (chatTab === 'unanswered' && conv.status === 'Unresolved');
    const matchesSearch = conv.customer.toLowerCase().includes(chatSearchQuery.toLowerCase()) ||
                         conv.id.toLowerCase().includes(chatSearchQuery.toLowerCase());
    const matchesStatus = chatStatusFilter === 'all' || conv.status === chatStatusFilter;
    const matchesIntent = chatIntentFilter === 'all' || 
                         conv.intents.some(intent => intent === chatIntentFilter);
    return matchesTab && matchesSearch && matchesStatus && matchesIntent;
  });

  // Filter tickets for Support Inbox
  const filteredTickets = supportTickets.filter((ticket) => {
    const matchesTab = supportTab === 'pending' && ticket.status === 'pending' ||
                      supportTab === 'in-progress' && ticket.status === 'replied' ||
                      supportTab === 'resolved' && ticket.status === 'resolved';
    const matchesSearch = ticket.subject.toLowerCase().includes(supportSearchQuery.toLowerCase()) ||
                         ticket.id.toLowerCase().includes(supportSearchQuery.toLowerCase());
    return matchesTab && matchesSearch;
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
    if (status === 'Resolved') return 'bg-green-100 text-green-700';
    if (status === 'Unresolved') return 'bg-yellow-100 text-yellow-700';
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
            <h1 className="text-3xl font-bold text-[#202224]">Customer Details</h1>
            <p className="text-gray-600 mt-1">Customer ID: {customer.id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Mail className="w-4 h-4" />
            <span className="font-semibold text-sm">Send Email</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            <Ban className="w-4 h-4" />
            <span className="font-semibold text-sm">Block Customer</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-4 font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'border-b-2 border-[#4880FF] text-[#4880FF]'
                : 'text-gray-600 hover:text-[#4880FF]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-6 py-4 font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === 'chat'
                ? 'border-b-2 border-[#4880FF] text-[#4880FF]'
                : 'text-gray-600 hover:text-[#4880FF]'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Chat History
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`px-6 py-4 font-semibold text-sm transition flex items-center gap-2 ${
              activeTab === 'support'
                ? 'border-b-2 border-[#4880FF] text-[#4880FF]'
                : 'text-gray-600 hover:text-[#4880FF]'
            }`}
          >
            <Headphones className="w-4 h-4" />
            Support Inbox
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
                {customer.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-[#202224]">{customer.name}</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    {customer.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Joined {customer.joined}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Order History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F1F4F9]">
                    <th className="px-4 py-3 text-left text-sm font-bold">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Items</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${order.id}`} className="font-semibold text-[#4880FF] hover:underline">
                          {order.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.date}</td>
                      <td className="px-4 py-3 text-sm">{order.items}</td>
                      <td className="px-4 py-3 text-sm font-semibold">${order.total}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Saved Addresses</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-4 border border-gray-200 rounded-lg relative">
                  {addr.isDefault && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                      Default
                    </span>
                  )}
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-[#4880FF] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-sm mb-1">{addr.label}</p>
                      <p className="text-sm text-gray-600">{addr.name}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{addr.address}</p>
                  <p className="text-sm text-gray-700 mb-1">{addr.city}</p>
                  <p className="text-sm text-gray-600">{addr.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-600">{customer.totalOrders}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-green-600">${customer.totalSpent}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Average Order</p>
                <p className="text-2xl font-bold text-purple-600">${customer.averageOrder}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Last Order</p>
                <p className="text-lg font-bold text-yellow-600">{customer.lastOrder}</p>
              </div>
            </div>
          </div>

          {/* Wishlist */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold">Wishlist</h2>
            </div>
            <div className="space-y-3">
              {wishlist.map((item, i) => (
                <div key={i} className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#202224] mb-1">{item.name}</p>
                    <p className="text-sm font-bold text-[#4880FF]">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-semibold">Order Delivered</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-semibold">Order Placed</p>
                  <p className="text-xs text-gray-600">5 days ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-semibold">Added to Wishlist</p>
                  <p className="text-xs text-gray-600">1 week ago</p>
                </div>
              </div>
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
              className={`px-4 py-3 font-semibold transition relative ${
                chatTab === 'all'
                  ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setChatTab('unanswered')}
              className={`px-4 py-3 font-semibold transition relative ${
                chatTab === 'unanswered'
                  ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Unanswered Questions
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by ID or customer name..."
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
                <option value="all">All Status</option>
                <option value="Resolved">Resolved</option>
                <option value="Unresolved">Unresolved</option>
              </select>
              <select
                value={chatIntentFilter}
                onChange={(e) => setChatIntentFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm"
              >
                <option value="all">All Intents</option>
                <option value="Product Inquiry">Product Inquiry</option>
                <option value="Order Status">Order Status</option>
                <option value="Shipping Info">Shipping Info</option>
                <option value="Size Guide">Size Guide</option>
                <option value="Delivery">Delivery</option>
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
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Intents</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Messages</th>
                    <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredConversations.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No conversations found
                      </td>
                    </tr>
                  ) : (
                    filteredConversations.map((conv) => (
                      <tr 
                        key={conv.id} 
                        onClick={() => setSelectedConversation(conv)}
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
                          <span className="text-sm text-gray-600">{conv.messages}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-600">{conv.time}</span>
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
                onClick={() => {setSupportTab('pending'); setCurrentPage(1);}}
                className={`px-4 py-3 font-semibold transition relative ${
                  supportTab === 'pending'
                    ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => {setSupportTab('in-progress'); setCurrentPage(1);}}
                className={`px-4 py-3 font-semibold transition relative ${
                  supportTab === 'in-progress'
                    ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                In Progress
              </button>
              <button
                onClick={() => {setSupportTab('resolved'); setCurrentPage(1);}}
                className={`px-4 py-3 font-semibold transition relative ${
                  supportTab === 'resolved'
                    ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Resolved
              </button>
            </div>
            <div className="p-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search tickets..."
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
                  <p className="text-gray-600">No tickets found</p>
                </div>
              ) : (
                <>
                  {paginatedTickets.map((ticket) => (
                    <div
                      key={ticket.id}
                      onClick={() => setSelectedTicket(ticket.id)}
                      className={`bg-white border-2 rounded-xl p-5 cursor-pointer transition hover:shadow-lg ${
                        selectedTicket === ticket.id
                          ? 'border-[#4880FF]'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-gray-500">{ticket.id}</span>
                            {ticket.aiAttempted && (
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs font-bold rounded">
                                AI Escalated
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
                        <span>{new Date(ticket.createdAt).toLocaleDateString()} • {new Date(ticket.createdAt).toLocaleTimeString()}</span>
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
                          Previous
                        </button>
                        <span className="text-sm font-semibold text-gray-700">
                          Page {currentPage} of {totalPages}
                        </span>
                        <button
                          onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                          disabled={currentPage === totalPages}
                          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Next
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
                      <h3 className="font-bold mb-3">Actions</h3>
                      <div className="flex gap-3">
                        <button className="flex-1 bg-[#4880FF] text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center gap-2">
                          <Send className="w-5 h-5" />
                          Reply
                        </button>
                        <button className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition">
                          Resolve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
                  <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-bold mb-2">No Ticket Selected</h3>
                  <p className="text-gray-600">Select a ticket from the list to view details</p>
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
                    {selectedConversation.customer} • {selectedConversation.time}
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
              {chatTab === 'unanswered' ? (
                // Q&A Pairs for Unanswered tab
                <div className="space-y-6">
                  <h3 className="font-bold text-lg text-[#202224] mb-4">Unanswered Questions</h3>
                  {selectedConversation.fullConversation
                    .filter((msg: any) => msg.role === 'user' || msg.text.includes('[No answer'))
                    .reduce((acc: any[][], msg: any, i: number, arr: any[]) => {
                      if (msg.role === 'user') {
                        const nextMsg = arr[i + 1];
                        if (nextMsg && nextMsg.text.includes('[No answer')) {
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
                            <p className="text-sm font-semibold text-gray-800">{pair[0].text}</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 pt-3 border-t border-yellow-300">
                          <Bot className="w-5 h-5 text-red-600 flex-shrink-0 mt-1" />
                          <div className="flex-1">
                            <p className="text-xs text-gray-500 mb-1">Answer:</p>
                            <p className="text-sm text-red-600 font-semibold">{pair[1].text}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                // Full Conversation for All tab
                <div className="space-y-4">
                  {selectedConversation.fullConversation.map((msg: any, i: number) => (
                    <div key={i} className={`flex gap-3 ${msg.role === 'bot' ? 'justify-end' : ''}`}>
                      {msg.role === 'user' && (
                        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                      )}
                      <div className={`flex-1 max-w-xl ${msg.role === 'bot' ? 'flex flex-col items-end' : ''}`}>
                        <span className="text-xs text-gray-500 mb-1 block">{msg.time}</span>
                        <div
                          className={`rounded-lg p-4 ${
                            msg.role === 'user' ? 'bg-gray-100' : 'bg-[#4880FF] text-white'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-line">{msg.text}</p>
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
    </div>
  );
}
