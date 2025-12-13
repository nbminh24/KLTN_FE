import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Users, Target, Award, Heart } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">About</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-3xl md:text-5xl font-integral font-bold mb-6">
              ABOUT LECAS
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We're passionate about bringing you the best fashion from around the world.
              Our mission is to make style accessible to everyone.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {[
              { number: '200+', label: 'International Brands' },
              { number: '2,000+', label: 'High-Quality Products' },
              { number: '30,000+', label: 'Happy Customers' },
              { number: '50+', label: 'Countries Shipping' },
            ].map((stat, index) => (
              <div key={index} className="text-center p-6 border border-gray-200 rounded-2xl">
                <p className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</p>
                <p className="text-gray-600 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Values */}
          <div className="mb-16">
            <h2 className="text-2xl md:text-4xl font-integral font-bold text-center mb-12">
              OUR VALUES
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Target,
                  title: 'Quality First',
                  description: 'We carefully curate every product to ensure the highest quality standards.',
                },
                {
                  icon: Users,
                  title: 'Customer Focused',
                  description: 'Your satisfaction is our priority. We listen and adapt to your needs.',
                },
                {
                  icon: Award,
                  title: 'Authenticity',
                  description: 'All products are 100% authentic from verified brand partners.',
                },
                {
                  icon: Heart,
                  title: 'Sustainability',
                  description: 'We\'re committed to sustainable fashion and ethical practices.',
                },
              ].map((value, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-black bg-white rounded-full mb-4">
                    <value.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Story */}
          <div className="bg-gray-100 rounded-3xl p-8 md:p-12 mb-16">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold mb-6">THE NEW ERA OF CASUAL ELEGANCE</h2>
              <div className="space-y-4 text-gray-700">
                <p>
                  LeCas was born in 2025 with a disruptive vision: to redefine casual male fashion. We saw a gap between comfort and sophistication, and we filled it. What started as a focused online studio dedicated to premium menswear essentials has quickly grown into the definitive hub for the modern man's wardrobe.
                </p>
                <p>
                  Today, we aren't just selling clothes; we are curating a lifestyle. LeCas is the trusted destination for those who believe in subtle power dressing. Our commitment goes beyond fabric—it's built on quality, refined design, and genuine self-expression. We ship to over 50 countries, proving that Casually Elegant is a global mindset.
                </p>
                <p>
                  We believe true style is effortless. Join the LeCas movement and wear your confidence.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Join Our Fashion Journey
            </h2>
            <p className="text-gray-600 mb-6">
              Discover thousands of products from the world's best brands
            </p>
            <Link
              href="/products"
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
