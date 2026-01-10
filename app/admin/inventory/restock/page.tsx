'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Check, Loader2, Package } from 'lucide-react';
import adminInventoryService, { CreateRestockBatchData } from '@/lib/services/admin/inventoryService';
import adminProductService from '@/lib/services/admin/productService';
import { showToast } from '@/components/Toast';

interface RestockItem {
    variant_id: number;
    product_id: number;
    product_name: string;
    size_id: number;
    size_name: string;
    color_id: number;
    color_name: string;
    quantity: number;
}

export default function RestockPage() {
    const [items, setItems] = useState<RestockItem[]>([]);
    const [products, setProducts] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [batchType, setBatchType] = useState<'Manual' | 'Auto'>('Manual');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoadingProducts(true);
            const response = await adminProductService.getProducts({
                page: 1,
                limit: 100,
                status: 'active',
                include_variants: true
            } as any);
            console.log('📡 Products API response:', response.data);
            const backendData: any = response.data;
            const productsList = backendData.data || backendData.products || [];
            console.log('📦 Products loaded:', productsList.length, 'products');
            console.log('🔍 First product sample:', productsList[0]);
            console.log('🔍 Has variants?', productsList[0]?.variants ? 'Yes ✅' : 'No ❌');
            setProducts(productsList);
        } catch (error) {
            console.error('Failed to load products:', error);
            showToast('Không thể tải danh sách sản phẩm', 'error');
        } finally {
            setLoadingProducts(false);
        }
    };

    const addItem = () => {
        setItems([
            ...items,
            {
                variant_id: 0,
                product_id: 0,
                product_name: '',
                size_id: 0,
                size_name: '',
                color_id: 0,
                color_name: '',
                quantity: 0
            }
        ]);
    };

    const handleProductChange = async (index: number, productId: number) => {
        console.log('🔍 handleProductChange called:', { index, productId, totalProducts: products.length });
        const product = products.find((p: any) => p.id == productId || p.id === productId);
        console.log('📦 Found product:', product);

        if (product) {
            // Fetch product details with variants
            try {
                console.log('🔄 Fetching product details for ID:', productId);
                const detailResponse = await adminProductService.getProductById(productId);
                const productWithVariants = detailResponse.data;
                console.log('✅ Product with variants:', productWithVariants);

                // Update products array with variant data
                const updatedProducts = products.map((p: any) =>
                    (p.id == productId || p.id === productId) ? { ...p, variants: productWithVariants.variants } : p
                );
                setProducts(updatedProducts);

                // Update item
                const newItems = [...items];
                newItems[index] = {
                    ...newItems[index],
                    product_id: productId,
                    product_name: product.name,
                    size_id: 0,
                    size_name: '',
                    color_id: 0,
                    color_name: '',
                    variant_id: 0
                };
                console.log('✅ Updated item:', newItems[index]);
                setItems(newItems);
            } catch (error) {
                console.error('❌ Failed to fetch product details:', error);
                showToast('Không thể tải chi tiết sản phẩm', 'error');
            }
        } else {
            console.log('❌ Product not found in products array');
            console.log('🔍 Available product IDs:', products.map((p: any) => ({ id: p.id, type: typeof p.id })));
        }
    };

    const handleVariantChange = (index: number, sizeId: number, colorId: number) => {
        const item = items[index];
        const product = products.find((p: any) => p.id == item.product_id || p.id === item.product_id);
        console.log('🎨 handleVariantChange:', { sizeId, colorId, productId: item.product_id, hasVariants: !!product?.variants });

        if (product && product.variants) {
            const newItems = [...items];

            // Update size_id and color_id in item state
            newItems[index] = {
                ...newItems[index],
                size_id: sizeId,
                color_id: colorId
            };

            // Only find variant if BOTH size and color are selected
            if (sizeId > 0 && colorId > 0) {
                const variant = product.variants.find(
                    (v: any) => (v.size_id == sizeId || v.size_id === sizeId) && (v.color_id == colorId || v.color_id === colorId)
                );
                console.log('🔍 Searching for variant with size:', sizeId, 'color:', colorId);
                console.log('🔍 Found variant:', variant);

                if (variant) {
                    newItems[index] = {
                        ...newItems[index],
                        variant_id: variant.id,
                        size_name: variant.size?.name || '',
                        color_name: variant.color?.name || ''
                    };
                    console.log('✅ Updated variant:', newItems[index]);
                } else {
                    console.log('❌ Variant not found for size:', sizeId, 'color:', colorId);
                    console.log('🔍 Available variants:', product.variants.map((v: any) => ({ size_id: v.size_id, color_id: v.color_id, id: v.id })));
                }
            } else {
                console.log('⏳ Waiting for both size and color to be selected');
                // Reset variant_id if not both selected
                newItems[index].variant_id = 0;
            }

            setItems(newItems);
        } else {
            console.log('❌ Product not found or no variants');
        }
    };

    const getAvailableSizes = (productId: number) => {
        const product = products.find((p: any) => p.id == productId || p.id === productId);
        console.log('🔍 getAvailableSizes:', { productId, foundProduct: !!product, hasVariants: !!product?.variants, variantsCount: product?.variants?.length });
        if (!product || !product.variants) return [];
        const sizes = product.variants
            .map((v: any) => v.size)
            .filter((s: any, i: number, arr: any[]) => s && arr.findIndex((x: any) => x?.id === s.id) === i);
        console.log('✅ Available sizes:', sizes);
        return sizes.filter((s: any) => s) as any[];
    };

    const getAvailableColors = (productId: number, sizeId: number) => {
        const product = products.find((p: any) => p.id == productId || p.id === productId);
        console.log('🎨 getAvailableColors:', { productId, sizeId, foundProduct: !!product, hasVariants: !!product?.variants });
        if (!product || !product.variants) return [];

        // Filter variants by size_id (use loose comparison for type safety)
        const filteredVariants = product.variants.filter((v: any) => {
            if (!sizeId || isNaN(sizeId)) return true; // Show all colors if no size selected
            return v.size_id == sizeId || v.size_id === sizeId;
        });

        console.log('🔍 Filtered variants by size:', filteredVariants.length, 'out of', product.variants.length);

        const colors = filteredVariants
            .map((v: any) => v.color)
            .filter((c: any, i: number, arr: any[]) => c && arr.findIndex((x: any) => x?.id === c.id) === i);
        console.log('✅ Available colors:', colors);
        return colors.filter((c: any) => c) as any[];
    };

    const updateItem = (index: number, field: keyof RestockItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const removeItem = (index: number) => {
        setItems(items.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        const validItems = items.filter(item => item.variant_id > 0 && item.quantity > 0);

        if (validItems.length === 0) {
            showToast('Please add at least one item with valid quantity', 'error');
            return;
        }

        try {
            setLoading(true);

            const batchData: CreateRestockBatchData = {
                admin_id: 1, // TODO: Get from auth context
                type: batchType,
                items: validItems.map(item => ({
                    variant_id: item.variant_id,
                    quantity: item.quantity
                }))
            };

            console.log('📦 Creating restock batch...', batchData);

            const response = await adminInventoryService.createRestockBatch(batchData);
            console.log('✅ Restock batch created:', response.data);

            showToast(`Restock batch created successfully! ${validItems.length} items added to inventory.`, 'success');
            setItems([]);
        } catch (error: any) {
            console.error('❌ Failed to create restock batch:', error);
            console.error('Response:', error?.response?.data);

            const errorMessage = error?.response?.data?.message ||
                error?.response?.data?.error ||
                'Failed to create restock batch';
            showToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/admin/inventory" className="p-2 hover:bg-gray-100 rounded-lg transition">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-[#202224]">Nhập Kho</h1>
                        <p className="text-gray-600 mt-1">Thêm hàng vào kho cho các phiên bản sản phẩm</p>
                    </div>
                </div>
            </div>

            {/* Batch Type */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <label className="block text-sm font-semibold mb-2">Loại Lô Hàng</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={batchType === 'Manual'}
                            onChange={() => setBatchType('Manual')}
                            className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Thủ công</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={batchType === 'Auto'}
                            onChange={() => setBatchType('Auto')}
                            className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Tự động (Hệ thống tạo)</span>
                    </label>
                </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Sản Phẩm Nhập Kho</h2>
                    <button
                        onClick={addItem}
                        className="flex items-center gap-2 px-4 py-2 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                    >
                        <Plus className="w-5 h-5" />
                        Thêm Sản Phẩm
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Chưa có sản phẩm nào. Nhấn "Thêm Sản Phẩm" để bắt đầu.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#F1F4F9]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">#</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Sản phẩm</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Size</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Màu</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Số lượng</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase">Hành động</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={item.product_id || ''}
                                                onChange={(e) => handleProductChange(index, parseInt(e.target.value))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm"
                                            >
                                                <option value="">Chọn sản phẩm</option>
                                                {products.map((product: any) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={item.size_id || ''}
                                                onChange={(e) => {
                                                    const sizeId = parseInt(e.target.value);
                                                    handleVariantChange(index, sizeId, item.color_id);
                                                }}
                                                disabled={!item.product_id}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                <option value="">Chọn size</option>
                                                {getAvailableSizes(item.product_id).map((size: any) => (
                                                    <option key={size.id} value={size.id}>
                                                        {size.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={item.color_id || ''}
                                                onChange={(e) => {
                                                    const colorId = parseInt(e.target.value);
                                                    handleVariantChange(index, item.size_id, colorId);
                                                }}
                                                disabled={!item.product_id}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF] text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            >
                                                <option value="">Chọn màu</option>
                                                {getAvailableColors(item.product_id, item.size_id).map((color: any) => (
                                                    <option key={color.id} value={color.id}>
                                                        {color.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                value={item.quantity || ''}
                                                onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                                                placeholder="0"
                                                min="0"
                                                className="w-24 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                                            />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => removeItem(index)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Summary */}
            {items.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-lg font-bold text-blue-900">Tổng Kết Lô Hàng</h3>
                            <p className="text-sm text-blue-700 mt-1">Xem lại trước khi gửi</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-blue-700">Tổng Sản Phẩm</p>
                            <p className="text-3xl font-bold text-blue-900">{items.filter(i => i.quantity > 0).length}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                        <Check className="w-4 h-4" />
                        <span>Tổng Số Lượng: {items.reduce((sum, item) => sum + (item.quantity || 0), 0)} sản phẩm</span>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <Link
                    href="/admin/inventory"
                    className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                    Hủy
                </Link>
                <button
                    onClick={handleSubmit}
                    disabled={loading || items.length === 0}
                    className="flex-1 px-8 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang tạo lô hàng...
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5" />
                            Gửi Lô Nhập Kho
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
