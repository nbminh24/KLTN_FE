'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Search, X, MessageSquare, Bot, User } from 'lucide-react';

type Tab = 'all' | 'unanswered';

interface Message {
  role: 'user' | 'bot';
  text: string;
  time: string;
}

interface Conversation {
  id: string;
  customer: string;
  status: string;
  intents: string[];
  messages: number;
  time: string;
  fullConversation: Message[];
}

function ConversationsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<Tab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterIntent, setFilterIntent] = useState<string>('all');
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

  // Read tab from query parameter
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'unanswered') {
      setActiveTab('unanswered');
    } else {
      setActiveTab('all');
    }
  }, [searchParams]);

  const conversations: Conversation[] = [
    {
      id: '1',
      customer: 'John Smith',
      status: 'Resolved',
      intents: ['Product Inquiry', 'Size Guide'],
      messages: 12,
      time: '2h ago',
      fullConversation: [
        { role: 'user', text: 'Hi! What sizes do you have for the t-shirts?', time: '10:30 AM' },
        { role: 'bot', text: 'Hello! We have sizes ranging from XS to 3XL for our t-shirts. Which specific t-shirt are you interested in?', time: '10:30 AM' },
        { role: 'user', text: 'The Gradient Graphic T-shirt', time: '10:31 AM' },
        { role: 'bot', text: 'The Gradient Graphic T-shirt is available in Small, Medium, Large, and XL. Would you like to know about the fit or measurements?', time: '10:31 AM' },
        { role: 'user', text: 'What are the measurements for Large?', time: '10:32 AM' },
        { role: 'bot', text: 'For size Large:\n• Chest: 42 inches\n• Length: 29 inches\n• Shoulder: 18 inches', time: '10:32 AM' },
      ],
    },
    {
      id: '2',
      customer: 'Sarah Johnson',
      status: 'Unresolved',
      intents: ['Shipping Info'],
      messages: 5,
      time: '3h ago',
      fullConversation: [
        { role: 'user', text: 'Do you ship internationally?', time: '09:15 AM' },
        { role: 'bot', text: '[No answer - Fallback]', time: '09:15 AM' },
        { role: 'user', text: 'What about shipping to Vietnam?', time: '09:16 AM' },
        { role: 'bot', text: '[No answer - Fallback]', time: '09:16 AM' },
      ],
    },
    {
      id: '3',
      customer: 'Mike Chen',
      status: 'Resolved',
      intents: ['Order Status', 'Payment'],
      messages: 8,
      time: '5h ago',
      fullConversation: [
        { role: 'user', text: 'Where is my order #12345?', time: '08:00 AM' },
        { role: 'bot', text: 'Let me check that for you. Your order #12345 is currently in transit and expected to arrive in 2-3 business days.', time: '08:00 AM' },
        { role: 'user', text: 'Can I change the payment method?', time: '08:02 AM' },
        { role: 'bot', text: 'Unfortunately, payment methods cannot be changed after an order is placed. However, you can cancel and reorder if needed.', time: '08:02 AM' },
      ],
    },
    {
      id: '4',
      customer: 'Emily Davis',
      status: 'Unresolved',
      intents: ['Return Policy'],
      messages: 3,
      time: '6h ago',
      fullConversation: [
        { role: 'user', text: 'Can I return after 45 days?', time: '07:30 AM' },
        { role: 'bot', text: '[No answer - Fallback]', time: '07:30 AM' },
      ],
    },
    {
      id: '5',
      customer: 'David Wilson',
      status: 'Escalated',
      intents: ['Payment', 'Order Status'],
      messages: 15,
      time: '8h ago',
      fullConversation: [
        { role: 'user', text: 'My payment was charged twice!', time: '06:00 AM' },
        { role: 'bot', text: 'I apologize for the inconvenience. Let me escalate this to our support team immediately.', time: '06:00 AM' },
        { role: 'user', text: 'This is urgent, I need a refund now!', time: '06:01 AM' },
        { role: 'bot', text: 'I understand your concern. A support agent will contact you within 1 hour to resolve this issue.', time: '06:01 AM' },
      ],
    },
    {
      id: '6',
      customer: 'Lisa Anderson',
      status: 'Resolved',
      intents: ['Product Inquiry'],
      messages: 6,
      time: '1d ago',
      fullConversation: [
        { role: 'user', text: 'Is the hoodie made of cotton?', time: 'Yesterday' },
        { role: 'bot', text: 'Yes! Our hoodies are made of 100% premium cotton for maximum comfort.', time: 'Yesterday' },
        { role: 'user', text: 'Great, thank you!', time: 'Yesterday' },
        { role: 'bot', text: 'You\'re welcome! Let me know if you need anything else.', time: 'Yesterday' },
      ],
    },
  ];

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    // Tab filter
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'unanswered' && conv.status === 'Unresolved');
    
    // Search filter
    const matchesSearch = conv.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         conv.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || conv.status === filterStatus;
    
    // Intent filter
    const matchesIntent = filterIntent === 'all' || 
                         conv.intents.some(intent => intent === filterIntent);
    
    return matchesTab && matchesSearch && matchesStatus && matchesIntent;
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
          <h1 className="text-3xl font-bold text-[#202224]">Conversation Logs</h1>
          <p className="text-gray-600 mt-1">View all chatbot conversations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-4 border-b border-gray-200">
        <button
          onClick={() => {
            setActiveTab('all');
            router.push('/admin/chatbot/conversations');
          }}
          className={`px-4 py-3 font-semibold transition relative ${
            activeTab === 'all'
              ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          All
        </button>
        <button
          onClick={() => {
            setActiveTab('unanswered');
            router.push('/admin/chatbot/conversations?tab=unanswered');
          }}
          className={`px-4 py-3 font-semibold transition relative ${
            activeTab === 'unanswered'
              ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Unanswered Questions
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by ID or customer name..."
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
            <option value="all">All Status</option>
            <option value="Resolved">Resolved</option>
            <option value="Unresolved">Unresolved</option>
            <option value="Escalated">Escalated</option>
          </select>
          <select
            value={filterIntent}
            onChange={(e) => setFilterIntent(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm"
          >
            <option value="all">All Intents</option>
            <option value="Product Inquiry">Product Inquiry</option>
            <option value="Order Status">Order Status</option>
            <option value="Shipping Info">Shipping Info</option>
            <option value="Return Policy">Return Policy</option>
            <option value="Payment">Payment</option>
            <option value="Size Guide">Size Guide</option>
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
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Intents</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Messages</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredConversations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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
                      <span className="text-sm font-semibold text-[#202224]">
                        {conv.customer}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(conv.status)}`}>
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
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedConversation.status)}`}>
                  {selectedConversation.status}
                </span>
                {selectedConversation.intents.map((intent, i) => (
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
              {activeTab === 'unanswered' ? (
                // Q&A Pairs for Unanswered tab
                <div className="space-y-6">
                  <h3 className="font-bold text-lg text-[#202224] mb-4">Unanswered Questions</h3>
                  {selectedConversation.fullConversation
                    .filter((msg) => msg.role === 'user' || msg.text.includes('[No answer'))
                    .reduce((acc: Message[][], msg, i, arr) => {
                      if (msg.role === 'user') {
                        const nextMsg = arr[i + 1];
                        if (nextMsg && nextMsg.text.includes('[No answer')) {
                          acc.push([msg, nextMsg]);
                        }
                      }
                      return acc;
                    }, [])
                    .map((pair, i) => (
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
                  {selectedConversation.fullConversation.map((msg, i) => (
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
