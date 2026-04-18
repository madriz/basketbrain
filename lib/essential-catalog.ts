/**
 * Essential 60 — canonical product list used by the cart autocomplete.
 *
 * `name` is sent to the price engine as the search query (matched via
 * ILIKE %name% against Supabase products.name).
 *
 * SEARCH_CATALOG extends Essential 60 with additional package-size variants
 * for the CartBuilder autocomplete. BasketRadar uses only STAPLES_CATALOG.
 */

export interface CatalogItem {
  id: string;
  emoji: string;
  /** Canonical product name — used as the price engine search query. */
  name: string;
  /** Size / pack spec displayed alongside the name in the dropdown. */
  spec: string;
  category: string;
}

export const STAPLES_CATALOG: CatalogItem[] = [
  // ── Protein (10) ──────────────────────────────────────────────────────────
  { id: 'chicken-breast',  emoji: '🍗', name: 'Chicken Breast',    spec: '600g',     category: 'Protein'   },
  { id: 'ground-beef',     emoji: '🥩', name: 'Ground Beef',       spec: '500g',     category: 'Protein'   },
  { id: 'ground-pork',     emoji: '🥩', name: 'Ground Pork',       spec: '500g',     category: 'Protein'   },
  { id: 'pork-chops',      emoji: '🥩', name: 'Pork Chops',        spec: '600g',     category: 'Protein'   },
  { id: 'bacon',           emoji: '🥓', name: 'Bacon',             spec: '375g',     category: 'Protein'   },
  { id: 'eggs',            emoji: '🥚', name: 'Eggs',              spec: '12 Large', category: 'Protein'   },
  { id: 'canned-tuna',     emoji: '🐟', name: 'Canned Tuna',       spec: '170g',     category: 'Protein'   },
  { id: 'salmon-fillet',   emoji: '🐟', name: 'Salmon Fillet',     spec: '400g',     category: 'Protein'   },
  { id: 'tofu-firm',       emoji: '🫘', name: 'Tofu Firm',         spec: '350g',     category: 'Protein'   },
  { id: 'deli-ham',        emoji: '🍖', name: 'Deli Ham',          spec: '175g',     category: 'Protein'   },

  // ── Dairy (8) ─────────────────────────────────────────────────────────────
  { id: 'milk-2pct-4l',    emoji: '🥛', name: 'Milk 2%',           spec: '4L',       category: 'Dairy'     },
  { id: 'milk-2pct-2l',    emoji: '🥛', name: 'Milk 2%',           spec: '2L',       category: 'Dairy'     },
  { id: 'butter',          emoji: '🧈', name: 'Butter',            spec: '454g',     category: 'Dairy'     },
  { id: 'cheddar',         emoji: '🧀', name: 'Cheddar',           spec: '400g',     category: 'Dairy'     },
  { id: 'mozzarella',      emoji: '🧀', name: 'Mozzarella',        spec: '400g',     category: 'Dairy'     },
  { id: 'yogurt-plain',    emoji: '🫙', name: 'Yogurt Plain',      spec: '750g',     category: 'Dairy'     },
  { id: 'cream-cheese',    emoji: '🫙', name: 'Cream Cheese',      spec: '250g',     category: 'Dairy'     },
  { id: 'sour-cream',      emoji: '🫙', name: 'Sour Cream',        spec: '500mL',    category: 'Dairy'     },

  // ── Grains (8) ────────────────────────────────────────────────────────────
  { id: 'white-bread',     emoji: '🍞', name: 'White Bread',       spec: '675g',     category: 'Grains'    },
  { id: 'ww-bread',        emoji: '🍞', name: 'Whole Wheat Bread', spec: '675g',     category: 'Grains'    },
  { id: 'long-grain-rice', emoji: '🍚', name: 'Long Grain Rice',   spec: '2kg',      category: 'Grains'    },
  { id: 'basmati-rice',    emoji: '🍚', name: 'Basmati Rice',      spec: '2kg',      category: 'Grains'    },
  { id: 'pasta',           emoji: '🍝', name: 'Pasta',             spec: '900g',     category: 'Grains'    },
  { id: 'rolled-oats',     emoji: '🥣', name: 'Rolled Oats',       spec: '1kg',      category: 'Grains'    },
  { id: 'cereal',          emoji: '🥣', name: 'Cereal',            spec: '500g',     category: 'Grains'    },
  { id: 'flour',           emoji: '🌾', name: 'All-Purpose Flour', spec: '2kg',      category: 'Grains'    },

  // ── Produce (10) ──────────────────────────────────────────────────────────
  { id: 'bananas',         emoji: '🍌', name: 'Bananas',           spec: '',         category: 'Produce'   },
  { id: 'apples',          emoji: '🍎', name: 'Apples Gala/Fuji',  spec: '',         category: 'Produce'   },
  { id: 'oranges',         emoji: '🍊', name: 'Oranges Navel',     spec: '',         category: 'Produce'   },
  { id: 'potatoes',        emoji: '🥔', name: 'Potatoes',          spec: '5lb',      category: 'Produce'   },
  { id: 'onions',          emoji: '🧅', name: 'Onions',            spec: '3lb',      category: 'Produce'   },
  { id: 'carrots',         emoji: '🥕', name: 'Carrots',           spec: '2lb',      category: 'Produce'   },
  { id: 'tomatoes',        emoji: '🍅', name: 'Tomatoes Field',    spec: '',         category: 'Produce'   },
  { id: 'lettuce',         emoji: '🥬', name: 'Iceberg Lettuce',   spec: '',         category: 'Produce'   },
  { id: 'broccoli',        emoji: '🥦', name: 'Broccoli Crown',    spec: '',         category: 'Produce'   },
  { id: 'frozen-veg',      emoji: '🧊', name: 'Frozen Vegetables', spec: '750g',     category: 'Frozen'    },

  // ── Pantry (10) ───────────────────────────────────────────────────────────
  { id: 'veg-oil',         emoji: '🫙', name: 'Vegetable Oil',     spec: '1L',       category: 'Pantry'    },
  { id: 'olive-oil',       emoji: '🫒', name: 'Olive Oil',         spec: '750mL',    category: 'Pantry'    },
  { id: 'peanut-butter',   emoji: '🥜', name: 'Peanut Butter',     spec: '1kg',      category: 'Pantry'    },
  { id: 'jam',             emoji: '🍓', name: 'Jam Strawberry',    spec: '500mL',    category: 'Pantry'    },
  { id: 'sugar',           emoji: '🍬', name: 'Sugar',             spec: '2kg',      category: 'Pantry'    },
  { id: 'canned-tomatoes', emoji: '🥫', name: 'Canned Tomatoes',   spec: '796mL',    category: 'Pantry'    },
  { id: 'chicken-broth',   emoji: '🍲', name: 'Chicken Broth',     spec: '900mL',    category: 'Pantry'    },
  { id: 'pasta-sauce',     emoji: '🫙', name: 'Pasta Sauce',       spec: '650mL',    category: 'Pantry'    },
  { id: 'mayo',            emoji: '🫙', name: 'Mayonnaise',        spec: '890mL',    category: 'Pantry'    },
  { id: 'soy-sauce',       emoji: '🫙', name: 'Soy Sauce',         spec: '150mL',    category: 'Pantry'    },

  // ── Beverages (4) ─────────────────────────────────────────────────────────
  { id: 'orange-juice',    emoji: '🍊', name: 'Orange Juice',      spec: '1.75L',    category: 'Beverages' },
  { id: 'instant-coffee',  emoji: '☕', name: 'Instant Coffee',    spec: '200g',     category: 'Beverages' },
  { id: 'tea-bags',        emoji: '🍵', name: 'Tea Bags',          spec: '72ct',     category: 'Beverages' },
  { id: 'kraft-dinner',    emoji: '🧀', name: 'Kraft Dinner',      spec: '225g',     category: 'Pantry'    },
];

