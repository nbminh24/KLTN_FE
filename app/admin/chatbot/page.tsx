'use client';

import Link from 'next/link';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';

export default function ChatbotPage() {
  const stats = [
    { label: 'Total Conversations', value: '2,456', change: '+12.5%', isPositive: true },
    { label: 'Messages Today', value: '342', change: '+8.2%', isPositive: true },
    { label: 'Fallback Rate', value: '4.2%', change: '-1.3%', isPositive: true },
    { label: 'Avg Response Time', value: '1.2s', change: '-0.3s', isPositive: true },
  ];

  const topIntents = [
    { intent: 'product_inquiry', count: 456, percentage: 28, color: 'bg-blue-500' },
    { intent: 'order_status', count: 389, percentage: 24, color: 'bg-green-500' },
    { intent: 'size_guide', count: 267, percentage: 16, color: 'bg-purple-500' },
    { intent: 'return_policy', count: 198, percentage: 12, color: 'bg-yellow-500' },
    { intent: 'payment_issue', count: 145, percentage: 9, color: 'bg-red-500' },
    { intent: 'shipping_info', count: 123, percentage: 7, color: 'bg-pink-500' },
  ];

  const unansweredQuestions = [
    { message: 'Can I return after 45 days?', count: 12, date: '2024-01-15' },
    { message: 'Do you ship to Vietnam?', count: 8, date: '2024-01-15' },
    { message: 'What about wholesale pricing?', count: 6, date: '2024-01-14' },
    { message: 'Can I change my order?', count: 5, date: '2024-01-14' },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Chatbot Analytics</h1>
          <p className="text-gray-600 mt-1">Monitor AI chatbot performance (Rasa)</p>
        </div>
        <Link
          href="/admin/chatbot/conversations"
          className="px-4 py-2.5 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
        >
          All Conversations
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
          <h2 className="text-xl font-bold mb-6">Top Intents</h2>
          <div className="space-y-4">
            {topIntents.map((item, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold">{item.intent.replace(/_/g, ' ')}</span>
                  <span className="text-sm text-gray-600">{item.count} times ({item.percentage}%)</span>
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

        {/* Unanswered Questions */}
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Unanswered Questions</h2>
            <Link href="/admin/chatbot/conversations?tab=unanswered" className="text-sm text-[#4880FF] font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {unansweredQuestions.map((item, i) => (
              <div key={i} className="p-4 border border-yellow-200 bg-yellow-50 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{item.message}</p>
                    <div className="flex items-center gap-3 mt-2 text-xs text-gray-600">
                      <span>Asked {item.count} times</span>
                      <span>•</span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
