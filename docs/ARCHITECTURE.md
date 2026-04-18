# Architecture

How BasketBrain serves a Canadian grocery price comparison without a
runtime database, a serverless function, or a single byte of live API
traffic per visitor — and why that was the right call for this project.

## Overview

```
┌──────────────────────────────────────────────────────────────────┐
│  Upstream pipeline repo (private)                                │
│                                                                  │
│   Supabase (Postgres)                                            │
│         │                                                        │
│         │  pipeline/build_demo_snapshot.py                       │
│         │    • reads curated Essential 30 list                   │
│         │    • queries stores within 10 km of M5V 2T6            │
│         │    • queries prices <= 2026-04-01                      │
│         │    • applies price_bounds + match_pattern filters      │
│         │    • picks median-adjacent row per (item, retailer)    │
│         │    • remaps virtuals onto nearest physical storefront  │
│         ▼                                                        │
│   snapshot.json (89 KB pretty / 8.1 KB gzipped)                  │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │  committed to this public repo as
                             │  data/snapshot.json
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│  This repo (madriz/basketbrain, MIT, public)                     │
│                                                                  │
│    Next.js 15 App Router                                         │
│          │                                                       │
│          │  npm run build  →  output: 'export'                   │
│          │    • imports data/snapshot.json at build time         │
│          │    • prerenders every route as plain HTML             │
│          │    • emits ./out with HTML + CSS + JS chunks          │
│          ▼                                                       │
│    ./out/                                                        │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │  actions/deploy-pages on push to main
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│  GitHub Pages CDN                                                │
│    basketbrain.ca  (CNAME → <user>.github.io)                    │
│                                                                  │
│    Serves ./out/ as-is. No origin server. No serverless.         │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             │  HTTPS pre-rendered HTML + JS chunks
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│  User browser                                                    │
│    • receives static HTML, hydrates with React                   │
│    • snapshot data is already inlined in the page JS bundle      │
│    • Leaflet + Recharts compute visualisations locally           │
│    • GA4 loads only after explicit cookie-banner consent         │
│    • zero outbound network calls to our infrastructure           │
└──────────────────────────────────────────────────────────────────┘
```

The boundary between the two repos is a deliberate security and
privacy gate. The private upstream repo holds Supabase service-role
credentials, retailer-scraping code, and raw observation history.
Nothing from that side is visible in this public repo except the
deterministic `snapshot.json` artefact.

## Why static?

### Cost

A static GitHub Pages deploy costs **$0/month** and scales
horizontally for free, because GitHub absorbs the bandwidth. The
earlier stack carried a recurring monthly infrastructure cost for
an inactive site. The static version eliminates that ongoing spend
entirely and would also be materially cheaper than a proper
always-on deployment of the old architecture.

For a research archive that will not receive new traffic-driving
features, this is the right trade. Paying for runtime compute so
crawlers can hit 410 Gone is negative-value work.

### Honesty

A live site with stale data is worse than a static site with a visible
observation date. When prices are frozen and the UI says so clearly
(`Data as of 2026-04-01`), a visitor forms an accurate mental model.
When prices are "live" but quietly 3 months old because the pipeline
failed last week, the visitor is getting misleading information and
doesn't know it.

BasketBrain is explicitly a research archive now. The static form
makes that hard to forget — there is literally no code path that could
surface fresher data to the UI without a developer editing
`data/snapshot.json` and pushing a commit.

### Portability

Anyone can `git clone` this repo, run `npm install && npm run build`,
and produce an exact byte-for-byte replica of the site with no
credentials and no database access. The "deployment" is just
`actions/deploy-pages` → GitHub Pages; the same `out/` directory would
work on Cloudflare Pages, Netlify, S3 + CloudFront, or any plain HTTP
server with negligible config change.

That portability matters for a demo that's meant to be instructive.
The build succeeds with zero external dependencies beyond what `npm
install` downloads.

### Showcases the engineering

The data-extraction pipeline is where the actual intellectual work
went. The UI components are, by design, straightforward — the hard
part was accumulating reliable retailer observations over time and
reducing them honestly. Keeping the UI thin and putting the real
methodology in `docs/DATA_EXTRACTION.md` matches how this project
should be read.

## Component map

All paths relative to the repo root.

