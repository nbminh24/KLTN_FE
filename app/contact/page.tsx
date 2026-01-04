'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, Mail, Phone, MapPin, Send } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message sent! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Trang Chủ</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Liên Hệ</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-integral font-bold mb-6">
              LIÊN HỆ VỚI CHÚNG TÔI
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Có thắc mắc? Chúng tôi rất muốn lắng nghe từ bạn. Gửi tin nhắn và chúng tôi sẽ phản hồi sớm nhất có thể.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Contact Cards */}
            {[
              {
                icon: Mail,
                title: 'Email',
                info: 'support@lecas.com',
                description: 'Gửi email bất cứ lúc nào',
              },
              {
                icon: Phone,
                title: 'Điện Thoại',
                info: '+1 (555) 123-4567',
                description: 'Thứ 2-6 từ 9AM đến 6PM',
              },
              {
                icon: MapPin,
                title: 'Văn Phòng',
                info: 'New York, NY 10001',
                description: 'Ghé thăm văn phòng chúng tôi',
              },
            ].map((contact, index) => (
              <div key={index} className="border border-gray-200 rounded-2xl p-6 text-center hover:shadow-lg transition">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-black text-white rounded-full mb-4">
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
            <div className="bg-gray-50 rounded-3xl p-8 md:p-12">
              <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                Gửi Tin Nhắn Cho Chúng Tôi
              </h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Họ Và Tên</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Chủ Đề</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                    placeholder="Chúng tôi có thể giúp gì cho bạn?"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Nội Dung</label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    placeholder="Nói thêm về vấn đề của bạn..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition flex items-center justify-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Gửi Tin Nhắn
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
