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
      console.log('📦 Order Detail Response:', response.data);

      // Transform order data to ensure items array exists
      const orderData = response.data.order || response.data;
      console.log('📦 Order Data:', orderData);
      console.log('📦 Order Items:', orderData.items);

      // Transform order items to extract product info from variant
      if (orderData.items && Array.isArray(orderData.items)) {
        orderData.items = orderData.items.map((item: any) => {
          const variant = item.variant || {};
          const product = variant.product || {};

          return {
            ...item,
            product_id: product.id || item.product_id || variant.product_id,
            product_name: product.name || item.product_name || variant.name || 'Product',
            thumbnail_url: product.thumbnail_url || item.thumbnail_url || variant.image_url || '/bmm32410_black_xl.webp',
            // Keep existing fields if they exist
            size: item.size || variant.size,
            color: item.color || variant.color,
            variant_sku: item.variant_sku || item.sku || variant.sku,
            price_at_purchase: item.price_at_purchase || item.price || variant.price || product.selling_price || 0,
            subtotal: item.subtotal || (item.quantity || 1) * (item.price || variant.price || 0)
          };
        });
      }

      console.log('📦 Transformed Items:', orderData.items);
      console.log('📦 Shipping Address Fields:', {
        address_type: orderData.address_type,
        shipping_address_type: orderData.shipping_address_type,
        customer_name: orderData.customer_name,
        shipping_name: orderData.shipping_name,
        customer_phone: orderData.customer_phone,
        shipping_phone: orderData.shipping_phone,
        shipping_address: orderData.shipping_address,
        detailed_address: orderData.detailed_address,
        address_object: orderData.address,
        customer_address: orderData.customer_address
      });

      // Extract address info from nested address object if exists
      if (orderData.address || orderData.customer_address) {
        const addr = orderData.address || orderData.customer_address;
        orderData.address_type = orderData.address_type || addr.address_type;
        orderData.detailed_address = orderData.detailed_address || addr.detailed_address;
        orderData.phone_number = orderData.phone_number || addr.phone_number;
      }

      setOrder(orderData);
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
                  {(order.items || []).map((item: any) => (
                    <div key={item.id} className="py-4 flex gap-4">
                      <Link href={`/products/${item.product_id || '#'}`} className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.thumbnail_url || '/bmm32410_black_xl.webp'}
                          alt={item.product_name || 'Product Image'}
                          fill
                          className="object-cover"
                        />
                      </Link>
                      <div className="flex-1">
                        <Link href={`/products/${item.product_id || '#'}`} className="font-bold hover:underline">
                          {item.product_name || 'Product'}
                        </Link>
                        <div className="text-sm text-gray-600 mt-1 space-y-0.5">
                          <p>Size: {
                            typeof item.size === 'object' && item.size?.name
                              ? item.size.name
                              : item.size || 'N/A'
                          } | Color: {
                              typeof item.color === 'object' && item.color?.name
                                ? item.color.name
                                : item.color || 'N/A'
                            }</p>
                          <p>SKU: {item.variant_sku || item.sku || 'N/A'}</p>
                          <p>Quantity: {item.quantity || 1}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{Number(item.price_at_purchase || 0).toLocaleString('vi-VN')}₫</p>
                        <p className="text-sm text-gray-600">× {item.quantity || 1}</p>
                        <p className="font-bold text-lg mt-1">{Number(item.subtotal || 0).toLocaleString('vi-VN')}₫</p>
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
                  {/* Address Type */}
                  {(order.address_type || order.shipping_address_type) && (
                    <p className="font-bold text-black">{order.address_type || order.shipping_address_type}</p>
                  )}

                  {/* Customer Name & Phone */}
                  <p className="font-medium text-black">{order.customer_name || order.shipping_name || 'N/A'}</p>
                  <p>{order.customer_phone || order.shipping_phone || order.phone_number || 'N/A'}</p>

                  {/* Full Address */}
                  <p>{order.shipping_address || order.detailed_address || 'N/A'}</p>

                  {/* Order Note */}
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
                    <span className="font-medium">{Number(order.subtotal || 0).toLocaleString('vi-VN')}₫</span>
                  </div>
                  {(order.discount || 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-medium text-green-600">-{Number(order.discount || 0).toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="font-medium">{Number(order.shipping_fee || 0).toLocaleString('vi-VN')}₫</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold">{Number(order.total_amount || order.total || 0).toLocaleString('vi-VN')}₫</span>
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
