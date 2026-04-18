# BasketBrain

**A frozen snapshot of Canadian grocery prices — built as a research
project, preserved here as a static, open-source demo.**

[![MIT licensed](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
![Static site](https://img.shields.io/badge/build-static%20export-blue.svg)
![No backend](https://img.shields.io/badge/runtime-no%20backend-lightgrey.svg)

---

BasketBrain compares 30 Essential grocery staples across 7 Canadian
retailers within 10 km of downtown Toronto (postal code M5V 2T6). Every
price in this demo was observed on or before **April 1, 2026** and has
been frozen into an 89 KB `snapshot.json` committed alongside the
source. There is no database, no serverless function, no live API at
runtime — the whole site is static HTML served from GitHub Pages.

<!-- TODO(phase-5): replace with real screenshot of /demo after DNS cutover. -->
> _Screenshot placeholder — will be added in Phase 5 once the site is
> live at [basketbrain.ca](https://basketbrain.ca)._

## Try it live

🔗 **[basketbrain.ca](https://basketbrain.ca)** _(goes live after DNS
cutover)_

## What's in the snapshot

| What | Count |
|---|---:|
| Essential grocery products | 30 |
| Canadian retailers | 7 |
| Priced physical storefronts | 9 |
| Geocoded storefronts on map | 76 |
| Price observations | 165 |
| Observation window | Feb 26 – Mar 28, 2026 |
| Geographic scope | 10 km radius around Toronto M5V 2T6 |
| `snapshot.json` size | 89 KB pretty / 8.1 KB gzipped |

Products cover dairy, eggs, meat, produce, bakery, pantry, beverages,
and frozen categories. The Essential 30 list is aligned with Statistics
Canada's basket methodology where possible, so year-over-year drift of
these items is meaningful.

Retailers in scope: Loblaws, No Frills, Real Canadian Superstore, Your
Independent Grocer (Loblaws Group), Metro, Food Basics (Metro Group),
and Longo's (Empire / Sobeys Group).

## Why this exists

BasketBrain started in February 2026 as a proof-of-concept Canadian
grocery price comparison platform. The initial idea was straightforward
— build a cart, find the cheapest store combination to fulfil it — but
the most interesting engineering turned out to be upstream of the UI.

Reliably pulling Canadian retailer pricing at scale means reconciling
multiple retailer APIs with inconsistent rate limits and refresh
cadences, the Flipp flyer aggregator's publishing rules, fuzzy
product normalization across 20+ banners, and deterministic
historical retention for longitudinal analysis. The techniques developed here became the foundation of a
sister project, **HomeGadgets.ca**, a live Canadian consumer-electronics
price comparison site that is now the active development focus.

This repo is the frozen archive of the BasketBrain research phase. The
pipeline still exists upstream and could be re-run, but the intent is
to preserve this specific snapshot as a point-in-time reference and as
a portfolio artefact demonstrating the full static-site pattern: data
extracted once, baked into the build, served from a CDN for $0/month.

## Architecture in one sentence

A Python extraction script runs once against the upstream database,
writes a typed JSON snapshot committed to this repo, and Next.js
static export turns everything into plain HTML + small chunks that
GitHub Pages serves from its CDN — no runtime backend, no database
calls, no serverless functions. See
[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the longer version.

## Running locally

```bash
# Clone and enter
git clone https://github.com/madriz/basketbrain.git
cd basketbrain

# Install dependencies (Node 24 LTS recommended)
npm install

# Dev server with hot reload on http://localhost:3000
npm run dev

# Production build → static export in ./out
npm run build

# Preview the static export exactly as GitHub Pages will serve it
npx serve out -p 3000
# (or `python -m http.server 3000 --directory out`)
```

The production build is a pure static site — no Node process runs at
serve time. The `out/` directory can be deployed to any static host
(GitHub Pages, Cloudflare Pages, Netlify, S3 + CloudFront, a plain
nginx `try_files` config, etc.) without modification.

## Regenerating the snapshot

`data/snapshot.json` is the single source of truth for all displayed
data. The extraction pipeline that produced it lives in a **separate
private repository** that holds Supabase credentials and the
retailer-scraping code. No credentials are ever committed to this
public repo.

See [docs/DATA_EXTRACTION.md](docs/DATA_EXTRACTION.md) for the full
methodology: source retailers, item selection, price-bound filtering,
median-adjacent reduction, virtual-source remapping, and the known
caveats you should keep in mind if you reason about the numbers.

If a future refresh is ever needed, the private pipeline can
regenerate `snapshot.json` and open a PR here. As of April 2026 the
snapshot is intentionally frozen.

## Tech stack

- **Next.js 15.3** App Router with `output: 'export'` (static HTML)
- **React 19** server components for prerender, client components for
  maps and charts
- **TypeScript 5.5** strict mode
- **Tailwind CSS 3.4**
- **Leaflet 1.9** + OpenStreetMap tiles for the store map
- **Recharts 2.12** for the basket-by-retailer charts
- **Node 24 LTS** build runtime
- **GitHub Pages** hosting (auto-deploy on push to `main` via
  `actions/deploy-pages`)
- **Google Analytics 4** (opt-in only — see cookie banner)

## Project layout

```
.
├── app/                       # Next.js App Router routes (static export)
│   ├── page.tsx               # Homepage
│   ├── about/page.tsx         # Origin + methodology narrative
│   ├── demo/                  # /demo — basket comparison + map
│   │   ├── page.tsx
│   │   ├── build/page.tsx     # /demo/build — cart builder
│   │   └── results/           # /demo/results — cart pricing
│   └── layout.tsx             # Shared shell, CookieBanner mount
├── components/                # React components
│   ├── BasketComparison.tsx   # 30-item × 7-retailer comparison
│   ├── CartBuilder.tsx        # Client-side cart, hidden postal
│   ├── CookieBanner.tsx       # GA4 opt-in consent gate
│   ├── ItemAutocomplete.tsx   # Essential-60 catalog autocomplete
│   ├── PriceComparisonTable.tsx
│   ├── PriceTrendsSection.tsx # 5 headline best/worst cards
│   ├── ResultsMap.tsx         # Leaflet map, 76 display pins
│   ├── OptimalStrategy.tsx    # Cheapest single-store summary
│   ├── BasketRadar.tsx        # Recharts radar (cart coverage)
│   └── SavingsBarChart.tsx    # Recharts bar (cart total)
├── data/
│   └── snapshot.json          # The frozen snapshot (89 KB)
├── lib/
│   ├── essential-catalog.ts   # Essential 60 autocomplete catalog
│   ├── fsa-lookup.ts          # Canadian postal FSA → coords
│   └── snapshot.ts            # Typed reader + compute helpers
├── types/
│   └── snapshot.d.ts          # TypeScript types for schema v2
├── public/favicon.ico
├── docs/
│   ├── ARCHITECTURE.md
│   └── DATA_EXTRACTION.md
├── .github/workflows/
│   └── deploy.yml             # GitHub Pages deploy on push to main
├── CNAME                      # basketbrain.ca
├── LICENSE                    # MIT
└── README.md                  # (this file)
```

## License

Released under the [MIT License](LICENSE). Copyright (c) 2026 Rodrigo
Madriz.

The `snapshot.json` file is a derivative dataset aggregated from
public Canadian retailer price listings. Retailer trademarks remain
the property of their respective owners. No retailer logos, imagery,
or proprietary product data are bundled with this repository.

## Contributing

BasketBrain is a frozen research demo. Issues and pull requests are
welcome for **bug fixes, documentation clarifications, accessibility
improvements, and build-tooling fixes**. Please do not open PRs
proposing new features — active product development has moved to the
[HomeGadgets.ca](https://homegadgets.ca) codebase.

If you're considering forking this for a similar price-comparison
demo, the relevant pieces to study are:

- `pipeline/build_demo_snapshot.py` in the upstream private repo
  (methodology documented in [docs/DATA_EXTRACTION.md](docs/DATA_EXTRACTION.md))
- `lib/snapshot.ts` — the typed reader pattern that keeps components
  pure functions of the snapshot
- `next.config.js` — minimal Next 15 static-export configuration
- `.github/workflows/deploy.yml` — GitHub Pages deploy action

## Acknowledgements

- [OpenStreetMap contributors](https://www.openstreetmap.org/copyright)
  for the map tiles
- [Flipp](https://flipp.com/) for the public flyer aggregator API that
  underpins much of the Canadian grocery price landscape
- [Statistics Canada](https://www.statcan.gc.ca/) CPI basket
  methodology, which informed the Essential 30 item selection
