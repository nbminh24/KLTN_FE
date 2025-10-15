import type { Metadata } from "next";
import "./globals.css";
import Chatbot from "@/components/Chatbot";

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
    <html lang="en">
      <body className="antialiased">
        {children}
        <Chatbot />
      </body>
    </html>
  );
}
