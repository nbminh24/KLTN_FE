'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Filter, Eye, Ban } from 'lucide-react';

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const customers = [
    {
      id: '1',
      name: 'Christine Brooks',
      email: 'christine@example.com',
      phone: '+1 234 567 8900',
      orders: 12,
      totalSpent: 1245,
      joined: '2023-08-15',
      status: 'Active',
    },
    {
      id: '2',
      name: 'Rosie Pearson',
      email: 'rosie@example.com',
      phone: '+1 234 567 8901',
      orders: 8,
      totalSpent: 890,
      joined: '2023-09-20',
      status: 'Active',
    },
    {
      id: '3',
      name: 'Darrell Caldwell',
      email: 'darrell@example.com',
      phone: '+1 234 567 8902',
      orders: 15,
      totalSpent: 2100,
      joined: '2023-07-10',
      status: 'Active',
    },
    {
      id: '4',
      name: 'Gilbert Johnston',
      email: 'gilbert@example.com',
      phone: '+1 234 567 8903',
      orders: 3,
      totalSpent: 345,
      joined: '2024-01-05',
      status: 'Active',
    },
    {
      id: '5',
      name: 'Alan Cain',
      email: 'alan@example.com',
      phone: '+1 234 567 8904',
      orders: 0,
      totalSpent: 0,
      joined: '2024-01-15',
      status: 'Blocked',
    },
  ];

  const stats = [
    { label: 'Total Customers', value: '2,456', color: 'text-blue-600' },
    { label: 'Active', value: '2,340', color: 'text-green-600' },
    { label: 'New This Month', value: '156', color: 'text-purple-600' },
    { label: 'Blocked', value: '8', color: 'text-red-600' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Customers</h1>
          <p className="text-gray-600 mt-1">Manage your customers</p>
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
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
            />
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]">
            <option>All Status</option>
            <option>Active</option>
            <option>Blocked</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Filter className="w-4 h-4" />
            <span className="font-semibold text-sm">More Filters</span>
          </button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F1F4F9] border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Email</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Orders</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Total Spent</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Joined</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold">
                        {customer.name[0]}
                      </div>
                      <span className="font-semibold text-sm text-[#202224]">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.phone}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#202224]">{customer.orders}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#202224]">${customer.totalSpent}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{customer.joined}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        customer.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="p-2 hover:bg-gray-100 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4 text-gray-600" />
                      </Link>
                      <button className="p-2 hover:bg-red-50 rounded-lg transition" title="Block User">
                        <Ban className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <p className="text-sm text-gray-600">Showing 1-5 of 2,456</p>
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
