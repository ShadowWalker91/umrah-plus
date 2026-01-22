import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Header from "@/components/Header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: 'swap' });
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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body 
        className={`${inter.variable} ${playfair.variable} font-sans bg-slate-950 text-white antialiased`}
        suppressHydrationWarning
      >
        <Header />
        
        {children}
        
      </body>
    </html>
  );
}