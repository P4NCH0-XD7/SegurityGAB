'use client';

import { Inter, Manrope } from "next/font/google";
import "../styles/globals.css";
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: '--font-manrope',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const checkAuth = useAuthStore(state => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <html lang="es">
      <body className={`${inter.variable} ${manrope.variable} ${inter.className}`}>
        <Toaster position="bottom-right" />
        {children}
      </body>
    </html>
  );
}