| Path | Purpose |
|---|---|
| `app/layout.tsx` | Shared HTML shell: header, footer, CookieBanner mount, global Tailwind CSS. |
| `app/page.tsx` | Homepage — three CTAs and honest origin framing. Static. |
| `app/about/page.tsx` | Long-form origin story + methodology pointer. Static. |
| `app/demo/page.tsx` | Main comparison view: best/worst cards → basket table → optimal-strategy card → Leaflet map. |
| `app/demo/build/page.tsx` | Cart builder form (client-side state only). |
| `app/demo/results/page.tsx` | Wraps the client `ResultsView` in a `<Suspense>` so URL search params work under static export. |
| `app/demo/results/ResultsView.tsx` | Client component: parses `?cart=<json>` from the URL, prices the cart, renders charts + comparison table. |
| `components/BasketComparison.tsx` | Computes per-retailer 30-item basket totals from the snapshot. Ranks retailers, shows "save vs. most expensive" badges. |
| `components/BasketRadar.tsx` | Recharts radar chart: coverage of the user's cart per retailer. |
| `components/CartBuilder.tsx` | Client-side cart state, `ItemAutocomplete` per line, postal hardcoded. Submits via `window.location.assign('/demo/results/?cart=…')`. |
| `components/CookieBanner.tsx` | Opt-in GA4 loader. Reads/writes the `ga_consent` cookie (1-year TTL). GA4 script only injected after Accept. |
| `components/ItemAutocomplete.tsx` | Typeahead over the Essential 60 catalog. Keyboard-navigable. |
| `components/OptimalStrategy.tsx` | "Cheapest single-store basket" card with the mixed-basket theoretical minimum for comparison. |
| `components/PriceComparisonTable.tsx` | Cart-view per-item × per-retailer table with min-price highlighting. |
| `components/PriceTrendsSection.tsx` | 5 headline cards showing cheapest + priciest retailer for hero items (milk, eggs, bread, chicken, cheese). |
| `components/ResultsMap.tsx` | Leaflet map with 76 display pins; green = priced, gray = map-only. M5V centroid + 10 km radius circle. |
| `components/SavingsBarChart.tsx` | Recharts horizontal bar of per-retailer cart total; cheapest green, priciest red. |
| `lib/essential-catalog.ts` | The Essential 60 autocomplete catalog (names, emojis, specs, categories) plus fuzzy search helpers. |
| `lib/fsa-lookup.ts` | Canadian FSA → `{city, province, lat, lng}` table. Unused at runtime for the demo (postal is hardcoded) but kept for transparency. |
| `lib/snapshot.ts` | The **typed reader** — exports `snapshot`, selectors (`productById`, `pricesForItem`, …), and the compute helpers (`computeBasketComparison`, `computeBestWorst`, `priceCart`, `resolveCartName`). |
| `types/snapshot.d.ts` | TypeScript types for schema v2. Source of truth for any downstream consumer. |
| `data/snapshot.json` | The frozen snapshot (see [DATA_EXTRACTION.md](./DATA_EXTRACTION.md)). |
| `next.config.js` | `output: 'export'`, `images: { unoptimized: true }`, `trailingSlash: true`, Leaflet in `transpilePackages`. |
| `.github/workflows/deploy.yml` | `actions/checkout` → `setup-node@24` → `npm ci` → `npm run build` → `actions/upload-pages-artifact` → `actions/deploy-pages`. |

## Data flow for a typical visitor

1. Browser requests `https://basketbrain.ca/demo/`.
2. GitHub Pages' CDN serves `out/demo/index.html` from its edge cache
   in whichever region is closest to the visitor. This response
   contains the fully prerendered page markup: header, 5 best/worst
   cards with real prices, ranked-retailer basket table with real
   totals, optimal-strategy card, and a placeholder div for the map.
3. The browser parses the HTML, requests the shared JS chunks (~102 kB
   first load). These chunks include:
   - The snapshot data inlined as a JS object (no separate fetch).
   - `lib/snapshot.ts` computation helpers.
   - React runtime + component code.
4. React hydrates. The placeholder div becomes a Leaflet map that
   mounts 76 pins (4 green priced stores whose rows feed the basket
   comparison, 72 gray map-only stores from the store locator). The
   map tiles come from the public OpenStreetMap servers — our repo
   ships no tile images.
