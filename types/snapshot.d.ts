/**
 * TypeScript types for the frozen BasketBrain snapshot (schema v2).
 *
 * Source of truth: pipeline/build_demo_snapshot.py in the private upstream
 * repo. Keep this file in sync if the Python schema version bumps.
 */

export interface SnapshotRegion {
  label: string;
  postal: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
  radius_km: number;
}

export interface SnapshotRetailer {
  slug: string;
  name: string;
}

/**
 * `stores[]` — price-attached source stores. Mix of real geocoded storefronts
 * (is_virtual=false) and Ontario-area aggregators (is_virtual=true, lat/lng
 * null, carries a display_note).
 */
export interface SnapshotStore {
  id: string;              // 8-char UUID prefix
  slug: string | null;     // retailer slug
  name: string | null;
  postal: string | null;
  city: string | null;
  province: string | null;
  lat: number | null;      // null when is_virtual = true
  lng: number | null;
  distance_km: number | null;
  is_virtual: boolean;
  display_note?: string;   // present only when is_virtual
}

/** `display_stores[]` — every geocoded physical storefront within 10 km. */
export interface SnapshotDisplayStore {
  id: string;
  retailer_slug: string | null;
  retailer_name: string | null;
  store_name: string | null;
  address: string | null;
  postal: string | null;
  lat: number;
  lng: number;
  distance_km: number | null;
  has_prices: boolean;     // true when this store_id also appears in prices[]
}

export interface SnapshotProduct {
  id: string;
  display_name: string;
  category: string;
  spec: string | null;
  emoji: string;
  unit_for_comparison: string | null;
  statcan_aligned: boolean;
  statcan_note: string | null;
  price_bounds: [number | null, number | null];
}

export interface SnapshotPrice {
  item_id: string;
  retailer_slug: string;
  store_id: string;
  price_cad: number;
  unit_price_cad: number | null;
  in_flyer: boolean;
  source: string | null;
  observed_at: string; // ISO date (yyyy-mm-dd)
}

export interface SnapshotDisclaimers {
  data_caveats: string;
  retailer_coverage_per_item: Record<string, number>;
  total_retailers_in_scope: number;
  total_stores_in_scope: number;
  total_display_stores: number;
  total_price_rows: number;
  items_with_zero_coverage: string[];
  items_hitting_price_bounds: { id: string; clamped: number }[];
}

export interface Snapshot {
  schema_version: 2;
  generated_at: string;
  snapshot_date: string;   // "2026-04-01"
  region: SnapshotRegion;
  retailers: SnapshotRetailer[];
  stores: SnapshotStore[];
  display_stores: SnapshotDisplayStore[];
  products: SnapshotProduct[];
  prices: SnapshotPrice[];
  disclaimers: SnapshotDisclaimers;
}
