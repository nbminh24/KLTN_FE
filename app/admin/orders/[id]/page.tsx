'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, MapPin, CreditCard, Truck, Download, Edit, Loader2, ChevronDown, CheckCircle, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { showToast } from '@/components/Toast';
import { canTransitionTo, getAllowedNextStatuses, getStatusColor, getStatusLabel, OrderStatus } from '@/lib/orderStatus';
import adminOrderService, { AdminOrder } from '@/lib/services/admin/orderService';

type MoneyStatus = 'Paid' | 'COD' | 'Pending';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('pending');

  useEffect(() => {
    fetchOrderDetail();
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      setLoading(true);
      console.log('📦 Fetching order detail for ID:', id);
      const response = await adminOrderService.getOrderById(parseInt(id));
      console.log('✅ Order detail response:', response.data);

      const orderData = response.data;
      setOrder(orderData);
      // Backend returns capitalized status (Processing), convert to lowercase for frontend
      setOrderStatus(orderData.fulfillment_status.toLowerCase() as OrderStatus);
    } catch (error) {
      console.error('❌ Failed to fetch order detail:', error);
      showToast('Không thể tải chi tiết đơn hàng', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      showToast('Đang tạo hóa đơn...', 'info');

      // Fetch invoice HTML via API (will include Authorization header)
      const response = await fetch(`http://localhost:3001/admin/orders/${id}/invoice`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_access_token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch invoice');
      }

      const htmlContent = await response.text();

      // Create blob URL and open in new tab
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');

      // Clean up blob URL after a delay
      setTimeout(() => URL.revokeObjectURL(url), 100);

      showToast('Đã mở hóa đơn', 'success');
    } catch (error) {
      console.error('❌ Failed to open invoice:', error);
      showToast('Không thể tải hóa đơn. Vui lòng thử lại.', 'error');
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    const newOrderStatus = newStatus as OrderStatus;

    if (!canTransitionTo(orderStatus, newOrderStatus)) {
      showToast(`Không thể chuyển từ ${orderStatus} sang ${newStatus}`, 'error');
      return;
    }

    if (confirm(`Xác nhận chuyển trạng thái sang "${getStatusLabel(newOrderStatus)}"?`)) {
      try {
        // Capitalize first letter for backend: "confirmed" -> "Confirmed"
        const capitalizedStatus = newOrderStatus.charAt(0).toUpperCase() + newOrderStatus.slice(1);
        await adminOrderService.updateOrderStatus(parseInt(id), {
          status: capitalizedStatus as any
        });

        // Auto-set payment to paid when delivered
        if (newOrderStatus === 'delivered' && order?.payment_status === 'unpaid') {
          try {
            await adminOrderService.updatePaymentStatus(parseInt(id), 'paid');
            showToast('Đơn hàng đã giao - tự động cập nhật thanh toán thành công', 'success');
          } catch (err) {
            console.warn('⚠️ Could not auto-update payment status:', err);
          }
        }

        setOrderStatus(newOrderStatus);
        showToast(`Cập nhật trạng thái thành công`, 'success');
        fetchOrderDetail();
      } catch (error) {
        console.error('❌ Failed to update status:', error);
        showToast('Không thể cập nhật trạng thái', 'error');
      }
    }
  };

  const allowedStatuses = getAllowedNextStatuses(orderStatus);

  // Status flow for progress timeline
  const STATUS_FLOW = [
    { key: 'pending', label: 'Đã Tiếp Nhận', description: 'Đơn hàng đã được tiếp nhận' },
    { key: 'confirmed', label: 'Đã Xác Nhận', description: 'Đơn hàng đã được xác nhận' },
    { key: 'processing', label: 'Đang Xử Lý', description: 'Đang chuẩn bị hàng' },
    { key: 'shipped', label: 'Đang Giao Hàng', description: 'Đơn hàng đã giao cho đơn vị vận chuyển' },
    { key: 'delivered', label: 'Đã Giao', description: 'Đơn hàng đã được giao thành công' },
  ];

  const CANCELLED_STEP = { key: 'cancelled', label: 'Đã Hủy', description: 'Đơn hàng đã bị hủy' };
  const isCancelled = orderStatus === 'cancelled';
  const displaySteps = isCancelled ? [STATUS_FLOW[0], CANCELLED_STEP] : STATUS_FLOW;
  const currentStepIndex = displaySteps.findIndex(step => step.key === orderStatus);

  // Map status history by status key
  const historyMap = new Map<string, any>();
  order?.status_history?.forEach((item: any) => {
    if (!historyMap.has(item.status?.toLowerCase())) {
      historyMap.set(item.status?.toLowerCase(), item);
    }
  });

  const getMoneyStatusColor = (status: string) => {
    if (status === 'paid') return 'bg-green-100 text-green-700';
    if (status === 'unpaid') return 'bg-yellow-100 text-yellow-700';
    return 'bg-blue-100 text-blue-700';
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="p-6">
        <div className="text-center text-gray-500">Không tìm thấy đơn hàng</div>
      </div>
    );
  }

  const subtotal = order.items?.reduce((sum, item) => sum + (parseFloat(item.price_at_purchase || '0') * item.quantity), 0) || 0;
  const shippingFee = parseFloat(order.shipping_fee?.toString() || '0');
  const total = parseFloat(order.total_amount?.toString() || '0');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#202224]">Chi tiết đơn hàng</h1>
            <p className="text-gray-600 mt-1">Mã đơn: #{order.id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownloadInvoice}
            className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-sm"
          >
            <Download className="w-4 h-4" />
            <span>Tải hóa đơn</span>
          </button>
          {allowedStatuses.length > 0 ? (
            <Select onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[200px] bg-[#4880FF] text-white font-bold border-[#4880FF] hover:bg-blue-600 [&>span]:text-white [&>span]:font-bold [&>svg]:text-white">
                <SelectValue placeholder="Cập nhật trạng thái" />
              </SelectTrigger>
              <SelectContent>
                {allowedStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {getStatusLabel(status)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className={`px-4 py-2.5 rounded-lg font-semibold border ${getStatusColor(orderStatus)}`}>
              {getStatusLabel(orderStatus)} (Hoàn tất)
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#202224] mb-4">Sản phẩm</h2>
            <div className="space-y-4">
              {order.items?.map((item) => {
                const productName = item.variant?.product?.name || item.product_name || 'Sản phẩm';
                const productImage = item.variant?.product?.thumbnail_url || item.product_image || '/bmm32410_black_xl.webp';
                const sizeName = item.variant?.size?.name || item.size || 'N/A';
                const colorName = item.variant?.color?.name || item.color || 'N/A';
                const price = parseFloat(item.price_at_purchase || item.price || '0');

                return (
                  <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                    <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={productImage}
                        alt={productName}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-base">{productName}</h3>
                      <p className="text-sm text-gray-600">
                        Size: {sizeName} | Màu: {colorName}
                      </p>
                      <p className="text-sm text-gray-600">SL: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{(price * 25000).toLocaleString('vi-VN')} đ</p>
                      <p className="text-sm text-gray-600">x{item.quantity}</p>
                      <p className="font-bold text-sm text-[#4880FF] mt-1">
                        {(price * item.quantity * 25000).toLocaleString('vi-VN')} đ
                      </p>
                    </div>
                  </div>
                );
              }) || <p className="text-gray-500">Không có sản phẩm</p>}
            </div>
          </div>

          {/* Shipping Progress */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#202224] mb-6">Tiến Trình Vận Chuyển</h2>
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gray-200"></div>

              <div className="space-y-6">
                {displaySteps.map((step, index) => {
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
                      <div className="flex-1 pb-4">
                        <div className="flex items-start justify-between mb-1">
                          <div>
                            <h3 className={`font-bold text-base ${textColor}`}>
                              {step.label}
                              {isCurrent && !isCancelledStep && (
                                <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">Hiện tại</span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{historyData?.note || step.description}</p>
                            {historyData?.admin && (
                              <p className="text-xs text-gray-500 mt-1">Cập nhật bởi: {historyData.admin.name}</p>
                            )}
                          </div>
                        </div>
                        {historyData?.created_at && (
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(historyData.created_at).toLocaleString('vi-VN', {
                              year: 'numeric',
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
                })}
              </div>
            </div>
          </div>

          {/* Tracking Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#202224]">Thông tin vận chuyển</h2>
              <button className="text-sm text-[#4880FF] font-semibold hover:underline">
                Cập nhật
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Truck className="w-5 h-5 text-[#4880FF]" />
                <div>
                  <p className="text-sm text-gray-600">Mã vận đơn</p>
                  <p className="font-bold">{order.tracking_number || 'Chưa có'}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Package className="w-5 h-5 text-[#4880FF]" />
                <div>
                  <p className="text-sm text-gray-600">Đơn vị vận chuyển</p>
                  <p className="font-bold">{order.carrier_name || order.shipping_method || 'Standard'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#202224] mb-4">Khách hàng</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Tên</p>
                <p className="font-semibold">{order.customer?.name || order.customer_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{order.customer_email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="font-semibold">{order.shipping_phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#202224] mb-4">Địa chỉ giao hàng</h2>
            <div className="space-y-2">
              <p className="text-sm">{order.shipping_address}</p>
              {order.shipping_ward && <p className="text-sm">{order.shipping_ward}</p>}
              {order.shipping_district && <p className="text-sm">{order.shipping_district}</p>}
              {order.shipping_city && <p className="text-sm">{order.shipping_city}</p>}
              <p className="text-sm font-semibold text-[#4880FF] mt-3">
                {order.shipping_method || 'Standard Delivery'}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#202224] mb-4">Thanh toán</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">Phương thức</p>
                <p className="text-sm font-semibold">{order.payment_method === 'cod' ? 'COD (Tiền mặt)' : order.payment_method}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Trạng thái</p>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${getMoneyStatusColor(order.payment_status)}`}>
                  {order.payment_status === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                </span>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#202224] mb-4">Tổng đơn hàng</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính</span>
                <span className="font-semibold">{(subtotal * 25000).toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí vận chuyển</span>
                <span className="font-semibold">{(shippingFee * 25000).toLocaleString('vi-VN')} đ</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-lg">Tổng cộng</span>
                  <span className="font-bold text-lg text-[#4880FF]">{(total * 25000).toLocaleString('vi-VN')} đ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
