'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Heart, Calendar, Ban, CheckCircle, MessageCircle, Headphones, X, Send } from 'lucide-react';
import { use } from 'react';

export default function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<string | null>(null);
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

  // Mock Chat History with AI
  const chatHistory = [
    {
      id: 'CHAT-001',
      date: '2024-01-18',
      time: '14:30',
      topic: 'Product Recommendation',
      messageCount: 12,
      status: 'Completed',
      preview: 'Hi! Can you help me find a nice t-shirt for summer?'
    },
    {
      id: 'CHAT-002',
      date: '2024-01-15',
      time: '10:15',
      topic: 'Order Status Inquiry',
      messageCount: 8,
      status: 'Completed',
      preview: 'Where is my order ORD-001?'
    },
    {
      id: 'CHAT-003',
      date: '2024-01-10',
      time: '16:45',
      topic: 'Size Guide',
      messageCount: 6,
      status: 'Completed',
      preview: 'What size should I get for a regular fit?'
    },
  ];

  // Mock Support Tickets
  const supportTickets = [
    {
      id: 'TICKET-145',
      subject: 'Damaged item received',
      status: 'Resolved',
      priority: 'High',
      created: '2024-01-16',
      updated: '2024-01-17',
      assignedTo: 'Admin Team'
    },
    {
      id: 'TICKET-132',
      subject: 'Refund request for order ORD-002',
      status: 'In Progress',
      priority: 'Medium',
      created: '2024-01-12',
      updated: '2024-01-14',
      assignedTo: 'Support Team'
    },
    {
      id: 'TICKET-118',
      subject: 'Change delivery address',
      status: 'Resolved',
      priority: 'Low',
      created: '2024-01-08',
      updated: '2024-01-09',
      assignedTo: 'Admin Team'
    },
  ];

  // Mock Chat Messages Detail
  const chatMessages: { [key: string]: any } = {
    'CHAT-001': [
      { sender: 'Customer', message: 'Hi! Can you help me find a nice t-shirt for summer?', time: '14:30' },
      { sender: 'AI Bot', message: 'Of course! I\'d be happy to help you find the perfect summer t-shirt. What style are you looking for?', time: '14:30' },
      { sender: 'Customer', message: 'Something casual and colorful, maybe with graphics?', time: '14:31' },
      { sender: 'AI Bot', message: 'Great choice! We have some amazing graphic t-shirts. Let me show you our top picks...', time: '14:31' },
      { sender: 'Customer', message: 'Do you have any with tropical themes?', time: '14:32' },
      { sender: 'AI Bot', message: 'Yes! We have a beautiful collection with tropical and beach themes. Would you like to see them?', time: '14:32' },
    ],
    'CHAT-002': [
      { sender: 'Customer', message: 'Where is my order ORD-001?', time: '10:15' },
      { sender: 'AI Bot', message: 'Let me check that for you. One moment please...', time: '10:15' },
      { sender: 'AI Bot', message: 'Your order ORD-001 is currently out for delivery and should arrive today!', time: '10:16' },
      { sender: 'Customer', message: 'Great! Thanks for the quick response.', time: '10:16' },
    ],
    'CHAT-003': [
      { sender: 'Customer', message: 'What size should I get for a regular fit?', time: '16:45' },
      { sender: 'AI Bot', message: 'For a regular fit, I recommend checking our size guide. What\'s your usual size?', time: '16:45' },
      { sender: 'Customer', message: 'I usually wear Medium', time: '16:46' },
      { sender: 'AI Bot', message: 'Perfect! Medium should work well for you. Our regular fit is true to size.', time: '16:46' },
    ],
  };

  // Mock Ticket Messages Detail
  const ticketMessages: { [key: string]: any } = {
    'TICKET-145': {
      messages: [
        { sender: 'Customer', message: 'I received a damaged t-shirt in my order. The fabric has a tear on the side.', time: '2024-01-16 09:30', isCustomer: true },
        { sender: 'Admin Team', message: 'We\'re very sorry to hear about this issue. We take quality seriously. Can you please send us photos of the damage?', time: '2024-01-16 10:15', isCustomer: false },
        { sender: 'Customer', message: 'Sure, I\'ve attached the photos. As you can see, there\'s a clear tear.', time: '2024-01-16 11:00', isCustomer: true },
        { sender: 'Admin Team', message: 'Thank you for the photos. We\'ll send you a replacement immediately with express shipping. You should receive it within 2 days.', time: '2024-01-17 08:30', isCustomer: false },
      ]
    },
    'TICKET-132': {
      messages: [
        { sender: 'Customer', message: 'I\'d like to request a refund for order ORD-002. The item doesn\'t fit properly.', time: '2024-01-12 14:20', isCustomer: true },
        { sender: 'Support Team', message: 'I understand. Have you tried using our exchange service? We can send you a different size.', time: '2024-01-12 15:00', isCustomer: false },
        { sender: 'Customer', message: 'I prefer a refund at this time.', time: '2024-01-13 09:15', isCustomer: true },
        { sender: 'Support Team', message: 'Understood. Please ship the item back using the prepaid label we\'ll email you. Refund will be processed once we receive the item.', time: '2024-01-14 10:30', isCustomer: false },
      ]
    },
    'TICKET-118': {
      messages: [
        { sender: 'Customer', message: 'Can I change the delivery address for my recent order? I need it sent to my office instead.', time: '2024-01-08 16:00', isCustomer: true },
        { sender: 'Admin Team', message: 'Yes, we can update that for you. What\'s the new address?', time: '2024-01-08 16:15', isCustomer: false },
        { sender: 'Customer', message: '1234 Business Plaza, Brooklyn, NY 11201', time: '2024-01-08 16:20', isCustomer: true },
        { sender: 'Admin Team', message: 'Address updated successfully! Your order will be delivered to the new address.', time: '2024-01-09 09:00', isCustomer: false },
      ]
    },
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
            Support Tickets
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
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">AI Chat History</h2>
            <p className="text-sm text-gray-600">{chatHistory.length} conversations</p>
          </div>
          <div className="space-y-4">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat.id)}
                className="block p-4 border border-gray-200 rounded-lg hover:border-[#4880FF] hover:bg-gray-50 transition cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-sm">{chat.topic}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                        {chat.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{chat.preview}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>ID: {chat.id}</span>
                      <span>•</span>
                      <span>{chat.date} at {chat.time}</span>
                      <span>•</span>
                      <span>{chat.messageCount} messages</span>
                    </div>
                  </div>
                  <MessageCircle className="w-5 h-5 text-[#4880FF]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Support Tickets Tab */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Support Tickets</h2>
            <p className="text-sm text-gray-600">{supportTickets.length} tickets</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F1F4F9]">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Ticket ID</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Subject</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Priority</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Created</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Assigned To</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {supportTickets.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    onClick={() => setSelectedTicket(ticket.id)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <span className="font-mono text-sm font-semibold text-[#4880FF]">{ticket.id}</span>
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">{ticket.subject}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        ticket.priority === 'High' ? 'bg-red-100 text-red-700' :
                        ticket.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                        ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {ticket.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ticket.created}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{ticket.assignedTo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chat Detail Modal */}
      {selectedChat && chatMessages[selectedChat] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedChat(null)}>
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-[#202224]">Chat Conversation: {selectedChat}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {chatHistory.find(c => c.id === selectedChat)?.topic}
                </p>
              </div>
              <button
                onClick={() => setSelectedChat(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {chatMessages[selectedChat].map((msg: any, idx: number) => (
                <div key={idx} className={`flex ${msg.sender === 'Customer' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[70%] ${msg.sender === 'Customer' ? 'bg-gray-100' : 'bg-blue-100'} rounded-lg p-4`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-gray-700">{msg.sender}</span>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-800">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedChat(null)}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Support Ticket Detail Modal */}
      {selectedTicket && ticketMessages[selectedTicket] && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedTicket(null)}>
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[85vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-[#202224]">Ticket: {selectedTicket}</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {supportTickets.find(t => t.id === selectedTicket)?.subject}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              {/* Ticket Info */}
              <div className="flex items-center gap-4 text-sm">
                <span className={`px-3 py-1 rounded-full font-bold ${
                  supportTickets.find(t => t.id === selectedTicket)?.status === 'Resolved' 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {supportTickets.find(t => t.id === selectedTicket)?.status}
                </span>
                <span className={`px-3 py-1 rounded-full font-bold ${
                  supportTickets.find(t => t.id === selectedTicket)?.priority === 'High' 
                    ? 'bg-red-100 text-red-700' 
                    : supportTickets.find(t => t.id === selectedTicket)?.priority === 'Medium'
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {supportTickets.find(t => t.id === selectedTicket)?.priority} Priority
                </span>
                <span className="text-gray-600">
                  Assigned to: {supportTickets.find(t => t.id === selectedTicket)?.assignedTo}
                </span>
              </div>
            </div>

            {/* Ticket Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {ticketMessages[selectedTicket].messages.map((msg: any, idx: number) => (
                <div key={idx} className={`flex ${msg.isCustomer ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[75%] ${msg.isCustomer ? 'bg-gray-100' : 'bg-blue-50'} rounded-lg p-4 border ${msg.isCustomer ? 'border-gray-200' : 'border-blue-200'}`}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-gray-700">{msg.sender}</span>
                      <span className="text-xs text-gray-500">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-800">{msg.message}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply Section */}
            <div className="p-6 border-t border-gray-200 space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Reply to ticket</label>
                <textarea
                  rows={3}
                  placeholder="Type your response here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                ></textarea>
              </div>
              
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-6 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition font-semibold">
                  <Send className="w-4 h-4" />
                  Send Reply
                </button>
                <button className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold">
                  Mark as Resolved
                </button>
                <select className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]">
                  <option>Assign to...</option>
                  <option>Admin Team</option>
                  <option>Support Team</option>
                  <option>Technical Team</option>
                </select>
                <button
                  onClick={() => setSelectedTicket(null)}
                  className="ml-auto px-6 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
