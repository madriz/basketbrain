'use client';

/**
 * SavingsBarChart — Recharts horizontal bar of per-retailer cart totals.
 * The cheapest retailer is highlighted green, the priciest red.
 */
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { CartPricing } from '@/lib/snapshot';

export default function SavingsBarChart({ pricing }: { pricing: CartPricing }) {
  const data = pricing.per_retailer_total
    .filter((r) => r.total > 0)
    .map((r) => ({ retailer: r.name, total: r.total }));
  if (data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.total));
  const min = Math.min(...data.map((d) => d.total));

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-2">
        Cart total by retailer
      </h3>
      <ResponsiveContainer width="100%" height={Math.max(220, data.length * 42)}>
        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            type="number"
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => `$${v}`}
          />
          <YAxis
            type="category"
            dataKey="retailer"
            tick={{ fontSize: 11 }}
            width={160}
          />
          <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, 'Total']} />
          <Bar dataKey="total">
            {data.map((d, i) => (
              <Cell
                key={i}
                fill={
                  d.total === min ? '#16a34a' : d.total === max ? '#ef4444' : '#6b7280'
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
