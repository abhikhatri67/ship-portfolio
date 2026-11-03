import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { QueryProvider } from '@/components/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'] });

const description =
  'Lead Software Engineer with 9.5+ years of experience in React, TypeScript and AI-assisted engineering. Sail through the career quest: heyport (10,000+ port calls), JouleTrack, LLM email ingestion.';

export const metadata: Metadata = {
  title: 'Abhishek Khatri · Lead Software Engineer',
  description,
  keywords: ['Abhishek Khatri', 'Lead Software Engineer', 'React', 'TypeScript', 'portfolio', 'GoGroup', 'heyport'],
  authors: [{ name: 'Abhishek Khatri' }],
  openGraph: {
    title: 'Abhishek Khatri · Lead Software Engineer',
    description,
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Abhishek Khatri: an interactive 3D career quest' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abhishek Khatri · Lead Software Engineer',
    description,
    images: ['/og.png'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen`}>
        <QueryProvider>
          {children}
        </QueryProvider>
      </body>
    </html>
  );
} 