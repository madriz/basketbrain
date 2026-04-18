# Data extraction

How `data/snapshot.json` was produced, what it contains, and the honest
set of caveats that come with the numbers.

This document does not include the extraction script itself — that
lives in a separate private repo alongside the retailer-scraping code
and Supabase credentials. What follows is sufficient to understand
how the numbers were derived and to evaluate whether they fit your
use case.

## Snapshot schema

`schema_version: 2`. The full top-level shape:

```jsonc
{
  "schema_version": 2,
  "generated_at": "2026-04-18T14:08:...Z",   // when the script ran
  "snapshot_date": "2026-04-01",             // cutoff used for observed_at
  "region": { "label": "...", "postal": "M5V 2T6",
              "city": "Toronto", "province": "ON",
              "lat": 43.645, "lng": -79.394, "radius_km": 10 },

  "retailers":       [...],  //  7 rows
  "stores":          [...],  //  9 rows — price-attached physical stores
  "display_stores":  [...],  // 76 rows — every geocoded storefront in radius
  "products":        [...],  // 30 rows — the Essential 30 basket
  "prices":          [...],  // 165 rows — one per (item, retailer)

  "disclaimers": {
    "data_caveats": "...",                    // narrative explanation
    "retailer_coverage_per_item": {...},      // 30 entries
    "total_retailers_in_scope": 7,
    "total_stores_in_scope": 9,
    "total_display_stores": 76,
    "total_price_rows": 165,
    "items_with_zero_coverage": [],           // empty — every item is priced
    "items_hitting_price_bounds": [...]       // 30 rows with clamp counts
  }
}
```

Full TypeScript types live in [`types/snapshot.d.ts`](../types/snapshot.d.ts).
Keep those in sync if the Python schema version bumps.

### Retailers (7 rows)

```jsonc
{ "slug": "foodbasics",             "name": "Food Basics" }
{ "slug": "loblaws",                "name": "Loblaws" }
{ "slug": "longos",                 "name": "Longo's" }
{ "slug": "metro",                  "name": "Metro" }
{ "slug": "nofrills",               "name": "No Frills" }
{ "slug": "realcanadiansuperstore", "name": "Real Canadian Superstore" }
{ "slug": "yourindependentgrocer",  "name": "Your Independent Grocer" }
```

These are the 7 Canadian banners with both a geocoded physical store
within 10 km of M5V 2T6 **and** at least one price observation
attributable to Toronto/Ontario. Walmart, Giant Tiger, and Voilà were
dropped — their only data source in our Supabase was a Flipp virtual
row for cities outside the radius.

### Stores (9 rows — price-attached)

Every row here is a real geocoded storefront. Each is the canonical
price anchor for its retailer — `nofrills` and `foodbasics` happen to
have two (a real store-locator row plus a Flipp-geocoded row with
distinct observations), the other five retailers have one each.

| slug | distance | name |
|---|---:|---|
| nofrills | 0.5 km | Bo's NOFRILLS Toronto Richmond |
| loblaws | 1.0 km | Loblaws Toronto Lakeshore |
| metro | 1.8 km | Metro Front Street Market |
| nofrills | 3.0 km | No Frills — Toronto (Flipp) |
| longos | 3.0 km | Longo's Hudson's Bay Centre |
| foodbasics | 3.1 km | Food Basics Toronto |
| foodbasics | 6.2 km | Food Basics — Toronto (Flipp) |
| yourindependentgrocer | 8.3 km | Rob & Darlene's YIG Etobicoke |
| realcanadiansuperstore | 9.8 km | RCSS Don Mills Road |

### Display stores (76 rows — map layer)

Every geocoded storefront for any of the 15 Canadian banners whose
lat/lng places it inside the 10 km M5V radius. Drives the Leaflet
map. `has_prices: boolean` flags the 9 above.

Breakdown by banner:

