/**
 * Wine Aroma & Flavor Descriptors
 * Organized by category (Primary, Secondary, Tertiary)
 * Reference: Wine Folly Aroma Wheel - https://winefolly.com/tips/wine-aroma-wheel-100-flavors/
 */

export interface AromaCategory {
  name: string;
  subcategories: {
    name: string;
    descriptors: string[];
  }[];
}

// Primary Aromas - derived from grape variety
export const PRIMARY_AROMAS: AromaCategory = {
  name: 'Primary (Grape-Derived)',
  subcategories: [
    {
      name: 'Citrus Fruit',
      descriptors: ['Grapefruit', 'Lemon', 'Lime', 'Orange', 'Lemon Zest', 'Orange Peel', 'Citrus Peel', 'Blood Orange', 'Bergamot', 'Tangerine', 'Mandarin', 'Marmalade']
    },
    {
      name: 'Green Fruit',
      descriptors: ['Green Apple', 'Pear', 'Gooseberry', 'Grape', 'Quince', 'Persimmon']
    },
    {
      name: 'Stone Fruit',
      descriptors: ['Peach', 'Apricot', 'Nectarine', 'White Peach', 'Yellow Peach']
    },
    {
      name: 'Tropical Fruit',
      descriptors: ['Banana', 'Lychee', 'Mango', 'Melon', 'Passion Fruit', 'Pineapple', 'Guava', 'Papaya', 'Starfruit', 'Bubblegum']
    },
    {
      name: 'Red Fruit',
      descriptors: ['Redcurrant', 'Cranberry', 'Raspberry', 'Strawberry', 'Red Cherry', 'Red Plum', 'Pomegranate', 'Wild Strawberry', 'Red Apple', 'Sour Cherry', 'Cherry']
    },
    {
      name: 'Black Fruit',
      descriptors: ['Blackcurrant', 'Blackberry', 'Blueberry', 'Black Cherry', 'Black Plum', 'Cassis', 'Boysenberry', 'Mulberry', 'Olive', 'Plum']
    },
    {
      name: 'Dried Fruit',
      descriptors: ['Fig', 'Prune', 'Raisin', 'Sultana', 'Dried Apricot', 'Date', 'Candied Orange Peel', 'Marmalade', 'Apricot Jam', 'Fruitcake']
    },
    {
      name: 'Floral',
      descriptors: ['Acacia', 'Honeysuckle', 'Jasmine', 'Rose', 'Violet', 'Orange Blossom', 'Elderflower', 'Lavender', 'Geranium', 'Rose Petal', 'White Flowers', 'Iris', 'Peony', 'Lilac', 'Potpourri', 'Hibiscus', 'Chamomile']
    },
    {
      name: 'Herbaceous / Herbal',
      descriptors: ['Green Bell Pepper', 'Grass', 'Tomato Leaf', 'Asparagus', 'Blackcurrant Leaf', 'Mint', 'Eucalyptus', 'Fennel', 'Dill', 'Thyme', 'Rosemary', 'Bay Leaf', 'Tea Leaves', 'Savory Herbs', 'Black Tea', 'Jalapeño', 'Tomato', 'Sun-Dried Tomato', 'Sage', 'Oregano', 'Basil']
    },
    {
      name: 'Spice (Primary)',
      descriptors: ['Black Pepper', 'White Pepper', 'Licorice', 'Anise', 'Ginger', 'Cinnamon', 'Red Pepper', '5-Spice', 'Star Anise']
    },
    {
      name: 'Earth',
      descriptors: ['Wet Stone', 'Mineral', 'Flint', 'Saline', 'Chalk', 'Crushed Rock', 'Petrol', 'Kerosene', 'Clay Pot', 'Slate', 'Wet Gravel', 'Potting Soil', 'Red Beet', 'Volcanic Rocks', 'Petroleum']
    }
  ]
};

// Secondary Aromas - derived from winemaking
export const SECONDARY_AROMAS: AromaCategory = {
  name: 'Secondary (Winemaking)',
  subcategories: [
    {
      name: 'Yeast / MLF',
      descriptors: ['Biscuit', 'Bread', 'Toast', 'Pastry', 'Brioche', 'Bread Dough', 'Cheese', 'Yogurt', 'Butter', 'Cream', 'Fresh Dough', 'Sourdough', 'Lager']
    },
    {
      name: 'Oak',
      descriptors: ['Vanilla', 'Clove', 'Nutmeg', 'Coconut', 'Butterscotch', 'Cedar', 'Charred Wood', 'Smoke', 'Chocolate', 'Coffee', 'Mocha', 'Caramel', 'Toffee', 'Cigar Box', 'Baking Spices', 'Dill', 'Cocoa']
    },
    {
      name: 'Other Winemaking',
      descriptors: ['Flor', 'Almond', 'Marzipan', 'Honey', 'Beeswax', 'Botrytis', 'Dried Flowers', 'Truffle', 'Mushroom']
    }
  ]
};