5. The cookie banner is injected by `CookieBanner.tsx`. If the
   visitor has no `ga_consent` cookie, the banner renders and blocks
   nothing else. GA4 is not loaded until the visitor clicks Accept.
6. All subsequent interactivity — sorting, hovering, toggling, cart
   building — runs entirely in the browser against data already in
   memory. No network calls to our infrastructure happen for the rest
   of the session.

The `/demo/results/` page is a small exception: it reads `?cart=<json>`
from the URL, deserialises it client-side, runs `priceCart()` against
the already-loaded snapshot, and renders. Still zero network calls to
our side.

## Snapshot refresh policy

`data/snapshot.json` is frozen at `snapshot_date = 2026-04-01`. There
is no automated refresh job. The extraction script lives in the
upstream private repo and is invoked manually when a refresh is
intentional.

If a future refresh is produced:

1. The private pipeline regenerates `snapshot.json` against the
   then-current Supabase state, applying the same methodology.
2. A PR is opened against this public repo with the updated JSON.
3. On merge, `actions/deploy-pages` rebuilds and redeploys. No other
   repo edits are typically needed unless the schema version has
   changed (at which point `types/snapshot.d.ts` and
   `lib/snapshot.ts` would need matching updates).
4. The observation date visible throughout the UI updates
   automatically from `snapshot.snapshot_date`.

## What's NOT in this repo

- **Supabase URL or service-role credentials.** These live in the
  private upstream repo's `.env` and in GitHub Actions secrets on the
  private side. No secret of any kind is referenced from code in this
  public repo.
- **Retailer scraping code.** `ingest_flipp.py`,
  `ingest_pcexpress_catalog.py`, `ingest_metro_prices.py`,
  `ingest_loblaws_stores.py`, and siblings all stay upstream. A fork
  of this public repo has no ability to scrape retailers.
- **Raw price observations.** Only the 165 reduced, representative,
  bounded, median-adjacent rows in `snapshot.json` are published.
  Historical `price_history` rows (hundreds of thousands of
  observations accumulated since February 2026) are not included.
- **Any user data.** No analytics logs, session identifiers, or
  visitor IP addresses ship with the repo or the built site.
- **Retailer logos, product photography, or branded imagery.** The UI
  uses emoji identifiers for products. No copyrighted retailer assets
  are bundled.

## Privacy and consent

Google Analytics 4 (measurement ID `G-PRR16YTLRX`) is the only
third-party tracker. It is gated by the `CookieBanner` component and
never loads before the visitor explicitly clicks Accept. Decline
writes `ga_consent=denied` for one year; the banner does not reappear
for either outcome.

No server-side logs are retained beyond what GitHub Pages collects by
default (which is outside our control). The repo contributes no
fingerprinting, no session cookies, no localStorage tracking, and no
third-party embeds beyond GA4 (opt-in) and OpenStreetMap tiles (which
serve the map but receive only tile coordinate requests).

Compliance-relevant notes:

- **PIPEDA / Canadian privacy law:** this site collects no personal
  information from visitors. No identifiers are written without
  consent.
- **CASL / anti-spam:** no email collection, no subscription, no
  contact forms.
- **Quebec Law 25:** GA4 consent is truly opt-in with a clear
  rejection path.

## Sister project

The data-extraction patterns built for BasketBrain — especially the
session handling and retailer-specific refresh scheduling, the
`price_bounds` / `match_pattern` product disambiguation, the
median-adjacent representative selection, and the idempotent pipeline
design that survives partial failures — all evolved into a live
Canadian consumer-electronics price comparison site,
**[HomeGadgets.ca](https://homegadgets.ca)**.

HomeGadgets is the productised continuation; BasketBrain is the
earlier research phase. Neither project exposes the other — they
share neither credentials nor data at runtime. The only thing they
share is the engineering lineage, which is why BasketBrain is worth
preserving as a public artefact.

## Further reading

- [README.md](../README.md) — project overview, running locally
- [DATA_EXTRACTION.md](./DATA_EXTRACTION.md) — snapshot methodology
  and schema walkthrough
- [LICENSE](../LICENSE) — MIT licence terms
