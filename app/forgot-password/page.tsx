'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import authService from '@/lib/services/authService';
import axios from 'axios';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(5);

  // Auto-redirect countdown
  useEffect(() => {
    if (isSubmitted && countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (isSubmitted && countdown === 0) {
      router.push('/login');
    }
  }, [isSubmitted, countdown, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Call real API
      await authService.forgotPassword({ email });

      // Success - show confirmation message
      setIsSubmitted(true);
    } catch (err: any) {
      // Handle errors from API
      if (axios.isAxiosError(err)) {
        if (err.response?.status === 404) {
          setError('No account found with this email address');
        } else if (err.response?.status === 400) {
          setError(err.response?.data?.message || 'Invalid email address');
        } else {
          setError(err.response?.data?.message || 'Failed to send reset email. Please try again.');
        }
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            {/* Card */}
            <div className="bg-white rounded-3xl shadow-lg p-8 md:p-10">
              {!isSubmitted ? (
                <>
                  {/* Back Button */}
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black mb-6"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to login
                  </Link>

                  {/* Title */}
                  <div className="mb-8">
                    <h1 className="text-3xl font-integral font-bold mb-2">
                      Forgot Password?
                    </h1>
                    <p className="text-gray-600">
                      No worries, we'll send you reset instructions.
                    </p>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600">{error}</p>
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="your@email.com"
                          className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Reset Password'}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  {/* Success Message */}
                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Mail className="w-8 h-8 text-green-600" />
                    </div>
                    <h1 className="text-2xl font-bold mb-4">
                      Check your email
                    </h1>
                    <p className="text-gray-600 mb-4">
                      We sent a password reset link to <strong>{email}</strong>
                    </p>

                    {/* Countdown Timer */}
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-6">
                      <p className="text-sm text-blue-700">
                        Redirecting to Login in <strong>{countdown}</strong> seconds...
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Link
                        href="/login"
                        className="inline-block w-full bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition"
                      >
                        Back to Login Now
                      </Link>

                      <button
                        onClick={() => {
                          window.close();
                          setTimeout(() => {
                            alert('Bạn có thể đóng tab này. Vui lòng check email để tiếp tục.');
                          }, 500);
                        }}
                        className="w-full text-gray-600 hover:text-gray-900 font-medium py-2 transition-colors"
                      >
                        Close this tab
                      </button>
                    </div>

                    <p className="text-sm text-gray-500 mt-6">
                      Didn\'t receive the email?{' '}
                      <button
                        onClick={() => setIsSubmitted(false)}
                        className="text-black font-medium hover:underline"
                      >
                        Click to resend
                      </button>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
