'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Package, Truck, MapPin, CheckCircle, Clock, Phone, AlertTriangle, Loader2 } from 'lucide-react';
import orderService from '@/lib/services/orderService';
import axios from 'axios';

// Status mapping
const STATUS_LABELS: Record<string, string> = {
  pending: 'Order Placed',
  confirmed: 'Order Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_DESCRIPTIONS: Record<string, string> = {
  pending: 'Your order has been received and is pending confirmation',
  confirmed: 'Your order has been confirmed and is being prepared',
  processing: 'Your order is being processed in our warehouse',
  shipped: 'Your package has been shipped and is on the way',
  delivered: 'Your package has been delivered',
  cancelled: 'Your order has been cancelled',
};

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const orderId = id;

  const [order, setOrder] = useState<any>(null);
  const [timeline, setTimeline] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrderTracking();
  }, [orderId]);

  const fetchOrderTracking = async () => {
    try {
      setLoading(true);
      setError('');

      console.log('📦 Fetching order tracking for:', orderId);

      // Fetch both order details and status history
      const [orderDetailRes, statusHistoryRes] = await Promise.all([
        orderService.getOrderDetail(Number(orderId)),
        orderService.getOrderStatusHistory(Number(orderId))
      ]);

      console.log('📦 Order Detail Response:', orderDetailRes.data);
      console.log('📦 Status History Response:', statusHistoryRes.data);

      const orderData = orderDetailRes.data.order || orderDetailRes.data;
      const statusHistory = statusHistoryRes.data.timeline || [];

      console.log('📦 Combined Order Data:', {
        id: orderData?.id,
        created_at: orderData?.created_at,
        total_amount: orderData?.total_amount,
        payment_method: orderData?.payment_method,
        fulfillment_status: orderData?.fulfillment_status,
        payment_status: orderData?.payment_status
      });

      setOrder(orderData);
      setTimeline(statusHistory);
    } catch (err: any) {
      console.error('❌ Error fetching tracking:', err);
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          router.push('/login?redirect=/orders/' + orderId + '/track');
        } else if (err.response?.status === 404) {
          setError('Order not found');
        } else {
          setError(err.response?.data?.message || 'Failed to load tracking information');
        }
      } else {
        setError('Failed to load tracking information');
      }
    } finally {
      setLoading(false);
    }
  };

  // Loading state
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

  // Error state
  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error || 'Failed to load tracking information'}</p>
            <Link href="/orders" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Back to Orders
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const currentStatus = order.fulfillment_status?.toLowerCase() || 'pending';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <Link href="/orders" className="text-gray-500">My Orders</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <Link href={`/orders/${orderId}`} className="text-gray-500">{orderId}</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Track Order</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-integral font-bold mb-8">Track Your Order</h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Tracking Timeline */}
            <div className="lg:col-span-2">
              <div className="border border-gray-200 rounded-2xl p-6 md:p-8 mb-6">
                <h2 className="text-xl font-bold mb-6">Shipping Timeline</h2>

                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gray-200"></div>

                  <div className="space-y-8">
                    {timeline.map((step, index) => {
                      const isLast = index === timeline.length - 1;
                      const stepStatus = step.status?.toLowerCase();
                      const isCurrent = stepStatus === currentStatus;

                      return (
                        <div key={step.id} className="relative flex gap-5">
                          {/* Icon */}
                          <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isCurrent
                            ? 'bg-blue-500 text-white ring-4 ring-blue-100'
                            : 'bg-green-500 text-white'
                            }`}>
                            <CheckCircle className="w-5 h-5" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 pb-8">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className={`font-bold text-base ${isCurrent ? 'text-blue-600' : 'text-black'
                                  }`}>
                                  {STATUS_LABELS[stepStatus] || step.status}
                                  {isCurrent && (
                                    <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                      Current
                                    </span>
                                  )}
                                </h3>
                                <p className="text-sm text-gray-600 mt-1">
                                  {step.note || STATUS_DESCRIPTIONS[stepStatus] || 'Status updated'}
                                </p>
                                {step.admin && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    Updated by: {step.admin.name}
                                  </p>
                                )}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500 mt-2">
                              {new Date(step.created_at).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Contact & Support */}
              <div className="border border-gray-200 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <Link href="/support" className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-500 transition">
                      <Phone className="w-5 h-5 text-blue-600 group-hover:text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Contact Support</p>
                      <p className="text-sm text-gray-600">Get help with your order</p>
                    </div>
                  </Link>
                  <button className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition group">
                    <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center group-hover:bg-red-500 transition">
                      <AlertTriangle className="w-5 h-5 text-red-600 group-hover:text-white" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Report Issue</p>
                      <p className="text-sm text-gray-600">Having problems?</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Tracking Info Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Current Status */}
              <div className="border border-gray-200 rounded-2xl p-5 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full mx-auto mb-4">
                  <Package className="w-8 h-8" />
                </div>
                <h3 className="text-center font-bold text-lg mb-2">
                  {STATUS_LABELS[currentStatus] || order.fulfillment_status}
                </h3>
                <p className="text-center text-sm text-gray-600 mb-4">
                  Order #{order.id}
                </p>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Payment Status</p>
                  <p className={`text-sm font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                    {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              <div className="border border-gray-200 rounded-2xl p-5">
                <h3 className="font-bold mb-4">Order Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Order ID</p>
                    <p className="font-medium">#{order?.id || orderId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Order Date</p>
                    <p className="font-medium">
                      {order?.created_at
                        ? new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })
                        : 'N/A'
                      }
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total Amount</p>
                    <p className="font-medium">
                      {Number(order?.total_amount || order?.total || 0).toLocaleString('vi-VN')}₫
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Payment Method</p>
                    <p className="font-medium capitalize">
                      {order?.payment_method || 'COD'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href={`/orders/${orderId}`}
                  className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition text-center block"
                >
                  View Order Details
                </Link>
                <Link
                  href="/support"
                  className="w-full border border-gray-300 text-black py-3 rounded-full font-medium hover:bg-gray-50 transition text-center block"
                >
                  Contact Support
                </Link>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 rounded-xl p-4 text-sm">
                <p className="text-gray-700">
                  <strong>Note:</strong> Please ensure someone is available to receive the package. Valid ID may be required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
