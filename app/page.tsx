'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { Loader2 } from 'lucide-react';
import productService, { Product } from '@/lib/services/productService';

export default function HomePage() {
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [topSelling, setTopSelling] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHomeProducts();
  }, []);

  const fetchHomeProducts = async () => {
    try {
      setLoading(true);

      // Fetch all sections in parallel
      const [newArrivalsRes, topSellingRes, recommendedRes] = await Promise.all([
        productService.getNewArrivals(1, 4),
        productService.getProducts({ page: 1, limit: 4, sort_by: 'rating' }),
        productService.getProducts({ page: 1, limit: 4, sort_by: 'newest' }),
      ]);

      setNewArrivals(newArrivalsRes.data.data);
      setTopSelling(topSellingRes.data.data);
      setRecommendedProducts(recommendedRes.data.data);
    } catch (error) {
      console.error('Error fetching home products:', error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative min-h-[600px] md:min-h-[750px]" style={{ backgroundColor: '#e6e6e8' }}>
          <div className="container mx-auto px-6 md:px-20 h-full">
            <div className="grid md:grid-cols-2 gap-4 md:gap-2 items-stretch h-full min-h-[600px] md:min-h-[750px]">
              <div className="flex flex-col justify-center space-y-6 py-12 md:py-20">
                <h1 className="text-3xl md:text-5xl font-integral font-bold leading-tight">
                  LeCas - Thanh Lịch Trong Từng Khoảnh Khắc
                </h1>
                <p className="text-gray-600 text-sm md:text-base max-w-xl">
                  Trải nghiệm tinh hoa thời trang nam hiện đại - tinh tế, tự tin và bền vững. Mỗi thiết kế thể hiện sự cân bằng hoàn hảo giữa phong cách và chất lượng dành cho phái mạnh.
                </p>
                <Link
                  href="/products"
                  className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition w-auto max-w-xs text-center"
                >
                  Mua Ngay
                </Link>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 md:gap-6 pt-4">
                  <div>
                    <p className="text-2xl md:text-3xl font-bold">200+</p>
                    <p className="text-gray-600 text-xs md:text-sm">Thương Hiệu Quốc Tế</p>
                  </div>
                  <div className="h-10 w-px bg-gray-300"></div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold">2,000+</p>
                    <p className="text-gray-600 text-xs md:text-sm">Sản Phẩm Chất Lượng Cao</p>
                  </div>
                  <div className="h-10 w-px bg-gray-300"></div>
                  <div>
                    <p className="text-2xl md:text-3xl font-bold">30,000+</p>
                    <p className="text-gray-600 text-xs md:text-sm">Khách Hàng Hài Lòng</p>
                  </div>
                </div>
              </div>

              <div className="relative h-full min-h-[600px] md:min-h-[750px]">
                <Image
                  src="/hero.png"
                  alt="Hero"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="bg-black py-8">
          <div className="container mx-auto px-6 md:px-12">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
              <Link href="/products?category=t-shirts" className="text-white text-xl md:text-2xl font-bold hover:text-gray-300 transition">ÁO THUN</Link>
              <Link href="/products?category=jeans-pants" className="text-white text-xl md:text-2xl font-bold hover:text-gray-300 transition">QUẦN JEANS & KAKI</Link>
              <Link href="/products?category=shirts" className="text-white text-xl md:text-2xl font-bold hover:text-gray-300 transition">ÁO SƠ MI</Link>
              <Link href="/products?category=outerwear" className="text-white text-xl md:text-2xl font-bold hover:text-gray-300 transition">ÁO KHOÁC</Link>
              <Link href="/products?category=accessories" className="text-white text-xl md:text-2xl font-bold hover:text-gray-300 transition">PHỤ KIỆN</Link>
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="container mx-auto px-6 md:px-12 py-10 md:py-14">
          <h2 className="text-2xl md:text-4xl font-integral font-bold text-center mb-6 md:mb-10">
            HÀNG MỚI VỀ
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {newArrivals.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id.toString()}
                    name={product.name}
                    image={product.thumbnail_url || '/bmm32410_black_xl.webp'}
                    price={product.selling_price}
                    originalPrice={product.original_price}
                    rating={product.average_rating || 0}
                    discount={product.discount_percentage}
                    variantId={product.variants?.[0]?.id}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link
                  href="/new-arrivals"
                  className="border border-gray-300 px-12 py-3 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Xem Tất Cả
                </Link>
              </div>
            </>
          )}
        </section>

        <div className="container mx-auto px-6 md:px-12">
          <hr className="border-gray-200" />
        </div>

        {/* Recommended for You - AI Personalization */}
        <section className="container mx-auto px-6 md:px-12 py-10 md:py-14">
          <h2 className="text-2xl md:text-4xl font-integral font-bold text-center mb-6 md:mb-10">
            GỢI Ý DÀNH CHO BẠN
          </h2>
          <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            Dựa trên lịch sử duyệt web và sở thích của bạn, chúng tôi đã tuyển chọn những sản phẩm này dành riêng cho bạn
          </p>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {recommendedProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id.toString()}
                    name={product.name}
                    image={product.thumbnail_url || '/bmm32410_black_xl.webp'}
                    price={product.selling_price}
                    originalPrice={product.original_price}
                    rating={product.average_rating || 0}
                    discount={product.discount_percentage}
                    variantId={product.variants?.[0]?.id}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link
                  href="/products"
                  className="border border-gray-300 px-12 py-3 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Xem Tất Cả
                </Link>
              </div>
            </>
          )}
        </section>

        <div className="container mx-auto px-6 md:px-12">
          <hr className="border-gray-200" />
        </div>

        {/* Top Selling */}
        <section className="container mx-auto px-6 md:px-12 py-10 md:py-14">
          <h2 className="text-2xl md:text-4xl font-integral font-bold text-center mb-6 md:mb-10">
            BÁN CHẠY NHẤT
          </h2>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-gray-600" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {topSelling.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id.toString()}
                    name={product.name}
                    image={product.thumbnail_url || '/bmm32410_black_xl.webp'}
                    price={product.selling_price}
                    originalPrice={product.original_price}
                    rating={product.average_rating || 0}
                    discount={product.discount_percentage}
                    variantId={product.variants?.[0]?.id}
                  />
                ))}
              </div>
              <div className="flex justify-center mt-8">
                <Link
                  href="/products"
                  className="border border-gray-300 px-12 py-3 rounded-full font-medium hover:bg-gray-50 transition"
                >
                  Xem Tất Cả
                </Link>
              </div>
            </>
          )}
        </section>

        {/* Promotional Banners */}
        <section className="container mx-auto px-6 md:px-12 py-10 md:py-14">
          <h2 className="text-2xl md:text-4xl font-integral font-bold text-center mb-6 md:mb-10">
            ƯU ĐÃI ĐẶC BIỆT
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Banner 1 - Sale Shock */}
            <Link href="/sale" className="relative h-64 bg-white border border-gray-300 rounded-3xl overflow-hidden group">
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div>
                  <p className="text-black text-sm font-semibold mb-2">GIẢM GIÁ SỐC</p>
                  <h3 className="text-black text-3xl font-bold mb-2">Giảm Đến 50%</h3>
                  <p className="text-gray-700 text-sm">Thời gian có hạn</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full font-semibold w-fit group-hover:gap-3 transition-all">
                  <span>Mua Ngay</span>
                  <span>→</span>
                </div>
              </div>
            </Link>

            {/* Banner 2 - New Arrivals */}
            <Link href="/new-arrivals" className="relative h-64 bg-white border border-gray-300 rounded-3xl overflow-hidden group">
              <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div>
                  <p className="text-black text-sm font-semibold mb-2">MỚI RA MẮT</p>
                  <h3 className="text-black text-3xl font-bold mb-2">Hàng Mới Về</h3>
                  <p className="text-gray-700 text-sm">Phong cách mới cho mùa</p>
                </div>
                <div className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full font-semibold w-fit group-hover:gap-3 transition-all">
                  <span>Khám Phá Ngay</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="container mx-auto px-6 md:px-12 py-10 md:py-14">
          <h2 className="text-2xl md:text-4xl font-integral font-bold mb-6 md:mb-10">
            KHÁCH HÀNG HÀI LÒNG
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Anh Wilson',
                review: "Tôi thực sự ấn tượng với chất lượng cao và phong cách của trang phục nam tôi nhận được từ LeCas. Từ những món đồ thiết yếu hàng ngày đến những thiết kế thanh lịch hơn, mọi sản phẩm tôi mua đều vượt quá mong đợi về độ bền và vẻ ngoài. LeCas là lựa chọn hàng đầu của tôi cho thời trang nam!",
              },
              {
                name: 'Anh Alex K.',
                review: "Việc tìm quần áo phù hợp với phong cách cá nhân từng là thử thách cho đến khi tôi khám phá ra LeCas. Bộ sưu tập trang phục nam họ cung cấp thực sự đáng chú ý, đáp ứng nhiều khẩu vị và dịp khác nhau. LeCas là điểm đến lý tưởng cho trang phục nam phong cách hàng ngày.",
              },
              {
                name: 'Anh James L.',
                review: "Là người luôn tìm kiếm những món đồ thời trang nam độc đáo, tôi rất vui khi tình cờ biết đến LeCas. Bộ sưu tập quần áo nam không chỉ đa dạng mà còn hoàn toàn phù hợp với xu hướng thời trang nam mới nhất. Mua sắm trang phục nam chất lượng tại LeCas là một trải nghiệm tuyệt vời.",
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
