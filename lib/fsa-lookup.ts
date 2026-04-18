/**
 * Canadian postal code (FSA) → city, province, approximate lat/lng.
 * Derived from the upstream pipeline's postal lookup.
 *
 * Matches on the first two characters of the FSA (e.g. "M5" from "M5V 2T6").
 */

interface FSAEntry {
  city: string;
  province: string;
  lat: number;
  lng: number;
}

const FSA: Record<string, FSAEntry> = {
  // Ontario – Toronto (M)
  M1: { city: 'Toronto',          province: 'ON', lat: 43.77, lng: -79.21 },
  M2: { city: 'Toronto',          province: 'ON', lat: 43.76, lng: -79.40 },
  M3: { city: 'Toronto',          province: 'ON', lat: 43.73, lng: -79.44 },
  M4: { city: 'Toronto',          province: 'ON', lat: 43.68, lng: -79.36 },
  M5: { city: 'Toronto',          province: 'ON', lat: 43.65, lng: -79.39 },
  M6: { city: 'Toronto',          province: 'ON', lat: 43.66, lng: -79.46 },
  M7: { city: 'Toronto',          province: 'ON', lat: 43.64, lng: -79.38 },
  M8: { city: 'Toronto',          province: 'ON', lat: 43.62, lng: -79.50 },
  M9: { city: 'Toronto',          province: 'ON', lat: 43.70, lng: -79.55 },
  // Ontario – Ottawa / Eastern (K)
  K0: { city: 'Ottawa',           province: 'ON', lat: 45.42, lng: -75.69 },
  K1: { city: 'Ottawa',           province: 'ON', lat: 45.42, lng: -75.69 },
  K2: { city: 'Ottawa',           province: 'ON', lat: 45.35, lng: -75.73 },
  K4: { city: 'Ottawa',           province: 'ON', lat: 45.40, lng: -75.72 },
  K6: { city: 'Kingston',         province: 'ON', lat: 44.23, lng: -76.49 },
  K7: { city: 'Kingston',         province: 'ON', lat: 44.23, lng: -76.49 },
  K8: { city: 'Peterborough',     province: 'ON', lat: 44.30, lng: -78.32 },
  // Ontario – Peel / Halton / York / Durham (L)
  L0: { city: 'Newmarket',        province: 'ON', lat: 44.05, lng: -79.47 },
  L1: { city: 'Oshawa',           province: 'ON', lat: 43.90, lng: -78.85 },
  L2: { city: 'Niagara Falls',    province: 'ON', lat: 43.09, lng: -79.07 },
  L3: { city: 'Markham',          province: 'ON', lat: 43.87, lng: -79.26 },
  L4: { city: 'Mississauga',      province: 'ON', lat: 43.60, lng: -79.65 },
  L5: { city: 'Mississauga',      province: 'ON', lat: 43.58, lng: -79.62 },
  L6: { city: 'Mississauga',      province: 'ON', lat: 43.55, lng: -79.59 },
  L7: { city: 'Oakville',         province: 'ON', lat: 43.47, lng: -79.68 },
  L8: { city: 'Hamilton',         province: 'ON', lat: 43.26, lng: -79.87 },
  L9: { city: 'Barrie',           province: 'ON', lat: 44.39, lng: -79.69 },
  // Ontario – Southwestern (N)
  N0: { city: 'Guelph',           province: 'ON', lat: 43.55, lng: -80.25 },
  N1: { city: 'Guelph',           province: 'ON', lat: 43.55, lng: -80.25 },
  N2: { city: 'Kitchener',        province: 'ON', lat: 43.45, lng: -80.49 },
  N3: { city: 'Cambridge',        province: 'ON', lat: 43.36, lng: -80.31 },
  N4: { city: 'Brantford',        province: 'ON', lat: 43.14, lng: -80.26 },
  N5: { city: 'Woodstock',        province: 'ON', lat: 43.13, lng: -80.74 },
  N6: { city: 'London',           province: 'ON', lat: 42.98, lng: -81.23 },
  N7: { city: 'Sarnia',           province: 'ON', lat: 42.97, lng: -82.40 },
  N8: { city: 'Windsor',          province: 'ON', lat: 42.31, lng: -83.04 },
  N9: { city: 'Windsor',          province: 'ON', lat: 42.29, lng: -83.01 },
  // Ontario – Northern (P)
  P1: { city: 'Sudbury',          province: 'ON', lat: 46.49, lng: -80.99 },
  P3: { city: 'Sudbury',          province: 'ON', lat: 46.49, lng: -80.99 },
  P5: { city: 'Sault Ste. Marie', province: 'ON', lat: 46.52, lng: -84.34 },
  P6: { city: 'Sault Ste. Marie', province: 'ON', lat: 46.52, lng: -84.34 },
  P7: { city: 'Thunder Bay',      province: 'ON', lat: 48.38, lng: -89.25 },
  // Manitoba (R)
  R0: { city: 'Winnipeg',         province: 'MB', lat: 49.89, lng:  -97.14 },
  R2: { city: 'Winnipeg',         province: 'MB', lat: 49.89, lng:  -97.14 },
  R3: { city: 'Winnipeg',         province: 'MB', lat: 49.89, lng:  -97.14 },
  R4: { city: 'Winnipeg',         province: 'MB', lat: 49.82, lng:  -97.20 },
  // Saskatchewan (S)
  S0: { city: 'Regina',           province: 'SK', lat: 50.44, lng: -104.62 },
  S4: { city: 'Regina',           province: 'SK', lat: 50.44, lng: -104.62 },
  S6: { city: 'Regina',           province: 'SK', lat: 50.41, lng: -104.59 },
  S7: { city: 'Saskatoon',        province: 'SK', lat: 52.13, lng: -106.67 },
  // Alberta (T)
  T0: { city: 'Calgary',          province: 'AB', lat: 51.04, lng: -114.07 },
  T1: { city: 'Lethbridge',       province: 'AB', lat: 49.69, lng: -112.83 },
  T2: { city: 'Calgary',          province: 'AB', lat: 51.04, lng: -114.07 },
  T3: { city: 'Calgary',          province: 'AB', lat: 51.08, lng: -114.18 },
  T4: { city: 'Red Deer',         province: 'AB', lat: 52.27, lng: -113.81 },
  T5: { city: 'Edmonton',         province: 'AB', lat: 53.54, lng: -113.49 },
  T6: { city: 'Edmonton',         province: 'AB', lat: 53.47, lng: -113.54 },
  T7: { city: 'Edmonton',         province: 'AB', lat: 53.59, lng: -113.43 },
  T8: { city: 'Edmonton',         province: 'AB', lat: 53.59, lng: -113.43 },
  T9: { city: 'Fort McMurray',    province: 'AB', lat: 56.73, lng: -111.38 },
  // British Columbia (V)
  V0: { city: 'Kelowna',          province: 'BC', lat: 49.88, lng: -119.48 },
  V1: { city: 'Kelowna',          province: 'BC', lat: 49.88, lng: -119.48 },
  V2: { city: 'Abbotsford',       province: 'BC', lat: 49.05, lng: -122.31 },
  V3: { city: 'Surrey',           province: 'BC', lat: 49.19, lng: -122.85 },
  V4: { city: 'Richmond',         province: 'BC', lat: 49.16, lng: -123.14 },
  V5: { city: 'Vancouver',        province: 'BC', lat: 49.23, lng: -123.10 },
  V6: { city: 'Vancouver',        province: 'BC', lat: 49.27, lng: -123.14 },
  V7: { city: 'North Vancouver',  province: 'BC', lat: 49.32, lng: -123.07 },
  V8: { city: 'Victoria',         province: 'BC', lat: 48.43, lng: -123.37 },
  V9: { city: 'Nanaimo',          province: 'BC', lat: 49.16, lng: -123.94 },
  // Quebec (G, H, J)
  G0: { city: 'Quebec City',      province: 'QC', lat: 46.81, lng:  -71.21 },
  G1: { city: 'Quebec City',      province: 'QC', lat: 46.81, lng:  -71.21 },
  G2: { city: 'Quebec City',      province: 'QC', lat: 46.84, lng:  -71.28 },
  G3: { city: 'Quebec City',      province: 'QC', lat: 46.87, lng:  -71.39 },
  G6: { city: 'Lévis',            province: 'QC', lat: 46.69, lng:  -71.17 },
  G7: { city: 'Chicoutimi',       province: 'QC', lat: 48.43, lng:  -71.07 },
  H1: { city: 'Montreal',         province: 'QC', lat: 45.56, lng:  -73.59 },
  H2: { city: 'Montreal',         province: 'QC', lat: 45.52, lng:  -73.60 },
  H3: { city: 'Montreal',         province: 'QC', lat: 45.50, lng:  -73.57 },
  H4: { city: 'Montreal',         province: 'QC', lat: 45.46, lng:  -73.63 },
  H5: { city: 'Montreal',         province: 'QC', lat: 45.49, lng:  -73.56 },
  H7: { city: 'Laval',            province: 'QC', lat: 45.61, lng:  -73.74 },
  H8: { city: 'Montreal West',    province: 'QC', lat: 45.45, lng:  -73.68 },
  H9: { city: 'West Island',      province: 'QC', lat: 45.45, lng:  -73.85 },
  J4: { city: 'Longueuil',        province: 'QC', lat: 45.53, lng:  -73.52 },
  J7: { city: 'Laval',            province: 'QC', lat: 45.62, lng:  -73.87 },
  J8: { city: 'Gatineau',         province: 'QC', lat: 45.48, lng:  -75.65 },
  // Atlantic – Newfoundland (A)
  A1: { city: "St. John's",       province: 'NL', lat: 47.56, lng:  -52.71 },
  A2: { city: 'Corner Brook',     province: 'NL', lat: 48.95, lng:  -57.95 },
  A5: { city: 'Grand Falls',      province: 'NL', lat: 49.00, lng:  -55.65 },
  // Atlantic – Nova Scotia (B)
  B0: { city: 'Truro',            province: 'NS', lat: 45.36, lng:  -63.27 },
  B1: { city: 'Cape Breton',      province: 'NS', lat: 46.13, lng:  -60.19 },
  B2: { city: 'Dartmouth',        province: 'NS', lat: 44.67, lng:  -63.57 },
  B3: { city: 'Halifax',          province: 'NS', lat: 44.65, lng:  -63.57 },
  B4: { city: 'Halifax',          province: 'NS', lat: 44.72, lng:  -63.70 },
  // Atlantic – PEI (C)
  C0: { city: 'Charlottetown',    province: 'PE', lat: 46.24, lng:  -63.13 },
  C1: { city: 'Charlottetown',    province: 'PE', lat: 46.24, lng:  -63.13 },
  // Atlantic – New Brunswick (E)
  E1: { city: 'Moncton',          province: 'NB', lat: 46.09, lng:  -64.77 },
  E2: { city: 'Moncton',          province: 'NB', lat: 46.10, lng:  -64.80 },
  E3: { city: 'Fredericton',      province: 'NB', lat: 45.97, lng:  -66.65 },
  E4: { city: 'Fredericton',      province: 'NB', lat: 45.95, lng:  -66.64 },
  E5: { city: 'Saint John',       province: 'NB', lat: 45.27, lng:  -66.06 },
  // Territories (X, Y)
  X0: { city: 'Yellowknife',      province: 'NT', lat: 62.45, lng: -114.37 },
  X1: { city: 'Yellowknife',      province: 'NT', lat: 62.45, lng: -114.37 },
  Y0: { city: 'Whitehorse',       province: 'YT', lat: 60.72, lng: -135.05 },
  Y1: { city: 'Whitehorse',       province: 'YT', lat: 60.72, lng: -135.05 },
};

export function lookupPostal(postal: string): FSAEntry | null {
  const clean = postal.replace(/\s+/g, '').toUpperCase();
  if (clean.length < 2) return null;
  return FSA[clean.slice(0, 2)] ?? null;
}
