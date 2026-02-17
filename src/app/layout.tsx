import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cuan - Sales Dashboard",
  description: "Dashboard pendapatan Sales for Cuan",
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

import { RoleProvider } from "@/context/RoleContext";
import { BottomNav } from "@/components/ui/BottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} antialiased`}>
        <RoleProvider>
          <main className="mobile-frame">
            <div className="flex-1 overflow-y-auto w-full relative">
              {children}
            </div>
            <BottomNav />
          </main>
        </RoleProvider>
      </body>
    </html>
  );
}
