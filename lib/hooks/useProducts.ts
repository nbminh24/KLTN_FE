import { useState, useEffect } from 'react';
import { productService } from '@/lib/api/services';
import type { Product, ProductSearchParams } from '@/lib/types/backend';

export function useProducts(params?: ProductSearchParams) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        limit: 12,
        total_pages: 0,
    });

    useEffect(() => {
        fetchProducts();
    }, [JSON.stringify(params)]);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productService.getProducts(params);
            setProducts(response.data.products);
            setPagination(response.data.metadata);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể tải sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        loading,
        error,
        pagination,
        refetch: fetchProducts,
    };
}

export function useProduct(slug: string) {
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) return;
        fetchProduct();
    }, [slug]);

    const fetchProduct = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await productService.getProductBySlug(slug);
            setProduct(response.data.product);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể tải sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    return {
        product,
        loading,
        error,
        refetch: fetchProduct,
    };
}
