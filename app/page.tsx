import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';

// Mock data - Replace with API calls later
const newArrivals = [
  {
    id: '1',
    name: 'T-SHIRT WITH TAPE DETAILS',
    image: '/bmm32410_black_xl.webp',
    price: 120,
    rating: 4.5,
  },
  {
    id: '2',
    name: 'SKINNY FIT JEANS',
    image: '/bmm32410_black_xl.webp',
    price: 240,
    originalPrice: 260,
    rating: 3.5,
    discount: 20,
  },
  {
    id: '3',
    name: 'CHECKERED SHIRT',
    image: '/bmm32410_black_xl.webp',
    price: 180,
    rating: 4.5,
  },
  {
    id: '4',
    name: 'SLEEVE STRIPED T-SHIRT',
    image: '/bmm32410_black_xl.webp',
    price: 130,
    originalPrice: 160,
    rating: 4.5,
    discount: 30,
  },
];

// AI-Personalized recommendations based on user behavior
const recommendedForYou = [
  {
    id: '9',
    name: 'CLASSIC POLO SHIRT',
    image: '/bmm32410_black_xl.webp',
    price: 165,
    rating: 4.7,
  },
  {
    id: '10',
    name: 'SLIM FIT CHINOS',
    image: '/bmm32410_black_xl.webp',
    price: 195,
    originalPrice: 220,
    rating: 4.3,
    discount: 11,
  },
  {
    id: '11',
    name: 'CASUAL BLAZER',
    image: '/bmm32410_black_xl.webp',
    price: 280,
    rating: 4.9,
  },
  {
    id: '12',
    name: 'DENIM JACKET',
    image: '/bmm32410_black_xl.webp',
    price: 230,
    originalPrice: 270,
    rating: 4.6,
    discount: 15,
  },
];

