'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import authService from '@/lib/services/authService';
import axios from 'axios';

function ActivateContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setErrorMessage('Invalid activation link. No token provided.');
            return;
        }

        // Automatically activate account on mount
        activateAccount(token);
    }, [token]);

    const activateAccount = async (activationToken: string) => {
        try {
            console.log('🔍 Activating account with token:', activationToken);

            // Call real API
            const response = await authService.activateAccount({
                token: activationToken,
            });

            console.log('✅ Activation Response:', response.data);

            // Success - account activated
            setStatus('success');

            // If response includes auth tokens, auto-login the user
            if (response.data.access_token) {
                localStorage.setItem('access_token', response.data.access_token);
                if (response.data.refresh_token) {
                    localStorage.setItem('refresh_token', response.data.refresh_token);
                }
                if (response.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                }
            }
        } catch (err: any) {
            console.error('❌ Activation Error:', err);

            // Handle errors from API
            setStatus('error');

            if (axios.isAxiosError(err)) {
                if (err.response?.status === 400) {
                    setErrorMessage('Invalid or expired activation token. Please request a new verification email.');
                } else if (err.response?.status === 404) {
                    setErrorMessage('Account not found. Please register again.');
                } else if (err.response?.status === 409) {
                    setErrorMessage('This account has already been activated. You can log in now.');
                } else {
                    setErrorMessage(err.response?.data?.message || 'Activation failed. Please try again.');
                }
            } else {
                setErrorMessage('Network error. Please check your connection and try again.');
            }
        }
    };

    // Loading State
    if (status === 'loading') {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 bg-gray-50 flex items-center justify-center py-12">
                    <div className="container mx-auto px-6">
                        <div className="max-w-md mx-auto">
                            {/* Card */}
                            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
                                {/* Icon */}
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                                        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                                    </div>
                                    <h1 className="text-3xl font-integral font-bold mb-2">
                                        Verifying your account...
                                    </h1>
                                    <p className="text-gray-600">
                                        Please wait a moment while we activate your account.
                                    </p>
                                </div>

                                {/* Progress Indicator */}
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        );
    }

    // Success State
    if (status === 'success') {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />

                <main className="flex-1 bg-gray-50 flex items-center justify-center py-12">
                    <div className="container mx-auto px-6">
                        <div className="max-w-md mx-auto">
                            {/* Card */}
                            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
                                {/* Icon */}
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6 relative">
                                        <CheckCircle className="w-16 h-16 text-green-600" />
                                        {/* 3D Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-br from-green-400/20 to-green-600/20 rounded-full"></div>
                                    </div>
                                    <h1 className="text-3xl md:text-4xl font-integral font-bold mb-4">
                                        Account Activated!
                                    </h1>
                                    <p className="text-gray-600 text-lg mb-2">
                                        Thank you for verifying your email.
                                    </p>
                                    <p className="text-gray-600">
                                        You can now access all features and start shopping with your verified account.
                                    </p>
                                </div>

                                {/* Success Features */}
                                <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 mb-6">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                            <p className="text-sm text-gray-700">Full access to all products</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                            <p className="text-sm text-gray-700">Track your orders</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                            <p className="text-sm text-gray-700">Save your favorite items</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                                            <p className="text-sm text-gray-700">Exclusive member benefits</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="space-y-3">
                                    <button
                                        onClick={() => router.push('/')}
                                        className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition shadow-lg hover:shadow-xl"
                                    >
                                        Start Shopping
                                    </button>
                                    <Link
                                        href="/login"
                                        className="w-full border-2 border-gray-300 text-black py-4 rounded-full font-medium hover:bg-gray-50 transition flex items-center justify-center"
                                    >
                                        Go to Login
                                    </Link>
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
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 bg-gray-50 flex items-center justify-center py-12">
                <div className="container mx-auto px-6">
                    <div className="max-w-md mx-auto">
                        {/* Card */}
                        <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
                            {/* Icon */}
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-24 h-24 bg-red-100 rounded-full mb-6 relative">
                                    <XCircle className="w-16 h-16 text-red-600" />
                                    {/* 3D Effect */}
                                    <div className="absolute inset-0 bg-gradient-to-br from-red-400/20 to-red-600/20 rounded-full"></div>
                                </div>
                                <h1 className="text-3xl md:text-4xl font-integral font-bold mb-4">
                                    Activation Failed
                                </h1>
                                <p className="text-gray-600 text-lg mb-4">
                                    We couldn't activate your account.
                                </p>

                                {/* Error Message */}
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                    <p className="text-sm text-red-800">{errorMessage}</p>
                                </div>
                            </div>

                            {/* Help Section */}
                            <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                                <h3 className="font-bold mb-3">What you can do:</h3>
                                <div className="space-y-2 text-sm text-gray-700">
                                    <p>• Request a new verification email from the login page</p>
                                    <p>• Check if you've already activated your account</p>
                                    <p>• Contact support if the problem persists</p>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="space-y-3">
                                <Link
                                    href="/login"
                                    className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition flex items-center justify-center"
                                >
                                    Back to Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="w-full border-2 border-gray-300 text-black py-4 rounded-full font-medium hover:bg-gray-50 transition flex items-center justify-center"
                                >
                                    Register New Account
                                </Link>
                            </div>

                            {/* Support Link */}
                            <div className="text-center mt-6">
                                <Link href="/support" className="text-sm text-gray-600 hover:text-black transition">
                                    Need help? Contact Support →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

export default function ActivatePage() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                        <Loader2 className="w-8 h-8 text-gray-600 animate-spin mx-auto mb-4" />
                        <p className="text-gray-600">Loading...</p>
                    </div>
                </div>
            }
        >
            <ActivateContent />
        </Suspense>
    );
}
