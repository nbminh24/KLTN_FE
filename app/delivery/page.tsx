import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Truck, Clock, MapPin, Package } from 'lucide-react';

export default function DeliveryPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Delivery Details</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-integral font-bold mb-6">
              DELIVERY INFORMATION
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our shipping and delivery options
            </p>
          </div>

          {/* Delivery Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Truck,
                title: 'Standard Delivery',
                time: '3-5 Business Days',
                price: 'Free (Domestic)',
              },
              {
                icon: Clock,
                title: 'Express Delivery',
                time: '1-2 Business Days',
                price: '$15.99',
              },
              {
                icon: Package,
                title: 'Next Day Delivery',
                time: 'Order by 2PM',
                price: '$24.99',
              },
            ].map((option, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-6 text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-4">
                  <option.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                <p className="text-gray-600 mb-1">{option.time}</p>
                <p className="text-gray-900 font-medium">{option.price}</p>
              </div>
            ))}
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Shipping Locations</h2>
              <p className="text-gray-700 mb-4">
                We ship nationwide across Vietnam with free domestic delivery. International shipping is also available to select regions worldwide.
              </p>
              <div className="bg-gray-100 rounded-xl p-6 mb-4">
                <h3 className="font-bold mb-3">Domestic Shipping (Vietnam)</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Nationwide delivery: 3-5 business days</li>
                  <li>• Major cities (Hanoi, HCMC, Da Nang): 1-2 business days</li>
                  <li>• <strong>Free shipping</strong> on all domestic orders</li>
                </ul>
              </div>
              <div className="bg-gray-100 rounded-xl p-6">
                <h3 className="font-bold mb-3">International Shipping</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Asia (Thailand, Singapore, Malaysia, etc.): 5-7 business days - $8.99</li>
                  <li>• Rest of the world: 10-14 business days - $15.99</li>
                  <li>• Express international shipping available upon request</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Order Tracking</h2>
              <p className="text-gray-700 mb-4">
                Once your order has been shipped, you will receive a tracking number via email. You can track your package in real-time through our website or directly on the carrier's website.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Delivery Issues</h2>
              <p className="text-gray-700 mb-4">
                If you experience any issues with your delivery, please contact our customer support team immediately. We're here to help resolve any problems quickly.
              </p>
              <div className="bg-gray-100 rounded-xl p-6">
                <h3 className="font-bold mb-2">Common Issues:</h3>
                <ul className="space-y-2 text-gray-700 text-sm">
                  <li>• Package not received</li>
                  <li>• Damaged items</li>
                  <li>• Wrong address</li>
                  <li>• Delayed delivery</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">Customs & Duties</h2>
              <p className="text-gray-700">
                For international orders, customs duties and taxes may apply depending on your country's regulations. These charges are the responsibility of the recipient and are not included in the product or shipping price.
              </p>
            </section>
          </div>

          {/* CTA */}
          <div className="mt-12 text-center">
            <Link
              href="/support"
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