// ── Additional package-size variants (CartBuilder autocomplete only) ────────
// Items here appear in search results but are NOT part of the Essential 60 basket.
// `name` must match what the price engine can find via ILIKE %name% in the DB.
const VARIANT_ITEMS: CatalogItem[] = [
  // ── Eggs ──────────────────────────────────────────────────────────────────
  { id: 'eggs-6',            emoji: '🥚', name: 'Eggs',               spec: '6-pack',   category: 'Protein'   },
  { id: 'eggs-18',           emoji: '🥚', name: 'Eggs',               spec: '18 Large', category: 'Protein'   },
  { id: 'eggs-30',           emoji: '🥚', name: 'Eggs',               spec: '30 Large', category: 'Protein'   },

  // ── Milk ──────────────────────────────────────────────────────────────────
  { id: 'milk-1pct-4l',      emoji: '🥛', name: 'Milk 1%',            spec: '4L',       category: 'Dairy'     },
  { id: 'milk-1pct-2l',      emoji: '🥛', name: 'Milk 1%',            spec: '2L',       category: 'Dairy'     },
  { id: 'milk-whole-4l',     emoji: '🥛', name: 'Milk Whole (3.25%)', spec: '4L',       category: 'Dairy'     },
  { id: 'milk-whole-2l',     emoji: '🥛', name: 'Milk Whole (3.25%)', spec: '2L',       category: 'Dairy'     },
  { id: 'milk-skim-4l',      emoji: '🥛', name: 'Skim Milk',          spec: '4L',       category: 'Dairy'     },
  { id: 'milk-skim-2l',      emoji: '🥛', name: 'Skim Milk',          spec: '2L',       category: 'Dairy'     },
  { id: 'milk-1l',           emoji: '🥛', name: 'Milk',               spec: '1L',       category: 'Dairy'     },

  // ── Protein ───────────────────────────────────────────────────────────────
  { id: 'chicken-breast-1kg',emoji: '🍗', name: 'Chicken Breast',     spec: '1kg',      category: 'Protein'   },
  { id: 'chicken-breast-fam',emoji: '🍗', name: 'Chicken Breast',     spec: '1.5kg',    category: 'Protein'   },
  { id: 'ground-beef-1kg',   emoji: '🥩', name: 'Ground Beef',        spec: '1kg',      category: 'Protein'   },
  { id: 'bacon-500g',        emoji: '🥓', name: 'Bacon',              spec: '500g',     category: 'Protein'   },
  { id: 'canned-tuna-4pk',   emoji: '🐟', name: 'Canned Tuna',        spec: '4-pack',   category: 'Protein'   },

  // ── Dairy ─────────────────────────────────────────────────────────────────
  { id: 'butter-227g',       emoji: '🧈', name: 'Butter',             spec: '227g',     category: 'Dairy'     },
  { id: 'cheddar-200g',      emoji: '🧀', name: 'Cheddar',            spec: '200g',     category: 'Dairy'     },
  { id: 'cheddar-600g',      emoji: '🧀', name: 'Cheddar',            spec: '600g',     category: 'Dairy'     },
  { id: 'mozzarella-200g',   emoji: '🧀', name: 'Mozzarella',         spec: '200g',     category: 'Dairy'     },
  { id: 'yogurt-500g',       emoji: '🫙', name: 'Yogurt Plain',       spec: '500g',     category: 'Dairy'     },
  { id: 'yogurt-1kg',        emoji: '🫙', name: 'Yogurt Plain',       spec: '1kg',      category: 'Dairy'     },
  { id: 'cream-cheese-500g', emoji: '🫙', name: 'Cream Cheese',       spec: '500g',     category: 'Dairy'     },
  { id: 'sour-cream-250ml',  emoji: '🫙', name: 'Sour Cream',         spec: '250mL',    category: 'Dairy'     },

  // ── Grains ────────────────────────────────────────────────────────────────
  { id: 'pasta-450g',        emoji: '🍝', name: 'Pasta',              spec: '450g',     category: 'Grains'    },
  { id: 'long-grain-rice-5kg',emoji: '🍚', name: 'Long Grain Rice',   spec: '5kg',      category: 'Grains'    },
  { id: 'basmati-rice-5kg',  emoji: '🍚', name: 'Basmati Rice',       spec: '5kg',      category: 'Grains'    },
  { id: 'rolled-oats-2kg',   emoji: '🥣', name: 'Rolled Oats',        spec: '2kg',      category: 'Grains'    },
  { id: 'flour-10kg',        emoji: '🌾', name: 'All-Purpose Flour',  spec: '10kg',     category: 'Grains'    },
  { id: 'bread-570g',        emoji: '🍞', name: 'White Bread',        spec: '570g',     category: 'Grains'    },
  { id: 'ww-bread-570g',     emoji: '🍞', name: 'Whole Wheat Bread',  spec: '570g',     category: 'Grains'    },

  // ── Pantry ────────────────────────────────────────────────────────────────
  { id: 'peanut-butter-500g',emoji: '🥜', name: 'Peanut Butter',      spec: '500g',     category: 'Pantry'    },
  { id: 'sugar-1kg',         emoji: '🍬', name: 'Sugar',              spec: '1kg',      category: 'Pantry'    },
  { id: 'sugar-4kg',         emoji: '🍬', name: 'Sugar',              spec: '4kg',      category: 'Pantry'    },
  { id: 'olive-oil-500ml',   emoji: '🫒', name: 'Olive Oil',          spec: '500mL',    category: 'Pantry'    },
  { id: 'veg-oil-2l',        emoji: '🫙', name: 'Vegetable Oil',      spec: '2L',       category: 'Pantry'    },
  { id: 'pasta-sauce-680ml', emoji: '🫙', name: 'Pasta Sauce',        spec: '680mL',    category: 'Pantry'    },
  { id: 'mayo-445ml',        emoji: '🫙', name: 'Mayonnaise',         spec: '445mL',    category: 'Pantry'    },
  { id: 'canned-tomatoes-398ml', emoji: '🥫', name: 'Canned Tomatoes', spec: '398mL',  category: 'Pantry'    },
  { id: 'chicken-broth-1l',  emoji: '🍲', name: 'Chicken Broth',      spec: '1L',       category: 'Pantry'    },
  { id: 'kraft-dinner-7pk',  emoji: '🧀', name: 'Kraft Dinner',       spec: '7-pack',   category: 'Pantry'    },

  // ── Beverages ─────────────────────────────────────────────────────────────
  { id: 'oj-946ml',          emoji: '🍊', name: 'Orange Juice',       spec: '946mL',    category: 'Beverages' },
  { id: 'oj-2l',             emoji: '🍊', name: 'Orange Juice',       spec: '2L',       category: 'Beverages' },
  { id: 'instant-coffee-100g',emoji: '☕', name: 'Instant Coffee',    spec: '100g',     category: 'Beverages' },
  { id: 'tea-bags-144ct',    emoji: '🍵', name: 'Tea Bags',           spec: '144ct',    category: 'Beverages' },
];

