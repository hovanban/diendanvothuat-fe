import React from 'react';
import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import SessionProvider from '@/components/providers/SessionProvider';
import { SignInProvider } from '@/components/providers/SignInProvider';
import { ThemeProvider } from '@/context/ThemeProvider';
import '../styles/prism.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-inter',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-spaceGrotesk',
});

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL || 'https://diendanvothuat.vn'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Diễn Đàn Võ Thuật Việt Nam',
    template: '%s | Diễn Đàn Võ Thuật',
  },
  description: 'Cộng đồng võ thuật Việt Nam — chia sẻ kinh nghiệm, tìm câu lạc bộ, thảo luận về các môn võ: Muay Thai, Jiu-Jitsu, Karate, Kickboxing và nhiều hơn nữa.',
  keywords: ['võ thuật', 'diễn đàn võ thuật', 'câu lạc bộ võ thuật', 'muay thai', 'jiu-jitsu', 'karate', 'kickboxing', 'boxing', 'vietnam martial arts'],
  authors: [{ name: 'Diễn Đàn Võ Thuật' }],
  creator: 'Diễn Đàn Võ Thuật',
  icons: {
    icon: '/assets/images/site-logo.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: baseUrl,
    siteName: 'Diễn Đàn Võ Thuật',
    title: 'Diễn Đàn Võ Thuật Việt Nam',
    description: 'Cộng đồng võ thuật Việt Nam — chia sẻ kinh nghiệm, tìm câu lạc bộ, thảo luận về các môn võ.',
    images: [{ url: '/assets/images/site-logo.svg', width: 512, height: 512, alt: 'Diễn Đàn Võ Thuật' }],
  },
  twitter: {
    card: 'summary',
    title: 'Diễn Đàn Võ Thuật Việt Nam',
    description: 'Cộng đồng võ thuật Việt Nam — chia sẻ kinh nghiệm, tìm câu lạc bộ, thảo luận về các môn võ.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={`${inter.variable} ${spaceGrotesk.variable}`} suppressHydrationWarning>
        <SessionProvider>
          <ThemeProvider>
            <SignInProvider>
              {children}
            </SignInProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
