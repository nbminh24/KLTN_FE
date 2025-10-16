import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Truck, Shield, CreditCard, Headphones, RefreshCw, Star, Package, Clock } from 'lucide-react';

export default function FeaturesPage() {
  const features = [
    {
      icon: Truck,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $100. Fast delivery within 3-5 business days.',
      color: 'bg-blue-100 text-blue-600',
    },
    {
      icon: Shield,
      title: 'Secure Payment',
      description: '100% secure payment processing. Your data is encrypted and protected.',
      color: 'bg-green-100 text-green-600',
    },
    {
      icon: CreditCard,
      title: 'Multiple Payment Options',
      description: 'Pay with credit card, PayPal, Apple Pay, Google Pay, and more.',
      color: 'bg-purple-100 text-purple-600',
    },
    {
      icon: Headphones,
      title: '24/7 Customer Support',
      description: 'Our support team is available round the clock to help you.',
      color: 'bg-orange-100 text-orange-600',
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day return policy. Free returns on all orders, no questions asked.',
      color: 'bg-red-100 text-red-600',
    },
    {
      icon: Star,
      title: 'Quality Guarantee',
      description: 'All products are authentic and quality-checked before shipping.',
      color: 'bg-yellow-100 text-yellow-600',
    },
    {
      icon: Package,
      title: 'Order Tracking',
      description: 'Real-time tracking for all orders. Know exactly when your package arrives.',
      color: 'bg-indigo-100 text-indigo-600',
    },
    {
      icon: Clock,
      title: 'Quick Processing',
      description: 'Orders processed within 24 hours. Get your items faster.',
      color: 'bg-pink-100 text-pink-600',
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
            <span className="font-medium">Features</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-integral font-bold mb-6">
              WHY SHOP WITH US
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We offer the best shopping experience with features designed to make your life easier
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition"
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 ${feature.color} rounded-full mb-4`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Additional Features */}
          <div className="bg-black text-white rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl md:text-4xl font-bold mb-8 text-center">
              Premium Shopping Experience
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-3">Personalized Recommendations</h3>
                <p className="text-gray-300 text-sm">
                  Get product suggestions based on your style preferences and browsing history
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Size Guide & Fit Finder</h3>
                <p className="text-gray-300 text-sm">
                  Find your perfect fit with our detailed size guides and virtual fit finder
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-3">Exclusive Member Deals</h3>
                <p className="text-gray-300 text-sm">
                  Join our loyalty program and get access to exclusive discounts and early sales
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