const topSelling = [
  {
    id: '5',
    name: 'VERTICAL STRIPED SHIRT',
    image: '/bmm32410_black_xl.webp',
    price: 212,
    originalPrice: 232,
    rating: 5.0,
    discount: 20,
  },
  {
    id: '6',
    name: 'COURAGE GRAPHIC T-SHIRT',
    image: '/bmm32410_black_xl.webp',
    price: 145,
    rating: 4.0,
  },
  {
    id: '7',
    name: 'LOOSE FIT BERMUDA SHORTS',
    image: '/bmm32410_black_xl.webp',
    price: 80,
    rating: 3.0,
  },
  {
    id: '8',
    name: 'FADED SKINNY JEANS',
    image: '/bmm32410_black_xl.webp',
    price: 210,
    rating: 4.5,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[600px] md:min-h-[750px]" style={{ backgroundColor: '#dadee3' }}>
          <div className="container mx-auto px-6 md:px-20 h-full">
            <div className="grid md:grid-cols-2 gap-4 md:gap-2 items-stretch h-full min-h-[600px] md:min-h-[750px]">
              <div className="flex flex-col justify-center space-y-6 py-12 md:py-20">
                <h1 className="text-3xl md:text-5xl font-integral font-bold leading-tight">
                  LeCas - Casually Elegant Every Moment
                </h1>
                <p className="text-gray-600 text-sm md:text-base max-w-xl">
                  Experience the essence of modern men's fashion - refined, confident, and built to last. Every design embodies a balance of style and quality made for today's man.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition w-auto max-w-xs text-center"
                >
                  Shop Now
                </Link>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 md:gap-6 pt-4">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold">200+</p>
                    <p className="text-gray-600 text-xs md:text-sm">International Brands</p>
                  </div>
                  <div className="h-10 w-px bg-gray-300"></div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold">2,000+</p>
                    <p className="text-gray-600 text-xs md:text-sm">High-Quality Products</p>
                  </div>
                  <div className="h-10 w-px bg-gray-300"></div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold">30,000+</p>
                    <p className="text-gray-600 text-xs md:text-sm">Happy Customers</p>
                  </div>
                </div>
              </div>

              <div className="relative h-full min-h-[600px] md:min-h-[750px]">
                <Image
                  src="/bmm32410_black_xl-Photoroom.png"
                  alt="Hero"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Brands Section */}
        <section className="bg-black py-8">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              <div className="text-white text-2xl md:text-3xl font-bold">VERSACE</div>
              <div className="text-white text-2xl md:text-3xl font-bold">ZARA</div>
              <div className="text-white text-2xl md:text-3xl font-bold">GUCCI</div>
              <div className="text-white text-2xl md:text-3xl font-bold">PRADA</div>
              <div className="text-white text-2xl md:text-3xl font-bold">Calvin Klein</div>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="container mx-auto px-6 md:px-12 py-10 md:py-14">
          <h2 className="text-2xl md:text-4xl font-integral font-bold text-center mb-6 md:mb-10">
            NEW ARRIVALS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link
              href="/products"
              className="border border-gray-300 px-12 py-3 rounded-full font-medium hover:bg-gray-50 transition"
            >
              View All
            </Link>
          </div>
        </section>

        <div className="container mx-auto px-6 md:px-12">
          <hr className="border-gray-200" />
        </div>

        {/* Recommended for You - AI Personalization */}
        <section className="container mx-auto px-6 md:px-12 py-10 md:py-14">
          <div className="flex items-center justify-center gap-3 mb-6 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-integral font-bold text-center">
              RECOMMENDED FOR YOU
            </h2>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 border border-purple-300 rounded-full">
              <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
              </svg>
              <span className="text-xs font-bold text-purple-700">AI Powered</span>
            </div>
          </div>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Based on your browsing history and preferences, we've curated these items just for you
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {recommendedForYou.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link
              href="/products"
              className="border border-gray-300 px-12 py-3 rounded-full font-medium hover:bg-gray-50 transition"
            >
              View All
            </Link>
          </div>
        </section>

        <div className="container mx-auto px-6 md:px-12">
          <hr className="border-gray-200" />
        </div>

        {/* Top Selling */}
        <section className="container mx-auto px-6 md:px-12 py-10 md:py-14">
          <h2 className="text-2xl md:text-4xl font-integral font-bold text-center mb-6 md:mb-10">
            TOP SELLING
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {topSelling.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
          <div className="flex justify-center mt-8">
            <Link
              href="/products"
              className="border border-gray-300 px-12 py-3 rounded-full font-medium hover:bg-gray-50 transition"
            >
              View All
            </Link>
          </div>
        </section>

        {/* Browse by Style */}
        <section className="container mx-auto px-6 md:px-12 py-10 md:py-14">
          <div className="bg-gray-100 rounded-3xl p-6 md:p-12">
            <h2 className="text-2xl md:text-4xl font-integral font-bold text-center mb-6 md:mb-10">
              BROWSE BY DRESS STYLE
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link href="/products?style=casual" className="relative h-48 md:h-56 bg-white rounded-2xl overflow-hidden group">
                <Image src="https://placehold.co/973x649" alt="Casual" fill className="object-cover group-hover:scale-105 transition" />
                <span className="absolute top-4 left-4 text-xl md:text-2xl font-bold">Casual</span>
              </Link>
              <Link href="/products?style=formal" className="relative h-48 md:h-56 md:col-span-2 bg-white rounded-2xl overflow-hidden group">
                <Image src="https://placehold.co/1306x870" alt="Formal" fill className="object-cover group-hover:scale-105 transition" />
                <span className="absolute top-4 left-4 text-xl md:text-2xl font-bold">Formal</span>
              </Link>
              <Link href="/products?style=party" className="relative h-48 md:h-56 md:col-span-2 bg-white rounded-2xl overflow-hidden group">
                <Image src="https://placehold.co/770x616" alt="Party" fill className="object-cover group-hover:scale-105 transition" />
                <span className="absolute top-4 left-4 text-xl md:text-2xl font-bold">Party</span>
              </Link>
              <Link href="/products?style=gym" className="relative h-48 md:h-56 bg-white rounded-2xl overflow-hidden group">
                <Image src="https://placehold.co/452x677" alt="Gym" fill className="object-cover group-hover:scale-105 transition" />
                <span className="absolute top-4 left-4 text-xl md:text-2xl font-bold">Gym</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="container mx-auto px-6 md:px-12 py-10 md:py-14">
          <h2 className="text-2xl md:text-4xl font-integral font-bold mb-6 md:mb-10">
            OUR HAPPY CUSTOMERS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Sarah M.',
                review: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations.",
              },
              {
                name: 'Alex K.',
                review: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions.",
              },
              {
                name: 'James L.',
                review: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends.",
              },
            ].map((testimonial, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <p className="font-bold">{testimonial.name}</p>
                  <span className="text-green-500">✓</span>
                </div>
                <p className="text-gray-600">{testimonial.review}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
