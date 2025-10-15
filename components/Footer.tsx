import Link from 'next/link';
import { Twitter, Facebook, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-100 mt-20">
      {/* Newsletter Section */}
      <div className="bg-black text-white">
        <div className="container mx-auto px-6 md:px-12 py-6 md:py-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <h2 className="text-xl md:text-3xl font-integral font-bold max-w-xl">
              STAY UPTO DATE ABOUT OUR LATEST OFFERS
            </h2>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="w-full md:w-80 px-4 py-2.5 rounded-full text-black focus:outline-none text-sm"
                />
              </div>
              <button className="w-full md:w-80 bg-white text-black px-4 py-2.5 rounded-full font-medium hover:bg-gray-200 transition text-sm">
                Subscribe to Newsletter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <Link href="/" className="text-xl font-integral font-bold">
              LeCas - Casually Elegant Every Moment
            </Link>
            <p className="mt-4 text-gray-600 max-w-xs text-sm">
              Experience the essence of modern men's fashion - refined, confident, and built to last. Every design embodies a balance of style and quality made for today's man.
            </p>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-gray-800 transition">
                <Facebook className="w-5 h-5 text-white" />
              </a>
              <a href="#" className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white border border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-medium text-xs tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><Link href="/about">About</Link></li>
              <li><Link href="/features">Features</Link></li>
              <li><Link href="/works">Works</Link></li>
              <li><Link href="/career">Career</Link></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-medium text-xs tracking-wider uppercase mb-4">Help</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><Link href="/support">Customer Support</Link></li>
              <li><Link href="/delivery">Delivery Details</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* FAQ Links */}
          <div>
            <h3 className="font-medium text-xs tracking-wider uppercase mb-4">FAQ</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><Link href="/account">Account</Link></li>
              <li><Link href="/deliveries">Manage Deliveries</Link></li>
              <li><Link href="/orders">Orders</Link></li>
              <li><Link href="/payments">Payments</Link></li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
}
