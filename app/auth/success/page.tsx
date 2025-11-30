'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

function AuthSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
    const [countdown, setCountdown] = useState(3);

    useEffect(() => {
        const accessToken = searchParams.get('access_token');
        const refreshToken = searchParams.get('refresh_token');

        if (!accessToken) {
            setStatus('error');
            return;
        }

        try {
            // Lưu tokens vào localStorage
            localStorage.setItem('access_token', accessToken);
            if (refreshToken) {
                localStorage.setItem('refresh_token', refreshToken);
            }

            // Giải mã token để lấy thông tin user (optional)
            try {
                const payload = JSON.parse(atob(accessToken.split('.')[1]));
                const user = {
                    id: payload.sub,
                    email: payload.email,
                };
                localStorage.setItem('user', JSON.stringify(user));
            } catch (e) {
                console.warn('Could not decode token:', e);
            }

            console.log('✅ Tokens saved successfully');
            setStatus('success');

            // Thử đóng tab/window sau khi lưu token thành công
            setTimeout(() => {
                // Thử đóng window (work nếu tab được mở từ email link)
                window.close();

                // Nếu không close được (vẫn còn trang), redirect về home
                setTimeout(() => {
                    router.push('/');
                }, 500);
            }, 1000);
        } catch (error) {
            console.error('❌ Error saving tokens:', error);
            setStatus('error');
        }
    }, [searchParams, router]);

    // Processing State
    if (status === 'processing') {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 bg-gray-50 flex items-center justify-center py-12">
                    <div className="container mx-auto px-6">
                        <div className="max-w-md mx-auto">
                            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                    </div>
                                    <h1 className="text-3xl font-integral font-bold mb-2">
                                        Đang kích hoạt tài khoản...
                                    </h1>
                                    <p className="text-gray-600">
                                        Vui lòng đợi trong giây lát
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Error State
    if (status === 'error') {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 bg-gray-50 flex items-center justify-center py-12">
                    <div className="container mx-auto px-6">
                        <div className="max-w-md mx-auto">
                            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6 relative">
                                        <XCircle className="w-16 h-16 text-red-600" />
                                        <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-full"></div>
                                    </div>
                                    <h1 className="text-3xl font-integral font-bold mb-4">
                                        Kích hoạt thất bại
                                    </h1>
                                    <p className="text-gray-600 mb-6">
                                        Link kích hoạt không hợp lệ hoặc đã hết hạn.
                                    </p>
                                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                        <p className="text-sm text-red-800">
                                            Vui lòng kiểm tra lại link hoặc yêu cầu gửi lại email kích hoạt.
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => router.push('/login')}
                                    className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition"
                                >
                                    Về trang đăng nhập
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Success State - Redirect to home (không hiện screen, redirect trực tiếp)
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Kích hoạt thành công!
                </h2>
                <p className="text-gray-500">Đang chuyển hướng...</p>
            </div>
        </div>
    );
}

export default function AuthSuccessPage() {
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
            <AuthSuccessContent />
        </Suspense>
    );
}