/**
 * Full search catalog: Essential 60 + package-size variants.
 * Used by the CartBuilder autocomplete. Canonical Essential 60 items
 * appear first in results for the same match score (stable sort).
 */
export const SEARCH_CATALOG: CatalogItem[] = [...STAPLES_CATALOG, ...VARIANT_ITEMS];

/**
 * Returns true if every character of `query` appears in `target` in order.
 * Enables partial/imprecise matches: "chkn" → "chicken breast".
 */
function isSubsequence(query: string, target: string): boolean {
  let qi = 0;
  for (let ti = 0; ti < target.length && qi < query.length; ti++) {
    if (target[ti] === query[qi]) qi++;
  }
  return qi === query.length;
}

/** Score how well a catalog item matches a lowercase query string (0 = no match). */
export function scoreMatch(item: CatalogItem, q: string): number {
  const full = `${item.name} ${item.spec}`.toLowerCase();
  const name = item.name.toLowerCase();
  const cat  = item.category.toLowerCase();

  if (full === q)           return 7; // exact
  if (name.startsWith(q))   return 6; // name prefix  — "milk" → "Milk 2%"
  if (full.startsWith(q))   return 5; // full prefix
  if (name.includes(q))     return 4; // name substring
  if (full.includes(q))     return 3; // full substring
  if (cat.includes(q))      return 2; // category
  if (isSubsequence(q, name) || isSubsequence(q, full)) return 1; // fuzzy
  return 0;
}

/**
 * Return up to `limit` catalog items ranked by match quality.
 * Searches SEARCH_CATALOG (Essential 60 + variants) so all package sizes appear.
 * Canonical Essential 60 items surface first for ties (stable sort, prepended).
 */
export function searchCatalog(query: string, limit = 12): CatalogItem[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];

  return SEARCH_CATALOG
    .map((item) => ({ item, score: scoreMatch(item, q) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item }) => item);
}
