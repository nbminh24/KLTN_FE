'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Download, Package } from 'lucide-react';

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
type MoneyStatus = 'Paid' | 'COD' | 'Pending';

export default function OrdersPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<OrderStatus>('Pending');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showBulkUpdateModal, setShowBulkUpdateModal] = useState(false);

  const orders = [
    {
      id: 'ORD-00001',
      customer: 'Christine Brooks',
      dateReceived: '2024-01-15',
      items: 3,
      total: 467,
      status: 'Delivered' as OrderStatus,
      moneyStatus: 'Paid' as MoneyStatus,
    },
    {
      id: 'ORD-00002',
      customer: 'Rosie Pearson',
      dateReceived: '2024-01-14',
      items: 2,
      total: 325,
      status: 'Processing' as OrderStatus,
      moneyStatus: 'Paid' as MoneyStatus,
    },
    {
      id: 'ORD-00003',
      customer: 'Darrell Caldwell',
      dateReceived: '2024-01-14',
      items: 1,
      total: 240,
      status: 'Pending' as OrderStatus,
      moneyStatus: 'COD' as MoneyStatus,
    },
    {
      id: 'ORD-00004',
      customer: 'Gilbert Johnston',
      dateReceived: '2024-01-13',
      items: 4,
      total: 892,
      status: 'Shipped' as OrderStatus,
      moneyStatus: 'Paid' as MoneyStatus,
    },
    {
      id: 'ORD-00005',
      customer: 'Alan Cain',
      dateReceived: '2024-01-13',
      items: 2,
      total: 456,
      status: 'Cancelled' as OrderStatus,
      moneyStatus: 'Pending' as MoneyStatus,
    },
    {
      id: 'ORD-00006',
      customer: 'John Doe',
      dateReceived: '2024-01-16',
      items: 1,
      total: 145,
      status: 'Pending' as OrderStatus,
      moneyStatus: 'COD' as MoneyStatus,
    },
    {
      id: 'ORD-00007',
      customer: 'Jane Smith',
      dateReceived: '2024-01-16',
      items: 3,
      total: 520,
      status: 'Processing' as OrderStatus,
      moneyStatus: 'Paid' as MoneyStatus,
    },
  ];

  const stats = [
    { label: 'Total Orders', value: '10,293', color: 'text-blue-600' },
    { label: 'Pending', value: '2,040', color: 'text-yellow-600' },
    { label: 'Processing', value: '1,523', color: 'text-blue-600' },
    { label: 'Delivered', value: '6,230', color: 'text-green-600' },
  ];

  // Filter and sort orders
  const filteredOrders = orders
    .filter((order) => {
      // Filter by active tab (status)
      if (order.status !== activeTab) return false;
      
      // Search filter
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           order.customer.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesSearch;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dateReceived).getTime();
      const dateB = new Date(b.dateReceived).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  // Checkbox handlers
  const handleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id));
    }
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrders(prev =>
      prev.includes(orderId)
        ? prev.filter(id => id !== orderId)
        : [...prev, orderId]
    );
  };

  const getMoneyStatusColor = (status: MoneyStatus) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700';
      case 'COD':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
    }
  };

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

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="flex border-b border-gray-200">
          {(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map((status) => (
            <button
              key={status}
              onClick={() => {
                setActiveTab(status);
                setSelectedOrders([]);
              }}
              className={`px-6 py-4 font-semibold text-sm transition flex items-center gap-2 ${
                activeTab === status
                  ? 'border-b-2 border-[#4880FF] text-[#4880FF]'
                  : 'text-gray-600 hover:text-[#4880FF]'
              }`}
            >
              <Package className="w-4 h-4" />
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Filters & Actions */}
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
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
          >
            <option value="desc">Date: Newest</option>
            <option value="asc">Date: Oldest</option>
          </select>
          <button
            onClick={() => setShowBulkUpdateModal(true)}
            disabled={selectedOrders.length === 0}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition ${
              selectedOrders.length > 0
                ? 'bg-[#4880FF] text-white hover:bg-blue-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <Package className="w-4 h-4" />
            Update Tracking ({selectedOrders.length})
          </button>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F1F4F9] border-b border-gray-200">
                <th className="px-6 py-4 text-left">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                  />
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Order ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Date Received</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Items</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Money Status</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-[#202224]">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr 
                  key={order.id} 
                  className="hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => router.push(`/admin/orders/${order.id}`)}
                >
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="w-4 h-4 rounded border-gray-300 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-sm text-[#202224]">{order.id}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.dateReceived}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getMoneyStatusColor(order.moneyStatus)}`}>
                      {order.moneyStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#202224]">${order.total}</td>
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

      {/* Bulk Update Tracking Modal */}
      {showBulkUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setShowBulkUpdateModal(false)}>
          <div className="bg-white rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold text-[#202224] mb-4">
              Update Tracking - {selectedOrders.length} order{selectedOrders.length > 1 ? 's' : ''} selected
            </h2>
            
            <p className="text-sm text-gray-600 mb-4">
              Update status for selected orders:
            </p>

            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] mb-4">
              <option value="">Choose Status</option>
              <option value="next">Next Status (Processing)</option>
              <option value="cancel">Cancel Order</option>
            </select>

            <p className="text-xs text-gray-500 mb-6">
              Note: Delivered orders will be skipped automatically
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowBulkUpdateModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (confirm(`Update ${selectedOrders.length} orders to next status?`)) {
                    alert('Orders updated successfully!');
                    setSelectedOrders([]);
                    setShowBulkUpdateModal(false);
                  }
                }}
                className="flex-1 px-4 py-2.5 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition font-semibold"
              >
                Confirm Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
