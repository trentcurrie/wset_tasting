import { TastingNote } from '../types';

export const SAMPLE_TASTINGS: TastingNote[] = [
  {
    id: 'sample-husch-gewurz-2023',
    type: 'Full',
    name: 'Husch Vineyards Late Harvest Gewürztraminer 2023',
    vintage: '2023',
    producer: 'Husch Vineyards',
    region: 'Anderson Valley',
    country: 'USA',
    grape: 'Gewürztraminer',
    alcoholPercentage: 10.0,
    createdAt: new Date('2024-11-15').getTime(),
    appearance: {
      clarity: 'Clear',
      intensity: 'Medium',
      color: 'Gold',
      colorCategory: 'White'
    },
    nose: {
      condition: 'Clean',
      intensity: 'Pronounced',
      characteristics: ['Lychee', 'Candied Orange Peel', 'Mango', 'Apricot Jam', 'Ginger', 'Rose Petal', 'Honey', 'Beeswax'],
      development: 'Youthful'
    },
    palate: {
      sweetness: 'Sweet',
      acidity: 'High',
      tannin: 'Low',
      alcohol: 'Low',
      body: 'Full',
      flavorIntensity: 'Pronounced',
      flavorCharacteristics: ['Dried Apricot', 'Wildflower Honey', 'Cinnamon', 'Candied Ginger', 'Marmalade'],
      finish: 'Long'
    },
    conclusion: {
      quality: 'Outstanding',
      readiness: 'Can Drink, Potential for Aging',
      personalRating: 95,
      notes: 'Botrytis-influenced late harvest with exceptional balance between sweetness and acidity. 150g/L residual sugar.'
    }
  },
  {
    id: 'sample-ceritas-pinot-2021',
    type: 'Full',
    name: "Ceritas Pinot Noir 'Cuvée Annabelle' 2021",
    vintage: '2021',
    producer: 'Ceritas',
    region: 'West Sonoma Coast',
    country: 'USA',
    grape: 'Pinot Noir',
    alcoholPercentage: 12.5,
    createdAt: new Date('2024-10-20').getTime(),
    appearance: {
      clarity: 'Clear',
      intensity: 'Medium',
      color: 'Ruby',
      colorCategory: 'Red'
    },
    nose: {
      condition: 'Clean',
      intensity: 'Medium',
      characteristics: ['Cranberry', 'Wild Strawberry', 'Blood Orange', 'Bergamot', 'Lavender', 'Tea Leaves', 'Clove', 'Smoke', 'Forest Floor', 'Crushed Rock'],
      development: 'Youthful'
    },
    palate: {
      sweetness: 'Dry',
      acidity: 'High',
      tannin: 'Medium',
      alcohol: 'Medium',
      body: 'Medium',
      flavorIntensity: 'Medium',
      flavorCharacteristics: ['Tart Red Cherry', 'Savory Herbs', 'Saline', 'Wet Stone', 'Baking Spice'],
      finish: 'Long'
    },
    conclusion: {
      quality: 'Outstanding',
      readiness: 'Can Drink, Potential for Aging',
      personalRating: 94,
      notes: 'Coastal tension with fine-grained but muscular tannins. ~30% new French oak. Mineral-driven style.'
    }
  },
  {
    id: 'sample-billecart-rose-nv',
    type: 'Full',
    name: 'Billecart-Salmon Brut Rosé NV',
    vintage: 'NV',
    producer: 'Billecart-Salmon',
    region: 'Champagne',
    country: 'France',
    grape: 'Pinot Noir, Chardonnay, Pinot Meunier',
    alcoholPercentage: 12,
    createdAt: new Date('2024-12-01').getTime(),
    appearance: {
      clarity: 'Clear',
      intensity: 'Pale',
      color: 'Salmon',
      colorCategory: 'Rose'
    },
    nose: {
      condition: 'Clean',
      intensity: 'Medium',
      characteristics: ['Wild Strawberry', 'Raspberry', 'Lemon Zest', 'White Flowers', 'Brioche', 'Biscuit', 'Fresh Dough'],
      development: 'Youthful'
    },
    palate: {
      sweetness: 'Dry',
      acidity: 'High',
      tannin: 'Low',
      alcohol: 'Medium',
      body: 'Medium',
      flavorIntensity: 'Medium',
      flavorCharacteristics: ['Red Apple', 'Citrus Peel', 'Redcurrant', 'Chalk'],
      finish: 'Medium'
    },
    conclusion: {
      quality: 'Very Good',
      readiness: 'Drink Now: Not Suitable for Aging',
      personalRating: 90,
      notes: 'Fine and persistent mousse. Creamy texture. Approx. 36 months lees aging. Styled for freshness and elegance.'
    }
  },
  {
    id: 'sample-giscours-2020',
    type: 'Full',
    name: 'Château Giscours 2020',
    vintage: '2020',
    producer: 'Château Giscours',
    region: 'Margaux',
    country: 'France',
    grape: 'Cabernet Sauvignon, Merlot',
    alcoholPercentage: 14,
    createdAt: new Date('2024-09-10').getTime(),
    appearance: {
      clarity: 'Clear',
      intensity: 'Deep',
      color: 'Ruby',
      colorCategory: 'Red'
    },
    nose: {
      condition: 'Clean',
      intensity: 'Pronounced',
      characteristics: ['Blackcurrant', 'Cassis', 'Blackberry', 'Black Plum', 'Violet', 'Pencil Shavings', 'Graphite', 'Vanilla', 'Cedar', 'Charred Wood', 'Smoke'],
      development: 'Youthful'
    },
    palate: {
      sweetness: 'Dry',
      acidity: 'Medium',
      tannin: 'High',
      alcohol: 'High',
      body: 'Full',
      flavorIntensity: 'Pronounced',
      flavorCharacteristics: ['Concentrated Black Fruit', 'Licorice', 'Toast', 'Tobacco Leaf', 'Savory', 'Earth'],
      finish: 'Long'
    },
    conclusion: {
      quality: 'Outstanding',
      readiness: 'Too Young',
      personalRating: 96,
      notes: 'Third growth Margaux. 50% new French oak. Velvety/powdery tannin texture. Best after 2027+.'
    }
  }
];

export const SAMPLE_TASTING_IDS = SAMPLE_TASTINGS.map(t => t.id);
