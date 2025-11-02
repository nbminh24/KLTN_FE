'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, DollarSign, ShoppingCart, MessageSquare, AlertTriangle, ArrowUp } from 'lucide-react';
import Link from 'next/link';

type DateRange = '7' | '30' | '90';

export default function AdminDashboard() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange>('30');

  // Calculate stats (mock data)
  const totalRevenue = 150000000;
  const newOrders = 450;
  const aov = Math.round(totalRevenue / newOrders);
  const aiResponseRate = 85; // 1 - (Fallbacks + Escalations) / Total Conversations

  const stats = [
    {
      title: 'Total Revenue',
      value: `${totalRevenue.toLocaleString('vi-VN')} VND`,
      change: '+12%',
      subtitle: 'vs previous period',
      icon: <DollarSign className="w-7 h-7" />,
      color: 'bg-green-500',
    },
    {
      title: 'New Orders',
      value: newOrders.toString(),
      change: '+8%',
      subtitle: 'vs previous period',
      icon: <ShoppingCart className="w-7 h-7" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Average Order Value',
      value: `${aov.toLocaleString('vi-VN')} VND`,
      change: '+5%',
      subtitle: 'vs previous period',
      icon: <TrendingUp className="w-7 h-7" />,
      color: 'bg-purple-500',
    },
    {
      title: 'AI Response Rate',
      value: `${aiResponseRate}%`,
      change: '+3%',
      subtitle: 'vs previous period',
      icon: <MessageSquare className="w-7 h-7" />,
      color: 'bg-orange-500',
    },
  ];

  // Pending orders (latest 5)
  const pendingOrders = [
    { id: '#ORD-001', customer: 'Christine Brooks', amount: '500,000 VND', time: '2h ago' },
    { id: '#ORD-002', customer: 'Rosie Pearson', amount: '750,000 VND', time: '3h ago' },
    { id: '#ORD-003', customer: 'Darrell Caldwell', amount: '300,000 VND', time: '5h ago' },
    { id: '#ORD-004', customer: 'Gilbert Johnston', amount: '450,000 VND', time: '6h ago' },
    { id: '#ORD-005', customer: 'Alan Cain', amount: '600,000 VND', time: '8h ago' },
  ];

  // Sales chart data (daily revenue for last 30 days)
  const salesChartData = [
    2.5, 3.2, 2.8, 3.5, 4.1, 3.8, 4.5, 3.9, 4.2, 4.8,
    5.1, 4.7, 5.3, 5.8, 5.5, 6.2, 5.9, 6.5, 6.8, 6.3,
    7.1, 6.9, 7.5, 7.2, 7.8, 8.1, 7.9, 8.5, 8.2, 8.8
  ]; // in millions

  return (
    <div className="p-6 space-y-6">
      {/* Header with Date Range Filter */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-[#202224]">Dashboard</h1>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value as DateRange)}
          className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] font-semibold"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-[#202224]">{stat.value}</h3>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-xl`}>
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-600">
                {stat.change}
              </span>
              <span className="text-sm text-gray-600">{stat.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Sales Chart - Bar Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-bold text-[#202224] mb-6">Sales Overview</h2>
        <div className="h-80 flex items-end justify-between gap-1">
          {salesChartData.map((value, i) => {
            const maxValue = Math.max(...salesChartData);
            const height = (value / maxValue) * 100;
            return (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-[#4880FF] to-blue-400 rounded-t-lg relative group cursor-pointer transition-all hover:from-blue-600 hover:to-blue-500"
                style={{ height: `${height}%` }}
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-[#202224] text-white px-3 py-1.5 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                  {value.toFixed(1)}M VND
                  <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 bg-[#202224] rotate-45"></div>
                </div>
              </div>
            );
          })}
        </div>
        {/* X-axis labels */}
        <div className="flex justify-between mt-4 text-xs text-gray-500">
          <span>Day 1</span>
          <span>Day 10</span>
          <span>Day 20</span>
          <span>Day 30</span>
        </div>
      </div>

      {/* Pending Orders Widget */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#202224]">
            ⚠️ Pending Orders ({pendingOrders.length})
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-[#4880FF] hover:underline flex items-center gap-1"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {pendingOrders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex items-center gap-4 flex-1">
                <span className="font-mono text-sm font-semibold text-[#4880FF]">{order.id}</span>
                <span className="text-sm font-semibold text-[#202224]">{order.customer}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-[#202224]">{order.amount}</span>
                <span className="text-sm text-gray-500">{order.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock Alert Widget */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-4">⚠️ Stock Alert</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-900">23 products are running low on stock</p>
              <p className="text-xs text-yellow-700">Consider restocking these items soon</p>
            </div>
            <button
              onClick={() => router.push('/admin/inventory')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-semibold"
            >
              View Stock
            </button>
          </div>
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">8 products are out of stock</p>
              <p className="text-xs text-red-700">These items need immediate attention</p>
            </div>
            <button
              onClick={() => router.push('/admin/inventory?tab=out-of-stock')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
            >
              View Stock
            </button>
          </div>
        </div>
      </div>

      {/* Support Tickets Widget */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h2 className="text-xl font-bold mb-4">💬 Support Tickets</h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <MessageSquare className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-yellow-900">12 tickets are awaiting response</p>
              <p className="text-xs text-yellow-700">These tickets need attention</p>
            </div>
            <button
              onClick={() => router.push('/admin/support-inbox')}
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition text-sm font-semibold"
            >
              View Inbox
            </button>
          </div>
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-red-900">3 tickets are escalated</p>
              <p className="text-xs text-red-700">High priority tickets</p>
            </div>
            <button
              onClick={() => router.push('/admin/support-inbox')}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition text-sm font-semibold"
            >
              View Inbox
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
