'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { XCircle, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

function AuthErrorContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const message = searchParams.get('message') || 'An error occurred';
    const [countdown, setCountdown] = useState(5);

    // Kiểm tra nếu là error về "đã được kích hoạt" thì redirect về login
    const isAlreadyActivated = message.toLowerCase().includes('đã được kích hoạt') ||
        message.toLowerCase().includes('already activated');

    // Auto-redirect countdown
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
            return () => clearTimeout(timer);
        }
        if (countdown === 0) {
            router.push('/login');
        }
    }, [countdown, router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-full max-w-md px-6">
                {/* Card Container */}
                <div className="bg-white p-8 rounded-[32px] shadow-xl w-full text-center">
                    {/* Icon - Green nếu "already activated", Red nếu error khác */}
                    <div className="mb-6">
                        {isAlreadyActivated ? (
                            <CheckCircle className="w-20 h-20 text-green-500 mx-auto" />
                        ) : (
                            <AlertCircle className="w-20 h-20 text-yellow-500 mx-auto" />
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        {isAlreadyActivated ? 'Tài khoản đã được kích hoạt' : 'Thông báo'}
                    </h1>

                    {/* Description */}
                    <p className="text-gray-600 mb-8">
                        {decodeURIComponent(message)}
                    </p>

                    {/* Info box */}
                    {isAlreadyActivated && (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                            <p className="text-sm text-green-800">
                                Tài khoản của bạn đã được kích hoạt trước đó. Bạn có thể đăng nhập ngay bây giờ.
                            </p>
                        </div>
                    )}

                    {/* Countdown Timer */}
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-6">
                        <p className="text-sm text-blue-700">
                            Redirecting to Login in <span className="font-semibold">{countdown}s</span>
                        </p>
                    </div>

                    {/* Primary Button */}
                    <button
                        onClick={() => router.push('/login')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 mb-3"
                    >
                        Đăng nhập ngay
                    </button>

                    {/* Secondary Button - Close tab */}
                    <button
                        onClick={() => {
                            window.close();
                            setTimeout(() => {
                                alert('Bạn có thể đóng tab này và tiến hành đăng nhập.');
                            }, 500);
                        }}
                        className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors"
                    >
                        Đóng tab này
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AuthErrorPage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 text-gray-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Đang tải...</p>
                    </div>
                </div>
            }
        >
            <AuthErrorContent />
        </Suspense>
    );
}
