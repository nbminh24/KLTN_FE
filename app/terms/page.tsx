import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-6 md:px-12 py-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6">
            <Link href="/" className="text-gray-500">Home</Link>
            <ChevronRight className="w-4 h-4 text-gray-500" />
            <span className="font-medium">Terms & Conditions</span>
          </div>

          {/* Content */}
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-5xl font-integral font-bold mb-6">
              TERMS & CONDITIONS
            </h1>
            <p className="text-gray-600 mb-8">Last updated: October 16, 2025</p>

            <div className="prose prose-gray max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  By accessing and using LeCas website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
                <p className="text-gray-700 leading-relaxed mb-3">
                  Permission is granted to temporarily download one copy of the materials on LeCas's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                </p>
                <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                  <li>Modify or copy the materials</li>
                  <li>Use the materials for any commercial purpose</li>
                  <li>Attempt to decompile or reverse engineer any software</li>
                  <li>Remove any copyright or proprietary notations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">3. Product Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  We strive to provide accurate product descriptions and images. However, we do not warrant that product descriptions, colors, or other content available on the site is accurate, complete, reliable, current, or error-free.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">4. Pricing and Payment</h2>
                <p className="text-gray-700 leading-relaxed">
                  All prices are in USD and subject to change without notice. We reserve the right to modify or discontinue products at any time. Payment must be received before order processing. We accept major credit cards, PayPal, and other payment methods as indicated on our site.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">5. Shipping and Delivery</h2>
                <p className="text-gray-700 leading-relaxed">
                  Shipping costs and delivery times vary based on location and selected shipping method. Risk of loss and title for items pass to you upon delivery to the carrier. We are not responsible for delays caused by customs or shipping carriers.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">6. Returns and Refunds</h2>
                <p className="text-gray-700 leading-relaxed">
                  Items may be returned within 30 days of purchase for a full refund, provided they are unworn, unwashed, and in original condition with tags attached. Shipping costs are non-refundable. Refunds will be processed within 5-7 business days of receiving the return.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">7. Limitation of Liability</h2>
                <p className="text-gray-700 leading-relaxed">
                  In no event shall LeCas or its suppliers be liable for any damages arising out of the use or inability to use the materials on LeCas's website, even if LeCas or an authorized representative has been notified of the possibility of such damage.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">8. Governing Law</h2>
                <p className="text-gray-700 leading-relaxed">
                  These terms and conditions are governed by and construed in accordance with the laws and you irrevocably submit to the exclusive jurisdiction of the courts in that location.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">9. Changes to Terms</h2>
                <p className="text-gray-700 leading-relaxed">
                  We reserve the right to modify these terms at any time. Your continued use of the site following any changes indicates your acceptance of the new terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold mb-4">10. Contact Information</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about these Terms & Conditions, please contact us at lecas.office@gmail.com
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
