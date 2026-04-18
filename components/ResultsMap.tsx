'use client';

/**
 * ResultsMap — Leaflet map with one pin per display_store. Pins for stores
 * that carry prices in the snapshot are green; map-only stores are gray.
 *
 * Leaflet accesses `window` at module init, so this component loads its
 * Leaflet imports dynamically inside a `useEffect` — safe under Next.js
 * static export.
 */
import 'leaflet/dist/leaflet.css';

import { useEffect, useRef } from 'react';
import { snapshot } from '@/lib/snapshot';

function pinSvg(fill: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="26" height="38" viewBox="0 0 26 38">
    <path fill="${fill}" stroke="white" stroke-width="2"
          d="M13 0C5.82 0 0 5.82 0 13c0 10.4 13 25 13 25S26 23.4 26 13C26 5.82 20.18 0 13 0z"/>
    <circle cx="13" cy="13" r="5.5" fill="white"/>
  </svg>`;
}

function centroidSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
    <circle cx="11" cy="11" r="9" fill="#3b82f6" stroke="white" stroke-width="3"/>
    <circle cx="11" cy="11" r="3" fill="white"/>
  </svg>`;
}

export default function ResultsMap() {
  const mapRef = useRef<import('leaflet').Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;
    // Defer one tick so the container has dimensions when Leaflet reads them
    const timer = setTimeout(() => {
      import('leaflet').then((L) => {
        if (cancelled || !containerRef.current) return;

        const { lat, lng } = snapshot.region;
        const map = L.map(containerRef.current, {
          center: [lat, lng],
          zoom: 12,
          scrollWheelZoom: false,
        });
        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }).addTo(map);

        // Centroid marker (M5V 2T6)
        const centroidIcon = L.divIcon({
          html: centroidSvg(),
          className: '',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });
        L.marker([lat, lng], { icon: centroidIcon })
          .addTo(map)
          .bindPopup(`<b>${snapshot.region.label}</b>`);

        // Radius circle
        L.circle([lat, lng], {
          radius: snapshot.region.radius_km * 1000,
          color: '#3b82f6',
          weight: 1,
          fillOpacity: 0.05,
        }).addTo(map);

        const green = L.divIcon({
          html: pinSvg('#16a34a'),
          className: '',
          iconSize: [26, 38],
          iconAnchor: [13, 38],
          popupAnchor: [0, -34],
        });
        const gray = L.divIcon({
          html: pinSvg('#9ca3af'),
          className: '',
          iconSize: [26, 38],
          iconAnchor: [13, 38],
          popupAnchor: [0, -34],
        });

        for (const s of snapshot.display_stores) {
          const icon = s.has_prices ? green : gray;
          const popup = `<b>${s.store_name ?? 'Store'}</b><br>${
            s.retailer_name ?? ''
          }${s.address ? `<br><span style="color:#6b7280">${s.address}</span>` : ''}${
            s.has_prices
              ? '<br><span style="color:#16a34a;font-weight:600">✓ priced in snapshot</span>'
              : ''
          }`;
          L.marker([s.lat, s.lng], { icon }).addTo(map).bindPopup(popup);
        }
      });
    }, 0);

    return () => {
      cancelled = true;
      clearTimeout(timer);
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl border border-gray-200"
      style={{ height: 420 }}
    />
  );
}