// Tertiary Aromas - derived from aging
export const TERTIARY_AROMAS: AromaCategory = {
  name: 'Tertiary (Aging)',
  subcategories: [
    {
      name: 'Oxidative',
      descriptors: ['Almond', 'Marzipan', 'Hazelnut', 'Walnut', 'Chocolate', 'Coffee', 'Toffee', 'Caramel']
    },
    {
      name: 'Developed (Fruit)',
      descriptors: ['Dried Apricot', 'Marmalade', 'Dried Orange Peel', 'Cooked Fruit', 'Stewed Fruit']
    },
    {
      name: 'Bottle Age (White)',
      descriptors: ['Petrol', 'Kerosene', 'Cinnamon', 'Ginger', 'Nutmeg', 'Toast', 'Honey', 'Mushroom']
    },
    {
      name: 'Bottle Age (Red)',
      descriptors: ['Leather', 'Forest Floor', 'Earth', 'Mushroom', 'Truffle', 'Wet Leaves', 'Game', 'Meat', 'Tobacco', 'Tobacco Leaf', 'Vegetal', 'Savory', 'Pencil Shavings', 'Graphite', 'Tar', 'Dried Herbs', 'Cedar']
    }
  ]
};

// All categories combined
export const ALL_AROMA_CATEGORIES: AromaCategory[] = [
  PRIMARY_AROMAS,
  SECONDARY_AROMAS,
  TERTIARY_AROMAS
];

// Category color mapping for chips (fallback)
export const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  'Primary (Grape-Derived)': { bg: 'bg-vine/15', text: 'text-vine', border: 'border-vine/30' },
  'Secondary (Winemaking)': { bg: 'bg-tangerine/15', text: 'text-tangerine', border: 'border-tangerine/30' },
  'Tertiary (Aging)': { bg: 'bg-grape/15', text: 'text-grape', border: 'border-grape/30' },
};

