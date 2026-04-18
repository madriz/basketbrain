'use client';

/**
 * Client-side cart builder — no backend. The postal code is hardcoded to
 * M5V 2T6 (downtown Toronto) because the snapshot only contains prices for
 * that region. The postal input is hidden from the UI.
 *
 * On submit the cart is serialized into the URL search params
 * (`/demo/results?cart=<encoded JSON>`) and the browser navigates there via
 * `window.location.assign`. We avoid Next's `useRouter` to stay compatible
 * with a fully static export.
 */
import { useState, type FormEvent } from 'react';
import ItemAutocomplete from './ItemAutocomplete';
import { resolveCartName } from '@/lib/snapshot';

interface CartLine {
  id: string;
  name: string;
  quantity: number;
  unit?: string;
}

let nextId = 1;
function makeLine(): CartLine {
  return { id: String(nextId++), name: '', quantity: 1 };
}

export default function CartBuilder() {
  const [items, setItems] = useState<CartLine[]>([makeLine()]);

  function addLine() {
    setItems((prev) => [...prev, makeLine()]);
  }
  function removeLine(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }
  function updateLine(id: string, patch: Partial<CartLine>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const filled = items.filter((i) => i.name.trim());
    if (filled.length === 0) return;
    const payload = filled.map(({ name, quantity, unit }) => ({
      name,
      quantity,
      unit,
    }));
    const encoded = encodeURIComponent(JSON.stringify(payload));
    window.location.assign(`/demo/results/?cart=${encoded}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {items.map((line, idx) => {
        // Warn when the selected item can't be resolved to a snapshot product.
        // ItemAutocomplete draws from the Essential 60 catalog, but the
        // snapshot only prices the Essential 30 — anything outside will show
        // as "not in snapshot" on the results page, so we flag it here.
        const trimmed = line.name.trim();
        const missing =
          trimmed.length > 0 && resolveCartName(trimmed, line.unit) === null;
        return (
          <div key={line.id} className="space-y-1">
            <div className="flex gap-2 items-center">
              <span className="w-6 shrink-0 text-sm text-gray-400 text-right">
                {idx + 1}.
              </span>
              <ItemAutocomplete
                initialName={line.name}
                initialUnit={line.unit}
                placeholder="e.g. 2% milk 4L"
                required={idx === 0}
                onChange={({ name, unit }) =>
                  updateLine(line.id, { name, unit })
                }
              />
              <input
                type="number"
                min={1}
                max={99}
                value={line.quantity}
                onChange={(e) =>
                  updateLine(line.id, { quantity: Number(e.target.value) })
                }
                className="w-16 shrink-0 rounded-md border border-gray-300 px-2 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-green-600"
              />
              {items.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLine(line.id)}
                  className="shrink-0 text-gray-300 hover:text-red-500 text-lg leading-none"
                  aria-label="Remove item"
                >
                  ×
                </button>
              )}
            </div>
            {missing && (
              <p className="pl-8 text-xs text-amber-600">
                ⚠ Not in current snapshot — no price data for this item.
              </p>
            )}
          </div>
        );
      })}

      <button
        type="button"
        onClick={addLine}
        className="text-sm text-green-700 hover:underline"
      >
        + Add item
      </button>

      <div className="pt-4 flex items-center justify-between">
        <p className="text-xs text-gray-400">
          Prices are priced against the downtown Toronto snapshot (M5V 2T6).
        </p>
        <button
          type="submit"
          className="rounded-md bg-green-700 px-6 py-2 text-sm font-medium text-white hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-600"
        >
          Compare prices →
        </button>
      </div>
    </form>
  );
}
