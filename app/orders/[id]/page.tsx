'use client';

import { useState, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Package, MapPin, CreditCard, Truck, CheckCircle, Clock, Download } from 'lucide-react';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const orderId = id;

  // Mock order data
  const order = {
    id: orderId,
    date: '2024-01-15',
    status: 'Delivered',
    deliveredDate: '2024-01-20',
    total: 467,
    subtotal: 565,
    discount: 113,
    deliveryFee: 15,
    paymentMethod: 'Credit Card',
    trackingNumber: 'TRK123456789',
    items: [
      {
        id: '1',
        name: 'Gradient Graphic T-shirt',
        image: '/bmm32410_black_xl.webp',
        size: 'Large',
        color: 'White',
        price: 145,
        quantity: 1,
      },
      {
        id: '2',
        name: 'Checkered Shirt',
        image: '/bmm32410_black_xl.webp',
        size: 'Medium',
        color: 'Red',
        price: 180,
        quantity: 1,
      },
      {
        id: '3',
        name: 'Skinny Fit Jeans',
        image: '/bmm32410_black_xl.webp',
        size: 'Large',
        color: 'Blue',
        price: 240,
        quantity: 1,
      },
    ],
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street',
      city: 'New York',
      postalCode: '10001',
      phone: '+1 234 567 8900',
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-700';
      case 'Shipped':
        return 'bg-blue-100 text-blue-700';
      case 'Processing':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
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
            <Link href="/orders" className="text-gray-500">My Orders</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">{order.id}</span>
          </div>

          {/* Order Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-integral font-bold">Order Details</h1>
              <p className="text-gray-600 mt-2">Order ID: {order.id}</p>
              <p className="text-gray-600">Placed on {order.date}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
              <button className="border border-black px-6 py-2 rounded-full font-medium hover:bg-black hover:text-white transition flex items-center gap-2">
                <Download className="w-4 h-4" />
                Invoice
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Order Items */}
            <div className="lg:col-span-2 space-y-6">
              <div className="border border-gray-200 rounded-2xl p-6">
                <h2 className="text-xl font-bold mb-5">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                      <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-base mb-1">{item.name}</h3>
                        <div className="text-xs text-gray-600 space-y-0.5">
                          <p>Size: {item.size} | Color: {item.color}</p>
                          <p>Quantity: {item.quantity}</p>
                        </div>
                        <p className="text-lg font-bold mt-2">${item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Timeline */}
              <div className="border border-gray-200 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold">Order Timeline</h2>
                  <Link 
                    href={`/orders/${order.id}/track`}
                    className="text-sm font-medium text-black underline hover:no-underline"
                  >
                    Track Order
                  </Link>
                </div>
                <div className="space-y-6">
                  {[
                    { status: 'Order Placed', date: '2024-01-15, 10:30 AM', icon: CheckCircle, done: true },
                    { status: 'Order Confirmed', date: '2024-01-15, 11:00 AM', icon: CheckCircle, done: true },
                    { status: 'Shipped', date: '2024-01-16, 09:00 AM', icon: Truck, done: true },
                    { status: 'Out for Delivery', date: '2024-01-20, 08:00 AM', icon: Truck, done: true },
                    { status: 'Delivered', date: '2024-01-20, 02:30 PM', icon: Package, done: true },
                  ].map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        step.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <step.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <p className={`font-medium ${step.done ? 'text-black' : 'text-gray-400'}`}>
                          {step.status}
                        </p>
                        <p className="text-sm text-gray-500">{step.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Shipping Address */}
              <div className="border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <MapPin className="w-5 h-5" />
                  <h3 className="font-bold">Shipping Address</h3>
                </div>
                <div className="text-sm space-y-1">
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="text-gray-600">{order.shippingAddress.address}</p>
                  <p className="text-gray-600">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                  <p className="text-gray-600">{order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border border-gray-200 rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-4">
                  <CreditCard className="w-5 h-5" />
                  <h3 className="font-bold">Payment Method</h3>
                </div>
                <p className="text-sm text-gray-600">{order.paymentMethod}</p>
                <p className="text-sm text-gray-600 mt-1">
                  Tracking: <span className="font-medium text-black">{order.trackingNumber}</span>
                </p>
              </div>

              {/* Order Summary */}
              <div className="border border-gray-200 rounded-2xl p-5 space-y-4">
                <h3 className="font-bold text-lg">Order Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-bold">${order.subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Discount</span>
                    <span className="font-bold text-red-500">-${order.discount}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-bold">${order.deliveryFee}</span>
                  </div>
                  <hr className="border-gray-200" />
                  <div className="flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-lg">${order.total}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link 
                  href="/support"
                  className="w-full border border-black text-black py-3 rounded-full font-medium hover:bg-black hover:text-white transition text-center block"
                >
                  Need Help?
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
