import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import CookieBanner from '@/components/CookieBanner';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BasketBrain — Toronto grocery snapshot (research demo)',
  description:
    'Frozen 2026 snapshot of Canadian grocery prices near M5V 2T6 (downtown Toronto). Research-project archive, not a live shopping tool.',
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* GA4 is injected by CookieBanner only after user consent. */}
      </head>
      <body className={inter.className}>
        <header className="border-b bg-white sticky top-0 z-10">
          <div className="mx-auto max-w-4xl px-4 py-3 flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-xl font-bold text-green-700">
                BasketBrain
              </span>
              <span className="text-xs text-gray-400 font-normal">
                research archive
              </span>
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-4xl px-4 py-8">{children}</main>
        <CookieBanner />
        <footer className="mt-16 border-t bg-gray-50 py-8 px-4">
          <div className="mx-auto max-w-4xl space-y-2 text-xs text-gray-400 leading-relaxed">
            <p>
              BasketBrain is a research project, not a live shopping tool. Data
              shown here is a frozen April 2026 snapshot of public Canadian
              grocery retailer sources and should not be used as the basis for
              shopping decisions.
            </p>
            <p>BasketBrain · basketbrain.ca · Prices in CAD</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
