import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Mini Sepet Mağaza',
  description: 'Next.js ile geliştirilmiş mağaza uygulaması',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr">
      <body className={inter.className} suppressHydrationWarning>
        <Navigation />
        <main>{children}</main>
      </body>
    </html>
  );
}