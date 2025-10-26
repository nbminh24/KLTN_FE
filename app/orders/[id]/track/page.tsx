'use client';

import { use } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Package, Truck, MapPin, CheckCircle, Clock } from 'lucide-react';

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const orderId = id;

  // Mock tracking data
  const tracking = {
    orderId: orderId,
    trackingNumber: 'TRK123456789',
    courier: 'DHL Express',
    status: 'Out for Delivery',
    estimatedDelivery: 'Today, Jan 20, 2024',
    currentLocation: 'Local Distribution Center - New York',
    timeline: [
      {
        title: 'Order Placed',
        description: 'Your order has been confirmed',
        location: 'New York, NY',
        date: 'Jan 15, 2024',
        time: '10:30 AM',
        completed: true,
      },
      {
        title: 'Order Processed',
        description: 'Your order is being prepared',
        location: 'Warehouse - New Jersey',
        date: 'Jan 15, 2024',
        time: '02:00 PM',
        completed: true,
      },
      {
        title: 'Shipped',
        description: 'Package has been picked up by courier',
        location: 'Shipping Facility - New Jersey',
        date: 'Jan 16, 2024',
        time: '09:00 AM',
        completed: true,
      },
      {
        title: 'In Transit',
        description: 'Package is on the way to destination',
        location: 'Distribution Hub - Philadelphia',
        date: 'Jan 18, 2024',
        time: '03:45 PM',
        completed: true,
      },
      {
        title: 'Out for Delivery',
        description: 'Package is out for delivery',
        location: 'Local Center - New York',
        date: 'Jan 20, 2024',
        time: '08:00 AM',
        completed: true,
        current: true,
      },
      {
        title: 'Delivered',
        description: 'Package will be delivered soon',
        location: 'Your Address',
        date: 'Jan 20, 2024',
        time: 'Expected by 6:00 PM',
        completed: false,
      },
    ],
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
            <Link href={`/orders/${orderId}`} className="text-gray-500">{orderId}</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Track Order</span>
          </div>

          <h1 className="text-2xl md:text-3xl font-integral font-bold mb-8">Track Your Order</h1>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Tracking Timeline */}
            <div className="lg:col-span-2">
              <div className="border border-gray-200 rounded-2xl p-6 md:p-8 mb-6">
                <h2 className="text-xl font-bold mb-6">Shipping Timeline</h2>
                
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-gray-200"></div>
                  
                  <div className="space-y-8">
                    {tracking.timeline.map((step, index) => (
                      <div key={index} className="relative flex gap-5">
                        {/* Icon */}
                        <div className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                          step.current 
                            ? 'bg-blue-500 text-white ring-4 ring-blue-100' 
                            : step.completed 
                            ? 'bg-green-500 text-white' 
                            : 'bg-gray-200 text-gray-400'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <Clock className="w-5 h-5" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pb-8">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h3 className={`font-bold text-base ${step.current ? 'text-blue-600' : step.completed ? 'text-black' : 'text-gray-400'}`}>
                                {step.title}
                                {step.current && (
                                  <span className="ml-2 text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                    Current
                                  </span>
                                )}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                            <MapPin className="w-4 h-4" />
                            <span>{step.location}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-2">
                            {step.date} at {step.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Delivery Instructions */}
              <div className="border border-gray-200 rounded-2xl p-6">
                <h3 className="font-bold text-lg mb-4">Delivery Instructions</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm text-gray-700">
                    Please leave the package at the front door if no one is home. Contact me at the provided phone number if there are any issues.
                  </p>
                </div>
                <button className="mt-4 text-sm font-medium text-black underline hover:no-underline">
                  Update delivery instructions
                </button>
              </div>
            </div>

            {/* Tracking Info Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Current Status */}
              <div className="border border-gray-200 rounded-2xl p-5 bg-gradient-to-br from-blue-50 to-white">
                <div className="flex items-center justify-center w-16 h-16 bg-blue-500 text-white rounded-full mx-auto mb-4">
                  <Truck className="w-8 h-8" />
                </div>
                <h3 className="text-center font-bold text-lg mb-2">{tracking.status}</h3>
                <p className="text-center text-sm text-gray-600 mb-4">
                  Expected delivery: <br />
                  <span className="font-medium text-black">{tracking.estimatedDelivery}</span>
                </p>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Current Location</p>
                  <p className="text-sm font-medium">{tracking.currentLocation}</p>
                </div>
              </div>

              {/* Tracking Details */}
              <div className="border border-gray-200 rounded-2xl p-5">
                <h3 className="font-bold mb-4">Tracking Details</h3>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="text-gray-600">Order ID</p>
                    <p className="font-medium">{tracking.orderId}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Tracking Number</p>
                    <p className="font-medium">{tracking.trackingNumber}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Courier Service</p>
                    <p className="font-medium">{tracking.courier}</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href={`/orders/${orderId}`}
                  className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition text-center block"
                >
                  View Order Details
                </Link>
                <Link
                  href="/support"
                  className="w-full border border-gray-300 text-black py-3 rounded-full font-medium hover:bg-gray-50 transition text-center block"
                >
                  Contact Support
                </Link>
              </div>

              {/* Delivery Info */}
              <div className="bg-gray-50 rounded-xl p-4 text-sm">
                <p className="text-gray-700">
                  <strong>Note:</strong> Please ensure someone is available to receive the package. Valid ID may be required.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
