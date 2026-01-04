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
              CẬP NHẬT ƯU ĐÃI MỚI NHẤT CỦA CHÚNG TÔI
            </h2>
            <div className="flex flex-col gap-3 w-full md:w-auto">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Nhập địa chỉ email của bạn"
                  className="w-full md:w-80 px-4 py-2.5 rounded-full text-black focus:outline-none text-sm"
                />
              </div>
              <button className="w-full md:w-80 bg-white text-black px-4 py-2.5 rounded-full font-medium hover:bg-gray-200 transition text-sm">
                Đăng Ký Nhận Tin
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
              LeCas - Thanh Lịch Tự Nhiên Mọi Khoảnh Khắc
            </Link>
            <p className="mt-4 text-gray-600 max-w-xs text-sm">
              Trải nghiệm tinh hoa thời trang nam hiện đại - tinh tế, tự tin và bền vững. Mỗi thiết kế thể hiện sự cân bằng hoàn hảo giữa phong cách và chất lượng dành cho phái mạnh.
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
            <h3 className="font-medium text-xs tracking-wider uppercase mb-4">Công Ty</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><Link href="/about">Giới Thiệu</Link></li>
              <li><Link href="/features">Tính Năng</Link></li>
              <li><Link href="/works">Hoạt Động</Link></li>
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-medium text-xs tracking-wider uppercase mb-4">Hỗ Trợ</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><Link href="/support" className="hover:text-black transition">Chăm Sóc Khách Hàng</Link></li>
              <li><Link href="/delivery" className="hover:text-black transition">Chi Tiết Giao Hàng</Link></li>
              <li><Link href="/terms" className="hover:text-black transition">Điều Khoản & Điều Kiện</Link></li>
              <li><Link href="/privacy" className="hover:text-black transition">Chính Sách Bảo Mật</Link></li>
              <li><Link href="/faq" className="hover:text-black transition">Câu Hỏi Thường Gặp</Link></li>
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="font-medium text-xs tracking-wider uppercase mb-4">Tài Khoản</h3>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li><Link href="/profile" className="hover:text-black transition">Tài Khoản Của Tôi</Link></li>
              <li><Link href="/addresses" className="hover:text-black transition">Địa Chỉ Của Tôi</Link></li>
              <li><Link href="/orders" className="hover:text-black transition">Đơn Hàng</Link></li>
              <li><Link href="/payments" className="hover:text-black transition">Thanh Toán</Link></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-300 mt-8 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-600 text-sm">
              © 2025 LeCas. Bảo Lưu Mọi Quyền.
            </p>
            <div className="flex gap-4 text-xs text-gray-600">
              <Link href="/terms" className="hover:text-black transition">Điều Khoản</Link>
              <Link href="/privacy" className="hover:text-black transition">Bảo Mật</Link>
              <Link href="/support" className="hover:text-black transition">Hỗ Trợ</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
