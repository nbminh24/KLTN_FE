'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showToast } from '@/components/Toast';
import { ChevronRight, Package, MapPin, CreditCard, Truck, Loader2, AlertCircle, XCircle, CheckCircle, Clock, ArrowRight } from 'lucide-react';
import orderService from '@/lib/services/orderService';
import filterService from '@/lib/services/filterService';
import axios from 'axios';

const STATUS_LABELS = {
  pending: 'Đã Tiếp Nhận',
  confirmed: 'Đã Xác Nhận',
  processing: 'Đang Xử Lý',
  shipped: 'Đang Giao Hàng',
  delivered: 'Đã Giao',
  cancelled: 'Đã Hủy',
};

// Timeline steps
const STATUS_FLOW = [
  {
    key: 'pending',
    label: 'Đã Tiếp Nhận',
    description: 'Đơn hàng của bạn đã được tiếp nhận và đang chờ xác nhận',
  },
  {
    key: 'confirmed',
    label: 'Đã Xác Nhận',
    description: 'Đơn hàng đã được xác nhận và đang được chuẩn bị',
  },
  {
    key: 'shipped',
    label: 'Đang Giao Hàng',
    description: 'Đơn hàng đã được giao cho đơn vị vận chuyển',
  },
  {
    key: 'delivered',
    label: 'Đã Giao',
    description: 'Đơn hàng đã được giao thành công',
  },
];

