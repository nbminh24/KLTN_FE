'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, X, Check, Loader2, Package } from 'lucide-react';
import adminInventoryService, { RestockBatchData } from '@/lib/services/admin/inventoryService';
import adminProductService from '@/lib/services/admin/productService';
import { showToast } from '@/components/Toast';

interface RestockItem {
    variant_id: number;
    variant_name: string;
    sku: string;
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
                status: 'active'
            });
            setProducts(response.data.products || []);
        } catch (error) {
            console.error('Failed to load products:', error);
            showToast('Failed to load products', 'error');
        } finally {
            setLoadingProducts(false);
        }
    };

    const addItem = () => {
        setItems([
            ...items,
            {
                variant_id: 0,
                variant_name: '',
                sku: '',
                quantity: 0
            }
        ]);
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

            const batchData: RestockBatchData = {
                admin_id: 1, // TODO: Get from auth context
                type: batchType,
                items: validItems.map(item => ({
                    variant_id: item.variant_id,
                    quantity: item.quantity
                }))
            };

            await adminInventoryService.createRestockBatch(batchData);
            showToast(`Restock batch created successfully! ${validItems.length} items added to inventory.`, 'success');
            setItems([]);
        } catch (error: any) {
            console.error('Failed to create restock batch:', error);
            showToast(error.response?.data?.message || 'Failed to create restock batch', 'error');
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
                        <h1 className="text-3xl font-bold text-[#202224]">Restock Inventory</h1>
                        <p className="text-gray-600 mt-1">Add stock to product variants</p>
                    </div>
                </div>
            </div>

            {/* Batch Type */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
                <label className="block text-sm font-semibold mb-2">Batch Type</label>
                <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={batchType === 'Manual'}
                            onChange={() => setBatchType('Manual')}
                            className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Manual</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            checked={batchType === 'Auto'}
                            onChange={() => setBatchType('Auto')}
                            className="w-4 h-4"
                        />
                        <span className="text-sm font-medium">Auto (System Generated)</span>
                    </label>
                </div>
            </div>

            {/* Items */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Restock Items</h2>
                    <button
                        onClick={addItem}
                        className="flex items-center gap-2 px-4 py-2 bg-[#4880FF] text-white rounded-lg hover:bg-blue-600 transition font-semibold"
                    >
                        <Plus className="w-5 h-5" />
                        Add Item
                    </button>
                </div>

                {items.length === 0 ? (
                    <div className="p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">No items added yet. Click "Add Item" to start.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#F1F4F9]">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">#</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Variant ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Variant Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">SKU</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase">Quantity</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {items.map((item, index) => (
                                    <tr key={index}>
                                        <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="number"
                                                value={item.variant_id || ''}
                                                onChange={(e) => updateItem(index, 'variant_id', parseInt(e.target.value) || 0)}
                                                placeholder="Enter variant ID"
                                                className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={item.variant_name}
                                                onChange={(e) => updateItem(index, 'variant_name', e.target.value)}
                                                placeholder="Variant name (optional)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <input
                                                type="text"
                                                value={item.sku}
                                                onChange={(e) => updateItem(index, 'sku', e.target.value)}
                                                placeholder="SKU (optional)"
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4880FF]"
                                            />
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
                            <h3 className="text-lg font-bold text-blue-900">Batch Summary</h3>
                            <p className="text-sm text-blue-700 mt-1">Review before submitting</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-blue-700">Total Items</p>
                            <p className="text-3xl font-bold text-blue-900">{items.filter(i => i.quantity > 0).length}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-blue-800">
                        <Check className="w-4 h-4" />
                        <span>Total Quantity: {items.reduce((sum, item) => sum + (item.quantity || 0), 0)} units</span>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                <Link
                    href="/admin/inventory"
                    className="px-8 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
                >
                    Cancel
                </Link>
                <button
                    onClick={handleSubmit}
                    disabled={loading || items.length === 0}
                    className="flex-1 px-8 py-3 bg-[#4880FF] text-white rounded-lg font-semibold hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Batch...
                        </>
                    ) : (
                        <>
                            <Check className="w-5 h-5" />
                            Submit Restock Batch
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
