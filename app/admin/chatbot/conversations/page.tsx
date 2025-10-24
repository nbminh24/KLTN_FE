'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search, Filter, MessageSquare, CheckCircle, Clock } from 'lucide-react';

export default function ConversationsPage() {
  const [selectedConv, setSelectedConv] = useState<string | null>('1');
  const [searchQuery, setSearchQuery] = useState('');

  const conversations = [
    {
      id: '1',
      user: 'User #1234',
      lastMessage: 'What sizes do you have for the t-shirts?',
      time: '2 mins ago',
      messages: 5,
      resolved: true,
      intent: 'product_inquiry',
    },
    {
      id: '2',
      user: 'User #1235',
      lastMessage: 'How can I track my order?',
      time: '5 mins ago',
      messages: 3,
      resolved: true,
      intent: 'order_status',
    },
    {
      id: '3',
      user: 'User #1236',
      lastMessage: 'What is your return policy?',
      time: '12 mins ago',
      messages: 4,
      resolved: false,
      intent: 'return_policy',
    },
    {
      id: '4',
      user: 'User #1237',
      lastMessage: 'Do you have international shipping?',
      time: '1 hour ago',
      messages: 2,
      resolved: true,
      intent: 'shipping_info',
    },
  ];

  const messages = [
    { role: 'user', text: 'Hi! What sizes do you have for the t-shirts?', time: '10:30 AM' },
    { role: 'bot', text: 'Hello! We have sizes ranging from XS to 3XL for our t-shirts. Which specific t-shirt are you interested in?', time: '10:30 AM' },
    { role: 'user', text: 'The Gradient Graphic T-shirt', time: '10:31 AM' },
    { role: 'bot', text: 'The Gradient Graphic T-shirt is available in Small, Medium, Large, and XL. Would you like to know about the fit or measurements?', time: '10:31 AM' },
    { role: 'user', text: 'What are the measurements for Large?', time: '10:32 AM' },
    { role: 'bot', text: 'For size Large:\n• Chest: 42 inches\n• Length: 29 inches\n• Shoulder: 18 inches\n\nWould you like help with anything else?', time: '10:32 AM' },
  ];

  const selectedConversation = conversations.find((c) => c.id === selectedConv);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/chatbot" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Conversation Logs</h1>
          <p className="text-gray-600 mt-1">View all chatbot conversations</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conversations List */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Search */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm"
                />
              </div>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm">
                <option>All Conversations</option>
                <option>Resolved</option>
                <option>Unresolved</option>
                <option>With Fallbacks</option>
              </select>
            </div>

            {/* Conversations */}
            <div className="overflow-y-auto max-h-[600px]">
              {conversations.map((conv) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConv(conv.id)}
                  className={`p-4 border-b border-gray-200 cursor-pointer transition hover:bg-gray-50 ${
                    selectedConv === conv.id ? 'bg-blue-50 border-l-4 border-l-[#4880FF]' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {conv.user.slice(-4)}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-[#202224]">{conv.user}</p>
                        <p className="text-xs text-gray-500">{conv.messages} messages</p>
                      </div>
                    </div>
                    {conv.resolved ? (
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    ) : (
                      <Clock className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-2">{conv.lastMessage}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded-full font-semibold text-gray-700">
                      {conv.intent}
                    </span>
                    <span className="text-xs text-gray-500">{conv.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Conversation Detail */}
        <div className="lg:col-span-2">
          {selectedConversation ? (
            <div className="bg-white rounded-xl border border-gray-200 h-full flex flex-col">
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                      {selectedConversation.user.slice(-4)}
                    </div>
                    <div>
                      <p className="font-bold text-lg">{selectedConversation.user}</p>
                      <p className="text-sm text-gray-600">Intent: {selectedConversation.intent}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {selectedConversation.resolved ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        Resolved
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold">
                        Unresolved
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex gap-3 ${msg.role === 'bot' ? 'justify-end' : ''}`}>
                    {msg.role === 'user' && (
                      <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                        U
                      </div>
                    )}
                    <div className={`flex-1 max-w-xl ${msg.role === 'bot' ? 'flex flex-col items-end' : ''}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-gray-500">{msg.time}</span>
                      </div>
                      <div
                        className={`rounded-lg p-4 ${
                          msg.role === 'user' ? 'bg-gray-100' : 'bg-[#4880FF] text-white'
                        }`}
                      >
                        <p className="text-sm whitespace-pre-line">{msg.text}</p>
                      </div>
                    </div>
                    {msg.role === 'bot' && (
                      <div className="w-8 h-8 bg-[#4880FF] rounded-full flex-shrink-0 flex items-center justify-center text-white text-xs font-bold">
                        AI
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">
                      <strong>Confidence Score:</strong> 0.95 | <strong>Processing Time:</strong> 1.2s
                    </p>
                  </div>
                  <button className="px-4 py-2 text-sm font-semibold text-[#4880FF] hover:bg-blue-50 rounded-lg transition">
                    Export
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 h-full flex items-center justify-center">
              <div className="text-center">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a conversation to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
