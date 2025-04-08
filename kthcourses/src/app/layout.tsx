import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from '@/app/components/Navbar';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KTH Courses",
  description: "Explore all courses at KTH",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`min-w-80 bg-kth-gray flex flex-col h-full ${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navbar />
        <main className="mt-14 flex-grow flex flex-col overflow-auto">
          {children}
        </main>
      </body>
    </html>
  );
}