| banner | count |
|---|---:|
| No Frills | 26 |
| Loblaws | 15 |
| Metro | 14 |
| Longo's | 8 |
| Food Basics | 7 |
| Your Independent Grocer | 2 |
| Valu-mart | 2 |
| Real Canadian Superstore | 1 |
| Fortinos | 1 |

Valu-mart and Fortinos are on the map but carry zero priced rows in
this snapshot — the Loblaws Group scrapers attribute their prices to
Loblaws / No Frills canonical rows, so individual Valu-mart /
Fortinos storefronts never receive attached observations. The
gray-pinned Fortinos at First Canadian Place is therefore an honest
map pin, not a priced store — the UI labels them accordingly.

### Products (30 rows — Essential 30)

The 30 items selected from `pipeline/essential_50_curated.json`
(upstream), filtered to those with `db_coverage: "STRONG"` and ranked
by a tuple of (coverage tier, StatsCan-aligned, core-basket flag,
source count, alphabetical). The full list by category:

**Meat (3)**
- `bacon` — Bacon (375g) — 6/7 retailers
- `chicken-breast` — Chicken Breast (per kg) — 6/7
- `ground-beef` — Ground Beef (per kg) — 7/7

**Dairy & Eggs (5)**
- `butter-454g` — Butter (454g) — 4/7
- `cheddar-cheese-400g` — Cheddar Cheese (400g) — 6/7
- `large-eggs-dozen` — Large Eggs (1 dozen) — 4/7
- `milk-2-percent-4l` — Milk 2% (4L) — 3/7
- `yogurt` — Yogurt (650–750g) — 7/7

**Bakery (2)**
- `white-bread` — White Bread (675g loaf) — 4/7
- `whole-wheat-bread` — Whole Wheat Bread (675g loaf) — 5/7

**Pantry (11)**
- `all-purpose-flour` — All Purpose Flour (2.5kg) — 4/7
- `canned-tomatoes` — Canned Tomatoes (796mL) — 4/7
- `canned-tuna` — Canned Tuna (170g) — 7/7
- `cereal` — Cereal (400–500g box) — 7/7
- `coffee` — Coffee (300g ground) — 6/7
- `jam` — Jam (500mL) — 3/7
- `oats` — Oats (1kg) — 4/7
- `pasta` — Pasta (375–500g box) — 7/7
- `peanut-butter` — Peanut Butter (750g–1kg) — 5/7
- `rice` — Rice (900g–2kg bag) — 7/7
- `sugar` — White Sugar (2kg) — 4/7

**Produce (7)**
- `apples` — Apples (per kg) — 6/7
- `carrots` — Carrots (2 lb bag) — 7/7
- `lettuce` — Lettuce (1 head) — 6/7
- `onions` — Onions (3 lb bag) — 7/7
- `oranges` — Oranges (per kg) — 4/7
- `potatoes` — Potatoes (5 lb bag) — 7/7
- `tomatoes` — Tomatoes (per kg) — 7/7

**Beverages (1)**
- `orange-juice` — Orange Juice (1.75L) — 6/7

**Frozen (1)**
- `ice-cream` — Ice Cream (1.5L) — 5/7

Coverage min = 3, max = 7, mean = 5.5. Every item is priced at ≥3
retailers (no "1-retailer items" that would defeat a comparison).

### Prices (165 rows)

```jsonc
{
  "item_id":       "bacon",            // key into products[]
  "retailer_slug": "loblaws",          // key into retailers[]
  "store_id":      "0559ac72",         // 8-char UUID prefix → stores[]
  "price_cad":     7.99,
  "unit_price_cad": 21.31,             // per kg / per L, nullable
  "in_flyer":      false,              // true when flyer-sourced
  "source":        "pcexpress",        // provenance (see below)
  "observed_at":   "2026-03-12"        // yyyy-mm-dd
}
```

Exactly one row per (`item_id`, `retailer_slug`) pair. Observations
range from **Feb 26 to Mar 28 2026** (15 unique dates), so the
snapshot is a 4-week composite rather than a single-day cross-section.

