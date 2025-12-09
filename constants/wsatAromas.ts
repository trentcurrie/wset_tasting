/**
 * WSET Systematic Approach to Tasting (SAT) Aroma & Flavor Descriptors
 * Organized by category following WSET Level 2 and 3 framework
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
      descriptors: ['Grapefruit', 'Lemon', 'Lime', 'Orange', 'Lemon Zest', 'Orange Peel', 'Citrus Peel', 'Blood Orange', 'Bergamot', 'Tangerine', 'Mandarin']
    },
    {
      name: 'Green Fruit',
      descriptors: ['Green Apple', 'Pear', 'Gooseberry', 'Grape', 'Quince']
    },
    {
      name: 'Stone Fruit',
      descriptors: ['Peach', 'Apricot', 'Nectarine', 'White Peach', 'Yellow Peach']
    },
    {
      name: 'Tropical Fruit',
      descriptors: ['Banana', 'Lychee', 'Mango', 'Melon', 'Passion Fruit', 'Pineapple', 'Guava', 'Papaya', 'Starfruit']
    },
    {
      name: 'Red Fruit',
      descriptors: ['Redcurrant', 'Cranberry', 'Raspberry', 'Strawberry', 'Red Cherry', 'Red Plum', 'Pomegranate', 'Wild Strawberry', 'Red Apple']
    },
    {
      name: 'Black Fruit',
      descriptors: ['Blackcurrant', 'Blackberry', 'Blueberry', 'Black Cherry', 'Black Plum', 'Cassis', 'Boysenberry', 'Mulberry']
    },
    {
      name: 'Dried Fruit',
      descriptors: ['Fig', 'Prune', 'Raisin', 'Sultana', 'Dried Apricot', 'Date', 'Candied Orange Peel', 'Marmalade', 'Apricot Jam']
    },
    {
      name: 'Floral',
      descriptors: ['Acacia', 'Honeysuckle', 'Jasmine', 'Rose', 'Violet', 'Orange Blossom', 'Elderflower', 'Lavender', 'Geranium', 'Rose Petal', 'White Flowers']
    },
    {
      name: 'Herbaceous / Herbal',
      descriptors: ['Green Bell Pepper', 'Grass', 'Tomato Leaf', 'Asparagus', 'Blackcurrant Leaf', 'Mint', 'Eucalyptus', 'Fennel', 'Dill', 'Thyme', 'Rosemary', 'Bay Leaf', 'Tea Leaves', 'Savory Herbs']
    },
    {
      name: 'Spice (Primary)',
      descriptors: ['Black Pepper', 'White Pepper', 'Licorice', 'Anise', 'Ginger', 'Cinnamon']
    },
    {
      name: 'Other',
      descriptors: ['Wet Stone', 'Mineral', 'Flint', 'Saline', 'Chalk', 'Crushed Rock', 'Petrol', 'Kerosene']
    }
  ]
};

// Secondary Aromas - derived from winemaking
export const SECONDARY_AROMAS: AromaCategory = {
  name: 'Secondary (Winemaking)',
  subcategories: [
    {
      name: 'Yeast / MLF',
      descriptors: ['Biscuit', 'Bread', 'Toast', 'Pastry', 'Brioche', 'Bread Dough', 'Cheese', 'Yogurt', 'Butter', 'Cream', 'Fresh Dough']
    },
    {
      name: 'Oak',
      descriptors: ['Vanilla', 'Clove', 'Nutmeg', 'Coconut', 'Butterscotch', 'Cedar', 'Charred Wood', 'Smoke', 'Chocolate', 'Coffee', 'Mocha', 'Caramel', 'Toffee']
    },
    {
      name: 'Other Winemaking',
      descriptors: ['Flor', 'Almond', 'Marzipan', 'Honey', 'Beeswax', 'Botrytis', 'Dried Flowers']
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
