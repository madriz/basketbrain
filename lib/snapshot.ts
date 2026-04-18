/**
 * Typed reader + computation helpers for the frozen snapshot.
 *
 * The snapshot is a static JSON asset imported at build time; there is no
 * runtime database call anywhere in this repo.
 */
import raw from '@/data/snapshot.json';
import type {
  Snapshot,
  SnapshotDisplayStore,
  SnapshotPrice,
  SnapshotProduct,
  SnapshotRetailer,
  SnapshotStore,
} from '@/types/snapshot';

export const snapshot = raw as unknown as Snapshot;

// ── Basic selectors ─────────────────────────────────────────────────────────

export function allProducts(): SnapshotProduct[] {
  return snapshot.products;
}

export function productById(id: string): SnapshotProduct | undefined {
  return snapshot.products.find((p) => p.id === id);
}

export function allRetailers(): SnapshotRetailer[] {
  return snapshot.retailers;
}

export function retailerBySlug(slug: string): SnapshotRetailer | undefined {
  return snapshot.retailers.find((r) => r.slug === slug);
}

export function storeById(id: string): SnapshotStore | undefined {
  return snapshot.stores.find((s) => s.id === id);
}

export function displayStoreById(id: string): SnapshotDisplayStore | undefined {
  return snapshot.display_stores.find((s) => s.id === id);
}

export function pricesForItem(itemId: string): SnapshotPrice[] {
  return snapshot.prices
    .filter((p) => p.item_id === itemId)
    .sort((a, b) => a.price_cad - b.price_cad);
}

export function pricesForRetailer(slug: string): SnapshotPrice[] {
  return snapshot.prices.filter((p) => p.retailer_slug === slug);
}

export function retailerCoverage(itemId: string): number {
  return snapshot.disclaimers.retailer_coverage_per_item[itemId] ?? 0;
}

// ── Full-basket comparison ──────────────────────────────────────────────────

export interface RetailerBasketTotal {
  slug: string;
  name: string;
  basket_total: number;
  items_found: number;
  items_total: number;
  savings_vs_most_expensive: number;
  savings_pct: number;
}

export interface MixedBasket {
  basket_total: number;
  items_found: number;
}

export interface BasketComparison {
  retailers: RetailerBasketTotal[]; // sorted cheap → expensive
  mixed_basket: MixedBasket;
  items_total: number;
  core_item_ids: string[]; // items every retailer carries
}

/**
 * Compute the full 30-item basket per retailer.
 * Retailers missing an item contribute 0 for that item — coverage count
 * tells the caller how honest the comparison is.
 */
export function computeBasketComparison(): BasketComparison {
  const items = snapshot.products;
  const retailers = snapshot.retailers;
  const itemsTotal = items.length;

  // Cheapest price per (item, retailer)
  const cheapest: Record<string, Record<string, number>> = {};
  for (const p of snapshot.prices) {
    const row = (cheapest[p.retailer_slug] ??= {});
    const prev = row[p.item_id];
    if (prev === undefined || p.price_cad < prev) row[p.item_id] = p.price_cad;
  }

  // Core items — those every retailer carries
  const coreItemIds = items
    .filter((it) => retailers.every((r) => cheapest[r.slug]?.[it.id] !== undefined))
    .map((it) => it.id);

  const perRetailer = retailers.map((r) => {
    const row = cheapest[r.slug] ?? {};
    const found = items.filter((it) => row[it.id] !== undefined);
    const total = found.reduce((s, it) => s + (row[it.id] ?? 0), 0);
    return {
      slug: r.slug,
      name: r.name,
      basket_total: Math.round(total * 100) / 100,
      items_found: found.length,
      items_total: itemsTotal,
    };
  });

  // Mixed basket: minimum price across all retailers for each item
  let mixedTotal = 0;
  let mixedFound = 0;
  for (const it of items) {
    let best: number | undefined;
    for (const r of retailers) {
      const px = cheapest[r.slug]?.[it.id];
      if (px !== undefined && (best === undefined || px < best)) best = px;
    }
    if (best !== undefined) {
      mixedTotal += best;
      mixedFound++;
    }
  }

  // Rank retailers by basket_total ascending (exclude 0-coverage retailers
  // from "most expensive" comparison to avoid a divide-by-zero story).
  const ranked = [...perRetailer].sort((a, b) => a.basket_total - b.basket_total);
  const mostExpensive = ranked[ranked.length - 1];
  const withSavings: RetailerBasketTotal[] = ranked.map((r) => {
    const delta = Math.max(0, mostExpensive.basket_total - r.basket_total);
    return {
      ...r,
      savings_vs_most_expensive: Math.round(delta * 100) / 100,
      savings_pct:
        mostExpensive.basket_total > 0
          ? Math.round((delta / mostExpensive.basket_total) * 100)
          : 0,
    };
  });

  return {
    retailers: withSavings,
    mixed_basket: {
      basket_total: Math.round(mixedTotal * 100) / 100,
      items_found: mixedFound,
    },
    items_total: itemsTotal,
    core_item_ids: coreItemIds,
  };
}

