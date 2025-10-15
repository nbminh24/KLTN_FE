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
                  FIND CLOTHES THAT MATCHES YOUR STYLE
                </h1>
                <p className="text-gray-600 text-sm md:text-base max-w-xl">
                  Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
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
