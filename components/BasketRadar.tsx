'use client';

/**
 * BasketRadar — Recharts radar chart showing per-retailer coverage
 * of the user's cart. Each axis is a retailer; the radius is how many
 * cart items that retailer carries (0 → full).
 */
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import type { CartPricing } from '@/lib/snapshot';

export default function BasketRadar({ pricing }: { pricing: CartPricing }) {
  const cartSize = pricing.matches.filter((m) => m.product !== null).length;
  const data = pricing.per_retailer_total.map((r) => ({
    retailer: r.name,
    coverage: r.items_found,
    total: r.total,
  }));

  if (cartSize === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
        Add catalog items to your cart to see the retailer coverage radar.
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">
        Cart coverage by retailer ({cartSize} priceable items)
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e5e7eb" />
          <PolarAngleAxis
            dataKey="retailer"
            tick={{ fontSize: 11, fill: '#6b7280' }}
          />
          <PolarRadiusAxis
            domain={[0, cartSize]}
            tick={{ fontSize: 10, fill: '#9ca3af' }}
          />
          <Tooltip
            formatter={(value: number, name: string) =>
              name === 'coverage'
                ? [`${value} of ${cartSize} items`, 'Coverage']
                : [`$${value.toFixed(2)}`, 'Basket total']
            }
          />
          <Radar
            dataKey="coverage"
            stroke="#16a34a"
            fill="#16a34a"
            fillOpacity={0.35}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
