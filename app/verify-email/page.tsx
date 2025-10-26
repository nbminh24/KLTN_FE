'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, CheckCircle, XCircle, RefreshCw, ArrowRight } from 'lucide-react';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || 'user@example.com';
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResend = () => {
    setResendLoading(true);
    // Mock API call
    setTimeout(() => {
      setResendLoading(false);
      setResendSuccess(true);
      setCountdown(60);
      setTimeout(() => setResendSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 py-12">
          <div className="max-w-md mx-auto">
            {/* Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
                <Mail className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-integral font-bold mb-4">
                Verify Your Email
              </h1>
              <p className="text-gray-600 text-lg">
                We've sent a verification link to
              </p>
              <p className="font-bold text-lg mt-2">{email}</p>
            </div>

            {/* Instructions Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 mb-6 space-y-6">
              <div className="space-y-4">
                <h2 className="font-bold text-lg">What's next?</h2>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      1
                    </div>
                    <p className="text-gray-700">Check your email inbox (and spam folder)</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      2
                    </div>
                    <p className="text-gray-700">Click the verification link in the email</p>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                      3
                    </div>
                    <p className="text-gray-700">Start shopping with your verified account</p>
                  </div>
                </div>
              </div>

              {/* Resend Success Message */}
              {resendSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-800">Verification email sent successfully!</p>
                </div>
              )}

              {/* Resend Button */}
              <div className="pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Didn't receive the email?</p>
                <button
                  onClick={handleResend}
                  disabled={resendLoading || countdown > 0}
                  className={`w-full py-3 rounded-full font-medium transition flex items-center justify-center gap-2 ${
                    resendLoading || countdown > 0
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {resendLoading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend in ${countdown}s`
                  ) : (
                    <>
                      <RefreshCw className="w-5 h-5" />
                      Resend Verification Email
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Additional Options */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 space-y-4">
              <h3 className="font-bold">Need to use a different email?</h3>
              <p className="text-sm text-gray-600">
                You can update your email address in your account settings after logging in.
              </p>
              <Link
                href="/login"
                className="w-full border border-gray-300 text-black py-3 rounded-full font-medium hover:bg-gray-50 transition flex items-center justify-center gap-2"
              >
                Go to Login
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Help Section */}
            <div className="text-center mt-6">
              <p className="text-gray-600 text-sm mb-2">Still having trouble?</p>
              <Link href="/support" className="text-black font-medium underline hover:no-underline">
                Contact Customer Support
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <VerifyEmailContent />
    </Suspense>
  );
}
