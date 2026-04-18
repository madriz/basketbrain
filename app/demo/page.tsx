import BasketComparison from '@/components/BasketComparison';
import OptimalStrategy from '@/components/OptimalStrategy';
import PriceTrendsSection from '@/components/PriceTrendsSection';
import ResultsMap from '@/components/ResultsMap';
import { snapshot } from '@/lib/snapshot';

export default function DemoPage() {
  return (
    <div className="space-y-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Essential 30 basket — downtown Toronto
        </h1>
        <p className="text-sm text-gray-500">
          Frozen snapshot dated {snapshot.snapshot_date}. {snapshot.stores.length}{' '}
          priced storefronts, {snapshot.retailers.length} retailers,{' '}
          {snapshot.display_stores.length} total storefronts on the map.
        </p>
      </header>

      <PriceTrendsSection />

      <BasketComparison />

      <OptimalStrategy />

      <section className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900">Map of tracked stores</h2>
        <p className="text-sm text-gray-500">
          <span className="inline-block w-3 h-3 rounded-full bg-green-600 mr-1 align-middle" />
          green pins are stores whose prices feed the comparison ·{' '}
          <span className="inline-block w-3 h-3 rounded-full bg-gray-400 mr-1 align-middle" />
          gray pins are nearby storefronts we know about but whose prices
          aren&rsquo;t in this snapshot.
        </p>
        <ResultsMap />
      </section>

      <p className="text-xs text-gray-400 leading-relaxed">
        {snapshot.disclaimers.data_caveats}
      </p>
    </div>
  );
}
