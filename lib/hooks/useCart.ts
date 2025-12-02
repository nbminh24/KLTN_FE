import { useState, useEffect } from 'react';
import { cartService } from '@/lib/api/services';
import type { CartResponse } from '@/lib/types/backend';

export function useCart() {
    const [cart, setCart] = useState<CartResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await cartService.getCart();
            setCart(response.data);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Không thể tải giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (variantId: number, quantity: number) => {
        try {
            await cartService.addToCart({ variant_id: variantId, quantity });
            await fetchCart(); // Refresh cart
            return true;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Không thể thêm vào giỏ hàng');
        }
    };

    const updateItem = async (itemId: number, quantity: number) => {
        try {
            await cartService.updateCartItem(itemId, { quantity });
            await fetchCart();
            return true;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Không thể cập nhật');
        }
    };

    const removeItem = async (itemId: number) => {
        try {
            await cartService.removeCartItem(itemId);
            await fetchCart();
            return true;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Không thể xóa');
        }
    };

    const applyCoupon = async (code: string) => {
        try {
            const response = await cartService.applyCoupon({ code });
            setCart(response.data);
            return true;
        } catch (err: any) {
            throw new Error(err.response?.data?.message || 'Mã giảm giá không hợp lệ');
        }
    };

    const itemCount = cart?.items?.length || 0;
    const subtotal = cart?.subtotal || 0;
    const total = cart?.total || 0;

    return {
        cart,
        loading,
        error,
        itemCount,
        subtotal,
        total,
        addToCart,
        updateItem,
        removeItem,
        applyCoupon,
        refetch: fetchCart,
    };
}
