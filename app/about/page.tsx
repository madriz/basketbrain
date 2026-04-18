import Link from 'next/link';
import { snapshot } from '@/lib/snapshot';

export default function AboutPage() {
  return (
    <div className="space-y-8 text-gray-700">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">About BasketBrain</h1>
        <p className="text-sm text-gray-500">
          A research project archive, published as a static open-source demo.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">Origin</h2>
        <p>
          BasketBrain started in February 2026 as a proof-of-concept Canadian
          grocery price comparison platform. The goal was straightforward:
          build a cart once, and find the cheapest store combination to fulfil
          it. Over the next weeks the most interesting part turned out not to
          be the comparison UI but the data-acquisition pipeline — the
          techniques needed to reliably pull Canadian retailer pricing at
          scale without breaking rate limits, getting IP-blocked, or losing
          historical continuity.
        </p>
        <p>
          Those techniques became the foundation of a sister project,{' '}
          <strong>HomeGadgets.ca</strong>, a live Canadian consumer-electronics
          price comparison tool built on top of the pipeline patterns this
          project taught us. HomeGadgets is now the active development focus;
          BasketBrain is maintained here as a frozen research archive.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">Architecture</h2>
        <p>
          This site is a single static HTML bundle served from GitHub Pages.
          All data — {snapshot.products.length} Essential-basket items,{' '}
          {snapshot.retailers.length} retailers,{' '}
          {snapshot.display_stores.length} geocoded storefronts, and{' '}
          {snapshot.prices.length} representative price observations — lives
          in an 89 KB <code>snapshot.json</code> file committed alongside the
          code. There is no database, no serverless function, and no live API
          at runtime. Each visitor receives the same byte-identical HTML.
        </p>
        <p>
          The snapshot was produced once, on {snapshot.snapshot_date}, by a
          Python extraction script in the upstream private pipeline repo that
          queried the live BasketBrain database, applied the{' '}
          <code>price_bounds</code> / <code>match_pattern</code> filters from
          our curated Essential-basket definitions, reduced each
          (item, retailer) group to a median-adjacent representative, and
          remapped virtual aggregator sources onto the nearest physical
          storefront within 10 km of downtown Toronto (M5V 2T6).
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">Data sources</h2>
        <p>
          Prices in this snapshot were aggregated from publicly available
          Canadian grocery retailer catalogs and flyer feeds: the PC Express
          shelf-price catalog (Loblaws group), the Metro / Food Basics HTML
          catalog, the Voilà / Longo&rsquo;s online catalog, and the Flipp
          flyer aggregator&rsquo;s weekly Ontario feeds for participating
          banners (No Frills, Real Canadian Superstore, Metro, Food Basics,
          Your Independent Grocer).
        </p>
        <p className="text-sm text-gray-600">{snapshot.disclaimers.data_caveats}</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">What this is not</h2>
        <ul className="list-disc pl-6 space-y-1">
          <li>A live price comparison tool — prices are frozen to {snapshot.snapshot_date}.</li>
          <li>A shopping recommendation service — do not make purchase decisions from this data.</li>
          <li>An affiliate or commercial site — BasketBrain earns no revenue.</li>
          <li>A substitute for Statistics Canada CPI data.</li>
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-bold text-gray-900">Licence &amp; source</h2>
        <p>
          Source code for this site is released under the MIT licence. The
          snapshot JSON file is a derivative dataset of public retailer
          pricing; retailer trademarks remain the property of their
          respective owners. No retailer logos, imagery, or proprietary
          product data are bundled in this repo.
        </p>
        <p className="text-sm">
          Repository:{' '}
          <a
            href="https://github.com/madriz/basketbrain"
            className="text-green-700 hover:underline"
          >
            github.com/madriz/basketbrain
          </a>{' '}
          (placeholder URL — updated when the repo goes public).
        </p>
      </section>

      <Link
        href="/"
        className="inline-block text-sm text-green-700 hover:underline"
      >
        ← Back to home
      </Link>
    </div>
  );
}