## Source retailers and how their prices arrive

| source value | Where it comes from | Freshness shape |
|---|---|---|
| `flipp` | [Flipp](https://flipp.com) flyer aggregator (public API) — covers participating Canadian banners' weekly flyers | One flyer per banner per week; `observed_at` is the flyer's start-of-week date |
| `pcexpress` | Loblaws Group online catalogs (loblaws.ca / nofrills.ca / realcanadiansuperstore.ca) parsed via `__NEXT_DATA__` SSR blobs | Catalog-refreshed, usually daily; `observed_at` is the ingest date |
| `metro_online` | metro.ca HTML aisle parser (`data-product-*` attributes on product tiles) | Refreshed less frequently than flyer-based sources; observations in this snapshot may be a few weeks older than the Flipp-sourced retailers |
| `foodbasics_online` | foodbasics.ca HTML aisle parser (Metro Inc.'s discount banner) | Refreshed less frequently than flyer-based sources; attributes to `foodbasics` in the comparison |
| `voila_longos` | Voilà online catalog (Empire / Sobeys stack), Longo's variant | Weekly online-catalog snapshot |

Every `source` corresponds to one upstream scraper. The scrapers live
in the private upstream repo and are not part of this public release.

## Essential 30 methodology

### Why 30 items, not 50 or 60

The upstream curated catalog (`essential_50_curated.json`) has 50
items. For this demo we chose the 30 with highest coverage
(`db_coverage: "STRONG"` plus the ranking tuple described above)
because:

1. A 30-item basket renders cleanly as a single comparison table
   without scrolling fatigue.
2. At 30 items we maintain a minimum of 3-retailer coverage per item
   — the UI can always show a meaningful "cheapest vs. priciest"
   comparison without showing a row with a single price.
3. 30 aligns roughly with the StatsCan CPI food basket subset that
   gets reported at the provincial monthly level, making
   future comparisons to official price indices practical.

### Why Tofu Firm is missing

Upstream's curated catalog carries `tofu-firm`, but a pre-extraction
probe found zero matching products in our Supabase that resolved
cleanly to a tofu item at in-radius stores. Tofu was dropped in
favour of the next-highest-coverage item, rather than ship a
zero-coverage row. In a future refresh, broadening the tofu
`search_terms` list in the upstream curated catalog would likely fix
this.

### StatsCan alignment

Every item in the final 30 has `statcan_aligned: true` in the
upstream curated catalog — meaning its size specification and product
category match Statistics Canada's CPI basket definition, so
longitudinal comparison to official StatCan data is at least
theoretically possible for these items.

## Price extraction logic

The upstream `pipeline/build_demo_snapshot.py` script performs the
following, in order:

### 1. Load stores in radius

```
SELECT id, name, postal_code, city, latitude, longitude, retailer_id, retailers(slug)
FROM   stores
WHERE  latitude IS NOT NULL AND longitude IS NOT NULL
```

Then filter in Python using the haversine formula: keep rows where
the great-circle distance to (43.645, -79.394) is ≤ 10 km. At the
April 2026 snapshot, this yields **76 stores across 9 banners**.

### 2. Load virtual / aggregator price sources

For each retailer that has ≥1 geocoded physical store in radius, also
pull stores with `latitude IS NULL` OR with `"(Flipp)"` / `"(Online)"`
in their name, restricted to names or postal codes indicating
Ontario. This admits sources like "Metro — Toronto (Online)" and
"No Frills — Brampton (Flipp)" but rejects "Metro — Quebec City
(Flipp)". At April 2026 this adds **35 virtual rows**, bringing the
total price-source candidate pool to **111 rows** across all items.

### 3. For each of the 30 Essential items

1. **Resolve candidate products.** Hit Supabase with
   `products.name ILIKE '%<term>%'` for each term in the curated
   item's `search_terms[]`, then filter out rows matching any phrase
   in `exclude_if_contains[]` (e.g. `"almond"`, `"coconut"` for
   milk), and finally require the product name to match the
   item's `match_pattern` regex (e.g. `"egg.*(large|12|dozen)"`).

2. **Query prices.** For those product IDs × the 111 candidate store
   IDs, pull all `prices.*` rows where `observed_at <= 2026-04-01`.
   Raw row counts per item in the April 2026 snapshot range from
   **~20 to ~700**.

3. **Clamp to `price_bounds`.** The curated catalog carries
   (min, max) bounds per item (e.g. eggs `(3.0, 9.0)`, chicken breast
   `(8.0, 25.0)`). Rows outside the bounds are dropped. This is the
   primary defence against cross-pack-size contamination — e.g. the
   chicken breast pool initially includes 600g / 1kg / 1.5kg packages
   plus per-kg prices; clamping to the per-kg bound excludes the
   packaged variants. The total rows dropped in the April snapshot
   is **1,697**, concentrated in the items with broad ILIKE matches
   (`chicken-breast`: 212 clamped, `yogurt`: 171, `cheddar-cheese-400g`:
   152, `rice`: 141, `coffee`: 131).

4. **Reduce to one observation per (product_id, store_id).** Where
   multiple observations exist for the same product at the same
   store within the cutoff window, keep the most recent.

5. **Group by retailer slug.** All of `metro`'s surviving
   (product, store) observations go in one bucket, regardless of
   which specific store they came from.

6. **Pick the median-adjacent row** per retailer bucket. Synthesise
   the median price of the bucket, then choose the real observation
   whose `price_cad` is closest to that synthetic median. Ties break
   by store priority (physical > Toronto-named > Ontario) and then
   by `observed_at DESC`. This is the load-leader defence: a single
   flyer at $2.99 for Item X at Retailer Y does not become the
   comparison number if 4 other real observations cluster around
   $5.49.

7. **Remap virtual sources onto the nearest physical anchor.** For
   each retailer, pre-compute the nearest geocoded storefront to
   M5V 2T6 (preferring store-locator-sourced rows over Flipp-geocoded
   ones). If the picked row came from a virtual/aggregator store,
   rewrite its `store_id` to that physical anchor. This is why every
   row in `stores[]` resolves to a real storefront with real
   coordinates — the Flipp and Metro-Online provenance is preserved
   in the row's `source` field, not in a misleading map pin.

The output is exactly one row per (item, retailer) pair — at most
30 items × 7 retailers = 210 rows possible. The April snapshot
contains **165 rows** (the balance is items where a given retailer
had zero valid observations, which are flagged in
`disclaimers.retailer_coverage_per_item`).

## Representative, not minima

The reduction in step 6 deliberately surfaces **representative** prices,
not minima. A shopper browsing a flyer can find a $0.99 lettuce
loss-leader at No Frills this week; the median-adjacent choice will
more accurately reflect what a lettuce costs at No Frills across the
month. Loss-leader prices still appear in the raw data upstream — they
just don't win the reduction to one-row-per-retailer.

This choice matters for the "cheapest basket" story. A minima-based
comparison would overstate achievable savings because a cart that
cherry-picks each retailer's weekly loss-leader is not a cart any
single shopper can actually execute. The median-adjacent approach
gives a comparison that's robust to loss-leader rotation.

## Known data caveats

### Flipp virtual stores represent banner-wide flyer prices

Flipp publishes one flyer per banner per city. Our Supabase `stores`
table carries one virtual row per (banner, city) combination for
Flipp-sourced banners. These rows have canonical postal codes like
M5V 2T6 but they are not specific storefronts — they're Flipp's
aggregate view of the banner's flyer coverage in that city.

For this snapshot, we've attached each Flipp-sourced price to the
nearest real physical storefront of that banner (see
[price extraction step 7](#7-remap-virtual-sources-onto-the-nearest-physical-anchor)).
This is the honest compromise: the map pin is a real place, and the
row's `source: "flipp"` tells a technically curious reader that the
price is flyer-derived rather than in-store-scanned.

Caveat: if you change No Frills stores across the city, you should
see the same Flipp-derived price in our snapshot regardless of the
specific No Frills you chose. That's not a data bug — that's how
Flipp flyer pricing actually works in the real world.

### Metro and Food Basics refresh cadence

Metro Online prices are refreshed less frequently than flyer-based
sources. The snapshot may carry slightly older Metro observations
compared to Flipp-sourced retailers. Food Basics (Metro Inc.'s
discount banner) follows the same refresh cadence.

Super C (Metro's Quebec discount banner) is intentionally out of
scope for an Ontario snapshot.

### Some PC Express stores have wrong geocodes

Raw Supabase `stores.latitude/longitude` for a few PC Express catalog
rows point at the wrong location (Maple, Guelph) due to upstream
geocoder noise. The 10 km haversine filter correctly excludes these
rows. The nearest-physical-anchor remap in step 7 prefers store-locator-
sourced stores over PC Express catalog rows exactly to avoid
inheriting bad geocodes.

### Observation window is 4 weeks wide

Observations in the snapshot span Feb 26 – Mar 28 2026 (15 unique
dates), not a single-day slice. That's because different retailers'
pipelines run on different cadences — Flipp fires twice weekly, PC
Express weekly, Metro/Food Basics on a slower cadence. The
narrative date `snapshot_date: 2026-04-01` is the cutoff, not the
peak observation day.

For month-over-month comparisons this doesn't matter; for
week-over-week reasoning, remember that two adjacent data points for
different retailers may be separated by up to four weeks.

### Coverage per item is uneven

`retailer_coverage_per_item` ranges from 3 to 7. When you compare
basket totals across retailers, the retailer with coverage 3/30 is
not competing on an equal footing with the retailer at 7/30.

The UI surfaces this with a coverage progress bar on every retailer
row. The mixed-basket theoretical-minimum row always ships, which at
least pins the "cheapest achievable across all retailers" number.

### Not every Canadian retailer is in scope

Walmart, Giant Tiger, Costco, Sobeys, FreshCo, No Frills' parent
Loblaws' Provigo / Maxi banners, T&T, and Asian / Caribbean grocery
chains are not in this snapshot. In some cases (Walmart, Giant
Tiger) it's because the only data we had was a Flipp virtual for a
city outside the 10 km radius. In others (Costco, T&T) it's because
our upstream pipeline never covered them.

Treat this snapshot as "a Toronto-area sampling" rather than "a
comprehensive Canadian grocery index".

## Reproducibility

The extraction is deterministic given the same Supabase state and
the same `snapshot_date` cutoff. The script is idempotent — running
it multiple times against the same inputs produces byte-identical
output modulo the `generated_at` timestamp.

With access to the upstream private repo plus its `.env` file (which
contains `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`):

```bash
cd <upstream-pipeline-repo>  # the private upstream
python pipeline/build_demo_snapshot.py
# → writes /tmp/snapshot.json
```

The script runs in ~12 seconds against the April 2026 database
state. If the database has changed materially — more retailers, new
Essential items, broader geographic coverage — the output will
reflect those changes.

Without access to that private repo, the pipeline cannot be re-run.
What you can do as a public-repo visitor is:

- Audit `data/snapshot.json` directly against the schema in
  [`types/snapshot.d.ts`](../types/snapshot.d.ts) and the shape
  described above.
- Compare specific item prices against public sources (current
  Flipp flyers, retailer online catalogs) for plausibility.
- Use the median-adjacent / representative methodology described
  here as a reference implementation if you're building a similar
  comparison.

## Further reading

- [README.md](../README.md) — project overview
- [ARCHITECTURE.md](./ARCHITECTURE.md) — how the static site pipeline works
