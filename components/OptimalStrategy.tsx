'use client';

/**
 * Optimal-strategy card: names the single cheapest retailer for the
 * Essential 30 basket and the mixed-basket theoretical minimum.
 */
import { computeBasketComparison, storeById } from '@/lib/snapshot';

function fmt(n: number): string {
  return `$${n.toFixed(2)}`;
}

export default function OptimalStrategy() {
  const data = computeBasketComparison();
  const cheapest = data.retailers[0];
  // Pick a representative store name (first one in snapshot.stores for the slug)
  const rep = storeById(
    // not actually needed — show the retailer name for the card
    '',
  );
  void rep;

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-bold text-gray-900">
        Cheapest single-store basket
      </h3>
      <p className="mt-1 text-2xl font-bold text-green-700">
        {cheapest.name} — {fmt(cheapest.basket_total)}
      </p>
      <p className="mt-1 text-sm text-gray-500">
        {cheapest.items_found} of {data.items_total} Essential 30 items in
        stock. Mixed-basket minimum across all retailers:{' '}
        <span className="font-semibold text-green-700">
          {fmt(data.mixed_basket.basket_total)}
        </span>{' '}
        ({data.mixed_basket.items_found} items).
      </p>
    </section>
  );
}
