'use client';

import { useState, use, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Upload, X, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

type VariantOption = {
  value: string;
  label: string;
  hex?: string;
};

type Variant = {
  id: string;
  size: string;
  color: string;
  sku: string;
  active: boolean;
  status: 'normal' | 'stopped'; // 'stopped' = bị ngừng kinh doanh do uncheck size/color
  images: string[];
  primaryImage?: string;
  stock: number;
  hasSales: boolean; // có data bán hàng không
};

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  
  // Step 1 data
  const [productName, setProductName] = useState('Gradient Graphic T-shirt');
  const [description, setDescription] = useState('This graphic t-shirt which is perfect for any occasion.');
  const [productDetails, setProductDetails] = useState('Chất liệu: 100% Cotton cao cấp\nCách giặt: Giặt máy ở nhiệt độ thường\nXuất xứ: Việt Nam');
  const [category, setCategory] = useState('T-Shirts');
  const [costPrice, setCostPrice] = useState('100');
  const [sellPrice, setSellPrice] = useState('145');
  const [productActive, setProductActive] = useState(true);
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [selectedColors, setSelectedColors] = useState<string[]>(['BLACK', 'WHITE']);
  const [initialSizes, setInitialSizes] = useState<string[]>(['S', 'M', 'L', 'XL']);
  const [initialColors, setInitialColors] = useState<string[]>(['BLACK', 'WHITE']);

  // Step 2 data
  const [variants, setVariants] = useState<Variant[]>([
    { id: 'v1', size: 'S', color: 'Black', sku: 'TSH-001-S-BLK', active: true, status: 'normal', images: ['/bmm32410_black_xl.webp'], primaryImage: '/bmm32410_black_xl.webp', stock: 50, hasSales: true },
    { id: 'v2', size: 'S', color: 'White', sku: 'TSH-001-S-WHT', active: true, status: 'normal', images: ['/bmm32410_black_xl.webp'], primaryImage: '/bmm32410_black_xl.webp', stock: 30, hasSales: false },
    { id: 'v3', size: 'M', color: 'Black', sku: 'TSH-001-M-BLK', active: true, status: 'normal', images: ['/bmm32410_black_xl.webp'], primaryImage: '/bmm32410_black_xl.webp', stock: 75, hasSales: true },
    { id: 'v4', size: 'M', color: 'White', sku: 'TSH-001-M-WHT', active: true, status: 'normal', images: ['/bmm32410_black_xl.webp'], primaryImage: '/bmm32410_black_xl.webp', stock: 45, hasSales: false },
    { id: 'v5', size: 'L', color: 'Black', sku: 'TSH-001-L-BLK', active: true, status: 'normal', images: ['/bmm32410_black_xl.webp'], primaryImage: '/bmm32410_black_xl.webp', stock: 100, hasSales: true },
    { id: 'v6', size: 'L', color: 'White', sku: 'TSH-001-L-WHT', active: true, status: 'normal', images: ['/bmm32410_black_xl.webp'], primaryImage: '/bmm32410_black_xl.webp', stock: 60, hasSales: false },
    { id: 'v7', size: 'XL', color: 'Black', sku: 'TSH-001-XL-BLK', active: true, status: 'normal', images: ['/bmm32410_black_xl.webp'], primaryImage: '/bmm32410_black_xl.webp', stock: 20, hasSales: true },
    { id: 'v8', size: 'XL', color: 'White', sku: 'TSH-001-XL-WHT', active: true, status: 'normal', images: ['/bmm32410_black_xl.webp'], primaryImage: '/bmm32410_black_xl.webp', stock: 15, hasSales: false },
  ]);

  const sizes: VariantOption[] = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: '3XL', label: '3XL' },
    { value: '4XL', label: '4XL' },
  ];

  const colors: VariantOption[] = [
    { value: 'BLACK', label: 'Black', hex: '#000000' },
    { value: 'WHITE', label: 'White', hex: '#FFFFFF' },
    { value: 'RED', label: 'Red', hex: '#EF4444' },
    { value: 'BLUE', label: 'Blue', hex: '#3B82F6' },
    { value: 'GREEN', label: 'Green', hex: '#10B981' },
    { value: 'YELLOW', label: 'Yellow', hex: '#F59E0B' },
    { value: 'PINK', label: 'Pink', hex: '#EC4899' },
    { value: 'PURPLE', label: 'Purple', hex: '#8B5CF6' },
  ];

  const toggleSize = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors(prev =>
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const updateVariantsMatrix = () => {
    const baseProductSku = productName.substring(0, 3).toUpperCase() || 'PRD';
    const updatedVariants: Variant[] = [...variants];

    // 1. Tìm variants bị REMOVED (size hoặc color bị uncheck)
    variants.forEach(variant => {
      const sizeRemoved = !selectedSizes.includes(variant.size);
      const colorValue = colors.find(c => c.label === variant.color)?.value || variant.color;
      const colorRemoved = !selectedColors.includes(colorValue);

      if (sizeRemoved || colorRemoved) {
        // Ngừng kinh doanh variant này
        const idx = updatedVariants.findIndex(v => v.id === variant.id);
        if (idx !== -1) {
          updatedVariants[idx] = {
            ...variant,
            status: 'stopped',
            active: false,
          };
        }
      }
    });

    // 2. Tìm variants mới (size và color mới được thêm vào)
    const newVariants: Variant[] = [];
    selectedSizes.forEach(size => {
      selectedColors.forEach(colorValue => {
        const colorLabel = colors.find(c => c.value === colorValue)?.label || colorValue;
        
        // Kiểm tra xem variant này đã tồn tại chưa
        const exists = updatedVariants.find(
          v => v.size === size && v.color === colorLabel
        );

        if (!exists) {
          // Tạo variant mới
          newVariants.push({
            id: `new-${size}-${colorValue}`,
            size,
            color: colorLabel,
            sku: `${baseProductSku}-${size}-${colorValue.substring(0, 3)}`,
            active: true,
            status: 'normal',
            images: [],
            stock: 0,
            hasSales: false,
          });
        }
      });
    });

    setVariants([...updatedVariants, ...newVariants]);
    setStep(2);
  };

  const toggleVariantActive = (variantId: string) => {
    setVariants(prev =>
      prev.map(v => {
        if (v.id === variantId) {
          // Nếu variant bị stopped, không cho phép toggle
          if (v.status === 'stopped') {
            alert('Không thể bật lại variant này. Vui lòng quay lại Bước 1 và chọn lại size/color.');
            return v;
          }
          return { ...v, active: !v.active };
        }
        return v;
      })
    );
  };

  const handleImageUpload = (variantId: string, files: FileList | null) => {
    if (!files) return;
    const urls = Array.from(files).map(f => URL.createObjectURL(f));
    setVariants(prev =>
      prev.map(v => {
        if (v.id === variantId) {
          const newImages = [...v.images, ...urls];
          return {
            ...v,
            images: newImages,
            primaryImage: v.primaryImage || newImages[0],
          };
        }
        return v;
      })
    );
  };

  const setPrimaryImage = (variantId: string, imageUrl: string) => {
    setVariants(prev =>
      prev.map(v => (v.id === variantId ? { ...v, primaryImage: imageUrl } : v))
    );
  };

  const removeImage = (variantId: string, imageUrl: string) => {
    setVariants(prev =>
      prev.map(v => {
        if (v.id === variantId) {
          const newImages = v.images.filter(img => img !== imageUrl);
          return {
            ...v,
            images: newImages,
            primaryImage: v.primaryImage === imageUrl ? newImages[0] : v.primaryImage,
          };
        }
        return v;
      })
    );
  };

  const handleSubmit = () => {
    alert('Sản phẩm đã được cập nhật thành công!');
    router.push('/admin/products');
  };

  const handleBack = () => {
    setStep(1);
  };

  const stoppedVariants = variants.filter(v => v.status === 'stopped');
  const newVariants = variants.filter(v => v.id.startsWith('new-'));

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg transition">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-[#202224]">Chỉnh sửa sản phẩm</h1>
          <p className="text-gray-600 mt-1">
            Product ID: {id} - Bước {step}/2 - {step === 1 ? 'Thông tin chung' : 'Quản lý variants'}
          </p>
        </div>
      </div>

      {/* Step 1: General Information */}
      {step === 1 && (
        <div className="max-w-4xl space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Thông tin chung</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Mô tả ngắn</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                ></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Mô tả chi tiết</label>
                <textarea
                  value={productDetails}
                  onChange={(e) => setProductDetails(e.target.value)}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                ></textarea>
              </div>
            </div>
          </div>

          {/* Category & Pricing */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Category & Giá</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-3">
                <label className="block text-sm font-semibold mb-2">Category *</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                >
                  <option>T-Shirts</option>
                  <option>Shirts</option>
                  <option>Jeans</option>
                  <option>Hoodies</option>
                  <option>Shorts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Giá nhập *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={costPrice}
                    onChange={(e) => setCostPrice(e.target.value)}
                    required
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2">Giá bán *</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    required
                    step="0.01"
                    className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Variants Selection */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Variants</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-3">Chọn Size *</label>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size.value}
                      type="button"
                      onClick={() => toggleSize(size.value)}
                      className={`px-4 py-2 border rounded-lg font-semibold transition ${
                        selectedSizes.includes(size.value)
                          ? 'border-[#4880FF] bg-blue-50 text-[#4880FF]'
                          : 'border-gray-300 hover:border-[#4880FF] hover:bg-blue-50'
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-3">Chọn Color *</label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => toggleColor(color.value)}
                      className={`flex items-center gap-2 px-4 py-2 border rounded-lg font-semibold transition ${
                        selectedColors.includes(color.value)
                          ? 'border-[#4880FF] bg-blue-50 text-[#4880FF]'
                          : 'border-gray-300 hover:border-[#4880FF] hover:bg-blue-50'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      ></div>
                      {color.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Product Status */}
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold mb-4">Trạng thái</h2>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="active"
                checked={productActive}
                onChange={(e) => setProductActive(e.target.checked)}
                className="w-5 h-5"
              />
              <label htmlFor="active" className="text-sm font-semibold">
                Active (Sản phẩm sẽ hiển thị trên cửa hàng)
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={updateVariantsMatrix}
              disabled={!productName || !category || selectedSizes.length === 0 || selectedColors.length === 0}
              className="px-8 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Tiếp theo: Quản lý Variants
            </button>
            <Link
              href="/admin/products"
              className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition inline-block"
            >
              Hủy
            </Link>
          </div>
        </div>
      )}

      {/* Step 2: Manage Variants */}
      {step === 2 && (
        <div className="space-y-6">
          {/* Warnings */}
          {stoppedVariants.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-yellow-900">
                    Cảnh báo: {stoppedVariants.length} variants đã bị ngừng kinh doanh
                  </p>
                  <p className="text-sm text-yellow-800 mt-1">
                    Do bạn đã bỏ chọn size hoặc color, các variants sau sẽ bị ngừng kinh doanh (không xóa để bảo toàn data lịch sử):
                  </p>
                  <ul className="text-sm text-yellow-800 mt-2 list-disc list-inside">
                    {stoppedVariants.map(v => (
                      <li key={v.id}>{v.sku} - {v.size} / {v.color}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {newVariants.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-900">
                <strong>Thông báo:</strong> {newVariants.length} variants mới sẽ được tạo do bạn đã thêm size/color mới.
              </p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#F1F4F9]">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">SKU</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Size</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Color</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Ảnh</th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Active</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {variants.map((variant) => (
                    <tr 
                      key={variant.id} 
                      className={`${variant.status === 'stopped' ? 'bg-red-50 opacity-60' : !variant.active ? 'opacity-50' : ''}`}
                    >
                      <td className="px-6 py-4 text-sm font-mono">
                        {variant.sku}
                        {variant.status === 'stopped' && (
                          <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">STOPPED</span>
                        )}
                        {variant.id.startsWith('new-') && (
                          <span className="ml-2 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-bold rounded">NEW</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{variant.size}</td>
                      <td className="px-6 py-4 text-sm">{variant.color}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`font-bold ${variant.stock > 50 ? 'text-green-600' : variant.stock > 0 ? 'text-yellow-600' : 'text-gray-400'}`}>
                          {variant.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          {variant.images.length > 0 ? (
                            <>
                              {variant.images.slice(0, 3).map((img, idx) => (
                                <div
                                  key={idx}
                                  className={`relative w-12 h-12 rounded-lg overflow-hidden cursor-pointer ${
                                    variant.primaryImage === img ? 'ring-2 ring-[#4880FF]' : ''
                                  }`}
                                  onClick={() => setPrimaryImage(variant.id, img)}
                                >
                                  <Image src={img} alt="" fill className="object-cover" />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      removeImage(variant.id, img);
                                    }}
                                    className="absolute top-0 right-0 p-0.5 bg-red-500 text-white rounded-bl"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                </div>
                              ))}
                              {variant.images.length > 3 && (
                                <span className="text-xs text-gray-500">+{variant.images.length - 3}</span>
                              )}
                            </>
                          ) : null}
                          {variant.status !== 'stopped' && (
                            <label className="cursor-pointer">
                              <div className="w-12 h-12 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-[#4880FF] transition">
                                <Upload className="w-4 h-4 text-gray-400" />
                              </div>
                              <input
                                type="file"
                                multiple
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleImageUpload(variant.id, e.target.files)}
                              />
                            </label>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleVariantActive(variant.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg transition"
                          disabled={variant.status === 'stopped'}
                          title={
                            variant.status === 'stopped'
                              ? 'Variant bị ngừng kinh doanh. Quay lại Bước 1 để bật lại.'
                              : variant.active
                              ? 'Disable variant'
                              : 'Enable variant'
                          }
                        >
                          {variant.status === 'stopped' ? (
                            <EyeOff className="w-5 h-5 text-red-400" />
                          ) : variant.active ? (
                            <Eye className="w-5 h-5 text-green-600" />
                          ) : (
                            <EyeOff className="w-5 h-5 text-gray-400" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              className="px-8 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition"
            >
              Cập nhật sản phẩm
            </button>
            <button
              type="button"
              onClick={handleBack}
              className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Quay lại
            </button>
            <Link
              href="/admin/products"
              className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition inline-block"
            >
              Hủy
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
