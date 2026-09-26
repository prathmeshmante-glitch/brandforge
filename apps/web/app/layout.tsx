import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BrandForge — From rough idea to launch-ready brand',
  description: 'An AI brand intelligence studio for turning unstructured ideas into coherent, launch-ready brand systems.',
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
