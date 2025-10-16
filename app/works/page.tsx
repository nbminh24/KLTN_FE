import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Search, ShoppingCart, Truck, Star } from 'lucide-react';

export default function WorksPage() {
  const steps = [
    {
      icon: Search,
      step: '01',
      title: 'Browse & Discover',
      description: 'Explore thousands of products from top brands. Use filters and search to find exactly what you need.',
    },
    {
      icon: ShoppingCart,
      step: '02',
      title: 'Add to Cart',
      description: 'Select your size, color, and quantity. Add items to your cart and continue shopping or proceed to checkout.',
    },
    {
      icon: Truck,
      step: '03',
      title: 'Checkout & Pay',
      description: 'Enter shipping details and choose your preferred payment method. Secure payment processing guaranteed.',
    },
    {
      icon: Star,
      step: '04',
      title: 'Receive & Enjoy',
      description: 'Track your order in real-time. Receive your products and enjoy your new style!',
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">How It Works</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-integral font-bold mb-6">
              HOW IT WORKS
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Shopping made simple. Follow these easy steps to get your favorite fashion items delivered to your door.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-12 mb-16">
            {steps.map((item, index) => (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center gap-8 ${
                  index % 2 === 1 ? 'md:flex-row-reverse' : ''
                }`}
              >
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block bg-black text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
                    STEP {item.step}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">{item.title}</h2>
                  <p className="text-gray-600 text-lg">{item.description}</p>
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="w-48 h-48 bg-gray-100 rounded-full flex items-center justify-center">
                    <item.icon className="w-24 h-24 text-gray-400" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Additional Info */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              {
                title: 'Fast Delivery',
                description: 'Get your orders within 3-5 business days with express shipping options available',
              },
              {
                title: 'Easy Returns',
                description: 'Not satisfied? Return any item within 30 days for a full refund, no questions asked',
              },
              {
                title: 'Secure Shopping',
                description: 'Your payment information is encrypted and secure. Shop with confidence',
              },
            ].map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-6 text-center">
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Ready to Start Shopping?
            </h2>
            <p className="text-lg mb-6 max-w-2xl mx-auto">
              Join thousands of happy customers who trust LeCas for their fashion needs
            </p>
            <Link
              href="/products"
              className="inline-block bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
