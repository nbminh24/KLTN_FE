'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Mail, Phone, MessageCircle, Send } from 'lucide-react';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    triedAI: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    alert('Your message has been sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '', triedAI: false });
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
              HOW CAN WE HELP?
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
              Our support team is here to assist you 24/7
            </p>
            
            {/* AI Chatbot Notice */}
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-xl p-6">
              <div className="flex items-start gap-4">
                <MessageCircle className="w-8 h-8 text-purple-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h3 className="font-bold text-purple-900 text-lg mb-2">Try Our AI Chatbot First! 🤖</h3>
                  <p className="text-sm text-purple-800 mb-3">
                    Our AI assistant can instantly help you with:
                  </p>
                  <ul className="text-sm text-purple-800 space-y-1 mb-4">
                    <li>✓ Order tracking & status updates</li>
                    <li>✓ Product information & recommendations</li>
                    <li>✓ Return & refund policies</li>
                    <li>✓ Size guides & fitting advice</li>
                  </ul>
                  <p className="text-xs text-purple-700 font-medium">
                    💡 The AI chatbot resolves 80% of inquiries instantly! If it can't help, you'll be guided to fill this form.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Options */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Mail,
                title: 'Email Us',
                info: 'support@lecas.com',
                description: 'Response within 24 hours',
              },
              {
                icon: Phone,
                title: 'Call Us',
                info: '+1 (555) 123-4567',
                description: 'Mon-Fri, 9AM-6PM EST',
              },
              {
                icon: MessageCircle,
                title: 'Live Chat',
                info: 'Chat with us',
                description: 'Available 24/7',
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
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
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
                <div className="flex items-start gap-3 bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <input
                    type="checkbox"
                    id="triedAI"
                    checked={formData.triedAI}
                    onChange={(e) => setFormData({ ...formData, triedAI: e.target.checked })}
                    className="w-5 h-5 mt-0.5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    required
                  />
                  <label htmlFor="triedAI" className="text-sm text-purple-900">
                    <span className="font-bold">I tried the AI chatbot first</span> and it couldn't help
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Send Message
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
