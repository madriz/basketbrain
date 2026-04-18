'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

import BasketRadar from '@/components/BasketRadar';
import PriceComparisonTable from '@/components/PriceComparisonTable';
import SavingsBarChart from '@/components/SavingsBarChart';
import { priceCart, snapshot, type CartEntry } from '@/lib/snapshot';

function parseCart(raw: string | null): CartEntry[] {
  if (!raw) return [];
  try {
    const data = JSON.parse(decodeURIComponent(raw));
    if (!Array.isArray(data)) return [];
    return data.map((d: { name?: string; quantity?: number; unit?: string }) => ({
      name: String(d.name ?? ''),
      quantity: Math.max(1, Math.min(99, Number(d.quantity ?? 1))),
      unit: d.unit,
    }));
  } catch {
    return [];
  }
}

function fmt(n: number): string {
  return `$${n.toFixed(2)}`;
}

export default function ResultsView() {
  const searchParams = useSearchParams();
  const cart = useMemo(
    () => parseCart(searchParams.get('cart')),
    [searchParams],
  );
  const pricing = useMemo(() => priceCart(cart), [cart]);

  if (cart.length === 0) {
    return (
      <div className="space-y-4">
        <p className="rounded-md bg-amber-50 border border-amber-200 px-4 py-3 text-sm text-amber-800">
          No cart items found in the URL.
        </p>
        <Link
          href="/demo/build/"
          className="inline-block rounded-md bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
        >
          ← Build a cart
        </Link>
      </div>
    );
  }

  const cheapest = pricing.per_retailer_total[0];
  const priciest =
    pricing.per_retailer_total[pricing.per_retailer_total.length - 1];

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Cart results</h1>
        <p className="text-sm text-gray-500">
          {cart.length} item{cart.length === 1 ? '' : 's'}, priced against the{' '}
          {snapshot.snapshot_date} Toronto snapshot.
        </p>
      </header>

      {cheapest && cheapest.total > 0 && (
        <section className="rounded-xl border border-green-300 bg-green-50 p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Cheapest for this cart
          </p>
          <p className="mt-1 text-2xl font-bold text-green-700">
            {cheapest.name} — {fmt(cheapest.total)}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {cheapest.items_found} of {cart.length} cart items priced.
            {priciest && priciest.total > cheapest.total && (
              <>
                {' '}Save{' '}
                <span className="font-semibold">
                  {fmt(priciest.total - cheapest.total)}
                </span>{' '}
                vs. {priciest.name}.
              </>
            )}
          </p>
          {pricing.mixed_total > 0 && pricing.mixed_total < cheapest.total && (
            <p className="mt-1 text-sm text-gray-500">
              Mixed-basket minimum (cherry-pick each item&rsquo;s cheapest
              retailer): <span className="font-semibold">{fmt(pricing.mixed_total)}</span>
            </p>
          )}
        </section>
      )}

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SavingsBarChart pricing={pricing} />
        <BasketRadar pricing={pricing} />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-bold text-gray-900">Per-item comparison</h2>
        <PriceComparisonTable matches={pricing.matches} />
      </section>

      <Link
        href="/demo/build/"
        className="inline-block rounded-md bg-green-700 px-4 py-2 text-sm text-white hover:bg-green-800"
      >
        ← Edit cart
      </Link>
    </div>
  );
}
