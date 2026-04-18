import { Suspense } from 'react';
import ResultsView from './ResultsView';

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <p className="text-gray-500 animate-pulse">Pricing your cart…</p>
      }
    >
      <ResultsView />
    </Suspense>
  );
}
