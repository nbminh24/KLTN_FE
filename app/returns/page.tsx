'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Package, AlertCircle, CheckCircle, Upload } from 'lucide-react';

export default function ReturnsPage() {
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock orders eligible for return
  const eligibleOrders = [
    {
      id: 'ORD-001',
      date: '2024-01-15',
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
      ],
    },
  ];

  const returnReasons = [
    'Wrong size',
    'Wrong color',
    'Defective or damaged',
    'Not as described',
    'Quality issues',
    'Changed my mind',
    'Other',
  ];

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder || selectedItems.length === 0 || !reason) {
      alert('Please complete all required fields');
      return;
    }
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-6 md:px-12 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-integral font-bold mb-4">
                Return Request Submitted!
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Your return request has been received. We'll review it and send you a confirmation email with return instructions within 24 hours.
              </p>
              <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6">
                <p className="text-sm text-gray-600 mb-2">Return Request ID</p>
                <p className="text-2xl font-bold mb-4">RET-{Date.now().toString().slice(-6)}</p>
                <p className="text-sm text-gray-600">
                  You can track your return request in your order history.
                </p>
              </div>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/orders"
                  className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition"
                >
                  View Orders
                </Link>
                <Link
                  href="/"
                  className="border border-gray-300 px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
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
            <span className="font-medium">Return Items</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-integral font-bold mb-2">Return Items</h1>
          <p className="text-gray-600 mb-8">Select items you'd like to return</p>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Return Form */}
            <div className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Order */}
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  <h2 className="text-xl font-bold mb-4">Select Order</h2>
                  {eligibleOrders.map((order) => (
                    <label
                      key={order.id}
                      className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                        selectedOrder === order.id
                          ? 'border-black bg-gray-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="order"
                        value={order.id}
                        checked={selectedOrder === order.id}
                        onChange={(e) => setSelectedOrder(e.target.value)}
                        className="w-5 h-5"
                      />
                      <Package className="w-6 h-6 text-gray-600" />
                      <div className="flex-1">
                        <p className="font-bold">{order.id}</p>
                        <p className="text-sm text-gray-600">Ordered on {order.date}</p>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Select Items */}
                {selectedOrder && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-4">Select Items to Return</h2>
                    <div className="space-y-4">
                      {eligibleOrders
                        .find(o => o.id === selectedOrder)
                        ?.items.map((item) => (
                          <label
                            key={item.id}
                            className={`flex gap-4 p-4 border-2 rounded-xl cursor-pointer transition ${
                              selectedItems.includes(item.id)
                                ? 'border-black bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={selectedItems.includes(item.id)}
                              onChange={() => toggleItemSelection(item.id)}
                              className="w-5 h-5 mt-1"
                            />
                            <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold mb-1">{item.name}</h3>
                              <p className="text-sm text-gray-600">
                                Size: {item.size} | Color: {item.color}
                              </p>
                              <p className="text-lg font-bold mt-2">${item.price}</p>
                            </div>
                          </label>
                        ))}
                    </div>
                  </div>
                )}

                {/* Return Reason */}
                {selectedItems.length > 0 && (
                  <>
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                      <h2 className="text-xl font-bold mb-4">Reason for Return</h2>
                      <select
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black mb-4"
                      >
                        <option value="">Select a reason</option>
                        {returnReasons.map((r) => (
                          <option key={r} value={r}>{r}</option>
                        ))}
                      </select>

                      <label className="block text-sm font-medium mb-2">
                        Additional Details (Optional)
                      </label>
                      <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please provide any additional information about your return..."
                        rows={4}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
                      />
                    </div>

                    {/* Upload Photos */}
                    <div className="bg-white border border-gray-200 rounded-2xl p-6">
                      <h2 className="text-xl font-bold mb-4">Upload Photos (Optional)</h2>
                      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-black transition cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="font-medium mb-2">Click to upload images</p>
                        <p className="text-sm text-gray-600">
                          Upload photos of the item (if damaged or defective)
                        </p>
                      </div>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition"
                    >
                      Submit Return Request
                    </button>
                  </>
                )}
              </form>
            </div>

            {/* Return Policy Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 sticky top-6">
                <h3 className="font-bold text-lg mb-4">Return Policy</h3>
                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p>30-day return window from delivery date</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p>Items must be unworn and in original condition</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p>Original tags must be attached</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p>Free return shipping</p>
                  </div>
                  <div className="flex gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p>Refund processed within 5-7 business days</p>
                  </div>
                </div>

                <hr className="my-6 border-gray-200" />

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-900 mb-1">Need Help?</p>
                    <p className="text-sm text-blue-700">
                      Contact our support team if you have questions about returns.
                    </p>
                  </div>
                </div>

                <Link
                  href="/support"
                  className="w-full border border-gray-300 text-black py-3 rounded-full font-medium hover:bg-gray-50 transition text-center block mt-4"
                >
                  Contact Support
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
