'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { ChevronRight, Search as SearchIcon, Loader2 } from 'lucide-react';
import productService from '@/lib/services/productService';
import type { Product } from '@/lib/types/backend';

const ITEMS_PER_PAGE = 12;

function SearchPageContent() {
    const searchParams = useSearchParams();
    const queryParam = searchParams.get('q');

    const [searchQuery, setSearchQuery] = useState(queryParam || '');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);

    useEffect(() => {
        if (searchQuery.trim()) {
            searchProducts();
        }
    }, [searchQuery, currentPage]);

    const searchProducts = async () => {
        try {
            setLoading(true);
            const response = await productService.getProducts({
                search: searchQuery,
                page: currentPage,
                limit: ITEMS_PER_PAGE,
            });
            setProducts(response.data.data || []);
            setTotalPages(response.data.metadata?.total_pages || 1);
            setTotalProducts(response.data.metadata?.total || 0);
        } catch (err) {
            console.error('Search error:', err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setCurrentPage(1);
        searchProducts();
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1">
                <div className="container mx-auto px-6 md:px-12 py-6">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm mb-6">
                        <Link href="/" className="text-gray-500">Home</Link>
                        <ChevronRight className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Search Results</span>
                    </div>

                    {/* Search Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-integral font-bold mb-4">Search Products</h1>

                        {/* Search Bar */}
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1 relative">
                                <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search for products..."
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
                            >
                                {loading ? 'Searching...' : 'Search'}
                            </button>
                        </form>
                    </div>

                    {/* Results */}
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-12 h-12 animate-spin text-gray-600" />
                        </div>
                    ) : products.length === 0 ? (
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-bold mb-2">No products found</h2>
                            <p className="text-gray-600">Try searching with different keywords</p>
                        </div>
                    ) : (
                        <>
                            {/* Results count */}
                            <div className="mb-6">
                                <p className="text-gray-600">
                                    Found <span className="font-bold">{totalProducts}</span> products
                                    {searchQuery && ` for "${searchQuery}"`}
                                </p>
                            </div>

                            {/* Products Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-12">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Previous
                                    </button>
                                    {[...Array(Math.min(5, totalPages))].map((_, i) => {
                                        const page = i + 1;
                                        return (
                                            <button
                                                key={page}
                                                onClick={() => setCurrentPage(page)}
                                                className={`px-4 py-2 rounded-lg ${currentPage === page
                                                    ? 'bg-black text-white'
                                                    : 'border border-gray-300 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {page}
                                            </button>
                                        );
                                    })}
                                    <button
                                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Next
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-12 h-12 animate-spin" /></div>}>
            <SearchPageContent />
        </Suspense>
    );
}
