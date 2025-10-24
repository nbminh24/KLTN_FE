'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, Download } from 'lucide-react';

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const orders = [
    {
      id: 'ORD-00001',
      customer: 'Christine Brooks',
      date: '2024-01-15',
      items: 3,
      total: 467,
      status: 'Delivered',
      statusColor: 'bg-green-500',
    },
    {
      id: 'ORD-00002',
      customer: 'Rosie Pearson',
      date: '2024-01-14',
      items: 2,
      total: 325,
      status: 'Processing',
      statusColor: 'bg-blue-500',
    },
    {
      id: 'ORD-00003',
      customer: 'Darrell Caldwell',
      date: '2024-01-14',
      items: 1,
      total: 240,
      status: 'Pending',
      statusColor: 'bg-yellow-500',
    },
    {
      id: 'ORD-00004',
      customer: 'Gilbert Johnston',
      date: '2024-01-13',
      items: 4,
      total: 892,
      status: 'Shipped',
      statusColor: 'bg-purple-500',
    },
    {
      id: 'ORD-00005',
      customer: 'Alan Cain',
      date: '2024-01-13',
      items: 2,
      total: 456,
      status: 'Cancelled',
      statusColor: 'bg-red-500',
    },
  ];

  const stats = [
    { label: 'Total Orders', value: '10,293', color: 'text-blue-600' },
    { label: 'Pending', value: '2,040', color: 'text-yellow-600' },
    { label: 'Processing', value: '1,523', color: 'text-blue-600' },
    { label: 'Delivered', value: '6,230', color: 'text-green-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Orders</h1>
          <p className="text-gray-600 mt-1">Manage customer orders</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
          <Download className="w-4 h-4" />
          <span className="font-semibold text-sm">Export</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-gray-200">
            <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 border border-gray-200">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Order ID or Customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input
            type="date"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F1F4F9] border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Items</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Total</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-sm text-[#202224]">{order.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.date}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#202224]">${order.total}</td>
                  <td className="px-6 py-4">
                    <span className={`${order.statusColor} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition text-sm font-semibold"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 1-5 of 10,293</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Previous
            </button>
            <button className="px-4 py-2 bg-[#4880FF] text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">3</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
