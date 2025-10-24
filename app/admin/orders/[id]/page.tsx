'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, MapPin, CreditCard, Truck, Download, Edit } from 'lucide-react';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const order = {
    id: params.id,
    date: '2024-01-15 10:30 AM',
    status: 'Delivered',
    customer: {
      name: 'Christine Brooks',
      email: 'christine@example.com',
      phone: '+1 234 567 8900',
    },
    shipping: {
      address: '089 Kutch Green Apt. 448',
      city: 'New York, NY 10001',
      method: 'Standard Delivery',
    },
    payment: {
      method: 'Credit Card',
      card: '**** **** **** 4242',
    },
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
        quantity: 2,
      },
    ],
    subtotal: 505,
    discount: 50,
    shippingFee: 12,
    total: 467,
    tracking: 'TRK123456789',
    courier: 'DHL Express',
  };

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
            <h1 className="text-3xl font-bold text-[#202224]">Order Details</h1>
            <p className="text-gray-600 mt-1">Order ID: {order.id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Download className="w-4 h-4" />
            <span className="font-semibold text-sm">Download Invoice</span>
          </button>
          <select className="px-4 py-2.5 bg-[#4880FF] text-white rounded-lg font-semibold">
            <option>Delivered</option>
            <option>Shipped</option>
            <option>Processing</option>
            <option>Pending</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#202224] mb-4">Order Items</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                  <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-base">{item.name}</h3>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">${item.price}</p>
                    <p className="text-sm text-gray-600">x{item.quantity}</p>
                    <p className="font-bold text-sm text-[#4880FF] mt-1">
                      ${item.price * item.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tracking Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#202224]">Tracking Information</h2>
              <button className="text-sm text-[#4880FF] font-semibold hover:underline">
                Update Tracking
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Truck className="w-5 h-5 text-[#4880FF]" />
                <div>
                  <p className="text-sm text-gray-600">Tracking Number</p>
                  <p className="font-bold">{order.tracking}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Package className="w-5 h-5 text-[#4880FF]" />
                <div>
                  <p className="text-sm text-gray-600">Courier</p>
                  <p className="font-bold">{order.courier}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#202224] mb-4">Customer</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Name</p>
                <p className="font-semibold">{order.customer.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold">{order.customer.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-semibold">{order.customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#202224] mb-4">Shipping Address</h2>
            <div className="space-y-2">
              <p className="text-sm">{order.shipping.address}</p>
              <p className="text-sm">{order.shipping.city}</p>
              <p className="text-sm font-semibold text-[#4880FF] mt-3">
                {order.shipping.method}
              </p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#202224] mb-4">Payment</h2>
            <div className="space-y-2">
              <p className="text-sm font-semibold">{order.payment.method}</p>
              <p className="text-sm text-gray-600">{order.payment.card}</p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-[#202224] mb-4">Order Summary</h2>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-semibold">${order.subtotal}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-semibold text-red-600">-${order.discount}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Shipping</span>
                <span className="font-semibold">${order.shippingFee}</span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between">
                  <span className="font-bold text-lg">Total</span>
                  <span className="font-bold text-lg text-[#4880FF]">${order.total}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
