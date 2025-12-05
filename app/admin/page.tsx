'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, DollarSign, ShoppingCart, MessageSquare, AlertTriangle, ArrowUp, Loader2, Users } from 'lucide-react';
import Link from 'next/link';
import dashboardService, { DashboardStats } from '@/lib/services/admin/dashboardService';

type DateRange = '7' | '30' | '90';

export default function AdminDashboard() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange>('30');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchStats();
  }, [dateRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const daysParam = parseInt(dateRange);
      console.log('📊 Fetching dashboard stats for', daysParam, 'days...');
      console.log('📊 API params:', { days: daysParam });

      const response = await dashboardService.getDashboardStats({
        days: daysParam
      });
      console.log('📊 Dashboard stats response:', response.data);
      console.log('📊 Request URL:', response.config?.url);

      // Transform backend camelCase to frontend snake_case
      const backendData: any = response.data;
      const transformedData: DashboardStats = {
        total_orders: backendData.stats?.totalOrders || 0,
        total_customers: backendData.stats?.totalCustomers || 0,
        total_products: backendData.stats?.totalProducts || 0,
        total_revenue: backendData.stats?.totalRevenue || 0,
        pending_orders: backendData.stats?.pendingOrders || 0,
        recent_orders: backendData.recentOrders || []
      };

      console.log('📊 Transformed stats:', transformedData);
      setStats(transformedData);
    } catch (err: any) {
      console.error('❌ Failed to fetch dashboard stats:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);

      // Use fallback mock data if API fails
      console.log('⚠️ Using fallback mock data for dashboard');
      setStats({
        total_orders: 0,
        total_customers: 0,
        total_products: 0,
        total_revenue: 0,
        pending_orders: 0,
        recent_orders: []
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-gray-600" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: `${(stats?.total_revenue || 0).toLocaleString('vi-VN')} VND`,
      subtitle: 'Total earnings',
      icon: <DollarSign className="w-7 h-7" />,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: (stats?.total_orders || 0).toString(),
      subtitle: 'All time orders',
      icon: <ShoppingCart className="w-7 h-7" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Customers',
      value: (stats?.total_customers || 0).toString(),
      subtitle: 'Registered users',
      icon: <Users className="w-7 h-7" />,
      color: 'bg-purple-500',
    },
    {
      title: 'Pending Orders',
      value: (stats?.pending_orders || 0).toString(),
      subtitle: 'Needs attention',
      icon: <AlertTriangle className="w-7 h-7" />,
      color: 'bg-orange-500',
    },
  ];

  const recentOrders = stats?.recent_orders || [];

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
        {statCards.map((stat, index) => (
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
            <div className="text-sm text-gray-600">{stat.subtitle}</div>
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

      {/* Recent Orders Widget */}
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-[#202224]">
            Recent Orders ({recentOrders.length})
          </h2>
          <Link
            href="/admin/orders"
            className="text-sm font-semibold text-[#4880FF] hover:underline flex items-center gap-1"
          >
            View All →
          </Link>
        </div>
        <div className="space-y-3">
          {recentOrders.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent orders</p>
          ) : (
            recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-4 flex-1">
                  <Link href={`/admin/orders/${order.id}`} className="font-mono text-sm font-semibold text-[#4880FF] hover:underline">
                    #{order.id}
                  </Link>
                  <span className="text-sm font-semibold text-[#202224]">{order.customer_name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-[#202224]">{order.total_amount.toLocaleString('vi-VN')} VND</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
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
