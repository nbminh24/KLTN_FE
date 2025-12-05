'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showToast } from '@/components/Toast';
import { ChevronRight, Package, MapPin, CreditCard, Truck, Loader2, AlertCircle, XCircle } from 'lucide-react';
import orderService from '@/lib/services/orderService';
import axios from 'axios';

const STATUS_LABELS = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  processing: 'Processing',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await orderService.getOrderDetail(Number(orderId));
      setOrder(response.data);
    } catch (err: any) {
      console.error('Error fetching order:', err);
      if (axios.isAxiosError(err) && err.response?.status === 404) {
        setError('Order not found');
      } else if (axios.isAxiosError(err) && err.response?.status === 401) {
        setError('Please login to view this order');
      } else {
        setError('Failed to load order details');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;

    try {
      setCancelling(true);
      await orderService.cancelOrder(Number(orderId));
      showToast('Order cancelled successfully', 'success');
      await fetchOrderDetail();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        showToast(err.response?.data?.message || 'Failed to cancel order', 'error');
      } else {
        showToast('Failed to cancel order', 'error');
      }
    } finally {
      setCancelling(false);
    }
  };

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

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error || 'Order not found'}</p>
            <Link href="/orders" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Back to Orders
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }


  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <Link href="/orders" className="text-gray-500">Orders</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{order.order_number}</span>
          </div>

          {/* Order Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-integral font-bold mb-2">
                Order {order.order_number}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.created_at).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${STATUS_COLORS[order.fulfillment_status as keyof typeof STATUS_COLORS]}`}>
                {STATUS_LABELS[order.fulfillment_status as keyof typeof STATUS_LABELS]}
              </span>
              {order.can_cancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 transition disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-gray-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-5">Order Items</h2>
                <div className="divide-y">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="py-4 flex gap-4">
                      <Link href={`/products/${item.product_id}`} className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.thumbnail_url || '/bmm32410_black_xl.webp'}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link href={`/products/${item.product_id}`} className="font-bold hover:underline">
                          {item.product_name}
                        </Link>
                        <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                          <p>Size: {item.size} | Color: {item.color}</p>
                          <p>SKU: {item.variant_sku}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.price_at_purchase.toLocaleString('vi-VN')}₫</p>
                        <p className="text-sm text-gray-600">× {item.quantity}</p>
                        <p className="font-bold text-lg mt-1">{item.subtotal.toLocaleString('vi-VN')}₫</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Shipping Address</h2>
                </div>
                <div className="space-y-2 text-gray-600">
                  <p className="font-medium text-black">{order.customer_name}</p>
                  <p>{order.customer_phone}</p>
                  <p>{order.shipping_address}</p>
                  {order.shipping_ward && <p>{order.shipping_ward}, {order.shipping_district}</p>}
                  <p>{order.shipping_city}</p>
                  {order.note && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="font-medium text-black">Note:</p>
                      <p>{order.note}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Payment Information</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method:</span>
                    <span className="font-medium capitalize">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                      {order.payment_status === 'paid' ? 'Paid' : 'Unpaid'}
                    </span>
                  </div>
                  {order.payment_transaction && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Transaction ID:</span>
                        <span className="font-medium font-mono text-sm">{order.payment_transaction.transaction_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Paid At:</span>
                        <span className="font-medium">
                          {new Date(order.payment_transaction.paid_at).toLocaleString('vi-VN')}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-2xl p-6 space-y-4 sticky top-6">
                <h2 className="text-xl font-bold">Order Summary</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{order.subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  {order.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">-{order.discount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="font-medium">{order.shipping_fee.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">{order.total_amount.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Link
                    href={`/orders/${orderId}/track`}
                    className="w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition"
                  >
                    <Truck className="w-5 h-5" />
                    Track Order
                  </Link>
                  <Link
                    href="/support"
                    className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-full font-medium hover:bg-gray-50 transition"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
