'use client';

/**
 * "Best vs Worst Price" widget — shows 5 headline items with cheapest +
 * priciest retailer and the gap between them. Reads directly from the
 * frozen snapshot; no network.
 */
import { computeBestWorst } from '@/lib/snapshot';

const HEADLINE_IDS = [
  'milk-2-percent-4l',
  'large-eggs-dozen',
  'white-bread',
  'chicken-breast',
  'cheddar-cheese-400g',
];

function fmt(n: number): string {
  return `$${n.toFixed(2)}`;
}

export default function PriceTrendsSection() {
  const rows = HEADLINE_IDS.map(computeBestWorst).filter(
    (r): r is NonNullable<typeof r> => r !== null,
  );

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-bold text-gray-900">
        Best vs worst — 5 headline items
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {rows.map((row) => (
          <div
            key={row.item.id}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{row.item.emoji}</span>
              <span className="font-semibold text-gray-900">
                {row.item.display_name}
              </span>
            </div>
            {row.cheapest && (
              <div className="mb-2">
                <p className="text-xs text-gray-400 uppercase">Cheapest</p>
                <p className="text-sm text-gray-900">{row.cheapest.retailer}</p>
                <p className="text-lg font-bold text-green-700">
                  {fmt(row.cheapest.price_cad)}
                </p>
              </div>
            )}
            {row.priciest && (
              <div>
                <p className="text-xs text-gray-400 uppercase">Priciest</p>
                <p className="text-sm text-gray-900">{row.priciest.retailer}</p>
                <p className="text-lg font-bold text-red-600">
                  {fmt(row.priciest.price_cad)}
                </p>
              </div>
            )}
            {row.gap_cad > 0 && (
              <p className="mt-2 text-xs font-medium text-gray-500">
                Gap: {fmt(row.gap_cad)}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
