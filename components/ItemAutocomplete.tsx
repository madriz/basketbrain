'use client';

import { useEffect, useRef, useState } from 'react';
import { type CatalogItem, searchCatalog, SEARCH_CATALOG } from '@/lib/essential-catalog';

interface Props {
  /** Current item name (from parent CartItem state). */
  initialName: string;
  /** Current item unit/spec — set when a catalog item was previously selected. */
  initialUnit?: string;
  onChange: (patch: { name: string; unit?: string }) => void;
  placeholder?: string;
  required?: boolean;
}

/**
 * Text input with catalog-backed autocomplete.
 *
 * Behaviour:
 *  - Free text: just sets name, clears unit. Price engine still searches it.
 *  - Catalog pick: locks the input, sets name = canonical name and unit = spec.
 *    The locked state shows the emoji inline + a × to clear.
 *  - Keyboard: ↑↓ to navigate, Enter to pick, Escape to close.
 */
export default function ItemAutocomplete({
  initialName,
  initialUnit,
  onChange,
  placeholder = 'e.g. 2% milk 4L',
  required,
}: Props) {
  // Derive initial locked item if name+unit matches a catalog entry
  const initialLocked = initialUnit
    ? (SEARCH_CATALOG.find(
        (i) => i.name === initialName && i.spec === initialUnit,
      ) ?? null)
    : null;

  const [inputText, setInputText] = useState(
    initialLocked ? `${initialLocked.name} ${initialLocked.spec}` : initialName,
  );
  const [locked, setLocked] = useState<CatalogItem | null>(initialLocked);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const suggestions = locked ? [] : searchCatalog(inputText);

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  // Scroll active item into view
  useEffect(() => {
    if (activeIdx < 0 || !listRef.current) return;
    const li = listRef.current.children[activeIdx] as HTMLElement | undefined;
    li?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInputText(val);
    setLocked(null);
    setActiveIdx(-1);
    setOpen(val.trim().length >= 2);
    onChange({ name: val, unit: undefined });
  }

  function handleFocus() {
    if (!locked && inputText.trim().length >= 2) setOpen(true);
  }

  function pick(item: CatalogItem) {
    setLocked(item);
    setInputText(`${item.name} ${item.spec}`);
    setOpen(false);
    setActiveIdx(-1);
    onChange({ name: item.name, unit: item.spec });
  }

  function clear() {
    setLocked(null);
    setInputText('');
    setOpen(false);
    onChange({ name: '', unit: undefined });
    inputRef.current?.focus();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      if (activeIdx >= 0) {
        e.preventDefault();
        pick(suggestions[activeIdx]);
      }
      // If nothing is active, let the form submit normally
    } else if (e.key === 'Escape') {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative flex-1">
      {/* Input row */}
      <div className="relative">
        {/* Emoji badge when locked */}
        {locked && (
          <span
            aria-hidden
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-base leading-none"
          >
            {locked.emoji}
          </span>
        )}

        <input
          ref={inputRef}
          type="text"
          value={inputText}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          required={required}
          autoComplete="off"
          spellCheck={false}
          className={[
            'w-full rounded-md border px-3 py-2 text-sm',
            'focus:outline-none focus:ring-2 focus:ring-green-600',
            locked
              ? 'border-green-400 bg-green-50 pl-9 pr-7 font-medium text-green-900'
              : 'border-gray-300',
          ].join(' ')}
        />

        {/* Clear × when locked */}
        {locked && (
          <button
            type="button"
            tabIndex={-1}
            onClick={clear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-700 text-base leading-none"
            aria-label="Clear selection"
          >
            ×
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && suggestions.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-30 mt-1 w-full max-h-64 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-xl"
        >
          {suggestions.map((item, idx) => (
            <li
              key={item.id}
              role="option"
              aria-selected={idx === activeIdx}
              onMouseDown={(e) => {
                // Prevent input blur before we can handle the click
                e.preventDefault();
                pick(item);
              }}
              onMouseEnter={() => setActiveIdx(idx)}
              className={[
                'flex cursor-pointer items-center gap-3 px-3 py-2 text-sm transition-colors',
                idx === activeIdx ? 'bg-green-50' : 'hover:bg-gray-50',
              ].join(' ')}
            >
              <span className="shrink-0 text-lg leading-none">{item.emoji}</span>

              <span className="flex-1 min-w-0">
                <span className="font-medium text-gray-900">{item.name}</span>
                <span className="ml-1.5 text-gray-500">{item.spec}</span>
              </span>

              <span className="shrink-0 rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                {item.category}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
