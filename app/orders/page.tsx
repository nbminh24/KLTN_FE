'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Package, Search } from 'lucide-react';

const allOrders = [
  { id: 'ORD-001', date: '2024-01-15', status: 'Delivered', total: 467, items: 3 },
  { id: 'ORD-002', date: '2024-01-10', status: 'Shipped', total: 325, items: 2 },
  { id: 'ORD-003', date: '2024-01-05', status: 'Processing', total: 189, items: 1 },
  { id: 'ORD-004', date: '2024-01-12', status: 'Pending', total: 245, items: 2 },
  { id: 'ORD-005', date: '2023-12-20', status: 'Cancelled', total: 150, items: 1 },
  { id: 'ORD-006', date: '2024-01-18', status: 'Delivered', total: 380, items: 4 },
];

type OrderStatus = 'All' | 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus>('All');
  const [sortBy, setSortBy] = useState<'date-desc' | 'date-asc'>('date-desc');

  // Filter and sort orders
  const filteredOrders = allOrders
    .filter((order) => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortBy === 'date-desc' ? dateB - dateA : dateA - dateB;
    });

  const statusCounts = {
    All: allOrders.length,
    Pending: allOrders.filter(o => o.status === 'Pending').length,
    Processing: allOrders.filter(o => o.status === 'Processing').length,
    Shipped: allOrders.filter(o => o.status === 'Shipped').length,
    Delivered: allOrders.filter(o => o.status === 'Delivered').length,
    Cancelled: allOrders.filter(o => o.status === 'Cancelled').length,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">My Orders</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-integral font-bold mb-6">My Orders</h1>

          {/* Status Filter Tabs */}
          <div className="border-b border-gray-200 mb-6 overflow-x-auto">
            <div className="flex gap-6">
              {(['All', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] as OrderStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`pb-3 whitespace-nowrap font-medium transition border-b-2 ${
                    statusFilter === status
                      ? 'border-black text-black'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {status} ({statusCounts[status]})
                </button>
              ))}
            </div>
          </div>

          {/* Search and Sort */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date-desc' | 'date-asc')}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
            </select>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 border border-gray-200 rounded-2xl">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2">No orders found</h3>
              <p className="text-gray-600">
                {searchQuery ? 'Try a different search term' : 'You haven\'t placed any orders yet'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-4 rounded-xl">
                        <Package className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base">{order.id}</h3>
                        <p className="text-gray-600 text-sm">Order date: {order.date}</p>
                        <p className="text-gray-600 text-sm">{order.items} items</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Total</p>
                        <p className="text-xl font-bold">${order.total}</p>
                      </div>
                      <div>
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-700' :
                          order.status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'Processing' ? 'bg-yellow-100 text-yellow-700' :
                          order.status === 'Pending' ? 'bg-orange-100 text-orange-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <Link
                        href={`/orders/${order.id}`}
                        className="border border-black px-6 py-2 rounded-full font-medium hover:bg-black hover:text-white transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
