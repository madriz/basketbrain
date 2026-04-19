/**
 * Per-item price comparison table for the /demo/results cart view.
 * Pure presentational — receives already-priced cart matches and the
 * shared per-retailer totals (same object SavingsBarChart consumes, so
 * the numbers here and at the top bar chart are guaranteed identical).
 */
import type { CartItemMatch, CartPricing } from '@/lib/snapshot';
import { snapshot } from '@/lib/snapshot';

function fmt(n: number): string {
  return `$${n.toFixed(2)}`;
}

/**
 * Pick the "winning" retailer for the basket-total row.
 *
 * Rule: cheapest total among retailers that priced the MOST items
 * (not simply cheapest total). Retailer-A at $4.50 covering 1 of 2
 * cart items loses to Retailer-B at $12.18 covering 2 of 2 — the
 * lower-total retailer is incomplete and would mislead the user.
 *
 * Tie-breaks:
 *   - Equal coverage + equal total → alphabetical by name (deterministic).
 *   - All retailers priced 0 items → no winner (returns null).
 */
function pickWinnerSlug(
  rows: CartPricing['per_retailer_total'],
): string | null {
  const maxCoverage = Math.max(0, ...rows.map((r) => r.items_found));
  if (maxCoverage === 0) return null;
  const candidates = rows.filter((r) => r.items_found === maxCoverage);
  candidates.sort((a, b) => {
    if (a.total !== b.total) return a.total - b.total;
    return a.name.localeCompare(b.name);
  });
  return candidates[0]?.slug ?? null;
}

export default function PriceComparisonTable({
  matches,
  perRetailerTotal,
}: {
  matches: CartItemMatch[];
  perRetailerTotal: CartPricing['per_retailer_total'];
}) {
  const retailers = snapshot.retailers;

  // Lookup {slug -> {total, items_found}} for O(1) access in render order.
  const totalBySlug = new Map(
    perRetailerTotal.map((r) => [r.slug, r] as const),
  );

  const winnerSlug = pickWinnerSlug(perRetailerTotal);

  // "Basket total" (EN) — site is English-only today. OQLF French
  // equivalent when/if i18n lands: "Total du panier".
  const totalRowLabel = 'Basket total';

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
          <tr className="border-t-2 border-gray-300 font-bold">
            <td className="px-3 py-2 text-gray-900">{totalRowLabel}</td>
            {retailers.map((r) => {
              const row = totalBySlug.get(r.slug);
              const itemsFound = row?.items_found ?? 0;
              const total = row?.total ?? 0;
              const isWinner = winnerSlug === r.slug;
              // Retailers with zero priced items get an em-dash, matching
              // the per-item missing-price convention. 0 as a total here
              // is only meaningful paired with items_found > 0 (which is
              // vanishingly unlikely for real snapshot data but we guard
              // on items_found, not on total, for safety).
              return (
                <td
                  key={r.slug}
                  className={`px-3 py-2 text-right tabular-nums ${
                    itemsFound === 0
                      ? 'text-gray-300'
                      : isWinner
                        ? 'font-bold text-green-700'
                        : 'text-gray-800'
                  }`}
                >
                  {itemsFound === 0 ? '—' : fmt(total)}
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