// ── User-supplied cart pricing ──────────────────────────────────────────────

/** A free-text cart entry that came out of CartBuilder. */
export interface CartEntry {
  name: string;
  unit?: string;
  quantity: number;
}

export interface CartItemMatch {
  cart_entry: CartEntry;
  product: SnapshotProduct | null; // null = no snapshot match
  per_retailer: Record<string, { price_cad: number; store_id: string } | null>;
}

export interface CartPricing {
  matches: CartItemMatch[];
  per_retailer_total: { slug: string; name: string; total: number; items_found: number }[];
  mixed_total: number;
}

/** Case-insensitive substring / spec-aware match from a free-text name →
 *  snapshot product. Returns the product with the most overlap, or null. */
export function resolveCartName(name: string, unit?: string): SnapshotProduct | null {
  const q = name.trim().toLowerCase();
  if (!q) return null;
  const withUnit = unit ? `${q} ${unit.toLowerCase()}` : q;
  let best: { p: SnapshotProduct; score: number } | null = null;
  for (const p of snapshot.products) {
    const needle = p.display_name.toLowerCase();
    const first = needle.split('(')[0].trim();
    let score = 0;
    if (withUnit === needle) score = 100;
    else if (q === first) score = 80;
    else if (needle.includes(q)) score = 50 + q.length;
    else if (first.includes(q)) score = 40 + q.length;
    else if (q.split(' ').every((tok) => needle.includes(tok))) score = 20 + q.length;
    if (score > 0 && (!best || score > best.score)) best = { p, score };
  }
  return best?.p ?? null;
}

export function priceCart(entries: CartEntry[]): CartPricing {
  const matches: CartItemMatch[] = entries.map((entry) => {
    const product = resolveCartName(entry.name, entry.unit);
    const perRetailer: CartItemMatch['per_retailer'] = {};
    if (product) {
      for (const r of snapshot.retailers) {
        const row = snapshot.prices.find(
          (p) => p.item_id === product.id && p.retailer_slug === r.slug,
        );
        perRetailer[r.slug] = row
          ? { price_cad: row.price_cad, store_id: row.store_id }
          : null;
      }
    }
    return { cart_entry: entry, product, per_retailer: perRetailer };
  });

  const perRetailerTotal = snapshot.retailers.map((r) => {
    let total = 0;
    let itemsFound = 0;
    for (const m of matches) {
      const slot = m.per_retailer[r.slug];
      if (slot) {
        total += slot.price_cad * m.cart_entry.quantity;
        itemsFound++;
      }
    }
    return {
      slug: r.slug,
      name: r.name,
      total: Math.round(total * 100) / 100,
      items_found: itemsFound,
    };
  });

  let mixedTotal = 0;
  for (const m of matches) {
    let best: number | undefined;
    for (const slug of Object.keys(m.per_retailer)) {
      const slot = m.per_retailer[slug];
      if (slot && (best === undefined || slot.price_cad < best)) best = slot.price_cad;
    }
    if (best !== undefined) mixedTotal += best * m.cart_entry.quantity;
  }

  return {
    matches,
    per_retailer_total: perRetailerTotal.sort((a, b) => a.total - b.total),
    mixed_total: Math.round(mixedTotal * 100) / 100,
  };
}

// ── Best/worst widget helpers ──────────────────────────────────────────────

export interface BestWorst {
  item: SnapshotProduct;
  cheapest: { retailer: string; price_cad: number } | null;
  priciest: { retailer: string; price_cad: number } | null;
  gap_cad: number;
}

export function computeBestWorst(itemId: string): BestWorst | null {
  const item = productById(itemId);
  if (!item) return null;
  const prices = pricesForItem(itemId);
  if (prices.length === 0) {
    return { item, cheapest: null, priciest: null, gap_cad: 0 };
  }
  // pricesForItem sorts asc by price
  const first = prices[0];
  const last = prices[prices.length - 1];
  const slugName = (slug: string) => retailerBySlug(slug)?.name ?? slug;
  return {
    item,
    cheapest: { retailer: slugName(first.retailer_slug), price_cad: first.price_cad },
    priciest: { retailer: slugName(last.retailer_slug), price_cad: last.price_cad },
    gap_cad: Math.round((last.price_cad - first.price_cad) * 100) / 100,
  };
}
