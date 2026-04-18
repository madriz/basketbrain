/**
 * Per-item price comparison table for the /demo/results cart view.
 * Pure presentational — receives already-priced cart matches.
 */
import type { CartItemMatch } from '@/lib/snapshot';
import { snapshot } from '@/lib/snapshot';

function fmt(n: number): string {
  return `$${n.toFixed(2)}`;
}

export default function PriceComparisonTable({
  matches,
}: {
  matches: CartItemMatch[];
}) {
  const retailers = snapshot.retailers;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50">
            <th className="px-3 py-2 text-left font-semibold text-gray-700">
              Item
            </th>
            {retailers.map((r) => (
              <th
                key={r.slug}
                className="px-3 py-2 text-right font-semibold text-gray-700"
              >
                {r.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matches.map((m, idx) => {
            const prices = retailers.map((r) => m.per_retailer[r.slug]?.price_cad ?? null);
            const presentPrices = prices.filter((p): p is number => p != null);
            const minPrice = presentPrices.length
              ? Math.min(...presentPrices)
              : null;
            return (
              <tr key={idx} className="border-b border-gray-100">
                <td className="px-3 py-2">
                  {m.product ? (
                    <span>
                      <span className="mr-1">{m.product.emoji}</span>
                      {m.product.display_name}
                      {m.cart_entry.quantity > 1 && (
                        <span className="ml-1 text-xs text-gray-400">
                          × {m.cart_entry.quantity}
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-gray-400">
                      {m.cart_entry.name || '(unnamed)'}
                      <span className="ml-1 text-xs italic">not in snapshot</span>
                    </span>
                  )}
                </td>
                {prices.map((p, i) => (
                  <td
                    key={retailers[i].slug}
                    className={`px-3 py-2 text-right tabular-nums ${
                      p != null && p === minPrice
                        ? 'font-bold text-green-700'
                        : 'text-gray-700'
                    }`}
                  >
                    {p != null ? fmt(p) : <span className="text-gray-300">—</span>}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
