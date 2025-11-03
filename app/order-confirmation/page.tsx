'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Package, Mail, ArrowRight, Home, Download } from 'lucide-react';

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || 'ORD-001';
  const [confetti, setConfetti] = useState(false);

  useEffect(() => {
    // Trigger confetti animation
    setConfetti(true);
    setTimeout(() => setConfetti(false), 3000);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 py-12">
          <div className="max-w-2xl mx-auto">
            {/* Success Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6 animate-bounce">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-integral font-bold mb-4">
                Order Confirmed!
              </h1>
              <p className="text-gray-600 text-lg">
                Thank you for your purchase. Your order has been received and is being processed.
              </p>
            </div>

            {/* Order Info Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-6 space-y-6">
              <div className="flex items-center justify-between pb-6 border-b">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <p className="text-2xl font-bold">{orderId}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-xl">
                  <Package className="w-8 h-8 text-green-600" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-2">Estimated Delivery</p>
                  <p className="font-bold text-lg">5-7 Business Days</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-2">Order Total</p>
                  <p className="font-bold text-lg">$467.00</p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900 mb-1">Check your email</p>
                  <p className="text-sm text-blue-700">
                    We've sent a confirmation email with order details and tracking information.
                  </p>
                </div>
              </div>
            </div>

            {/* What's Next */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-6">
              <h2 className="text-xl font-bold mb-6">What happens next?</h2>
              <div className="space-y-5">
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <p className="font-medium mb-1">Order Processing</p>
                    <p className="text-sm text-gray-600">We'll prepare your items for shipping within 24 hours.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <p className="font-medium mb-1">Shipping Updates</p>
                    <p className="text-sm text-gray-600">You'll receive tracking information once your order ships.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <p className="font-medium mb-1">Delivery</p>
                    <p className="text-sm text-gray-600">Your order will arrive within 5-7 business days.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <Link
                href={`/orders/${orderId}`}
                className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 group"
              >
                View Order Details
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    // Mock download invoice
                    const link = document.createElement('a');
                    link.href = '#';
                    link.download = `invoice-${orderId}.pdf`;
                    alert(`Downloading invoice for order ${orderId}`);
                  }}
                  className="border border-gray-300 text-black py-4 rounded-full font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Invoice
                </button>
                <Link
                  href="/"
                  className="border border-gray-300 text-black py-4 rounded-full font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
                >
                  <Home className="w-5 h-5" />
                  Continue Shopping
                </Link>
              </div>
            </div>

            {/* Help Section */}
            <div className="text-center mt-8">
              <p className="text-gray-600 mb-2">Need help with your order?</p>
              <Link href="/support" className="text-black font-medium underline hover:no-underline">
                Contact Customer Support
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
