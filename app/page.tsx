import Link from 'next/link';
import { snapshot } from '@/lib/snapshot';

export default function HomePage() {
  const date = snapshot.snapshot_date;
  const priceRowCount = snapshot.prices.length;
  const retailerCount = snapshot.retailers.length;
  const itemCount = snapshot.products.length;

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <h1 className="text-4xl font-bold text-green-800">
          BasketBrain — Canadian grocery price research
        </h1>
        <p className="text-lg leading-relaxed text-gray-600">
          A frozen snapshot of {itemCount} Essential-basket prices across{' '}
          {retailerCount} Canadian retailers, within 10 km of downtown Toronto
          (M5V 2T6), observed on or before {date}.
        </p>
        <p className="text-sm leading-relaxed text-gray-500">
          {priceRowCount} representative price observations, captured once and
          committed to a static JSON file. No live backend, no database at
          runtime — just HTML, CSS, and an 89 KB snapshot served from GitHub
          Pages. Open source under MIT.
        </p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/demo/build/"
          className="rounded-xl border-2 border-green-600 bg-green-50 px-5 py-4 hover:bg-green-100 transition"
        >
          <p className="text-base font-semibold text-green-800">
            Build a sample cart →
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Try the cart builder with autocomplete
          </p>
        </Link>
        <Link
          href="/demo/"
          className="rounded-xl border-2 border-gray-300 bg-white px-5 py-4 hover:bg-gray-50 transition"
        >
          <p className="text-base font-semibold text-gray-900">
            Compare basket prices →
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Full {itemCount}-item Essential basket, 7 retailers
          </p>
        </Link>
        <Link
          href="/about/"
          className="rounded-xl border-2 border-gray-300 bg-white px-5 py-4 hover:bg-gray-50 transition"
        >
          <p className="text-base font-semibold text-gray-900">
            Learn more →
          </p>
          <p className="mt-1 text-xs text-gray-500">
            What this project is, and isn&rsquo;t
          </p>
        </Link>
      </section>

      <section className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4 text-sm text-gray-600">
        <p>
          BasketBrain began in February 2026 as an experiment in
          data-acquisition and pipeline design for Canadian grocery pricing.
          The techniques developed here became the foundation for a sister
          project, which is now the active focus. This page is a frozen
          research archive — the demo still works, but the data is a
          snapshot from {date}, not live.
        </p>
      </section>

      <p className="text-xs text-gray-400">
        Data as of {date} · Snapshot, not live · Prices in CAD
      </p>
    </div>
  );
}
