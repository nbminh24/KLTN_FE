'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Package, User, Calendar, DollarSign, MessageSquare, CheckCircle, XCircle } from 'lucide-react';

export default function ReturnDetailPage({ params }: { params: { id: string } }) {
  const returnRequest = {
    id: params.id,
    orderId: 'ORD-001',
    date: '2024-01-15',
    status: 'Pending',
    customer: {
      name: 'Christine Brooks',
      email: 'christine@example.com',
      phone: '+1 234 567 8900',
    },
    product: {
      name: 'Gradient Graphic T-shirt',
      image: '/bmm32410_black_xl.webp',
      size: 'Large',
      color: 'White',
      price: 145,
      quantity: 1,
    },
    reason: 'Wrong size',
    description: 'I ordered a Large size but it fits too small. I would like to exchange it for an XL size or get a refund.',
    images: ['/bmm32410_black_xl.webp', '/bmm32410_black_xl.webp'],
    refundAmount: 145,
    returnMethod: 'Pickup',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/returns" className="p-2 hover:bg-gray-100 rounded-lg transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-[#202224]">Return Request Details</h1>
            <p className="text-gray-600 mt-1">Return ID: {returnRequest.id}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition">
            <CheckCircle className="w-4 h-4" />
            <span className="font-semibold text-sm">Approve</span>
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            <XCircle className="w-4 h-4" />
            <span className="font-semibold text-sm">Reject</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Return Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Return Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Package className="w-5 h-5 text-[#4880FF]" />
                <div>
                  <p className="text-xs text-gray-600">Return ID</p>
                  <p className="font-bold text-sm">{returnRequest.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Package className="w-5 h-5 text-[#4880FF]" />
                <div>
                  <p className="text-xs text-gray-600">Order ID</p>
                  <Link href={`/admin/orders/${returnRequest.orderId}`} className="font-bold text-sm text-[#4880FF] hover:underline">
                    {returnRequest.orderId}
                  </Link>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <Calendar className="w-5 h-5 text-[#4880FF]" />
                <div>
                  <p className="text-xs text-gray-600">Request Date</p>
                  <p className="font-bold text-sm">{returnRequest.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                <DollarSign className="w-5 h-5 text-[#4880FF]" />
                <div>
                  <p className="text-xs text-gray-600">Refund Amount</p>
                  <p className="font-bold text-sm">${returnRequest.refundAmount}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Product Details</h2>
            <div className="flex gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="relative w-24 h-24 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                <Image src={returnRequest.product.image} alt="" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2">{returnRequest.product.name}</h3>
                <div className="flex gap-4 text-sm text-gray-600">
                  <span>Size: <strong>{returnRequest.product.size}</strong></span>
                  <span>Color: <strong>{returnRequest.product.color}</strong></span>
                  <span>Qty: <strong>{returnRequest.product.quantity}</strong></span>
                </div>
                <p className="text-lg font-bold text-[#4880FF] mt-2">${returnRequest.product.price}</p>
              </div>
            </div>
          </div>

          {/* Return Reason */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Return Reason</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Reason</p>
                <p className="text-base font-bold text-[#202224]">{returnRequest.reason}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">Description</p>
                <p className="text-sm text-gray-700">{returnRequest.description}</p>
              </div>
            </div>
          </div>

          {/* Product Images */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Product Images (Uploaded by Customer)</h2>
            <div className="grid grid-cols-3 gap-4">
              {returnRequest.images.map((img, i) => (
                <div key={i} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition">
                  <Image src={img} alt="" fill className="object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Admin Notes</h2>
            <textarea
              rows={4}
              placeholder="Add internal notes about this return..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
            ></textarea>
            <button className="mt-3 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold text-sm">
              Save Notes
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Status</h2>
            <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] font-semibold">
              <option>Pending</option>
              <option>Approved</option>
              <option>Rejected</option>
              <option>Completed</option>
            </select>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Customer</h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {returnRequest.customer.name[0]}
                </div>
                <div>
                  <p className="font-bold">{returnRequest.customer.name}</p>
                  <Link href={`/admin/customers/1`} className="text-xs text-[#4880FF] hover:underline">
                    View Profile
                  </Link>
                </div>
              </div>
              <div className="pt-3 border-t space-y-2">
                <p className="text-sm text-gray-600">{returnRequest.customer.email}</p>
                <p className="text-sm text-gray-600">{returnRequest.customer.phone}</p>
              </div>
            </div>
          </div>

          {/* Return Method */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Return Method</h2>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="font-bold text-blue-900">{returnRequest.returnMethod}</p>
              <p className="text-sm text-blue-700 mt-1">Customer will ship the product back</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-semibold flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Approve & Process Refund
              </button>
              <button className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-semibold flex items-center justify-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Contact Customer
              </button>
              <button className="w-full px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-semibold flex items-center justify-center gap-2">
                <XCircle className="w-5 h-5" />
                Reject Request
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Timeline</h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-semibold">Return Requested</p>
                  <p className="text-xs text-gray-600">Jan 15, 2024 10:30 AM</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm text-gray-500">Under Review</p>
                  <p className="text-xs text-gray-400">Pending</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
