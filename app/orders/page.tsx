'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Package, Search, Loader2, AlertCircle } from 'lucide-react';
import orderService from '@/lib/services/orderService';
import type { Order } from '@/lib/types/backend';
import axios from 'axios';

type OrderStatus = 'All' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_LABELS = {
    pending: 'Pending',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    processing: 'bg-blue-100 text-blue-800',
    shipped: 'bg-purple-100 text-purple-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus>('All');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalOrders, setTotalOrders] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsAuthenticated(!!token);

        if (token) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, [statusFilter, currentPage]);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await orderService.getMyOrders({
                page: currentPage,
                limit: 10,
                status: statusFilter === 'All' ? undefined : statusFilter,
            });

            console.log('📦 Orders API Response:', response.data);

            // Handle multiple possible response structures
            const ordersList = response.data.data || response.data.orders || response.data || [];
            const metadata = response.data.metadata || response.data.pagination || {};

            console.log('📦 Orders List:', ordersList);
            console.log('📦 Metadata:', metadata);

            setOrders(Array.isArray(ordersList) ? ordersList : []);
            setTotalPages(metadata.totalPages || metadata.total_pages || 1);
            setTotalOrders(metadata.total || ordersList.length || 0);
        } catch (err: any) {
            console.error('❌ Error fetching orders:', err);
            if (axios.isAxiosError(err)) {
                console.error('❌ Error response:', err.response?.data);
                if (err.response?.status === 401) {
                    setError('Session expired. Please login again.');
                    setIsAuthenticated(false);
                } else {
                    setError('Failed to load orders. Please try again.');
                }
            } else {
                setError('Failed to load orders. Please try again.');
            }
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    // Not logged in
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center py-20">
                    <div className="text-center max-w-md">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
                        <p className="text-gray-600 mb-6">Please login to view your orders</p>
                        <Link href="/login?redirect=/orders" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                            Login to Continue
                        </Link>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center py-20">
                    <Loader2 className="w-12 h-12 animate-spin text-gray-600" />
                </main>
                <Footer />
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center py-20">
                    <div className="text-center max-w-md">
                        <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
                        <h2 className="text-2xl font-bold mb-2">Error Loading Orders</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button onClick={fetchOrders} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                            Try Again
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Filter orders by search (with safe check)
    const filteredOrders = (orders || []).filter((order) =>
        order.order_number?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Status counts (with safe check)
    const statusCounts = {
        All: totalOrders,
        pending: (orders || []).filter((o) => o.fulfillment_status === 'pending').length,
        processing: (orders || []).filter((o) => o.fulfillment_status === 'processing').length,
        shipped: (orders || []).filter((o) => o.fulfillment_status === 'shipped').length,
        delivered: (orders || []).filter((o) => o.fulfillment_status === 'delivered').length,
        cancelled: (orders || []).filter((o) => o.fulfillment_status === 'cancelled').length,
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
                            {(['All', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => {
                                        setStatusFilter(status);
                                        setCurrentPage(1);
                                    }}
                                    className={`pb-3 whitespace-nowrap font-medium transition border-b-2 ${statusFilter === status
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {status === 'All' ? 'All' : STATUS_LABELS[status]} ({statusCounts[status] || 0})
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Search */}
                    <div className="mb-6">
                        <div className="relative max-w-md">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search by order number..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                            />
                        </div>
                    </div>

                    {/* Orders List */}
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-20">
                            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h2 className="text-xl font-bold mb-2">No Orders Found</h2>
                            <p className="text-gray-600 mb-6">
                                {searchQuery ? 'No orders match your search.' : 'You haven\'t placed any orders yet.'}
                            </p>
                            <Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                                Start Shopping
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredOrders.map((order) => (
                                <Link
                                    key={order.id}
                                    href={`/orders/${order.id}`}
                                    className="block border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="font-bold text-lg">{order.order_number}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.fulfillment_status as keyof typeof STATUS_COLORS]}`}>
                                                    {STATUS_LABELS[order.fulfillment_status as keyof typeof STATUS_LABELS]}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>
                                                    <span className="font-medium">Placed:</span>{' '}
                                                    {new Date(order.created_at).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Items:</span> {order.items_count}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Payment:</span>{' '}
                                                    <span className="capitalize">{order.payment_method}</span>
                                                    {' - '}
                                                    <span className={order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}>
                                                        {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-2xl font-bold mb-2">
                                                {order.total_amount.toLocaleString('vi-VN')}₫
                                            </p>
                                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                                View Details →
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                            >
                                Previous
                            </button>
                            <span className="px-4 py-2">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages}
                                className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
