'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { showToast } from '@/components/Toast';
import supportService from '@/lib/services/supportService';
import accountService from '@/lib/services/accountService';
import { ChevronRight, Mail, Phone, MessageCircle, Send, Loader2 } from 'lucide-react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          await accountService.getProfile();
          setIsLoggedIn(true);
        }
      } catch (err) {
        console.log('User not logged in');
      } finally {
        setLoadingProfile(false);
      }
    };

    checkAuth();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSubmitting(true);
      console.log('🎫 Creating support ticket:', formData);

      // Backend auto-fills email from token
      const payload = {
        subject: formData.subject,
        message: formData.message,
      };

      console.log('🎫 Sending payload to backend:', payload);
      console.log('🎫 User authenticated - email auto-filled by backend from token');

      const response = await supportService.createTicket(payload);

      console.log('🎫 Ticket created:', response.data);

      showToast(
        `Support ticket created! Tracking code: ${response.data.ticket_code}`,
        'success'
      );

      // Reset form
      setFormData({
        subject: '',
        message: ''
      });
    } catch (err: any) {
      console.error('❌ Error creating ticket:', err);
      console.error('❌ Error response:', err.response);
      console.error('❌ Error data:', err.response?.data);
      console.error('❌ Error message:', err.response?.data?.message);
      console.error('❌ Validation errors:', err.response?.data?.errors);

      // Show detailed error message
      let errorMessage = 'Failed to create support ticket. Please try again.';

      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.data?.errors) {
        const errors = err.response.data.errors;
        errorMessage = Array.isArray(errors)
          ? errors.join(', ')
          : JSON.stringify(errors);
      }

      showToast(errorMessage, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Customer Support</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-integral font-bold mb-6">
              WE'RE HERE TO HELP YOU
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Our dedicated team provides thoughtful and detailed assistance
            </p>
          </div>

          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Mail,
                title: 'Email Us',
                info: 'lecas.office@gmail.com',
                description: 'Response within 24 hours',
              },
              {
                icon: Phone,
                title: 'Call Us',
                info: '0342343591',
                description: 'Everyday, 8AM-8PM',
              },
              {
                icon: MessageCircle,
                title: 'Email Support',
                info: 'Get in touch',
                description: 'Guaranteed reply within 4 Hrs',
              },
            ].map((contact, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-6 text-center hover:shadow-lg transition">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-100 rounded-full mb-4">
                  <contact.icon className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold mb-2">{contact.title}</h3>
                <p className="text-gray-900 font-medium mb-1">{contact.info}</p>
                <p className="text-gray-600 text-sm">{contact.description}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-3xl mx-auto">
            <div className="border border-gray-200 rounded-2xl p-8">
              <h2 className="text-2xl font-bold mb-6">Contact Us for Support</h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="What is this regarding?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Message</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
