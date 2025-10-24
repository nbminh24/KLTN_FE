'use client';

import { useState } from 'react';
import { Search, Filter, MessageSquare, Clock, CheckCircle, XCircle, Send } from 'lucide-react';

export default function SupportPage() {
  const [selectedMessage, setSelectedMessage] = useState<string | null>('1');
  const [statusFilter, setStatusFilter] = useState('all');

  const messages = [
    {
      id: '1',
      customer: 'Christine Brooks',
      email: 'christine@example.com',
      subject: 'Order not received',
      message: 'Hello, I placed an order 5 days ago but haven\'t received it yet. Order ID: ORD-001. Can you help?',
      date: '2024-01-15 10:30 AM',
      status: 'Open',
      priority: 'High',
      replies: 2,
    },
    {
      id: '2',
      customer: 'Rosie Pearson',
      email: 'rosie@example.com',
      subject: 'Product quality issue',
      message: 'The shirt I received has a manufacturing defect. I would like to return it.',
      date: '2024-01-15 09:15 AM',
      status: 'In Progress',
      priority: 'Medium',
      replies: 1,
    },
    {
      id: '3',
      customer: 'Darrell Caldwell',
      email: 'darrell@example.com',
      subject: 'Question about sizing',
      message: 'What size should I order? I\'m 180cm tall and weigh 75kg.',
      date: '2024-01-14 16:20 PM',
      status: 'Resolved',
      priority: 'Low',
      replies: 3,
    },
    {
      id: '4',
      customer: 'Gilbert Johnston',
      email: 'gilbert@example.com',
      subject: 'Payment not processed',
      message: 'I tried to place an order but my payment keeps failing. Please help.',
      date: '2024-01-14 14:45 PM',
      status: 'Open',
      priority: 'High',
      replies: 0,
    },
  ];

  const stats = [
    { label: 'Total Tickets', value: '156', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-blue-500' },
    { label: 'Open', value: '42', icon: <Clock className="w-5 h-5" />, color: 'bg-yellow-500' },
    { label: 'In Progress', value: '28', icon: <MessageSquare className="w-5 h-5" />, color: 'bg-purple-500' },
    { label: 'Resolved', value: '86', icon: <CheckCircle className="w-5 h-5" />, color: 'bg-green-500' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-yellow-100 text-yellow-700';
      case 'In Progress':
        return 'bg-blue-100 text-blue-700';
      case 'Resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'Low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const selectedMsg = messages.find((m) => m.id === selectedMessage);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#202224]">Support Messages</h1>
        <p className="text-gray-600 mt-1">Manage customer support tickets</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className={`${stat.color} text-white p-2 rounded-lg`}>
                {stat.icon}
              </div>
              <p className="text-sm text-gray-600">{stat.label}</p>
            </div>
            <p className="text-2xl font-bold text-[#202224]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Search & Filter */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search messages..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            {/* Messages */}
            <div className="overflow-y-auto max-h-[600px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg.id)}
                  className={`p-4 border-b border-gray-200 cursor-pointer transition hover:bg-gray-50 ${
                    selectedMessage === msg.id ? 'bg-blue-50 border-l-4 border-l-[#4880FF]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-sm text-[#202224]">{msg.customer}</h3>
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${getPriorityColor(msg.priority)}`}>
                      {msg.priority}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700 mb-1">{msg.subject}</p>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">{msg.message}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold ${getStatusColor(msg.status)}`}>
                      {msg.status}
                    </span>
                    <span className="text-xs text-gray-500">{msg.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMsg ? (
            <div className="bg-white rounded-xl border border-gray-200 h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold text-[#202224] mb-1">{selectedMsg.subject}</h2>
                    <p className="text-sm text-gray-600">
                      From: {selectedMsg.customer} ({selectedMsg.email})
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedMsg.status)}`}>
                      {selectedMsg.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(selectedMsg.priority)}`}>
                      {selectedMsg.priority}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition">
                    Mark In Progress
                  </button>
                  <button className="px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-semibold hover:bg-green-600 transition">
                    Mark Resolved
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-semibold hover:bg-gray-50 transition">
                    Close
                  </button>
                </div>
              </div>

              {/* Message Thread */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {/* Customer Message */}
                <div className="flex gap-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
                    {selectedMsg.customer[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm">{selectedMsg.customer}</span>
                      <span className="text-xs text-gray-500">{selectedMsg.date}</span>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4">
                      <p className="text-sm text-gray-700">{selectedMsg.message}</p>
                    </div>
                  </div>
                </div>

                {/* Admin Reply (Mock) */}
                <div className="flex gap-3 justify-end">
                  <div className="flex-1 max-w-xl">
                    <div className="flex items-center gap-2 mb-1 justify-end">
                      <span className="text-xs text-gray-500">2024-01-15 11:00 AM</span>
                      <span className="font-bold text-sm">Admin</span>
                    </div>
                    <div className="bg-[#4880FF] text-white rounded-lg p-4">
                      <p className="text-sm">
                        Thank you for reaching out. I've checked your order and it's currently in transit. You should receive it within 2-3 business days.
                      </p>
                    </div>
                  </div>
                  <div className="w-10 h-10 bg-[#4880FF] rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold">
                    A
                  </div>
                </div>
              </div>

              {/* Reply Box */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex gap-3">
                  <textarea
                    placeholder="Type your reply..."
                    rows={3}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] resize-none"
                  ></textarea>
                  <button className="px-6 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    <span className="font-semibold">Send</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a message to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
