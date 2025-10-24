'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Star } from 'lucide-react';

const brands = [
  { id: '1', name: 'VERSACE', description: 'Luxury Italian fashion', products: 245, rating: 4.8 },
  { id: '2', name: 'ZARA', description: 'Spanish fast fashion', products: 890, rating: 4.5 },
  { id: '3', name: 'GUCCI', description: 'Italian luxury brand', products: 320, rating: 4.9 },
  { id: '4', name: 'PRADA', description: 'Italian fashion house', products: 280, rating: 4.7 },
  { id: '5', name: 'Calvin Klein', description: 'American fashion brand', products: 450, rating: 4.6 },
  { id: '6', name: 'H&M', description: 'Swedish fashion retailer', products: 1200, rating: 4.3 },
  { id: '7', name: 'NIKE', description: 'Athletic footwear & apparel', products: 680, rating: 4.8 },
  { id: '8', name: 'ADIDAS', description: 'German sportswear', products: 590, rating: 4.7 },
  { id: '9', name: 'UNIQLO', description: 'Japanese casual wear', products: 760, rating: 4.4 },
  { id: '10', name: 'LEVI\'S', description: 'American denim brand', products: 340, rating: 4.6 },
  { id: '11', name: 'TOMMY HILFIGER', description: 'American premium brand', products: 420, rating: 4.5 },
  { id: '12', name: 'LACOSTE', description: 'French clothing company', products: 290, rating: 4.6 },
];

export default function BrandsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Brands</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-integral font-bold mb-4">
              OUR BRANDS
            </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Shop from the world's most iconic fashion brands. Quality, style, and authenticity guaranteed.
            </p>
          </div>

          {/* Brands Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {brands.map((brand) => (
              <Link
                key={brand.id}
                href={`/products?brand=${brand.name.toLowerCase()}`}
                className="border border-gray-200 rounded-2xl p-6 hover:shadow-lg transition group"
              >
                <div className="text-center space-y-4">
                  <div className="bg-gray-100 h-32 rounded-xl flex items-center justify-center group-hover:bg-gray-200 transition">
                    <h3 className="text-2xl font-bold">{brand.name}</h3>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{brand.description}</p>
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{brand.rating}</span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600">{brand.products} products</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-black text-white rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-4xl font-bold mb-4">
              Can't find your favorite brand?
            </h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              We're constantly adding new brands to our collection. Let us know what you're looking for!
            </p>
            <Link
              href="/contact"
              className="inline-block bg-white text-black px-8 py-3 rounded-full font-medium hover:bg-gray-100 transition"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
