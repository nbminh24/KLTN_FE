'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    category: 'Orders & Payment',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay. All transactions are secure and encrypted.',
      },
      {
        q: 'Can I modify or cancel my order?',
        a: 'You can modify or cancel your order within 1 hour of placing it. After that, your order enters processing and cannot be changed. Contact support immediately if you need assistance.',
      },
      {
        q: 'Do you offer gift cards?',
        a: 'Yes! We offer digital gift cards in various denominations. They can be purchased on our website and sent via email.',
      },
    ],
  },
  {
    category: 'Shipping & Delivery',
    questions: [
      {
        q: 'How long does delivery take?',
        a: 'Standard delivery takes 3-5 business days. Express delivery takes 1-2 business days. International orders may take 7-14 business days depending on location.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to over 50 countries worldwide. Shipping costs and delivery times vary by location.',
      },
      {
        q: 'How can I track my order?',
        a: 'Once shipped, you\'ll receive a tracking number via email. You can track your order on our website or the carrier\'s website.',
      },
    ],
  },
  {
    category: 'Returns & Refunds',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day return policy for all items. Products must be unworn, unwashed, and in original packaging with tags attached.',
      },
      {
        q: 'How do I return an item?',
        a: 'Log into your account, go to Orders, select the item you want to return, and follow the return process. We\'ll provide a prepaid return label.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5-7 business days after we receive your return. The amount will be credited to your original payment method.',
      },
    ],
  },
  {
    category: 'Account & Security',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click on the user icon in the header and select "Sign Up". Fill in your details to create an account. You can also sign up using Google or Facebook.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes, absolutely. We use industry-standard SSL encryption to protect your payment information. We never store your full credit card details.',
      },
      {
        q: 'How do I reset my password?',
        a: 'Click on "Forgot Password" on the login page. Enter your email and we\'ll send you instructions to reset your password.',
      },
    ],
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleQuestion = (categoryIndex: number, questionIndex: number) => {
    const key = `${categoryIndex}-${questionIndex}`;
    setOpenIndex(openIndex === key ? null : key);
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
            <span className="font-medium">FAQ</span>
          </div>

          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-integral font-bold mb-6">
              FREQUENTLY ASKED QUESTIONS
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find answers to common questions about shopping with us
            </p>
          </div>

          {/* FAQ Sections */}
          <div className="max-w-4xl mx-auto space-y-8">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold mb-4">{category.category}</h2>
                <div className="space-y-3">
                  {category.questions.map((faq, questionIndex) => {
                    const key = `${categoryIndex}-${questionIndex}`;
                    const isOpen = openIndex === key;

                    return (
                      <div
                        key={questionIndex}
                        className="border border-gray-200 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-gray-50 transition"
                        >
                          <span className="font-bold text-base md:text-lg pr-4">{faq.q}</span>
                          {isOpen ? (
                            <ChevronUp className="w-5 h-5 flex-shrink-0" />
                          ) : (
                            <ChevronDown className="w-5 h-5 flex-shrink-0" />
                          )}
                        </button>
                        {isOpen && (
                          <div className="px-4 md:px-6 pb-4 md:pb-6 text-gray-700">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Still Need Help */}
          <div className="mt-16 bg-gray-100 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Still Have Questions?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Can\'t find the answer you\'re looking for? Our support team is here to help.
            </p>
            <Link
              href="/support"
              className="inline-block bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