// Descriptor-specific colors based on actual item appearance
// Colors are Tailwind arbitrary values for precise color matching
export const DESCRIPTOR_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  // === CITRUS FRUIT (yellows, oranges) ===
  'Grapefruit': { bg: 'bg-[#FCD34D]/20', text: 'text-[#CA8A04]', border: 'border-[#FCD34D]/40' },
  'Lemon': { bg: 'bg-[#FEF08A]/30', text: 'text-[#A16207]', border: 'border-[#FEF08A]/50' },
  'Lime': { bg: 'bg-[#BEF264]/25', text: 'text-[#4D7C0F]', border: 'border-[#BEF264]/40' },
  'Orange': { bg: 'bg-[#FB923C]/20', text: 'text-[#C2410C]', border: 'border-[#FB923C]/40' },
  'Lemon Zest': { bg: 'bg-[#FEF08A]/30', text: 'text-[#A16207]', border: 'border-[#FEF08A]/50' },
  'Orange Peel': { bg: 'bg-[#FDBA74]/25', text: 'text-[#C2410C]', border: 'border-[#FDBA74]/40' },
  'Citrus Peel': { bg: 'bg-[#FDE68A]/25', text: 'text-[#B45309]', border: 'border-[#FDE68A]/40' },
  'Blood Orange': { bg: 'bg-[#F87171]/20', text: 'text-[#B91C1C]', border: 'border-[#F87171]/40' },
  'Bergamot': { bg: 'bg-[#A3E635]/20', text: 'text-[#4D7C0F]', border: 'border-[#A3E635]/40' },
  'Tangerine': { bg: 'bg-[#FB923C]/20', text: 'text-[#EA580C]', border: 'border-[#FB923C]/40' },
  'Mandarin': { bg: 'bg-[#FDBA74]/20', text: 'text-[#EA580C]', border: 'border-[#FDBA74]/40' },

  // === GREEN FRUIT (greens, pale yellows) ===
  'Green Apple': { bg: 'bg-[#86EFAC]/20', text: 'text-[#166534]', border: 'border-[#86EFAC]/40' },
  'Pear': { bg: 'bg-[#D9F99D]/25', text: 'text-[#4D7C0F]', border: 'border-[#D9F99D]/40' },
  'Gooseberry': { bg: 'bg-[#BEF264]/20', text: 'text-[#3F6212]', border: 'border-[#BEF264]/40' },
  'Grape': { bg: 'bg-[#C4B5FD]/20', text: 'text-[#6D28D9]', border: 'border-[#C4B5FD]/40' },
  'Quince': { bg: 'bg-[#FDE68A]/20', text: 'text-[#A16207]', border: 'border-[#FDE68A]/40' },

  // === STONE FRUIT (peaches, oranges, yellows) ===
  'Peach': { bg: 'bg-[#FECACA]/25', text: 'text-[#DC2626]', border: 'border-[#FDBA74]/40' },
  'Apricot': { bg: 'bg-[#FED7AA]/25', text: 'text-[#EA580C]', border: 'border-[#FED7AA]/40' },
  'Nectarine': { bg: 'bg-[#FECACA]/20', text: 'text-[#DC2626]', border: 'border-[#FED7AA]/40' },
  'White Peach': { bg: 'bg-[#FEF3C7]/30', text: 'text-[#D97706]', border: 'border-[#FEF3C7]/50' },
  'Yellow Peach': { bg: 'bg-[#FDE68A]/25', text: 'text-[#B45309]', border: 'border-[#FDE68A]/40' },

  // === TROPICAL FRUIT (yellows, oranges, pinks) ===
  'Banana': { bg: 'bg-[#FEF08A]/30', text: 'text-[#A16207]', border: 'border-[#FEF08A]/50' },
  'Lychee': { bg: 'bg-[#FECDD3]/25', text: 'text-[#BE185D]', border: 'border-[#FECDD3]/40' },
  'Mango': { bg: 'bg-[#FDE047]/25', text: 'text-[#B45309]', border: 'border-[#FDBA74]/40' },
  'Melon': { bg: 'bg-[#D9F99D]/25', text: 'text-[#65A30D]', border: 'border-[#D9F99D]/40' },
  'Passion Fruit': { bg: 'bg-[#FDE68A]/25', text: 'text-[#A16207]', border: 'border-[#FDE68A]/40' },
  'Pineapple': { bg: 'bg-[#FEF08A]/30', text: 'text-[#A16207]', border: 'border-[#FEF08A]/50' },
  'Guava': { bg: 'bg-[#FECDD3]/20', text: 'text-[#BE185D]', border: 'border-[#FECDD3]/40' },
  'Papaya': { bg: 'bg-[#FDBA74]/25', text: 'text-[#EA580C]', border: 'border-[#FDBA74]/40' },
  'Starfruit': { bg: 'bg-[#FEF08A]/25', text: 'text-[#CA8A04]', border: 'border-[#FEF08A]/40' },

  // === RED FRUIT (reds, pinks) ===
  'Redcurrant': { bg: 'bg-[#FCA5A5]/25', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]/40' },
  'Cranberry': { bg: 'bg-[#F87171]/20', text: 'text-[#B91C1C]', border: 'border-[#F87171]/40' },
  'Raspberry': { bg: 'bg-[#FDA4AF]/25', text: 'text-[#E11D48]', border: 'border-[#FDA4AF]/40' },
  'Strawberry': { bg: 'bg-[#FCA5A5]/25', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]/40' },
  'Red Cherry': { bg: 'bg-[#FCA5A5]/25', text: 'text-[#B91C1C]', border: 'border-[#FCA5A5]/40' },
  'Red Plum': { bg: 'bg-[#F9A8D4]/20', text: 'text-[#BE185D]', border: 'border-[#F9A8D4]/40' },
  'Pomegranate': { bg: 'bg-[#FCA5A5]/25', text: 'text-[#B91C1C]', border: 'border-[#FCA5A5]/40' },
  'Wild Strawberry': { bg: 'bg-[#FCA5A5]/20', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]/40' },
  'Red Apple': { bg: 'bg-[#FCA5A5]/20', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]/40' },

  // === BLACK FRUIT (deep purples, dark reds) ===
  'Blackcurrant': { bg: 'bg-[#C4B5FD]/25', text: 'text-[#6D28D9]', border: 'border-[#C4B5FD]/40' },
  'Blackberry': { bg: 'bg-[#C4B5FD]/25', text: 'text-[#5B21B6]', border: 'border-[#C4B5FD]/40' },
  'Blueberry': { bg: 'bg-[#A5B4FC]/25', text: 'text-[#4338CA]', border: 'border-[#A5B4FC]/40' },
  'Black Cherry': { bg: 'bg-[#DDD6FE]/25', text: 'text-[#5B21B6]', border: 'border-[#DDD6FE]/40' },
  'Black Plum': { bg: 'bg-[#C4B5FD]/20', text: 'text-[#5B21B6]', border: 'border-[#C4B5FD]/40' },
  'Cassis': { bg: 'bg-[#C4B5FD]/25', text: 'text-[#6D28D9]', border: 'border-[#C4B5FD]/40' },
  'Boysenberry': { bg: 'bg-[#C4B5FD]/20', text: 'text-[#5B21B6]', border: 'border-[#C4B5FD]/40' },
  'Mulberry': { bg: 'bg-[#DDD6FE]/25', text: 'text-[#5B21B6]', border: 'border-[#DDD6FE]/40' },

  // === DRIED FRUIT (browns, ambers, dark oranges) ===
  'Fig': { bg: 'bg-[#C4B5FD]/20', text: 'text-[#5B21B6]', border: 'border-[#C4B5FD]/40' },
  'Prune': { bg: 'bg-[#C4B5FD]/25', text: 'text-[#4C1D95]', border: 'border-[#C4B5FD]/40' },
  'Raisin': { bg: 'bg-[#D8B4FE]/20', text: 'text-[#6B21A8]', border: 'border-[#D8B4FE]/40' },
  'Sultana': { bg: 'bg-[#FDE68A]/25', text: 'text-[#A16207]', border: 'border-[#FDE68A]/40' },
  'Dried Apricot': { bg: 'bg-[#FDBA74]/25', text: 'text-[#C2410C]', border: 'border-[#FDBA74]/40' },
  'Date': { bg: 'bg-[#D6D3D1]/30', text: 'text-[#57534E]', border: 'border-[#A8A29E]/40' },
  'Candied Orange Peel': { bg: 'bg-[#FDBA74]/25', text: 'text-[#EA580C]', border: 'border-[#FDBA74]/40' },
  'Marmalade': { bg: 'bg-[#FB923C]/20', text: 'text-[#C2410C]', border: 'border-[#FB923C]/40' },
  'Apricot Jam': { bg: 'bg-[#FED7AA]/25', text: 'text-[#EA580C]', border: 'border-[#FED7AA]/40' },

  // === FLORAL (pinks, purples, whites, yellows) ===
  'Acacia': { bg: 'bg-[#FEF9C3]/30', text: 'text-[#A16207]', border: 'border-[#FEF9C3]/50' },
  'Honeysuckle': { bg: 'bg-[#FEF3C7]/30', text: 'text-[#D97706]', border: 'border-[#FEF3C7]/50' },
  'Jasmine': { bg: 'bg-[#F5F5F4]/40', text: 'text-[#57534E]', border: 'border-[#D6D3D1]/50' },
  'Rose': { bg: 'bg-[#FECDD3]/25', text: 'text-[#E11D48]', border: 'border-[#FECDD3]/40' },
  'Violet': { bg: 'bg-[#C4B5FD]/25', text: 'text-[#7C3AED]', border: 'border-[#C4B5FD]/40' },
  'Orange Blossom': { bg: 'bg-[#FEF3C7]/30', text: 'text-[#D97706]', border: 'border-[#FEF3C7]/50' },
  'Elderflower': { bg: 'bg-[#F5F5F4]/40', text: 'text-[#57534E]', border: 'border-[#E7E5E4]/50' },
  'Lavender': { bg: 'bg-[#C4B5FD]/20', text: 'text-[#7C3AED]', border: 'border-[#C4B5FD]/40' },
  'Geranium': { bg: 'bg-[#FECDD3]/20', text: 'text-[#DB2777]', border: 'border-[#FECDD3]/40' },
  'Rose Petal': { bg: 'bg-[#FECDD3]/25', text: 'text-[#E11D48]', border: 'border-[#FECDD3]/40' },
  'White Flowers': { bg: 'bg-[#F5F5F4]/40', text: 'text-[#57534E]', border: 'border-[#E7E5E4]/50' },
  'Dried Flowers': { bg: 'bg-[#E7E5E4]/30', text: 'text-[#78716C]', border: 'border-[#D6D3D1]/40' },

  // === HERBACEOUS / HERBAL (greens) ===
  'Green Bell Pepper': { bg: 'bg-[#86EFAC]/20', text: 'text-[#166534]', border: 'border-[#86EFAC]/40' },
  'Grass': { bg: 'bg-[#86EFAC]/20', text: 'text-[#15803D]', border: 'border-[#86EFAC]/40' },
  'Tomato Leaf': { bg: 'bg-[#86EFAC]/20', text: 'text-[#166534]', border: 'border-[#86EFAC]/40' },
  'Asparagus': { bg: 'bg-[#86EFAC]/20', text: 'text-[#166534]', border: 'border-[#86EFAC]/40' },
  'Blackcurrant Leaf': { bg: 'bg-[#86EFAC]/20', text: 'text-[#166534]', border: 'border-[#86EFAC]/40' },
  'Mint': { bg: 'bg-[#6EE7B7]/20', text: 'text-[#047857]', border: 'border-[#6EE7B7]/40' },
  'Eucalyptus': { bg: 'bg-[#6EE7B7]/20', text: 'text-[#047857]', border: 'border-[#6EE7B7]/40' },
  'Fennel': { bg: 'bg-[#D9F99D]/25', text: 'text-[#4D7C0F]', border: 'border-[#D9F99D]/40' },
  'Dill': { bg: 'bg-[#86EFAC]/20', text: 'text-[#15803D]', border: 'border-[#86EFAC]/40' },
  'Thyme': { bg: 'bg-[#D9F99D]/20', text: 'text-[#4D7C0F]', border: 'border-[#D9F99D]/40' },
  'Rosemary': { bg: 'bg-[#86EFAC]/20', text: 'text-[#166534]', border: 'border-[#86EFAC]/40' },
  'Bay Leaf': { bg: 'bg-[#86EFAC]/20', text: 'text-[#166534]', border: 'border-[#86EFAC]/40' },
  'Tea Leaves': { bg: 'bg-[#D9F99D]/20', text: 'text-[#4D7C0F]', border: 'border-[#D9F99D]/40' },
  'Savory Herbs': { bg: 'bg-[#86EFAC]/20', text: 'text-[#166534]', border: 'border-[#86EFAC]/40' },
  'Dried Herbs': { bg: 'bg-[#D6D3D1]/25', text: 'text-[#57534E]', border: 'border-[#A8A29E]/40' },

  // === SPICE (browns, tans, blacks) ===
  'Black Pepper': { bg: 'bg-[#D6D3D1]/30', text: 'text-[#44403C]', border: 'border-[#A8A29E]/40' },
  'White Pepper': { bg: 'bg-[#F5F5F4]/40', text: 'text-[#57534E]', border: 'border-[#E7E5E4]/50' },
  'Licorice': { bg: 'bg-[#D6D3D1]/30', text: 'text-[#292524]', border: 'border-[#A8A29E]/40' },
  'Anise': { bg: 'bg-[#D9F99D]/20', text: 'text-[#4D7C0F]', border: 'border-[#D9F99D]/40' },
  'Ginger': { bg: 'bg-[#FED7AA]/25', text: 'text-[#C2410C]', border: 'border-[#FED7AA]/40' },
  'Cinnamon': { bg: 'bg-[#FDBA74]/25', text: 'text-[#9A3412]', border: 'border-[#FDBA74]/40' },
  'Clove': { bg: 'bg-[#D6D3D1]/30', text: 'text-[#57534E]', border: 'border-[#A8A29E]/40' },
  'Nutmeg': { bg: 'bg-[#D6D3D1]/30', text: 'text-[#57534E]', border: 'border-[#A8A29E]/40' },

  // === MINERAL / OTHER (grays, whites - enhanced for dark mode) ===
  'Wet Stone': { bg: 'bg-stone-200/50', text: 'text-stone-900', border: 'border-stone-300/60' },
  'Mineral': { bg: 'bg-stone-200/50', text: 'text-stone-900', border: 'border-stone-300/60' },
  'Flint': { bg: 'bg-stone-300/50', text: 'text-stone-950', border: 'border-stone-400/60' },
  'Saline': { bg: 'bg-slate-100/60', text: 'text-slate-900', border: 'border-slate-200/70' },
  'Chalk': { bg: 'bg-stone-100/60', text: 'text-stone-900', border: 'border-stone-200/70' },
  'Crushed Rock': { bg: 'bg-stone-200/50', text: 'text-stone-900', border: 'border-stone-300/60' },
  'Petrol': { bg: 'bg-indigo-200/50', text: 'text-indigo-950', border: 'border-indigo-300/60' },
  'Kerosene': { bg: 'bg-indigo-200/50', text: 'text-indigo-950', border: 'border-indigo-300/60' },

  // === YEAST / MLF (creams, tans) ===
  'Biscuit': { bg: 'bg-[#FEF3C7]/30', text: 'text-[#A16207]', border: 'border-[#FEF3C7]/50' },
  'Bread': { bg: 'bg-[#FED7AA]/25', text: 'text-[#92400E]', border: 'border-[#FED7AA]/40' },
  'Toast': { bg: 'bg-[#FDBA74]/25', text: 'text-[#9A3412]', border: 'border-[#FDBA74]/40' },
  'Pastry': { bg: 'bg-[#FEF3C7]/30', text: 'text-[#A16207]', border: 'border-[#FEF3C7]/50' },
  'Brioche': { bg: 'bg-[#FDE68A]/25', text: 'text-[#A16207]', border: 'border-[#FDE68A]/40' },
  'Bread Dough': { bg: 'bg-[#FEF3C7]/30', text: 'text-[#92400E]', border: 'border-[#FEF3C7]/50' },
  'Fresh Dough': { bg: 'bg-[#FEF3C7]/30', text: 'text-[#92400E]', border: 'border-[#FEF3C7]/50' },
  'Cheese': { bg: 'bg-[#FEF08A]/25', text: 'text-[#A16207]', border: 'border-[#FEF08A]/40' },
  'Yogurt': { bg: 'bg-stone-50/70', text: 'text-stone-900', border: 'border-stone-200/70' },
  'Butter': { bg: 'bg-yellow-100/50', text: 'text-yellow-900', border: 'border-yellow-200/60' },
  'Cream': { bg: 'bg-amber-50/70', text: 'text-amber-900', border: 'border-amber-100/70' },

  // === OAK (browns, tans) ===
  'Vanilla': { bg: 'bg-yellow-100/50', text: 'text-yellow-900', border: 'border-yellow-200/60' },
  'Coconut': { bg: 'bg-stone-50/70', text: 'text-stone-900', border: 'border-stone-200/70' },
  'Butterscotch': { bg: 'bg-[#FDBA74]/25', text: 'text-[#92400E]', border: 'border-[#FDBA74]/40' },
  'Cedar': { bg: 'bg-stone-300/50', text: 'text-stone-900', border: 'border-stone-400/60' },
  'Charred Wood': { bg: 'bg-stone-400/50', text: 'text-stone-950', border: 'border-stone-500/60' },
  'Smoke': { bg: 'bg-stone-300/50', text: 'text-stone-950', border: 'border-stone-400/60' },
  'Chocolate': { bg: 'bg-stone-300/50', text: 'text-stone-950', border: 'border-stone-400/60' },
  'Coffee': { bg: 'bg-stone-400/50', text: 'text-stone-950', border: 'border-stone-500/60' },
  'Mocha': { bg: 'bg-stone-300/50', text: 'text-stone-950', border: 'border-stone-400/60' },
  'Caramel': { bg: 'bg-[#FDBA74]/25', text: 'text-[#92400E]', border: 'border-[#FDBA74]/40' },
  'Toffee': { bg: 'bg-[#FDBA74]/25', text: 'text-[#92400E]', border: 'border-[#FDBA74]/40' },

  // === OTHER WINEMAKING ===
  'Flor': { bg: 'bg-[#FEF9C3]/25', text: 'text-[#A16207]', border: 'border-[#FEF9C3]/40' },
  'Almond': { bg: 'bg-[#FED7AA]/25', text: 'text-[#92400E]', border: 'border-[#FED7AA]/40' },
  'Marzipan': { bg: 'bg-[#FEF3C7]/30', text: 'text-[#A16207]', border: 'border-[#FEF3C7]/50' },
  'Honey': { bg: 'bg-[#FDE047]/25', text: 'text-[#A16207]', border: 'border-[#FDE047]/40' },
  'Beeswax': { bg: 'bg-[#FDE68A]/25', text: 'text-[#A16207]', border: 'border-[#FDE68A]/40' },
  'Botrytis': { bg: 'bg-[#FDE68A]/20', text: 'text-[#A16207]', border: 'border-[#FDE68A]/40' },

  // === OXIDATIVE / NUTTY (browns) ===
  'Hazelnut': { bg: 'bg-amber-200/50', text: 'text-amber-950', border: 'border-amber-300/60' },
  'Walnut': { bg: 'bg-amber-200/50', text: 'text-amber-950', border: 'border-amber-300/60' },

  // === DEVELOPED FRUIT ===
  'Dried Orange Peel': { bg: 'bg-[#FDBA74]/25', text: 'text-[#C2410C]', border: 'border-[#FDBA74]/40' },
  'Cooked Fruit': { bg: 'bg-[#FCA5A5]/20', text: 'text-[#B91C1C]', border: 'border-[#FCA5A5]/40' },
  'Stewed Fruit': { bg: 'bg-[#FCA5A5]/20', text: 'text-[#B91C1C]', border: 'border-[#FCA5A5]/40' },

  // === BOTTLE AGE (earthy browns, tans) ===
  'Mushroom': { bg: 'bg-stone-300/50', text: 'text-stone-900', border: 'border-stone-400/60' },
  'Leather': { bg: 'bg-amber-200/50', text: 'text-amber-950', border: 'border-amber-300/60' },
  'Forest Floor': { bg: 'bg-emerald-200/40', text: 'text-emerald-950', border: 'border-emerald-300/50' },
  'Earth': { bg: 'bg-stone-300/50', text: 'text-stone-900', border: 'border-stone-400/60' },
  'Truffle': { bg: 'bg-stone-400/50', text: 'text-stone-950', border: 'border-stone-500/60' },
  'Wet Leaves': { bg: 'bg-emerald-200/40', text: 'text-emerald-950', border: 'border-emerald-300/50' },
  'Game': { bg: 'bg-amber-200/50', text: 'text-amber-950', border: 'border-amber-300/60' },
  'Meat': { bg: 'bg-[#FECACA]/20', text: 'text-[#B91C1C]', border: 'border-[#FECACA]/40' },
  'Tobacco': { bg: 'bg-amber-200/50', text: 'text-amber-950', border: 'border-amber-300/60' },
  'Tobacco Leaf': { bg: 'bg-amber-200/50', text: 'text-amber-950', border: 'border-amber-300/60' },
  'Vegetal': { bg: 'bg-green-200/50', text: 'text-green-950', border: 'border-green-300/60' },
  'Savory': { bg: 'bg-stone-300/50', text: 'text-stone-900', border: 'border-stone-400/60' },
  'Pencil Shavings': { bg: 'bg-stone-300/50', text: 'text-stone-900', border: 'border-stone-400/60' },
  'Graphite': { bg: 'bg-stone-400/50', text: 'text-stone-950', border: 'border-stone-500/60' },
  'Tar': { bg: 'bg-stone-500/50', text: 'text-white', border: 'border-stone-600/60' },

  // === NEW WINE FOLLY ADDITIONS ===
  // Floral
  'Iris': { bg: 'bg-[#C4B5FD]/20', text: 'text-[#6D28D9]', border: 'border-[#C4B5FD]/40' },
  'Peony': { bg: 'bg-[#FECDD3]/25', text: 'text-[#DB2777]', border: 'border-[#FECDD3]/40' },
  'Lilac': { bg: 'bg-[#DDD6FE]/25', text: 'text-[#7C3AED]', border: 'border-[#DDD6FE]/40' },
  'Potpourri': { bg: 'bg-[#F5D0FE]/20', text: 'text-[#A21CAF]', border: 'border-[#F5D0FE]/40' },
  'Hibiscus': { bg: 'bg-[#FDA4AF]/25', text: 'text-[#E11D48]', border: 'border-[#FDA4AF]/40' },
  'Chamomile': { bg: 'bg-[#FEF9C3]/30', text: 'text-[#A16207]', border: 'border-[#FEF9C3]/50' },
  
  // Herbal
  'Black Tea': { bg: 'bg-amber-200/50', text: 'text-amber-950', border: 'border-amber-300/60' },
  'Jalapeño': { bg: 'bg-[#86EFAC]/25', text: 'text-[#166534]', border: 'border-[#86EFAC]/40' },
  'Tomato': { bg: 'bg-[#FCA5A5]/20', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]/40' },
  'Sun-Dried Tomato': { bg: 'bg-[#F87171]/25', text: 'text-[#B91C1C]', border: 'border-[#F87171]/40' },
  'Sage': { bg: 'bg-[#86EFAC]/20', text: 'text-[#166534]', border: 'border-[#86EFAC]/40' },
  'Oregano': { bg: 'bg-[#86EFAC]/20', text: 'text-[#166534]', border: 'border-[#86EFAC]/40' },
  'Basil': { bg: 'bg-[#86EFAC]/25', text: 'text-[#166534]', border: 'border-[#86EFAC]/40' },

  // Spice
  'Red Pepper': { bg: 'bg-[#F87171]/20', text: 'text-[#B91C1C]', border: 'border-[#F87171]/40' },
  '5-Spice': { bg: 'bg-[#D6D3D1]/30', text: 'text-[#57534E]', border: 'border-[#A8A29E]/40' },
  'Star Anise': { bg: 'bg-[#D6D3D1]/30', text: 'text-[#44403C]', border: 'border-[#A8A29E]/40' },
  'Baking Spices': { bg: 'bg-[#FDBA74]/25', text: 'text-[#9A3412]', border: 'border-[#FDBA74]/40' },

  // Earth
  'Clay Pot': { bg: 'bg-amber-200/50', text: 'text-amber-950', border: 'border-amber-300/60' },
  'Slate': { bg: 'bg-slate-300/50', text: 'text-slate-900', border: 'border-slate-400/60' },
  'Wet Gravel': { bg: 'bg-stone-300/50', text: 'text-stone-900', border: 'border-stone-400/60' },
  'Potting Soil': { bg: 'bg-amber-300/40', text: 'text-amber-950', border: 'border-amber-400/50' },
  'Red Beet': { bg: 'bg-[#F87171]/25', text: 'text-[#B91C1C]', border: 'border-[#F87171]/40' },
  'Volcanic Rocks': { bg: 'bg-stone-400/50', text: 'text-stone-950', border: 'border-stone-500/60' },
  'Petroleum': { bg: 'bg-indigo-200/50', text: 'text-indigo-950', border: 'border-indigo-300/60' },

  // Fruit additions
  'Persimmon': { bg: 'bg-[#FB923C]/25', text: 'text-[#C2410C]', border: 'border-[#FB923C]/40' },
  'Bubblegum': { bg: 'bg-[#F9A8D4]/25', text: 'text-[#DB2777]', border: 'border-[#F9A8D4]/40' },
  'Sour Cherry': { bg: 'bg-[#FCA5A5]/25', text: 'text-[#B91C1C]', border: 'border-[#FCA5A5]/40' },
  'Cherry': { bg: 'bg-[#FCA5A5]/25', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]/40' },
  'Olive': { bg: 'bg-[#86EFAC]/20', text: 'text-[#166534]', border: 'border-[#86EFAC]/40' },
  'Plum': { bg: 'bg-[#C4B5FD]/20', text: 'text-[#5B21B6]', border: 'border-[#C4B5FD]/40' },
  'Fruitcake': { bg: 'bg-amber-200/50', text: 'text-amber-950', border: 'border-amber-300/60' },

  // Oak/Winemaking additions
  'Cigar Box': { bg: 'bg-amber-200/50', text: 'text-amber-950', border: 'border-amber-300/60' },
  'Cocoa': { bg: 'bg-stone-300/50', text: 'text-stone-950', border: 'border-stone-400/60' },
  'Sourdough': { bg: 'bg-[#FEF3C7]/30', text: 'text-[#92400E]', border: 'border-[#FEF3C7]/50' },
  'Lager': { bg: 'bg-[#FDE68A]/25', text: 'text-[#A16207]', border: 'border-[#FDE68A]/40' },
};

