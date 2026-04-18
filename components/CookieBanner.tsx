'use client';

/**
 * Simple opt-in cookie consent banner. Defaults to DENIED until the user
 * clicks Accept. Loads Google Analytics 4 on Accept and sets a 1-year cookie
 * so the banner never reappears. Decline also persists and suppresses GA4.
 *
 * CASL + PIPEDA note: GA4 in this repo uses the BasketBrain measurement ID
 * (G-PRR16YTLRX) and receives only pageviews. No PII is collected; no
 * cross-site tracking is enabled.
 */
import { useEffect, useState } from 'react';

const GA_ID = 'G-PRR16YTLRX';
const COOKIE_KEY = 'ga_consent';
const ONE_YEAR_DAYS = 365;

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const pair = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return pair ? decodeURIComponent(pair.split('=')[1]) : null;
}

function writeCookie(name: string, value: string, days: number): void {
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; max-age=${maxAge}; path=/; SameSite=Lax`;
}

function loadGA(): void {
  if (typeof window === 'undefined') return;
  // Inject the gtag loader
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);

  const w = window as unknown as {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  function gtag(...args: unknown[]) {
    (w.dataLayer as unknown[]).push(args);
  }
  w.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_ID);
}

export default function CookieBanner() {
  const [decision, setDecision] = useState<'pending' | 'granted' | 'denied'>(
    'pending',
  );

  useEffect(() => {
    const existing = readCookie(COOKIE_KEY);
    if (existing === 'granted') {
      setDecision('granted');
      loadGA();
    } else if (existing === 'denied') {
      setDecision('denied');
    }
  }, []);

  if (decision !== 'pending') return null;

  function accept() {
    writeCookie(COOKIE_KEY, 'granted', ONE_YEAR_DAYS);
    setDecision('granted');
    loadGA();
  }
  function decline() {
    writeCookie(COOKIE_KEY, 'denied', ONE_YEAR_DAYS);
    setDecision('denied');
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white shadow-lg"
    >
      <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3">
        <p className="text-sm text-gray-700 flex-1">
          This site uses Google Analytics to count page views. No personal
          data is collected and nothing is shared with advertisers.
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={decline}
            className="rounded-md border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={accept}
            className="rounded-md bg-green-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-800"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
