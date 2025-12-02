import { useState, useEffect } from 'react';
import { authService } from '@/lib/api/services';
import type { AuthResponse, LoginData, RegisterData } from '@/lib/api/services/customer/auth.service';

export function useAuth() {
    const [user, setUser] = useState<AuthResponse['user'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Check if user is logged in on mount
        const token = localStorage.getItem('access_token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (err) {
                console.error('Failed to parse user data');
            }
        }
        setLoading(false);
    }, []);

    const login = async (data: LoginData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.login(data);
            const { user, access_token } = response.data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return response.data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Đăng nhập thất bại';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await authService.register(data);
            return response.data;
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Đăng ký thất bại';
            setError(errorMsg);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (err) {
            console.error('Logout error:', err);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
            setUser(null);
        }
    };

    return {
        user,
        loading,
        error,
        isAuthenticated: !!user,
        login,
        register,
        logout,
    };
}
