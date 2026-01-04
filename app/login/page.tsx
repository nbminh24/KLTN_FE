'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import authService from '@/lib/services/authService';
import cartService from '@/lib/services/cartService';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call real API
      const response = await authService.login({
        email: formData.email,
        password: formData.password,
      });

      // Save token to localStorage (matches DB schema & API response)
      localStorage.setItem('access_token', response.data.access_token);
      if (response.data.refresh_token) {
        localStorage.setItem('refresh_token', response.data.refresh_token);
      }
      localStorage.setItem('user', JSON.stringify(response.data.user));

      // Merge guest cart if exists
      const guestSessionId = localStorage.getItem('guest_cart_session');
      if (guestSessionId) {
        try {
          await cartService.mergeCart(guestSessionId);
          localStorage.removeItem('guest_cart_session');
          console.log('Cart merged successfully');
        } catch (mergeErr) {
          console.error('Failed to merge cart:', mergeErr);
          // Don't block login flow if merge fails
        }
      }

      // Get redirect URL from query params or default to home
      const urlParams = new URLSearchParams(window.location.search);
      const redirect = urlParams.get('redirect') || '/';

      // Success - redirect
      router.push(redirect);
    } catch (err: any) {
      // Handle errors from API
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 401) {
          setError('Email hoặc mật khẩu không đúng');
        } else if (err.response?.status === 403) {
          setError('Tài khoản chưa được kích hoạt. Vui lòng kiểm tra email.');
        } else {
          setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
        }
      } else {
        setError('Lỗi kết nối. Vui lòng kiểm tra đường truyền.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth flow
    // This requires backend OAuth setup
    alert('Google login will be implemented with OAuth flow');
    // For now, redirect to Google OAuth consent screen would go here
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            {/* Card */}
            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
              {/* Logo/Title */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-integral font-bold mb-2">
                  LeCas Xin chào
                </h1>
                <p className="text-gray-600">Đăng nhập vào tài khoản của bạn</p>
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 border-2 border-gray-300 rounded-full py-3 font-medium hover:bg-gray-50 transition mb-6"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Tiếp tục với Google
              </button>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">Hoặc tiếp tục với email</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="email@example.com"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">Mật Khẩu</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      required
                      placeholder="••••••••"
                      className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 rounded" />
                    <span>Ghi nhớ đăng nhập</span>
                  </label>
                  <Link href="/forgot-password" className="text-black font-medium hover:underline">
                    Quên mật khẩu?
                  </Link>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
                </button>
              </form>

              {/* Sign Up Link */}
              <p className="text-center mt-6 text-sm text-gray-600">
                Chưa có tài khoản?{' '}
                <Link href="/signup" className="text-black font-medium hover:underline">
                  Đăng ký
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
