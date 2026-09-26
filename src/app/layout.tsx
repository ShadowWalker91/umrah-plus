import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import FloatingWhatsApp from "@/components/FloatingWhatsApp";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: 'swap' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: 'swap' });

export const metadata: Metadata = {
  title: "Umrah Plus | Sacred Ziyarat & Spiritual Journeys",
  description: "Explore the life and legacy of Prophet Muhammad S.A.W through detailed Ziyarat guides.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} scroll-smooth`} suppressHydrationWarning>
      <body 
        className="font-sans antialiased bg-[#0c0d10] text-gray-100"
        suppressHydrationWarning
      >
        <GoogleAnalytics />
        <Header />
        
        {children}
        
        <FloatingWhatsApp />
      </body>
    </html>
  );
}