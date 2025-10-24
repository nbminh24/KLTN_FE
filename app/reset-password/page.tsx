'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle } from 'lucide-react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (password.length === 0) return { strength: 0, label: '', color: '' };
    if (password.length < 6) return { strength: 1, label: 'Weak', color: 'bg-red-500' };
    if (password.length < 10) return { strength: 2, label: 'Fair', color: 'bg-yellow-500' };
    if (password.length < 12 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      return { strength: 3, label: 'Good', color: 'bg-blue-500' };
    }
    return { strength: 4, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    // Mock API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-6 md:px-12 py-12">
            <div className="max-w-md mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-integral font-bold mb-4">
                Password Reset Successful!
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Your password has been successfully reset. You can now log in with your new password.
              </p>
              <Link
                href="/login"
                className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition"
              >
                Go to Login
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-gray-50">
          <div className="container mx-auto px-6 md:px-12 py-12">
            <div className="max-w-md mx-auto text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
                <AlertCircle className="w-10 h-10 text-red-600" />
              </div>
              <h1 className="text-3xl md:text-4xl font-integral font-bold mb-4">
                Invalid Reset Link
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                This password reset link is invalid or has expired. Please request a new one.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition"
              >
                Request New Link
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-6 md:px-12 py-12">
          <div className="max-w-md mx-auto">
            {/* Icon */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-black rounded-full mb-6">
                <Lock className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-integral font-bold mb-4">
                Reset Password
              </h1>
              <p className="text-gray-600 text-lg">
                Enter your new password below
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                )}

                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {newPassword && (
                    <div className="mt-3">
                      <div className="flex gap-1 mb-2">
                        {[1, 2, 3, 4].map((level) => (
                          <div
                            key={level}
                            className={`h-1 flex-1 rounded-full transition-colors ${
                              level <= passwordStrength.strength ? passwordStrength.color : 'bg-gray-200'
                            }`}
                          />
                        ))}
                      </div>
                      <p className={`text-sm font-medium ${passwordStrength.strength >= 3 ? 'text-green-600' : 'text-gray-600'}`}>
                        Password strength: {passwordStrength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm Password</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {confirmPassword && newPassword !== confirmPassword && (
                    <p className="text-sm text-red-600 mt-2">Passwords do not match</p>
                  )}
                </div>

                {/* Password Requirements */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-sm font-medium mb-2">Password must contain:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li className={newPassword.length >= 8 ? 'text-green-600' : ''}>
                      ✓ At least 8 characters
                    </li>
                    <li className={/[A-Z]/.test(newPassword) ? 'text-green-600' : ''}>
                      ✓ One uppercase letter
                    </li>
                    <li className={/[0-9]/.test(newPassword) ? 'text-green-600' : ''}>
                      ✓ One number
                    </li>
                  </ul>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading || !newPassword || !confirmPassword}
                  className={`w-full py-4 rounded-full font-medium transition ${
                    loading || !newPassword || !confirmPassword
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}
                >
                  {loading ? 'Resetting Password...' : 'Reset Password'}
                </button>
              </form>
            </div>

            {/* Back to Login */}
            <div className="text-center mt-6">
              <Link href="/login" className="text-gray-600 hover:text-black transition">
                ← Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
