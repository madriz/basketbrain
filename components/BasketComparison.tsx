'use client';

import { useMemo } from 'react';
import { computeBasketComparison } from '@/lib/snapshot';

const MEDALS = ['1st', '2nd', '3rd'];

function fmt(n: number): string {
  return `$${n.toFixed(2)}`;
}

function ItemsBar({ found, total }: { found: number; total: number }) {
  const pct = total > 0 ? (found / total) * 100 : 0;
  const warn = found < total * 0.9;
  return (
    <div className="flex items-center gap-2">
      <div className="h-2 flex-1 rounded-full bg-gray-100">
        <div
          className="h-2 rounded-full bg-green-500 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="shrink-0 text-xs text-gray-400">
        {found}/{total}
        {warn && <span className="ml-0.5" title="Fewer items tracked">⚠︎</span>}
      </span>
    </div>
  );
}

export default function BasketComparison() {
  const data = useMemo(() => computeBasketComparison(), []);
  const cheapest = data.retailers[0];
  const mostExpensive = data.retailers[data.retailers.length - 1];
  const savings = Math.max(0, mostExpensive.basket_total - cheapest.basket_total);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Essential 30 — full basket comparison
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {data.items_total} items tracked. Coverage varies by retailer —{' '}
          {data.core_item_ids.length} items are carried by every retailer in
          this snapshot.
        </p>
      </div>

      {savings > 0.01 && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-center">
          <p className="text-sm font-semibold text-green-800">
            You save {fmt(savings)} shopping at {cheapest.name} vs{' '}
            {mostExpensive.name} for the {data.items_total}-item basket.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {data.retailers.map((r, i) => {
          const isCheapest = i === 0;
          const isLast = i === data.retailers.length - 1;
          return (
            <div
              key={r.slug}
              className={`rounded-xl border px-4 py-4 sm:px-5 ${
                isCheapest
                  ? 'border-green-300 bg-green-50'
                  : isLast
                    ? 'border-red-200 bg-red-50/50'
                    : 'border-gray-200 bg-white'
              }`}
            >
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <div className="flex items-baseline gap-2">
                  {MEDALS[i] && (
                    <span className="text-sm font-bold text-gray-400">
                      {MEDALS[i]}
                    </span>
                  )}
                  <span
                    className={`text-base font-semibold ${
                      isCheapest
                        ? 'text-green-800'
                        : isLast
                          ? 'text-red-800'
                          : 'text-gray-900'
                    }`}
                  >
                    {r.name}
                  </span>
                  {isCheapest && (
                    <span className="text-xs font-medium text-green-600">
                      Cheapest
                    </span>
                  )}
                  {isLast && (
                    <span className="text-xs font-medium text-red-500">
                      Most exp.
                    </span>
                  )}
                </div>
                <span
                  className={`text-xl font-bold tabular-nums ${
                    isCheapest
                      ? 'text-green-700'
                      : isLast
                        ? 'text-red-700'
                        : 'text-gray-900'
                  }`}
                >
                  {fmt(r.basket_total)}
                </span>
              </div>
              <div className="mt-2">
                <ItemsBar found={r.items_found} total={r.items_total} />
              </div>
              {r.savings_vs_most_expensive > 0.01 && (
                <div className="mt-2">
                  <span className="inline-block rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                    Save {fmt(r.savings_vs_most_expensive)} ({r.savings_pct}%)
                  </span>
                </div>
              )}
            </div>
          );
        })}

        <div className="rounded-xl border-2 border-dashed border-green-400 bg-green-50/60 px-4 py-4 sm:px-5">
          <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
            <div>
              <span className="text-base font-semibold text-green-800">
                Mixed basket
              </span>
              <span className="ml-2 text-xs text-gray-500">
                theoretical minimum
              </span>
            </div>
            <span className="text-xl font-bold tabular-nums text-green-700">
              {fmt(data.mixed_basket.basket_total)}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500 italic">
            Cheapest price per item across all stores. Would require shopping
            at multiple stores — not a realistic single trip.
          </p>
          <div className="mt-2">
            <ItemsBar
              found={data.mixed_basket.items_found}
              total={data.items_total}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
