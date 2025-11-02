'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Clock, CheckCircle, AlertCircle, Send, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react';

interface SupportTicket {
  id: string;
  customerName: string;
  customerEmail: string;
  subject: string;
  message: string;
  status: 'pending' | 'replied' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  aiAttempted: boolean;
}

function SupportInboxContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState<'pending' | 'replied' | 'resolved'>('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Sync tab with URL
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'in-progress') {
      setFilterStatus('replied');
    } else if (tab === 'resolved') {
      setFilterStatus('resolved');
    } else {
      setFilterStatus('pending');
    }
    setCurrentPage(1);
  }, [searchParams]);

  // Mock data - Replace with API calls later
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-001',
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      subject: 'Question about return policy',
      message: 'Hi, I tried asking the chatbot about your return policy for items bought on sale, but I didn\'t get a clear answer. Can you help me understand if sale items are eligible for returns?',
      status: 'pending',
      priority: 'medium',
      createdAt: '2024-01-15T10:30:00',
      aiAttempted: true,
    },
    {
      id: 'TKT-002',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah.j@example.com',
      subject: 'Defective product received',
      message: 'I received a jacket with a broken zipper. The AI chatbot suggested I contact support for a replacement. Order #12345.',
      status: 'pending',
      priority: 'high',
      createdAt: '2024-01-15T11:45:00',
      aiAttempted: true,
    },
    {
      id: 'TKT-003',
      customerName: 'Mike Chen',
      customerEmail: 'mike.chen@example.com',
      subject: 'Bulk order inquiry',
      message: 'I want to place a bulk order of 100+ shirts for my company. The chatbot suggested I reach out to you for corporate pricing.',
      status: 'replied',
      priority: 'high',
      createdAt: '2024-01-14T14:20:00',
      aiAttempted: true,
    },
    {
      id: 'TKT-004',
      customerName: 'Emily Brown',
      customerEmail: 'emily.b@example.com',
      subject: 'Size chart confusion',
      message: 'The AI couldn\'t clarify the difference between Asian and US sizing for your products. Can you provide more details?',
      status: 'resolved',
      priority: 'low',
      createdAt: '2024-01-13T09:15:00',
      aiAttempted: true,
    },
  ]);

  const handleSendReply = () => {
    if (!selectedTicket || !replyMessage.trim()) return;

    // Update ticket status
    setTickets(tickets.map(t => 
      t.id === selectedTicket.id 
        ? { ...t, status: 'replied' as const }
        : t
    ));

    alert(`Email sent to ${selectedTicket.customerEmail}\n\nYour reply:\n${replyMessage}`);
    setReplyMessage('');
    setSelectedTicket(null);
  };

  const handleMarkResolved = (ticketId: string) => {
    setTickets(tickets.map(t => 
      t.id === ticketId 
        ? { ...t, status: 'resolved' as const }
        : t
    ));
  };

  const handleDeleteTicket = (ticketId: string) => {
    if (confirm('Are you sure you want to delete this ticket?')) {
      setTickets(tickets.filter(t => t.id !== ticketId));
      if (selectedTicket?.id === ticketId) {
        setSelectedTicket(null);
      }
    }
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesStatus = ticket.status === filterStatus;
    const matchesSearch = ticket.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filterStatus, searchQuery]);

  const handleTabChange = (status: 'pending' | 'replied' | 'resolved') => {
    setFilterStatus(status);
    if (status === 'pending') {
      router.push('/admin/support-inbox');
    } else if (status === 'replied') {
      router.push('/admin/support-inbox?tab=in-progress');
    } else if (status === 'resolved') {
      router.push('/admin/support-inbox?tab=resolved');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'replied':
        return 'bg-blue-100 text-blue-700';
      case 'resolved':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-orange-100 text-orange-700';
      case 'low':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const stats = {
    pending: tickets.filter(t => t.status === 'pending').length,
    replied: tickets.filter(t => t.status === 'replied').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    aiEscalated: tickets.filter(t => t.aiAttempted).length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#202224]">Support Inbox</h1>
        <p className="text-gray-600 mt-1">Manage customer support requests escalated from AI chatbot</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-10 h-10 text-yellow-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Replied</p>
              <p className="text-3xl font-bold text-blue-600">{stats.replied}</p>
            </div>
            <Mail className="w-10 h-10 text-blue-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Resolved</p>
              <p className="text-3xl font-bold text-green-600">{stats.resolved}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-600 opacity-20" />
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">AI Escalated</p>
              <p className="text-3xl font-bold text-purple-600">{stats.aiEscalated}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-purple-600 opacity-20" />
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex items-center gap-4 border-b border-gray-200 px-4">
          <button
            onClick={() => handleTabChange('pending')}
            className={`px-4 py-3 font-semibold transition relative ${
              filterStatus === 'pending'
                ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => handleTabChange('replied')}
            className={`px-4 py-3 font-semibold transition relative ${
              filterStatus === 'replied'
                ? 'text-[#4880FF] border-b-2 border-[#4880FF]'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => handleTabChange('resolved')}
            className={`px-4 py-3 font-semibold transition relative ${
              filterStatus === 'resolved'
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                onClick={() => setSelectedTicket(ticket)}
                className={`bg-white border-2 rounded-xl p-5 cursor-pointer transition hover:shadow-lg ${
                  selectedTicket?.id === ticket.id
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
                    <p className="text-sm text-gray-600">{ticket.customerName} • {ticket.customerEmail}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(ticket.status)}`}>
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteTicket(ticket.id);
                    }}
                    className="text-red-600 hover:text-red-800 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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

        {/* Ticket Detail & Reply */}
        <div className="sticky top-6">
          {selectedTicket ? (
            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#4880FF] to-blue-600 text-white p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-sm opacity-90 mb-1">{selectedTicket.id}</p>
                    <h2 className="text-2xl font-bold">{selectedTicket.subject}</h2>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPriorityColor(selectedTicket.priority)}`}>
                    {selectedTicket.priority} priority
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4" />
                  <span>{selectedTicket.customerEmail}</span>
                </div>
              </div>

              {/* Customer Message */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                    {selectedTicket.customerName[0]}
                  </div>
                  <div>
                    <p className="font-bold">{selectedTicket.customerName}</p>
                    <p className="text-xs text-gray-600">
                      {new Date(selectedTicket.createdAt).toLocaleDateString()} at {new Date(selectedTicket.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                {selectedTicket.aiAttempted && (
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-purple-900">AI Chatbot Attempted</p>
                        <p className="text-xs text-purple-700 mt-1">
                          Customer tried the AI chatbot first but couldn't get a satisfactory answer
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                <p className="text-gray-800 whitespace-pre-wrap">{selectedTicket.message}</p>
              </div>

              {/* Reply Section */}
              <div className="p-6">
                <h3 className="font-bold mb-3">Reply via Email</h3>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your response here..."
                  rows={8}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] mb-4"
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleSendReply}
                    disabled={!replyMessage.trim()}
                    className="flex-1 bg-[#4880FF] text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <Send className="w-5 h-5" />
                    Send Reply
                  </button>
                  {selectedTicket.status !== 'resolved' && (
                    <button
                      onClick={() => handleMarkResolved(selectedTicket.id)}
                      className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      Resolve
                    </button>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No Ticket Selected</h3>
              <p className="text-gray-600">Select a ticket from the list to view details and reply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SupportInboxPage() {
  return (
    <Suspense fallback={
      <div className="p-6">
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[#4880FF] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading support inbox...</p>
          </div>
        </div>
      </div>
    }>
      <SupportInboxContent />
    </Suspense>
  );
}
