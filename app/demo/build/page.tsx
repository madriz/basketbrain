import Link from 'next/link';
import CartBuilder from '@/components/CartBuilder';

export default function BuildPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Build a sample cart</h1>
        <p className="text-sm text-gray-500">
          Pick a few grocery staples. On submit, we price them against the
          frozen downtown-Toronto snapshot and show you which retailer is
          cheapest for that specific basket.
        </p>
      </header>

      <CartBuilder />

      <p className="text-xs text-gray-400">
        Location is hardcoded to downtown Toronto (M5V 2T6, 10 km radius).
        Items not in the Essential 30 snapshot will be flagged as
        &ldquo;not in snapshot&rdquo;.
      </p>

      <Link
        href="/demo/"
        className="inline-block text-sm text-green-700 hover:underline"
      >
        ← Skip to the full basket comparison
      </Link>
    </div>
  );
}