// Get the main category name for a descriptor (without subcategory)
export const getMainCategoryForDescriptor = (descriptor: string): string | null => {
  for (const category of ALL_AROMA_CATEGORIES) {
    for (const sub of category.subcategories) {
      if (sub.descriptors.some(d => d.toLowerCase() === descriptor.toLowerCase())) {
        return category.name;
      }
    }
  }
  return null;
};

// Get descriptor-specific color or fall back to category color
export const getDescriptorColor = (descriptor: string): { bg: string; text: string; border: string } | null => {
  // First check for exact descriptor match
  if (DESCRIPTOR_COLORS[descriptor]) {
    return DESCRIPTOR_COLORS[descriptor];
  }
  // Fall back to category color
  const mainCategory = getMainCategoryForDescriptor(descriptor);
  if (mainCategory && CATEGORY_COLORS[mainCategory]) {
    return CATEGORY_COLORS[mainCategory];
  }
  return null;
};

// Flat list of all descriptors for autocomplete
export const ALL_DESCRIPTORS: string[] = ALL_AROMA_CATEGORIES.flatMap(
  category => category.subcategories.flatMap(sub => sub.descriptors)
).filter((value, index, self) => self.indexOf(value) === index).sort();

// Quick search function
export const searchDescriptors = (query: string): string[] => {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return ALL_DESCRIPTORS.filter(d => d.toLowerCase().includes(lowerQuery)).slice(0, 10);
};

// Get category for a descriptor
export const getCategoryForDescriptor = (descriptor: string): string | null => {
  for (const category of ALL_AROMA_CATEGORIES) {
    for (const sub of category.subcategories) {
      if (sub.descriptors.some(d => d.toLowerCase() === descriptor.toLowerCase())) {
        return `${category.name} › ${sub.name}`;
      }
    }
  }
  return null;
};
