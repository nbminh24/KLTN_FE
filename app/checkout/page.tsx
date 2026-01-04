'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showToast } from '@/components/Toast';
import { ChevronRight, CreditCard, Truck, MapPin, Plus, Check, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import accountService, { Address } from '@/lib/services/accountService';
import cartService from '@/lib/services/cartService';
import checkoutService from '@/lib/services/checkoutService';
import type { CartResponse } from '@/lib/types/backend';
import axios from 'axios';

export default function CheckoutPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vnpay'>('cod');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.push('/login?redirect=/checkout');
      return;
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [addressesRes, cartRes] = await Promise.all([
        accountService.getAddresses(),
        cartService.getCart(),
      ]);

      console.log('📦 Checkout - Addresses Response:', addressesRes.data);
      console.log('📦 Checkout - Cart Response:', cartRes.data);

      // Transform addresses (handle different response formats)
      const addressesData = addressesRes.data.addresses || addressesRes.data.data || addressesRes.data || [];
      console.log('📍 Addresses Data:', addressesData);
      setAddresses(Array.isArray(addressesData) ? addressesData : []);

      // Transform cart (same as cart page)
      const transformedItems = (cartRes.data?.items || []).map((item: any) => {
        const variant = item.variant || {};
        const product = variant.product || {};

        return {
          ...item,
          product: {
            id: product.id || variant.product_id || 0,
            name: product.name || 'Product',
            thumbnail_url: product.thumbnail_url || variant.image_url || '/bmm32410_black_xl.webp',
            selling_price: Number(product.selling_price || 0)
          },
          variant: {
            ...variant,
            price: Number(product.selling_price || variant.price || 0)
          }
        };
      });

      const cartData = {
        items: transformedItems,
        summary: {
          subtotal: cartRes.data?.subtotal || 0,
          items_count: cartRes.data?.totalItems || 0,
          discount: cartRes.data?.discount || 0,
          shipping_fee: cartRes.data?.shipping_fee || 0,
          total: cartRes.data?.total || cartRes.data?.subtotal || 0
        },
        unavailable_items: cartRes.data?.unavailable_items || 0
      };

      setCart(cartData as any);

      // Auto-select default address
      const defaultAddr = addressesData.find((a: any) => a.is_default);
      if (defaultAddr && defaultAddr.id) {
        console.log('📍 Auto-selecting default address:', defaultAddr.id);
        setSelectedAddressId(Number(defaultAddr.id));
      } else if (addressesData.length > 0 && addressesData[0].id) {
        console.log('📍 Auto-selecting first address:', addressesData[0].id);
        setSelectedAddressId(Number(addressesData[0].id));
      }
    } catch (err: any) {
      console.error('❌ Error fetching checkout data:', err);
      if (axios.isAxiosError(err)) {
        console.error('❌ Error status:', err.response?.status);
        console.error('❌ Error data:', err.response?.data);

        if (err.response?.status === 401) {
          router.push('/login?redirect=/checkout');
        } else {
          setError('Không thể tải dữ liệu thanh toán');
        }
      } else {
        setError('Failed to load checkout data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      showToast('Vui lòng chọn địa chỉ giao hàng', 'warning');
      return;
    }

    if (!cart || !cart.items || cart.items.length === 0) {
      showToast('Giỏ hàng của bạn trống', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const response = await checkoutService.createOrder({
        customer_address_id: selectedAddressId,
        payment_method: paymentMethod,
        shipping_fee: cart.summary?.shipping_fee || 0,
        note: note || undefined,
      });

      const order = response.data.order;

      // If VNPAY, create payment URL and redirect
      if (paymentMethod === 'vnpay') {
        console.log('🔐 Requesting VNPAY payment URL for order:', order.id);
        const paymentRes = await checkoutService.createPaymentUrl({
          order_id: order.id,
        });

        console.log('🔐 VNPAY Response Full:', paymentRes);
        console.log('🔐 VNPAY Response Data:', paymentRes.data);
        console.log('🔐 Payment URL:', paymentRes.data.payment_url);
        console.log('🔐 Payment URL (alternative):', paymentRes.data.paymentUrl);
        console.log('🔐 Payment URL (url):', paymentRes.data.url);

        const paymentUrl = paymentRes.data.payment_url || paymentRes.data.paymentUrl || paymentRes.data.url;

        if (!paymentUrl) {
          console.error('❌ VNPAY payment URL is undefined!', paymentRes.data);
          showToast('Không nhận được URL thanh toán. Vui lòng liên hệ hỗ trợ.', 'error');
          return;
        }

        console.log('✅ Redirecting to:', paymentUrl);
        window.location.href = paymentUrl;
      } else {
        // COD - redirect to order success
        showToast('Đặt hàng thành công!', 'success');
        router.push(`/orders/${order.id}`);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      if (axios.isAxiosError(err)) {
        showToast(err.response?.data?.message || 'Thanh toán thất bại', 'error');
      } else {
        showToast('Không thể đặt hàng', 'error');
      }
    } finally {
      setSubmitting(false);
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

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold mb-2">Lỗi</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/cart" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Quay Lại Giỏ Hàng
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2">Giỏ Hàng Trống</h2>
            <p className="text-gray-600 mb-6">Thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
            <Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Tiếp Tục Mua Sắm
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
            <Link href="/cart" className="text-gray-500">Giỏ Hàng</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Thanh Toán</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-integral font-bold">Thanh Toán</h1>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay Lại Giỏ Hàng
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <h2 className="text-lg font-bold">Địa Chỉ Giao Hàng</h2>
                  </div>
                  <Link
                    href="/addresses"
                    className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Thêm Mới
                  </Link>
                </div>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Chưa có địa chỉ nào</p>
                    <Link
                      href="/addresses"
                      className="inline-block bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800 transition"
                    >
                      Thêm Địa Chỉ
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${selectedAddressId === Number(addr.id)
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400'
                          }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddressId === Number(addr.id)}
                          onChange={(e) => setSelectedAddressId(Number(e.target.value))}
                          className="mt-1 w-5 h-5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold">{addr.address_type || 'Address'}</span>
                            {addr.is_default && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                Mặc Định
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">
                            {addr.street_address}
                            {addr.ward && `, ${addr.ward}`}
                            {addr.district && `, ${addr.district}`}
                            {addr.province && `, ${addr.province}`}
                          </p>
                          <p className="text-sm text-gray-600">{addr.phone_number}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Note */}
              <div className="border border-gray-200 rounded-2xl p-5">
                <h2 className="text-lg font-bold mb-3">Ghi Chú Đơn Hàng (Tùy Chọn)</h2>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Thêm hướng dẫn giao hàng hoặc ghi chú..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              {/* Review Order */}
              <div className="border border-gray-200 rounded-2xl p-5">
                <h2 className="text-lg font-bold mb-5">Xem Lại Đơn Hàng ({cart.items?.length || 0} sản phẩm)</h2>
                <div className="space-y-4">
                  {(cart.items || []).map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.variant?.image_url || item.product?.thumbnail_url || '/bmm32410_black_xl.webp'}
                          alt={item.product?.name || 'Product'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm">{item.product?.name || 'Product'}</h3>
                        <div className="text-xs text-gray-600 mt-1">
                          <span>Kích thước: {
                            typeof item.variant?.size === 'object' && item.variant?.size?.name
                              ? item.variant.size.name
                              : item.variant?.size || 'N/A'
                          }</span>
                          <span className="mx-2">•</span>
                          <span>Màu sắc: {
                            typeof item.variant?.color === 'object' && item.variant?.color?.name
                              ? item.variant.color.name
                              : item.variant?.color || 'N/A'
                          }</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">SL: {item.quantity || 1}</span>
                          <span className="font-bold">{(Number(item.variant?.price || 0) * 25000).toLocaleString('vi-VN')}₫</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method */}
              <div className="border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-5">
                  <CreditCard className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Phương Thức Thanh Toán</h2>
                </div>
                <div className="space-y-3">
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'cod' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                    }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'vnpay')}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-medium">Thanh Toán Khi Nhận Hàng (COD)</p>
                      <p className="text-xs text-gray-600">Thanh toán khi nhận hàng</p>
                    </div>
                  </label>
                  <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${paymentMethod === 'vnpay' ? 'border-black bg-gray-50' : 'border-gray-200 hover:border-gray-400'
                    }`}>
                    <input
                      type="radio"
                      name="payment"
                      value="vnpay"
                      checked={paymentMethod === 'vnpay'}
                      onChange={(e) => setPaymentMethod(e.target.value as 'cod' | 'vnpay')}
                      className="w-5 h-5"
                    />
                    <div>
                      <p className="font-medium">VNPAY</p>
                      <p className="text-xs text-gray-600">Thanh toán trực tuyến qua cổng VNPAY</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-2xl p-5 space-y-5 sticky top-6">
                <h2 className="text-xl font-bold">Tóm Tắt Đơn Hàng</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tạm tính ({cart.summary?.items_count || 0} sản phẩm)</span>
                    <span className="font-bold">{(Number(cart.summary?.subtotal || 0) * 25000).toLocaleString('vi-VN')}₫</span>
                  </div>
                  {(cart.summary?.discount || 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Giảm giá</span>
                      <span className="font-bold text-green-600">-{(Number(cart.summary?.discount || 0) * 25000).toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-bold">{(Number(cart.summary?.shipping_fee || 0) * 25000).toLocaleString('vi-VN')}₫</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg">
                    <span className="font-medium">Tổng cộng</span>
                    <span className="font-bold">{(Number(cart.summary?.total || 0) * 25000).toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={submitting || !selectedAddressId}
                  className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Đang xử lý...' : 'Đặt Hàng'}
                </button>

                {(cart.unavailable_items || 0) > 0 && (
                  <p className="text-xs text-center text-red-500">
                    Một số sản phẩm không có sẵn. Vui lòng cập nhật giỏ hàng.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
