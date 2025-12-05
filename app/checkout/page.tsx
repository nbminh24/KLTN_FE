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

      setAddresses(addressesRes.data.addresses);
      setCart(cartRes.data);

      // Auto-select default address
      const defaultAddr = addressesRes.data.addresses.find(a => a.is_default);
      if (defaultAddr && defaultAddr.id) {
        setSelectedAddressId(defaultAddr.id);
      } else if (addressesRes.data.addresses.length > 0 && addressesRes.data.addresses[0].id) {
        setSelectedAddressId(addressesRes.data.addresses[0].id);
      }
    } catch (err: any) {
      console.error('Error fetching data:', err);
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push('/login?redirect=/checkout');
      } else {
        setError('Failed to load checkout data');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      showToast('Please select a shipping address', 'warning');
      return;
    }

    if (!cart || cart.items.length === 0) {
      showToast('Your cart is empty', 'warning');
      return;
    }

    try {
      setSubmitting(true);
      const response = await checkoutService.createOrder({
        customer_address_id: selectedAddressId,
        payment_method: paymentMethod,
        shipping_fee: cart.summary.shipping_fee,
        note: note || undefined,
      });

      const order = response.data.order;

      // If VNPAY, create payment URL and redirect
      if (paymentMethod === 'vnpay') {
        const paymentRes = await checkoutService.createPaymentUrl({
          order_id: order.id,
        });
        window.location.href = paymentRes.data.payment_url;
      } else {
        // COD - redirect to order success
        showToast('Order placed successfully!', 'success');
        router.push(`/orders/${order.id}`);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      if (axios.isAxiosError(err)) {
        showToast(err.response?.data?.message || 'Checkout failed', 'error');
      } else {
        showToast('Failed to place order', 'error');
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
            <h2 className="text-2xl font-bold mb-2">Error</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/cart" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Back to Cart
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-bold mb-2">Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add items to cart before checkout</p>
            <Link href="/products" className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition">
              Continue Shopping
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
            <Link href="/cart" className="text-gray-500">Cart</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Checkout</span>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl md:text-3xl font-integral font-bold">Checkout</h1>
            <Link
              href="/cart"
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-black transition"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cart
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
                    <h2 className="text-lg font-bold">Shipping Address</h2>
                  </div>
                  <Link
                    href="/addresses"
                    className="flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    <Plus className="w-4 h-4" />
                    Add New
                  </Link>
                </div>
                {addresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">No saved addresses</p>
                    <Link
                      href="/addresses"
                      className="inline-block bg-black text-white px-6 py-2 rounded-full text-sm hover:bg-gray-800 transition"
                    >
                      Add Address
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${selectedAddressId === addr.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400'
                          }`}
                      >
                        <input
                          type="radio"
                          name="address"
                          value={addr.id}
                          checked={selectedAddressId === addr.id}
                          onChange={(e) => setSelectedAddressId(Number(e.target.value))}
                          className="mt-1 w-5 h-5"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold">{addr.recipient_name}</span>
                            {addr.is_default && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{addr.address_line}</p>
                          <p className="text-sm text-gray-600">
                            {addr.ward}, {addr.district}, {addr.city}
                          </p>
                          <p className="text-sm text-gray-600">{addr.phone}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              {/* Order Note */}
              <div className="border border-gray-200 rounded-2xl p-5">
                <h2 className="text-lg font-bold mb-3">Order Note (Optional)</h2>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add delivery instructions or notes..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                />
              </div>

              {/* Review Order */}
              <div className="border border-gray-200 rounded-2xl p-5">
                <h2 className="text-lg font-bold mb-5">Review Order ({cart.items.length} items)</h2>
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.variant.image_url || item.product.thumbnail_url}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm">{item.product.name}</h3>
                        <div className="text-xs text-gray-600 mt-1">
                          <span>Size: {item.variant.size}</span>
                          <span className="mx-2">•</span>
                          <span>Color: {item.variant.color}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="font-bold">{item.variant.price.toLocaleString('vi-VN')}₫</span>
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
                  <h2 className="text-lg font-bold">Payment Method</h2>
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
                      <p className="font-medium">Cash on Delivery (COD)</p>
                      <p className="text-xs text-gray-600">Pay when you receive</p>
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
                      <p className="text-xs text-gray-600">Pay online via VNPAY gateway</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-2xl p-5 space-y-5 sticky top-6">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cart.summary.items_count} items)</span>
                    <span className="font-bold">{cart.summary.subtotal.toLocaleString('vi-VN')}₫</span>
                  </div>
                  {cart.summary.discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-bold text-green-600">-{cart.summary.discount.toLocaleString('vi-VN')}₫</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping Fee</span>
                    <span className="font-bold">{cart.summary.shipping_fee.toLocaleString('vi-VN')}₫</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">{cart.summary.total.toLocaleString('vi-VN')}₫</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={submitting || !selectedAddressId}
                  className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Processing...' : 'Place Order'}
                </button>

                {cart.unavailable_items > 0 && (
                  <p className="text-xs text-center text-red-500">
                    Some items are unavailable. Please update your cart.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
