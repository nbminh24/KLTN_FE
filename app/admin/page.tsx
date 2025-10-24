'use client';

import { ArrowUp, ArrowDown, TrendingUp, Package, DollarSign, ShoppingCart, Users } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: '40,689',
      change: '+8.5%',
      isPositive: true,
      subtitle: 'Up from yesterday',
      icon: <Users className="w-7 h-7" />,
      color: 'bg-blue-500',
    },
    {
      title: 'Total Orders',
      value: '10,293',
      change: '+1.3%',
      isPositive: true,
      subtitle: 'Up from past week',
      icon: <ShoppingCart className="w-7 h-7" />,
      color: 'bg-yellow-500',
    },
    {
      title: 'Total Sales',
      value: '$89,000',
      change: '-4.3%',
      isPositive: false,
      subtitle: 'Down from yesterday',
      icon: <DollarSign className="w-7 h-7" />,
      color: 'bg-green-500',
    },
    {
      title: 'Total Pending',
      value: '2,040',
      change: '+1.8%',
      isPositive: true,
      subtitle: 'Up from yesterday',
      icon: <Package className="w-7 h-7" />,
      color: 'bg-orange-500',
    },
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'Christine Brooks',
      product: 'Apple Watch',
      location: '089 Kutch Green Apt. 448',
      date: '04 Sep 2019',
      amount: '$34,295',
      quantity: 423,
      status: 'Delivered',
      statusColor: 'bg-green-500',
    },
    {
      id: 'ORD-002',
      customer: 'Rosie Pearson',
      product: 'Apple Watch',
      location: '979 Immanuel Ferry Suite 526',
      date: '28 May 2019',
      amount: '$34,295',
      quantity: 423,
      status: 'Pending',
      statusColor: 'bg-yellow-500',
    },
    {
      id: 'ORD-003',
      customer: 'Darrell Caldwell',
      product: 'Apple Watch',
      location: '8587 Frida Ports',
      date: '23 Nov 2019',
      amount: '$34,295',
      quantity: 423,
      status: 'Rejected',
      statusColor: 'bg-red-500',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#202224]">Dashboard</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
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
              {stat.isPositive ? (
                <ArrowUp className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDown className="w-4 h-4 text-red-600" />
              )}
              <span
                className={`text-sm font-semibold ${
                  stat.isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-sm text-gray-600">{stat.subtitle}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-[#202224]">Sales Details</h2>
            <select className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm text-gray-600">
              <option>October</option>
              <option>November</option>
              <option>December</option>
            </select>
          </div>
          {/* Mock Chart */}
          <div className="h-64 flex items-end justify-between gap-2">
            {[30, 50, 45, 60, 55, 70, 65, 80, 75, 60, 85, 90].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-[#4880FF] to-blue-300 rounded-t-lg relative group"
                style={{ height: `${height}%` }}
              >
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#4880FF] text-white px-2 py-1 rounded text-xs font-semibold opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  ${(height * 100).toFixed(0)}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Jan</span>
            <span>Feb</span>
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span>Aug</span>
            <span>Sep</span>
            <span>Oct</span>
            <span>Nov</span>
            <span>Dec</span>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-[#202224] mb-6">Top Selling Products</h2>
          <div className="space-y-4">
            {[
              { name: 'Gradient Graphic T-shirt', sales: 245, revenue: '$12,450', trend: '+12%' },
              { name: 'Checkered Shirt', sales: 189, revenue: '$9,870', trend: '+8%' },
              { name: 'Skinny Fit Jeans', sales: 167, revenue: '$8,340', trend: '+5%' },
              { name: 'Classic Hoodie', sales: 142, revenue: '$7,120', trend: '+3%' },
              { name: 'Polo T-Shirt', sales: 128, revenue: '$6,400', trend: '-2%' },
            ].map((product, i) => (
              <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                <div className="flex items-center gap-3 flex-1">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div>
                    <p className="font-semibold text-sm text-[#202224]">{product.name}</p>
                    <p className="text-xs text-gray-600">{product.sales} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-[#202224]">{product.revenue}</p>
                  <p className={`text-xs font-semibold ${product.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {product.trend}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-[#202224]">Deals Details</h2>
            <Link
              href="/admin/orders"
              className="text-sm font-semibold text-[#4880FF] hover:underline"
            >
              View All Orders
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F1F4F9]">
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Product Name</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Location</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Date - Time</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Piece</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                      <span className="font-semibold text-sm text-[#202224]">{order.product}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.location}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.quantity}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#202224]">{order.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`${order.statusColor} text-white px-4 py-1.5 rounded-full text-xs font-bold`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
