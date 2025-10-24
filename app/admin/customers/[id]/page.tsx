'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Heart, Calendar, Ban, CheckCircle } from 'lucide-react';

export default function CustomerDetailPage({ params }: { params: { id: string } }) {
  const customer = {
    id: params.id,
    name: 'Christine Brooks',
    email: 'christine@example.com',
    phone: '+1 234 567 8900',
    joined: '2023-08-15',
    lastOrder: '2024-01-15',
    status: 'Active',
    totalOrders: 12,
    totalSpent: 1245,
    averageOrder: 103.75,
  };

  const addresses = [
    {
      id: '1',
      label: 'Home',
      name: 'Christine Brooks',
      address: '089 Kutch Green Apt. 448',
      city: 'New York, NY 10001',
      phone: '+1 234 567 8900',
      isDefault: true,
    },
    {
      id: '2',
      label: 'Office',
      name: 'Christine Brooks',
      address: '1234 Business Plaza',
      city: 'Brooklyn, NY 11201',
      phone: '+1 234 567 8901',
      isDefault: false,
    },
  ];

  const orders = [
    { id: 'ORD-001', date: '2024-01-15', items: 3, total: 467, status: 'Delivered' },
    { id: 'ORD-002', date: '2024-01-10', items: 2, total: 325, status: 'Delivered' },
    { id: 'ORD-003', date: '2023-12-28', items: 1, total: 145, status: 'Delivered' },
  ];

  const wishlist = [
    { name: 'Polo with Contrast Trims', price: 212, image: '/bmm32410_black_xl.webp' },
    { name: 'Black Striped T-shirt', price: 130, image: '/bmm32410_black_xl.webp' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/customers" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#202224]">Customer Details</h1>
            <p className="text-gray-600 mt-1">Customer ID: {customer.id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
            <Mail className="w-4 h-4" />
            <span className="font-semibold text-sm">Send Email</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            <Ban className="w-4 h-4" />
            <span className="font-semibold text-sm">Block Customer</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-start gap-6">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
                {customer.name[0]}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold text-[#202224]">{customer.name}</h2>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                    {customer.status}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Joined {customer.joined}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Order History</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-[#F1F4F9]">
                    <th className="px-4 py-3 text-left text-sm font-bold">Order ID</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Date</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Items</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Total</th>
                    <th className="px-4 py-3 text-left text-sm font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/admin/orders/${order.id}`} className="font-semibold text-[#4880FF] hover:underline">
                          {order.id}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{order.date}</td>
                      <td className="px-4 py-3 text-sm">{order.items}</td>
                      <td className="px-4 py-3 text-sm font-semibold">${order.total}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Saved Addresses */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Saved Addresses</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div key={addr.id} className="p-4 border border-gray-200 rounded-lg relative">
                  {addr.isDefault && (
                    <span className="absolute top-2 right-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-bold">
                      Default
                    </span>
                  )}
                  <div className="flex items-start gap-3 mb-3">
                    <MapPin className="w-5 h-5 text-[#4880FF] flex-shrink-0 mt-1" />
                    <div>
                      <p className="font-bold text-sm mb-1">{addr.label}</p>
                      <p className="text-sm text-gray-600">{addr.name}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-1">{addr.address}</p>
                  <p className="text-sm text-gray-700 mb-1">{addr.city}</p>
                  <p className="text-sm text-gray-600">{addr.phone}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Statistics</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="w-8 h-8 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold text-blue-600">{customer.totalOrders}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-2xl font-bold text-green-600">${customer.totalSpent}</p>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Average Order</p>
                <p className="text-2xl font-bold text-purple-600">${customer.averageOrder}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Last Order</p>
                <p className="text-lg font-bold text-yellow-600">{customer.lastOrder}</p>
              </div>
            </div>
          </div>

          {/* Wishlist */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-red-500" />
              <h2 className="text-xl font-bold">Wishlist</h2>
            </div>
            <div className="space-y-3">
              {wishlist.map((item, i) => (
                <div key={i} className="flex gap-3 p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg"></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#202224] mb-1">{item.name}</p>
                    <p className="text-sm font-bold text-[#4880FF]">${item.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Log */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-semibold">Order Delivered</p>
                  <p className="text-xs text-gray-600">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-semibold">Order Placed</p>
                  <p className="text-xs text-gray-600">5 days ago</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-semibold">Added to Wishlist</p>
                  <p className="text-xs text-gray-600">1 week ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
