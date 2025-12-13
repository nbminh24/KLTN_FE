'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, DollarSign, ShoppingCart, MessageSquare, AlertTriangle, ArrowUp, Loader2, Users, TrendingDown } from 'lucide-react';
import Link from 'next/link';
import dashboardService, { DashboardStats, RevenueTrendResponse, OrderStatusDistributionResponse } from '@/lib/services/admin/dashboardService';
import { CartesianGrid, Line, LineChart, XAxis, Pie, PieChart, Cell, Legend, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/line-chart";
import { Badge } from "@/components/ui/badge";

type DateRange = '7' | '30' | '90';

export default function AdminDashboard() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange>('30');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [revenueTrendData, setRevenueTrendData] = useState<RevenueTrendResponse | null>(null);
  const [orderStatusData, setOrderStatusData] = useState<OrderStatusDistributionResponse | null>(null);
  const [chartsLoading, setChartsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    fetchStats();
    fetchChartsData();
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

  const fetchChartsData = async () => {
    try {
      setChartsLoading(true);
      const daysParam = parseInt(dateRange);
      console.log('📈 Fetching charts data for', daysParam, 'days...');

      // Fetch both chart APIs in parallel
      const [revenueTrendResponse, orderStatusResponse] = await Promise.all([
        dashboardService.getRevenueOrdersTrend({ days: daysParam }),
        dashboardService.getOrderStatusDistribution({ days: daysParam })
      ]);

      console.log('📈 Revenue Trend Response:', revenueTrendResponse.data);
      console.log('📊 Order Status Response:', orderStatusResponse.data);
      console.log('📈 Daily Stats Sample:', revenueTrendResponse.data.data?.dailyStats?.slice(0, 3));

      setRevenueTrendData(revenueTrendResponse.data.data);
      setOrderStatusData(orderStatusResponse.data.data);
    } catch (err: any) {
      console.error('❌ Failed to fetch charts data:', err);
      console.error('❌ Error response:', err.response?.data);
      console.error('❌ Error status:', err.response?.status);
    } finally {
      setChartsLoading(false);
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

  // Line Chart Data - Use real data from API or fallback
  const lineChartData = revenueTrendData?.dailyStats || [];
  const revenueGrowth = revenueTrendData?.summary?.revenueGrowth || 0;

  // Generate X-axis ticks based on date range
  const getXAxisTicks = () => {
    const days = parseInt(dateRange);
    if (days === 7) {
      return ['Day 1', 'Day 4', 'Day 7'];
    } else if (days === 30) {
      return ['Day 1', 'Day 10', 'Day 20', 'Day 30'];
    } else if (days === 90) {
      return ['Day 1', 'Day 30', 'Day 60', 'Day 90'];
    }
    return [];
  };

  const chartConfig = {
    revenue: {
      label: "Revenue (M VND)",
      color: "#4880FF",
    },
    orders: {
      label: "Orders",
      color: "#10b981",
    },
  } satisfies ChartConfig;

  // Pie Chart Data - Use real data from API or fallback
  const pieChartData = orderStatusData?.distribution || [];

  const pieChartConfig = {
    completed: {
      label: "Completed",
      color: "#10b981",
    },
    processing: {
      label: "Processing",
      color: "#3b82f6",
    },
    pending: {
      label: "Pending",
      color: "#f59e0b",
    },
    cancelled: {
      label: "Cancelled",
      color: "#ef4444",
    },
  } satisfies ChartConfig;

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

      {/* Charts Row - 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart - Line Chart */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-[#202224]">
              Sales Overview
              {revenueGrowth !== 0 && (
                <Badge
                  variant="outline"
                  className={`${revenueGrowth >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'} border-none ml-2`}
                >
                  {revenueGrowth >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{revenueGrowth >= 0 ? '+' : ''}{revenueGrowth.toFixed(1)}%</span>
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Daily revenue for the last {dateRange} days</CardDescription>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <div className="flex items-center justify-center h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : lineChartData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[400px] w-full">
                <LineChart
                  data={lineChartData}
                  margin={{
                    top: 10,
                    left: 12,
                    right: 12,
                    bottom: 10,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    interval="preserveStartEnd"
                    minTickGap={30}
                    tickFormatter={(value) => {
                      if (typeof value === 'string' && value.startsWith('Day ')) {
                        return value.replace('Day ', '');
                      }
                      return value;
                    }}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Line
                    dataKey="revenueInMillions"
                    type="monotone"
                    stroke="var(--color-revenue)"
                    strokeWidth={2}
                    dot={false}
                  />
                  <Line
                    dataKey="ordersCount"
                    type="monotone"
                    stroke="var(--color-orders)"
                    strokeWidth={2}
                    dot={false}
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Order Status Distribution - Pie Chart */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-xl text-[#202224]">
              Order Status Distribution
            </CardTitle>
            <CardDescription>Current order breakdown by status</CardDescription>
          </CardHeader>
          <CardContent>
            {chartsLoading ? (
              <div className="flex items-center justify-center h-[350px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : pieChartData.length > 0 ? (
              <>
                <ChartContainer config={pieChartConfig} className="mx-auto h-[350px]">
                  <PieChart>
                    <ChartTooltip
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow-lg">
                            <p className="font-semibold text-sm">{data.statusLabel}</p>
                            <p className="text-xs text-gray-600">{data.count} orders</p>
                          </div>
                        );
                      }}
                    />
                    <Pie
                      data={pieChartData as any}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(props: any) => `${props.statusLabel}: ${props.count}`}
                      outerRadius={110}
                      innerRadius={60}
                      fill="#8884d8"
                      dataKey="count"
                      paddingAngle={2}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>
                {/* Legend */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  {pieChartData.map((item) => (
                    <div key={item.status} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                      <span className="text-sm text-gray-700">
                        <span className="font-semibold">{item.statusLabel}</span>: {item.count}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-[350px] text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
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
