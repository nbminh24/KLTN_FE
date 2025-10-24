'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, CheckCircle, XCircle } from 'lucide-react';

export default function ReturnsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const returns = [
    {
      id: 'RET-001',
      orderId: 'ORD-001',
      customer: 'Christine Brooks',
      product: 'Gradient T-shirt',
      reason: 'Wrong size',
      date: '2024-01-15',
      status: 'Pending',
      amount: 145,
    },
    {
      id: 'RET-002',
      orderId: 'ORD-002',
      customer: 'Rosie Pearson',
      product: 'Checkered Shirt',
      reason: 'Defective item',
      date: '2024-01-14',
      status: 'Approved',
      amount: 180,
    },
    {
      id: 'RET-003',
      orderId: 'ORD-003',
      customer: 'Darrell Caldwell',
      product: 'Skinny Jeans',
      reason: 'Changed mind',
      date: '2024-01-13',
      status: 'Rejected',
      amount: 240,
    },
    {
      id: 'RET-004',
      orderId: 'ORD-004',
      customer: 'Gilbert Johnston',
      product: 'Classic Hoodie',
      reason: 'Not as described',
      date: '2024-01-12',
      status: 'Completed',
      amount: 220,
    },
  ];

  const stats = [
    { label: 'Total Returns', value: '156', color: 'text-blue-600' },
    { label: 'Pending', value: '42', color: 'text-yellow-600' },
    { label: 'Approved', value: '28', color: 'text-green-600' },
    { label: 'Rejected', value: '12', color: 'text-red-600' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500';
      case 'Approved':
        return 'bg-green-500';
      case 'Rejected':
        return 'bg-red-500';
      case 'Completed':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Returns & Refunds</h1>
          <p className="text-gray-600 mt-1">Manage return requests</p>
        </div>
      </div>

      {/* Stats */}
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
              placeholder="Search by Return ID or Customer..."
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
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="completed">Completed</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Filter className="w-4 h-4" />
            <span className="font-semibold text-sm">Filters</span>
          </button>
        </div>
      </div>

      {/* Returns Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F1F4F9] border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Return ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Product</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Reason</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {returns.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span className="font-semibold text-sm text-[#202224]">{item.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <Link href={`/admin/orders/${item.orderId}`} className="text-sm text-[#4880FF] hover:underline">
                      {item.orderId}
                    </Link>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.product}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.reason}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#202224]">${item.amount}</td>
                  <td className="px-6 py-4">
                    <span className={`${getStatusColor(item.status)} text-white px-3 py-1 rounded-full text-xs font-bold`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/returns/${item.id}`}
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
          <p className="text-sm text-gray-600">Showing 1-4 of 156</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Previous
            </button>
            <button className="px-4 py-2 bg-[#4880FF] text-white rounded-lg">1</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">2</button>
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
