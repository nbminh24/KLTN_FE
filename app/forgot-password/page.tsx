'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock password reset
    setIsSubmitted(true);
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
                      className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition"
                    >
                      Reset Password
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
                    <p className="text-gray-600 mb-8">
                      We sent a password reset link to <strong>{email}</strong>
                    </p>
                    <Link
                      href="/login"
                      className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition"
                    >
                      Back to Login
                    </Link>
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
