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

type OrderStatus = 'All' | 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const STATUS_LABELS = {
    pending: 'Đã Tiếp Nhận',
    confirmed: 'Đã Xác Nhận',
    processing: 'Đang Xử Lý',
    shipped: 'Đang Giao Hàng',
    delivered: 'Đã Giao',
    cancelled: 'Đã Hủy',
};

const STATUS_COLORS = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    processing: 'bg-purple-100 text-purple-800',
    shipped: 'bg-indigo-100 text-indigo-800',
    delivered: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

export default function OrdersPage() {
    const router = useRouter();
    const [allOrders, setAllOrders] = useState<any[]>([]); // All orders for counting
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<OrderStatus>('All');

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        setIsAuthenticated(!!token);

        if (token) {
            fetchOrders();
        } else {
            setLoading(false);
        }
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError('');
            // Fetch all orders without status filter to get accurate counts
            const response = await orderService.getMyOrders({
                page: 1,
                limit: 100, // Get all orders
            });

            console.log('📦 Orders API Response:', response.data);

            // Handle multiple possible response structures
            const ordersList = response.data.data || response.data.orders || response.data || [];

            console.log('📦 Orders List:', ordersList);

            setAllOrders(Array.isArray(ordersList) ? ordersList : []);
        } catch (err: any) {
            console.error('❌ Error fetching orders:', err);
            if (axios.isAxiosError(err)) {
                console.error('❌ Error response:', err.response?.data);
                if (err.response?.status === 401) {
                    setError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                    setIsAuthenticated(false);
                } else {
                    setError('Không thể tải đơn hàng. Vui lòng thử lại.');
                }
            } else {
                setError('Failed to load orders. Please try again.');
            }
            setAllOrders([]);
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
                        <h2 className="text-2xl font-bold mb-2">Không Tìm Thấy Đơn Hàng</h2>
                        <p className="text-gray-600 mb-6">Vui lòng đăng nhập để xem đơn hàng</p>
                        <Link href="/login?redirect=/orders" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                            Đăng Nhập Để Tiếp Tục
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
                        <h2 className="text-2xl font-bold mb-2">Lỗi Tải Đơn Hàng</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button onClick={fetchOrders} className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                            Thử Lại
                        </button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Status counts from all orders
    // Backend returns capitalized status (Shipped), convert to lowercase for comparison
    const statusCounts = {
        All: allOrders.length,
        pending: allOrders.filter((o) => o.fulfillment_status?.toLowerCase() === 'pending').length,
        confirmed: allOrders.filter((o) => o.fulfillment_status?.toLowerCase() === 'confirmed').length,
        processing: allOrders.filter((o) => o.fulfillment_status?.toLowerCase() === 'processing').length,
        shipped: allOrders.filter((o) => o.fulfillment_status?.toLowerCase() === 'shipped').length,
        delivered: allOrders.filter((o) => o.fulfillment_status?.toLowerCase() === 'delivered').length,
        cancelled: allOrders.filter((o) => o.fulfillment_status?.toLowerCase() === 'cancelled').length,
    };

    // Filter by status tab
    let orders = allOrders;
    if (statusFilter !== 'All') {
        orders = allOrders.filter((o) => o.fulfillment_status?.toLowerCase() === statusFilter);
    }

    // Helper function to format order number
    const formatOrderNumber = (orderId: number) => {
        return `#LCS-${String(orderId).padStart(6, '0')}`;
    };

    // Filter by search query
    const filteredOrders = orders.filter((order) => {
        const formattedNumber = formatOrderNumber(order.id);
        return formattedNumber.toLowerCase().includes(searchQuery.toLowerCase());
    });

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                <div className="container mx-auto px-6 md:px-12 py-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-6">
                        <Link href="/" className="text-gray-500">Trang Chủ</Link>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Đơn Hàng Của Tôi</span>
                    </div>

                    <h1 className="text-2xl md:text-3xl font-integral font-bold mb-6">Đơn Hàng Của Tôi</h1>

                    {/* Status Filter Tabs */}
                    <div className="border-b border-gray-200 mb-6 overflow-x-auto">
                        <div className="flex gap-6">
                            {(['All', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'] as OrderStatus[]).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`pb-3 whitespace-nowrap font-medium transition border-b-2 ${statusFilter === status
                                        ? 'border-black text-black'
                                        : 'border-transparent text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    {status === 'All' ? 'Tất Cả' : STATUS_LABELS[status]} ({statusCounts[status] || 0})
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
                                placeholder="Tìm theo mã đơn hàng..."
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
                            <h2 className="text-xl font-bold mb-2">Không Tìm Thấy Đơn Hàng</h2>
                            <p className="text-gray-600 mb-6">
                                {searchQuery ? 'Không có đơn hàng nào khớp với tìm kiếm.' : 'Bạn chưa đặt đơn hàng nào.'}
                            </p>
                            <Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
                                Bắt Đầu Mua Sắm
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
                                                <h3 className="font-bold text-lg">{formatOrderNumber(order.id)}</h3>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.fulfillment_status as keyof typeof STATUS_COLORS]}`}>
                                                    {STATUS_LABELS[order.fulfillment_status as keyof typeof STATUS_LABELS]}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-600 space-y-1">
                                                <p>
                                                    <span className="font-medium">Đặt hàng:</span>{' '}
                                                    {new Date(order.created_at).toLocaleDateString('vi-VN', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric',
                                                    })}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Số lượng:</span> {order.items_count}
                                                </p>
                                                <p>
                                                    <span className="font-medium">Thanh toán:</span>{' '}
                                                    <span className="capitalize">{order.payment_method}</span>
                                                    {' - '}
                                                    <span className={order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}>
                                                        {order.payment_status === 'paid' ? 'Đã Thanh Toán' : 'Chưa Thanh Toán'}
                                                    </span>
                                                </p>
                                            </div>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-2xl font-bold mb-2">
                                                {(Number(order.total_amount || 0) * 25000).toLocaleString('vi-VN')}₫
                                            </p>
                                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                                                Xem Chi Tiết →
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                </div>
            </main>

            <Footer />
        </div>
    );
}
