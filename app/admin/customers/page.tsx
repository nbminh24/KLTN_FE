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
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [sortField, setSortField] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [stats, setStats] = useState({
    total_customers: 0,
    active_customers: 0,
    new_customers_this_month: 0,
    blocked_customers: 0,
  });

  useEffect(() => {
    fetchStatistics();
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, statusFilter, sortField, sortOrder]);

  const fetchStatistics = async () => {
    try {
      const response = await adminCustomerService.getCustomerStatistics();
      console.log('📊 Customer statistics:', response.data);
      setStats({
        total_customers: response.data.total_customers || 0,
        active_customers: response.data.active_customers || 0,
        new_customers_this_month: response.data.new_customers_this_month || 0,
        blocked_customers: response.data.total_customers - response.data.active_customers || 0,
      });
    } catch (err: any) {
      // Silently handle statistics API errors (backend issue)
      // Stats will remain at 0, but page functionality is not affected
      if (err?.response?.status === 500) {
        console.warn('⚠️ Customer statistics API unavailable (500). Stats set to 0.');
      } else {
        console.error('❌ Failed to fetch statistics:', err);
      }
    }
  };

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      console.log('👥 Fetching customers...', { page: currentPage, status: statusFilter, sort: sortField });

      const response = await adminCustomerService.getCustomers({
        page: currentPage,
        limit: 20,
        search: searchQuery || undefined,
        status: statusFilter === 'all' ? undefined : statusFilter,
        sort_by: sortField,
        order: sortOrder,
      });
      console.log('✅ Customers response:', response.data);

      const customersData = response.data.data || response.data.customers || response.data;
      const customersArray = Array.isArray(customersData) ? customersData : [];

      console.log('👥 Parsed customers:', customersArray.length, 'items');

      setCustomers(customersArray);
      setTotalPages(response.data.meta?.totalPages || response.data.total_pages || 1);
      setTotalCustomers(response.data.meta?.total || response.data.total || 0);
    } catch (err) {
      console.error('❌ Failed to fetch customers:', err);
      showToast('Failed to load customers', 'error');
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    fetchCustomers();
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('vi-VN') + ' VND';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

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
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Total Customers</p>
          <p className="text-2xl font-bold text-blue-600">{stats.total_customers.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Active</p>
          <p className="text-2xl font-bold text-green-600">{stats.active_customers.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">New This Month</p>
          <p className="text-2xl font-bold text-purple-600">{stats.new_customers_this_month.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-600 mb-1">Inactive</p>
          <p className="text-2xl font-bold text-red-600">{stats.blocked_customers.toLocaleString()}</p>
        </div>
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
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition"
          >
            Search
          </button>
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
            onChange={(e) => {
              setSortField(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          >
            <option value="created_at">Sort by: Joined</option>
            <option value="total_orders">Sort by: Orders</option>
            <option value="total_spent">Sort by: Total Spent</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => {
              setSortOrder(e.target.value as 'asc' | 'desc');
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          >
            <option value="desc">High to Low</option>
            <option value="asc">Low to High</option>
          </select>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-[#4880FF]" />
          </div>
        ) : customers.length === 0 ? (
          <div className="text-center py-20">
            <Filter className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No customers found</p>
          </div>
        ) : (
          <>
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
                  {customers.map((customer) => (
                    <tr
                      key={customer.id}
                      onClick={() => router.push(`/admin/customers/${customer.id}`)}
                      className="hover:bg-gray-50 transition cursor-pointer"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {customer.name?.charAt(0) || 'U'}
                          </div>
                          <span className="font-semibold text-sm text-[#202224]">{customer.name || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{customer.phone || 'N/A'}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#202224]">{customer.total_orders || 0}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-[#202224]">{formatCurrency(customer.total_spent || 0)}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(customer.created_at)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${customer.status === 'active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                            }`}
                        >
                          {customer.status === 'active' ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing {customers.length > 0 ? ((currentPage - 1) * 20 + 1) : 0}-{Math.min(currentPage * 20, totalCustomers)} of {totalCustomers}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button className="px-4 py-2 bg-[#4880FF] text-white rounded-lg">{currentPage}</button>
                {currentPage < totalPages && (
                  <button
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    {currentPage + 1}
                  </button>
                )}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
