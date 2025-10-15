import Link from 'next/link';
import Image from 'next/image';
import { Star } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  image: string;
  price: number;
  originalPrice?: number;
  rating: number;
  discount?: number;
}

export default function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  discount,
}: ProductCardProps) {
  return (
    <Link href={`/products/${id}`} className="group">
      <div className="space-y-3">
        {/* Product Image */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden group" style={{ backgroundColor: '#dadee3' }}>
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          <h3 className="font-bold text-sm md:text-base line-clamp-1">{name}</h3>
          
          {/* Rating */}
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 md:w-4 md:h-4 ${
                    i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs md:text-sm">
              <span className="font-medium">{rating}</span>
              <span className="text-gray-500">/5</span>
            </span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg md:text-xl font-bold">${price}</span>
            {originalPrice && (
              <>
                <span className="text-lg md:text-xl font-bold text-gray-400 line-through">
                  ${originalPrice}
                </span>
                {discount && (
                  <span className="bg-red-100 text-red-600 text-xs font-medium px-2 py-0.5 rounded-full">
                    -{discount}%
                  </span>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
