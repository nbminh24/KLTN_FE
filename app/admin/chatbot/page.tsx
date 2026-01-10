'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import adminChatbotService from '@/lib/services/adminChatbotService';
import handoffService from '@/lib/services/handoffService';

interface Stat {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

interface Intent {
  intent: string;
  count: number;
  percentage: number;
  color: string;
}

interface HumanChat {
  session_id: number;
  customer: {
    id: number;
    name: string;
    email: string;
  } | null;
  visitor_id: string | null;
  status: 'human_pending' | 'human_active';
  handoff_reason: string | null;
  lastMessage?: string;
  time: string;
  messageCount?: number;
}

const INTENT_COLORS: { [key: string]: string } = {
  'product_inquiry': 'bg-blue-500',
  'order_status': 'bg-green-500',
  'check_product_availability': 'bg-purple-500',
  'ask_styling_advice': 'bg-yellow-500',
  'ask_sizing_advice': 'bg-red-500',
  'check_discount': 'bg-pink-500',
  'ask_shipping_info': 'bg-indigo-500',
  'ask_return_policy': 'bg-orange-500',
  'request_human_agent': 'bg-teal-500',
};

export default function ChatbotPage() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [topIntents, setTopIntents] = useState<Intent[]>([]);
  const [activeHumanChats, setActiveHumanChats] = useState<HumanChat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const [analyticsRes, intentsRes, pendingRes] = await Promise.allSettled([
        adminChatbotService.getAnalytics(),
        adminChatbotService.getTopIntents(6),
        handoffService.getPendingConversations(),
      ]);

      if (analyticsRes.status === 'fulfilled') {
        const data = analyticsRes.value.data;
        const overview = data.overview || {};

        setStats([
          {
            label: 'Tổng Hội Thoại',
            value: overview.total_sessions?.toLocaleString() || '0',
            change: '+12.5%',
            isPositive: true
          },
          {
            label: 'Tổng Tin Nhắn',
            value: overview.total_messages?.toLocaleString() || '0',
            change: '+8.2%',
            isPositive: true
          },
          {
            label: 'TB Tin Nhắn/Phiên',
            value: overview.avg_messages?.toFixed(1) || '0',
            change: '+5.3%',
            isPositive: true
          },
          {
            label: 'Hoạt Động Hôm Nay',
            value: data.daily_activity?.length?.toString() || '0',
            change: '+15%',
            isPositive: true
          },
        ]);
      } else {
        console.error('❌ [Dashboard] Analytics API failed:', analyticsRes);
      }

      if (intentsRes.status === 'fulfilled') {
        const data = intentsRes.value.data.intents || [];
        setTopIntents(data.map((item: any) => ({
          intent: item.intent,
          count: item.count,
          percentage: item.percentage,
          color: INTENT_COLORS[item.intent] || 'bg-gray-500'
        })));
      }

      if (pendingRes.status === 'fulfilled') {
        const conversations = pendingRes.value.data.conversations || [];
        setActiveHumanChats(conversations.slice(0, 4).map((conv: any) => ({
          session_id: conv.session_id,
          customer: conv.customer,
          visitor_id: conv.visitor_id,
          status: 'human_pending',
          handoff_reason: conv.handoff_reason,
          lastMessage: conv.handoff_reason || 'Requesting human support',
          time: getRelativeTime(conv.handoff_requested_at),
          messageCount: 0,
        })));
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Unable to load dashboard data');
    } finally {
      setLoading(false);
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

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#4880FF] mx-auto mb-4" />
          <p className="text-gray-600">Đang tải bảng điều khiển...</p>
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
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
          >
            Thử Lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Thống Kê Chatbot</h1>
          <p className="text-gray-600 mt-1">Theo dõi hiệu suất của chatbot AI (Rasa)</p>
        </div>
        <Link
          href="/admin/chatbot/conversations"
          className="px-4 py-2.5 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          Tất Cả Hội Thoại
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-6 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className="text-3xl font-bold text-[#202224] mb-2">{stat.value}</p>
            <div className="flex items-center gap-1">
              {stat.isPositive ? (
                <TrendingUp className="w-4 h-4 text-green-600" />
              ) : (
                <TrendingDown className="w-4 h-4 text-red-600" />
              )}
              <span className={`text-sm font-semibold ${stat.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top Intents */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <h2 className="text-xl font-bold mb-6">Ý Định Phổ Biến</h2>
          <div className="space-y-4">
            {topIntents.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{item.intent.replace(/_/g, ' ')}</span>
                  <span className="text-sm text-gray-600">{item.count} lần ({item.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full transition-all`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Human Chat Sessions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Hỗ Trợ Trực Tiếp</h2>
            <Link href="/admin/chatbot/conversations" className="text-sm text-[#4880FF] font-semibold hover:underline">
              Xem Tất Cả
            </Link>
          </div>
          <div className="space-y-3">
            {activeHumanChats.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Không có hỗ trợ trực tiếp nào</p>
            ) : (
              activeHumanChats.map((chat) => (
                <Link
                  key={chat.session_id}
                  href={`/admin/chatbot/chat/${chat.session_id}`}
                  className="block p-4 border border-gray-200 bg-gray-50 rounded-lg hover:bg-blue-50 hover:border-[#4880FF] transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-bold text-gray-800">
                          {chat.customer?.name || `Visitor ${chat.visitor_id}`}
                        </p>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${chat.status === 'human_active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                          }`}>
                          {chat.status === 'human_active' ? 'Active' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-1">{chat.lastMessage}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
                        <span>{chat.time}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
