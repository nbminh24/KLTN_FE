import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot";
import { ToastContainer } from "@/components/Toast";
import TokenRefreshProvider from "@/components/TokenRefreshProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const montserrat = Montserrat({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LeCas - Thời Trang Nam",
  description: "Nền tảng thương mại điện tử thời trang nam hiện đại",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        <TokenRefreshProvider />
        {children}
        <Chatbot />
        <ToastContainer />
      </body>
    </html>
  );
}
