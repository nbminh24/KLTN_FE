'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Filter, Loader2 } from 'lucide-react';
import adminCustomerService, { AdminCustomer } from '@/lib/services/admin/customerService';
import { showToast } from '@/components/Toast';

export default function CustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, statusFilter]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await adminCustomerService.getCustomers({
        page: currentPage,
        limit: 20,
        search: searchQuery,
        status: statusFilter === 'all' ? undefined : statusFilter,
      });
      setCustomers(response.data.customers);
      setTotalPages(response.data.total_pages);
    } catch (err) {
      showToast('Failed to load customers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const mockCustomers = [
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

  // Filter and sort customers
  const filteredCustomers = customers
    .filter((customer) => {
      // Search filter
      const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchQuery.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === 'all' || customer.status.toLowerCase() === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'orders':
          comparison = a.orders - b.orders;
          break;
        case 'spent':
          comparison = a.totalSpent - b.totalSpent;
          break;
        case 'joined':
          comparison = new Date(a.joined).getTime() - new Date(b.joined).getTime();
          break;
        default:
          return 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="blocked">Blocked</option>
          </select>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          >
            <option value="joined">Sort by: Joined</option>
            <option value="orders">Sort by: Orders</option>
            <option value="spent">Sort by: Total Spent</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          >
            <option value="desc">High to Low</option>
            <option value="asc">Low to High</option>
          </select>
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
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCustomers.map((customer) => (
                <tr
                  key={customer.id}
                  onClick={() => router.push(`/admin/customers/${customer.id}`)}
                  className="hover:bg-gray-50 transition cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
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
                      className={`px-3 py-1 rounded-full text-xs font-bold ${customer.status === 'Active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {customer.status}
                    </span>
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
