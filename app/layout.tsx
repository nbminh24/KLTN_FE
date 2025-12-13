import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import Chatbot from "@/components/Chatbot";
import { ToastContainer } from "@/components/Toast";
import TokenRefreshProvider from "@/components/TokenRefreshProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LeCas - Fashion E-commerce",
  description: "Modern fashion e-commerce platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased">
        <TokenRefreshProvider />
        {children}
        <Chatbot />
        <ToastContainer />
      </body>
    </html>
  );
}