const CANCELLED_STEP = {
  key: 'cancelled',
  label: 'Đã Hủy',
  description: 'Đơn hàng đã bị hủy',
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

  // Helper function to format order number
  const formatOrderNumber = (orderId: string | number) => {
    return `#LCS-${String(orderId).padStart(6, '0')}`;
  };

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [sizes, setSizes] = useState<any[]>([]);
  const [colors, setColors] = useState<any[]>([]);
  const [timeline, setTimeline] = useState<any[]>([]);

  useEffect(() => {
    if (orderId) {
      loadOrderData();
    }
  }, [orderId]);

  const loadOrderData = async () => {
    try {
      // Fetch filters and status history
      const [sizesRes, colorsRes, statusHistoryRes] = await Promise.all([
        filterService.getAllSizes(),
        filterService.getAllColors(),
        orderService.getOrderStatusHistory(Number(orderId)).catch(() => ({ data: { timeline: [] } }))
      ]);
      const fetchedSizes = sizesRes.data || [];
      const fetchedColors = colorsRes.data || [];
      setSizes(fetchedSizes);
      setColors(fetchedColors);
      setTimeline(statusHistoryRes.data.timeline || []);

      console.log('📐 Fetched Sizes:', fetchedSizes);
      console.log('🎨 Fetched Colors:', fetchedColors);

      // Then fetch order with filters available
      await fetchOrderDetail(fetchedSizes, fetchedColors);
    } catch (err) {
      console.error('Failed to load order data:', err);
      setLoading(false);
    }
  };

  const fetchOrderDetail = async (fetchedSizes: any[], fetchedColors: any[]) => {
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

          // Calculate subtotal properly
          const price = Number(item.price_at_purchase || 0);
          const quantity = Number(item.quantity || 1);
          const calculatedSubtotal = price * quantity;

          // Map size_id and color_id to actual names
          let sizeName = 'N/A';
          let colorName = 'N/A';

          if (variant.size_id && fetchedSizes.length > 0) {
            // Convert both to numbers for comparison since API returns string IDs
            const sizeId = typeof variant.size_id === 'string' ? parseInt(variant.size_id) : variant.size_id;
            const sizeObj = fetchedSizes.find((s: any) => s.id === sizeId);
            sizeName = sizeObj?.name || `Size ${variant.size_id}`;
            console.log(`🔍 Looking for size_id: ${variant.size_id} (${sizeId}), found:`, sizeObj);
          } else if (variant.size?.name) {
            sizeName = variant.size.name;
          } else if (item.size?.name) {
            sizeName = item.size.name;
          }

          if (variant.color_id && fetchedColors.length > 0) {
            // Convert both to numbers for comparison since API returns string IDs
            const colorId = typeof variant.color_id === 'string' ? parseInt(variant.color_id) : variant.color_id;
            const colorObj = fetchedColors.find((c: any) => c.id === colorId);
            colorName = colorObj?.name || `Color ${variant.color_id}`;
            console.log(`🔍 Looking for color_id: ${variant.color_id} (${colorId}), found:`, colorObj);
          } else if (variant.color?.name) {
            colorName = variant.color.name;
          } else if (item.color?.name) {
            colorName = item.color.name;
          }

          // Get product image - try multiple sources
          let imageUrl = '/bmm32410_black_xl.webp';
          if (product.thumbnail_url) {
            imageUrl = product.thumbnail_url;
          } else if (product.images && product.images.length > 0) {
            imageUrl = product.images[0].url || product.images[0].image_url;
          } else if (variant.image_url) {
            imageUrl = variant.image_url;
          } else if (item.thumbnail_url && !item.thumbnail_url.includes('bmm32410')) {
            imageUrl = item.thumbnail_url;
          }

          return {
            ...item,
            product_id: product.id || item.product_id || variant.product_id,
            product_name: product.name || item.product_name || variant.name || 'Product',
            thumbnail_url: imageUrl,
            size_name: sizeName,
            color_name: colorName,
            variant_sku: item.variant_sku || item.sku || variant.sku,
            price_at_purchase: price,
            subtotal: calculatedSubtotal
          };
        });
      }

      // Calculate order subtotal from items
      if (orderData.items && Array.isArray(orderData.items)) {
        orderData.subtotal = orderData.items.reduce((sum: number, item: any) => {
          return sum + Number(item.subtotal || 0);
        }, 0);
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
      await fetchOrderDetail(sizes, colors);
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
            <Link href="/" className="text-gray-500">Trang Chủ</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <Link href="/orders" className="text-gray-500">Đơn Hàng</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{formatOrderNumber(order.id)}</span>
          </div>

          {/* Order Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl md:text-3xl font-integral font-bold mb-2">
                Đơn Hàng {formatOrderNumber(order.id)}
              </h1>
              <p className="text-gray-600">
                Đặt ngày {new Date(order.created_at).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {order.can_cancel && (
                <button
                  onClick={handleCancelOrder}
                  disabled={cancelling}
                  className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-full hover:bg-red-50 transition disabled:opacity-50"
                >
                  <XCircle className="w-4 h-4" />
                  {cancelling ? 'Đang hủy...' : 'Hủy Đơn'}
                </button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-gray-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-5">Sản Phẩm Trong Đơn</h2>
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
                          <p>Size: {item.size_name || 'N/A'} | Màu: {item.color_name || 'N/A'}</p>
                          <p>SKU: {item.variant_sku || item.sku || 'N/A'}</p>
                          <p>Số lượng: {item.quantity || 1}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{(Number(item.price_at_purchase || 0) * 25000).toLocaleString('vi-VN')}₫</p>
                        <p className="text-sm text-gray-600">× {item.quantity || 1}</p>
                        <p className="font-bold text-lg mt-1">{(Number(item.subtotal || 0) * 25000).toLocaleString('vi-VN')}₫</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tracking Timeline */}
              <div className="border border-gray-200 rounded-2xl p-6 mb-6" data-timeline>
                <div className="flex items-center gap-2 mb-6">
                  <Truck className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Tiến Trình Vận Chuyển</h2>
                </div>
                <div className="relative">
                  <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-gray-200"></div>
                  <div className="space-y-6">
                    {(() => {
                      const currentStatus = order.fulfillment_status?.toLowerCase() || 'pending';
                      const isCancelled = currentStatus === 'cancelled';
                      const displaySteps = isCancelled ? [STATUS_FLOW[0], CANCELLED_STEP] : STATUS_FLOW;
                      const currentStepIndex = displaySteps.findIndex(step => step.key === currentStatus);
                      const historyMap = new Map<string, any>();
                      timeline.forEach(item => {
                        if (!historyMap.has(item.status)) {
                          historyMap.set(item.status, item);
                        }
                      });

                      return displaySteps.map((step, index) => {
                        const isCompleted = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;
                        const isPending = index > currentStepIndex;
                        const isCancelledStep = step.key === 'cancelled';
                        const historyData = historyMap.get(step.key);

                        let iconColor = 'bg-gray-300 text-gray-500';
                        let textColor = 'text-gray-500';
                        let ringClass = '';

                        if (isCancelledStep) {
                          iconColor = 'bg-red-500 text-white';
                          textColor = 'text-red-600';
                          ringClass = 'ring-4 ring-red-100';
                        } else if (isCurrent) {
                          iconColor = 'bg-green-500 text-white';
                          textColor = 'text-green-600';
                          ringClass = 'ring-4 ring-green-100';
                        } else if (isCompleted) {
                          iconColor = 'bg-green-500 text-white';
                          textColor = 'text-black';
                        }

                        return (
                          <div key={step.key} className="relative flex gap-4">
                            <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${iconColor} ${ringClass}`}>
                              {isPending ? <Clock className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                            </div>
                            <div className="flex-1 pb-2">
                              <h3 className={`font-bold text-sm ${textColor}`}>
                                {step.label}
                                {isCurrent && !isCancelledStep && (
                                  <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                                    Hiện tại
                                  </span>
                                )}
                              </h3>
                              <p className="text-xs text-gray-600 mt-1">
                                {historyData?.note || step.description}
                              </p>
                              {historyData?.created_at && (
                                <p className="text-xs text-gray-500 mt-1">
                                  {new Date(historyData.created_at).toLocaleString('vi-VN', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Địa Chỉ Giao Hàng</h2>
                </div>
                <div className="space-y-2 text-gray-600">
                  {/* Address Type */}
                  {(order.address_type || order.shipping_address_type) && (
                    <p className="font-bold text-black">{order.address_type || order.shipping_address_type}</p>
                  )}

                  {/* Customer Name & Phone */}
                  {(order.customer_name || order.shipping_name) && (
                    <p className="font-medium text-black">{order.customer_name || order.shipping_name}</p>
                  )}
                  <p>{order.customer_phone || order.shipping_phone || order.phone_number || 'N/A'}</p>

                  {/* Full Address */}
                  <p>{order.shipping_address || order.detailed_address || 'N/A'}</p>

                  {/* Order Note */}
                  {order.note && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="font-medium text-black">Ghi chú:</p>
                      <p>{order.note}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5" />
                  <h2 className="text-xl font-bold">Thông Tin Thanh Toán</h2>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phương thức:</span>
                    <span className="font-medium capitalize">{order.payment_method === 'cod' ? 'COD' : order.payment_method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trạng thái:</span>
                    <span className={`font-medium ${order.payment_status === 'paid' ? 'text-green-600' : 'text-orange-600'}`}>
                      {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </span>
                  </div>
                  {order.payment_transaction && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Mã giao dịch:</span>
                        <span className="font-medium font-mono text-sm">{order.payment_transaction.transaction_id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Thanh toán lúc:</span>
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
                <h2 className="text-xl font-bold">Tóm Tắt Đơn Hàng</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium">{(Number(order.subtotal || 0) * 25000).toLocaleString('vi-VN')}₫</span>
                  </div>
                  {(order.discount || 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="font-medium text-green-600">-{(Number(order.discount || 0) * 25000).toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">{(Number(order.shipping_fee || 0) * 25000).toLocaleString('vi-VN')}₫</span>
                  </div>
                  <hr />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Tổng cộng</span>
                    <span className="font-bold">{(Number(order.total_amount || order.total || 0) * 25000).toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                  <Link
                    href="/support"
                    className="w-full flex items-center justify-center border border-gray-300 py-3 rounded-full font-medium hover:bg-gray-50 transition"
                  >
                    Liên Hệ Hỗ Trợ
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Shopping Button */}
          <div className="mt-6 flex justify-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition group"
            >
              Tiếp tục mua sắm
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
