'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, CreditCard, Truck, MapPin, Plus, Check, ArrowLeft } from 'lucide-react';

export default function CheckoutPage() {
  const [selectedAddress, setSelectedAddress] = useState('1');
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');

  // Mock addresses
  const addresses = [
    { id: '1', label: 'Home', name: 'John Doe', address: '123 Main St, Apt 4B', city: 'New York', postal: '10001', phone: '+1 234 567 8900', isDefault: true },
    { id: '2', label: 'Work', name: 'John Doe', address: '456 Office Plaza, Suite 200', city: 'New York', postal: '10002', phone: '+1 234 567 8900', isDefault: false },
  ];

  // Mock cart items
  const cartItems = [
    { id: '1', name: 'Gradient Graphic T-shirt', size: 'Large', color: 'Black', price: 145, quantity: 1, image: '/bmm32410_black_xl.webp' },
    { id: '2', name: 'Checkered Shirt', size: 'Medium', color: 'Blue', price: 180, quantity: 1, image: '/bmm32410_black_xl.webp' },
  ];

  const subtotal = 565;
  const discount = 113;
  const deliveryFee = shippingMethod === 'express' ? 25 : 15;
  const total = subtotal - discount + deliveryFee;

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
                <div className="space-y-3">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer transition ${
                        selectedAddress === addr.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={addr.id}
                        checked={selectedAddress === addr.id}
                        onChange={(e) => setSelectedAddress(e.target.value)}
                        className="mt-1 w-5 h-5"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold">{addr.label}</span>
                          {addr.isDefault && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{addr.name}</p>
                        <p className="text-sm text-gray-600">{addr.address}</p>
                        <p className="text-sm text-gray-600">
                          {addr.city}, {addr.postal}
                        </p>
                        <p className="text-sm text-gray-600">{addr.phone}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Shipping Method */}
              <div className="border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-5">
                  <Truck className="w-5 h-5" />
                  <h2 className="text-lg font-bold">Shipping Method</h2>
                </div>
                <div className="space-y-3">
                  <label
                    className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
                      shippingMethod === 'standard'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value="standard"
                        checked={shippingMethod === 'standard'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="w-5 h-5"
                      />
                      <div>
                        <p className="font-bold">Standard Delivery</p>
                        <p className="text-sm text-gray-600">5-7 business days</p>
                      </div>
                    </div>
                    <span className="font-bold">$15</span>
                  </label>
                  <label
                    className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
                      shippingMethod === 'express'
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="shipping"
                        value="express"
                        checked={shippingMethod === 'express'}
                        onChange={(e) => setShippingMethod(e.target.value)}
                        className="w-5 h-5"
                      />
                      <div>
                        <p className="font-bold">Express Delivery</p>
                        <p className="text-sm text-gray-600">2-3 business days</p>
                      </div>
                    </div>
                    <span className="font-bold">$25</span>
                  </label>
                </div>
              </div>

              {/* Review Order */}
              <div className="border border-gray-200 rounded-2xl p-5">
                <h2 className="text-lg font-bold mb-5">Review Order</h2>
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm">{item.name}</h3>
                        <div className="text-xs text-gray-600 mt-1">
                          <span>Size: {item.size}</span>
                          <span className="mx-2">•</span>
                          <span>Color: {item.color}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-gray-600">Qty: {item.quantity}</span>
                          <span className="font-bold">${item.price}</span>
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
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-black transition">
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">Credit/Debit Card</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-black transition">
                    <input
                      type="radio"
                      name="payment"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">PayPal</span>
                  </label>
                  <label className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg cursor-pointer hover:border-black transition">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">Cash on Delivery</span>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="mt-6 space-y-4">
                    <input
                      type="text"
                      placeholder="Card Number"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                      <input
                        type="text"
                        placeholder="CVV"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="border border-gray-200 rounded-2xl p-5 space-y-5 sticky top-6">
                <h2 className="text-xl font-bold">Order Summary</h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold">${subtotal}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Discount</span>
                      <span className="font-bold text-red-500">-${discount}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">
                      Delivery Fee ({shippingMethod === 'express' ? 'Express' : 'Standard'})
                    </span>
                    <span className="font-bold">${deliveryFee}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between text-lg">
                    <span className="font-medium">Total</span>
                    <span className="font-bold">${total}</span>
                  </div>
                </div>

                <Link
                  href="/order-confirmation?orderId=ORD-001"
                  className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition block text-center"
                >
                  Place Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
