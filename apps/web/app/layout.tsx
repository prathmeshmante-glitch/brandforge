import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://brandforge-jade.vercel.app'),
  title: 'BrandForge — From rough idea to launch-ready brand',
  description: 'An AI brand intelligence studio for turning unstructured ideas into coherent, launch-ready brand systems through 8-agent reasoning, human decisions, critique, and consistency.',
  keywords: ['AI branding', 'brand intelligence', 'startup branding', 'brand strategy', 'brand kit generator', 'naming agent'],
  authors: [{ name: 'BrandForge Studio' }],
  openGraph: {
    title: 'BrandForge — AI Brand Intelligence Studio',
    description: 'From rough idea to launch-ready brand. 8-stage AI agent reasoning with human gates, adversarial critique, and vector PDF brand books.',
    url: 'https://brandforge-jade.vercel.app',
    siteName: 'BrandForge',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BrandForge — AI Brand Intelligence Studio',
    description: 'From rough idea to launch-ready brand. 8 specialized AI agents creating complete, consistent brand identities.',
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
};

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0A0A0C',
};

import { AuthProvider } from '../lib/auth-context';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#0a0a0c] text-[#f5f5f7]">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
