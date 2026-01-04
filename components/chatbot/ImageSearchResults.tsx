import Link from 'next/link';
import Image from 'next/image';
import { ImageSearchResultsCustomData } from '@/lib/types/chat';

interface ImageSearchResultsProps {
    data: ImageSearchResultsCustomData;
}

function getSimilarityBadgeColor(score: number): string {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    if (score >= 30) return 'bg-orange-100 text-orange-800 border-orange-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
}

function formatSimilarityScore(score: number): string {
    return `${score}%`;
}

export default function ImageSearchResults({ data }: ImageSearchResultsProps) {
    if (!data.products || data.products.length === 0) {
        return (
            <div className="bg-gray-50 rounded-lg p-6 text-center my-2">
                <div className="text-gray-400 mb-3">
                    <svg className="w-12 h-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <p className="text-sm text-gray-700 font-medium mb-2">
                    Hệ thống không tìm thấy sản phẩm tương tự
                </p>
                <p className="text-xs text-gray-600 mb-2">
                    Bạn có thể thử với ảnh khác hoặc chụp ở góc độ rõ ràng hơn.
                </p>
                <p className="text-xs text-gray-600">
                    Hoặc bạn có thể mô tả sản phẩm để chúng tôi hỗ trợ tìm kiếm.
                </p>
            </div>
        );
    }

    const totalProducts = data.products.length;

    return (
        <div className="my-3">
            {/* Header */}
            <div className="mb-3">
                <p className="text-sm text-gray-800 leading-relaxed">
                    Dựa trên ảnh bạn cung cấp, hệ thống đã phân tích và tìm thấy <span className="font-semibold text-blue-600">{totalProducts}</span> sản phẩm có mức độ tương đồng cao.
                </p>
                <p className="text-sm text-gray-800 mt-2">
                    Dưới đây là những sản phẩm giống ảnh nhất mà bạn có thể tham khảo:
                </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 gap-3">
                {data.products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg hover:border-gray-300 transition-all"
                    >
                        {/* Product Image */}
                        <div className="relative aspect-square bg-gray-100">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="(max-width: 768px) 50vw, 200px"
                            />

                            {/* Similarity Badge */}
                            <div className="absolute top-2 right-2">
                                <div className={`px-2 py-1 rounded-full text-xs font-bold border ${getSimilarityBadgeColor(product.similarity)} shadow-sm`}>
                                    {formatSimilarityScore(product.similarity)} tương đồng
                                </div>
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="p-3">
                            <h4 className="text-xs font-medium text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                                {product.name}
                            </h4>

                            <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-gray-900">
                                    {product.price.toLocaleString('vi-VN')}đ
                                </p>
                                <span className="text-xs text-blue-600 font-medium group-hover:underline">
                                    Xem →
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-600">
                    Click vào sản phẩm để xem chi tiết và đặt hàng
                </p>
            </div>
        </div>
    );
}
