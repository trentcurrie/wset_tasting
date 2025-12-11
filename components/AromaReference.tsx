import React, { useState } from 'react';
import { Search, X, Leaf, Beaker, Clock, AlertTriangle, ExternalLink } from 'lucide-react';
import { ALL_AROMA_CATEGORIES, searchDescriptors, getDescriptorColor } from '../constants/aromas';

interface Props {
  onClose?: () => void;
}

// Category accent colors (left border) and labels
const CATEGORY_ACCENTS: Record<string, string> = {
  'Primary (Grape-Derived)': 'border-l-vine',
  'Secondary (Winemaking)': 'border-l-tangerine',
  'Tertiary (Aging)': 'border-l-grape',
  'Faults / Off-Aromas': 'border-l-stone-500',
};

const CATEGORY_LABELS: Record<string, { icon: React.ReactNode; label: string; short: string }> = {
  'Primary (Grape-Derived)': { icon: <Leaf size={14} />, label: 'Primary', short: '1°' },
  'Secondary (Winemaking)': { icon: <Beaker size={14} />, label: 'Secondary', short: '2°' },
  'Tertiary (Aging)': { icon: <Clock size={14} />, label: 'Tertiary', short: '3°' },
  'Faults / Off-Aromas': { icon: <AlertTriangle size={14} />, label: 'Faults', short: '!' },
};

// Beautiful gradient colors for subcategories
const SUBCATEGORY_COLORS: Record<string, { bg: string; gradient: string; text: string }> = {
  'Citrus Fruit': { bg: '#FEF3C7', gradient: 'from-amber-100 to-yellow-200', text: 'text-amber-900' },
  'Green Fruit': { bg: '#D1FAE5', gradient: 'from-emerald-100 to-green-200', text: 'text-emerald-900' },
  'Stone Fruit': { bg: '#FED7AA', gradient: 'from-orange-100 to-amber-200', text: 'text-orange-900' },
  'Tropical Fruit': { bg: '#FEF08A', gradient: 'from-yellow-200 to-lime-200', text: 'text-yellow-900' },
  'Red Fruit': { bg: '#FECACA', gradient: 'from-red-100 to-rose-200', text: 'text-red-900' },
  'Black Fruit': { bg: '#DDD6FE', gradient: 'from-violet-200 to-purple-300', text: 'text-violet-900' },
  'Dried Fruit': { bg: '#E9D5FF', gradient: 'from-purple-100 to-fuchsia-200', text: 'text-purple-900' },
  'Floral': { bg: '#FBCFE8', gradient: 'from-pink-100 to-rose-200', text: 'text-pink-900' },
  'Herbaceous / Herbal': { bg: '#A7F3D0', gradient: 'from-emerald-200 to-teal-200', text: 'text-emerald-900' },
  'Spice (Primary)': { bg: '#FED7AA', gradient: 'from-orange-200 to-amber-300', text: 'text-orange-900' },
  'Earth': { bg: '#D6D3D1', gradient: 'from-stone-200 to-stone-300', text: 'text-stone-800' },
  'Yeast / MLF': { bg: '#FEF3C7', gradient: 'from-amber-50 to-yellow-100', text: 'text-amber-800' },
  'Oak': { bg: '#D97706', gradient: 'from-amber-500 to-orange-600', text: 'text-white' },
  'Other Winemaking': { bg: '#FDE68A', gradient: 'from-amber-200 to-yellow-300', text: 'text-amber-900' },
  'Oxidative': { bg: '#FDBA74', gradient: 'from-orange-300 to-amber-400', text: 'text-orange-900' },
  'Developed (Fruit)': { bg: '#FCA5A5', gradient: 'from-red-300 to-orange-300', text: 'text-red-900' },
  'Bottle Age (White)': { bg: '#FEF9C3', gradient: 'from-yellow-50 to-amber-100', text: 'text-yellow-900' },
  'Bottle Age (Red)': { bg: '#78716C', gradient: 'from-stone-500 to-stone-600', text: 'text-white' },
  'Cork Taint (TCA)': { bg: '#E5E5E5', gradient: 'from-neutral-200 to-neutral-300', text: 'text-neutral-800' },
  'Oxidation': { bg: '#FCD34D', gradient: 'from-amber-300 to-orange-300', text: 'text-amber-900' },
  'Reduction / Sulfides': { bg: '#BEF264', gradient: 'from-lime-200 to-lime-300', text: 'text-lime-900' },
  'Volatile Acidity': { bg: '#FCA5A5', gradient: 'from-red-200 to-red-300', text: 'text-red-900' },
  'Brettanomyces': { bg: '#D6D3D1', gradient: 'from-stone-300 to-stone-400', text: 'text-stone-800' },
  'Other Faults': { bg: '#A8A29E', gradient: 'from-stone-400 to-stone-500', text: 'text-white' },
};

// Color palette overview for the reference page - shows all subcategories with category indicators
const FlavorPaletteOverview: React.FC = () => {
  // Flatten all subcategories with their category info
  const allSubcategories = ALL_AROMA_CATEGORIES.flatMap(cat => 
    cat.subcategories.map(sub => ({
      ...sub,
      categoryName: cat.name,
      accent: CATEGORY_ACCENTS[cat.name] || 'border-l-stone-400',
      categoryInfo: CATEGORY_LABELS[cat.name],
    }))
  );

  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden mb-6">
      <div className="px-4 py-3 bg-stone-50 dark:bg-stone-700 border-b border-stone-200 dark:border-stone-600">
        <h3 className="font-semibold text-charcoal dark:text-stone-100">Flavor Families</h3>
        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
          Color-coded with category indicators: 
          <span className="inline-flex items-center gap-3 ml-2">
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-vine"></span>Primary</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-tangerine"></span>Secondary</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-grape"></span>Tertiary</span>
            <span className="inline-flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-stone-500"></span>Faults</span>
          </span>
        </p>
      </div>
      
      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {allSubcategories.map(sub => {
          const colors = SUBCATEGORY_COLORS[sub.name] || { bg: '#F5F5F4', gradient: 'from-stone-100 to-stone-200', text: 'text-stone-800' };
          return (
            <div 
              key={sub.name}
              className={`rounded-lg overflow-hidden border border-stone-200 dark:border-stone-600 border-l-4 ${sub.accent}`}
            >
              <div className={`bg-gradient-to-r ${colors.gradient} px-3 py-2 flex items-center justify-between`}>
                <span className={`text-xs font-semibold ${colors.text}`}>{sub.name}</span>
                <span className={`text-[10px] opacity-50 ${colors.text}`}>{sub.categoryInfo?.short}</span>
              </div>
              <div className="bg-white dark:bg-stone-800 px-2 py-1.5 text-[10px] text-stone-500 dark:text-stone-400">
                {sub.descriptors.length} descriptors
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const AromaReference: React.FC<Props> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const searchResults = searchQuery ? searchDescriptors(searchQuery) : [];

  // Flatten all subcategories with category info for the flat display
  const allSubcategories = ALL_AROMA_CATEGORIES.flatMap(cat => 
    cat.subcategories.map(sub => ({
      ...sub,
      categoryName: cat.name,
      accent: CATEGORY_ACCENTS[cat.name] || 'border-l-stone-400',
      categoryInfo: CATEGORY_LABELS[cat.name],
    }))
  );

  // Filter subcategories based on search
  const filteredSubcategories = searchQuery
    ? allSubcategories
        .map(sub => ({
          ...sub,
          descriptors: sub.descriptors.filter(d =>
            d.toLowerCase().includes(searchQuery.toLowerCase())
          )
        }))
        .filter(sub => sub.descriptors.length > 0)
    : allSubcategories;

  return (
    <div className="h-full flex flex-col bg-canvas-warm dark:bg-stone-900">
      {/* Header */}
      <header className="bg-charcoal text-white p-4 md:p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-serif">Aroma Guide</h1>
            <p className="text-stone-400 text-sm flex items-center gap-2">
              Wine Flavor Descriptors
              <a 
                href="https://winefolly.com/tips/wine-aroma-wheel-100-flavors/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-teal hover:text-teal/80 transition-colors inline-flex items-center gap-1"
              >
                <ExternalLink size={12} />
                Wine Folly
              </a>
            </p>
          </div>
          {onClose && (
            <button onClick={onClose} className="p-2 hover:bg-stone-800 rounded-lg transition-colors">
              <X size={24} />
            </button>
          )}
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" size={18} />
          <input
            type="text"
            placeholder="Search aromas (e.g., cherry, vanilla, leather...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-stone-800 border border-stone-700 rounded-lg text-white placeholder-stone-500 focus:ring-2 focus:ring-teal focus:border-teal transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </header>

      {/* Geometric accent bar */}
      <div className="h-1.5 flex flex-shrink-0">
        <div className="flex-1 bg-vine"></div>
        <div className="flex-1 bg-tangerine"></div>
        <div className="flex-1 bg-grape"></div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 md:p-6">
        {/* Flavor Palette Overview - only show when not searching */}
        {!searchQuery && <FlavorPaletteOverview />}

        {/* Quick search results */}
        {searchQuery && searchResults.length > 0 && (
          <div className="mb-6 p-4 bg-teal/10 border border-teal/30 rounded-lg">
            <h3 className="text-sm font-medium text-teal mb-2">Quick Results</h3>
            <div className="flex flex-wrap gap-2">
              {searchResults.map(descriptor => {
                const colors = getDescriptorColor(descriptor);
                return (
                  <span
                    key={descriptor}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium shadow-sm ${colors ? `${colors.bg} ${colors.text} border ${colors.border}` : 'bg-white dark:bg-stone-700 border border-stone-200 dark:border-stone-600 text-charcoal dark:text-stone-100'}`}
                  >
                    {descriptor}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Categories Grid - flat display with category indicators */}
        <div className="space-y-3">
          {filteredSubcategories.map(sub => {
            const colors = SUBCATEGORY_COLORS[sub.name] || { bg: '#F5F5F4', gradient: 'from-stone-100 to-stone-200', text: 'text-stone-800' };
            
            return (
              <div 
                key={sub.name} 
                className={`bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden shadow-sm border-l-4 ${sub.accent}`}
              >
                {/* Subcategory Header */}
                <div className={`px-4 py-2 flex items-center justify-between bg-gradient-to-r ${colors.gradient}`}>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold text-sm ${colors.text}`}>{sub.name}</span>
                    <span className={`text-[10px] opacity-50 ${colors.text}`}>{sub.categoryInfo?.short}</span>
                  </div>
                  <span className={`text-xs opacity-60 ${colors.text}`}>
                    {sub.descriptors.length} descriptors
                  </span>
                </div>

                {/* Descriptors */}
                <div className="p-3 flex flex-wrap gap-1.5">
                  {sub.descriptors.map(descriptor => {
                    const descriptorColors = getDescriptorColor(descriptor);
                    return (
                      <span
                        key={descriptor}
                        className={`px-2.5 py-1.5 rounded-lg text-xs cursor-default transition-colors hover:opacity-80`}
                        style={{ backgroundColor: colors.bg }}
                      >
                        <span className={colors.text}>{descriptor}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {searchQuery && filteredSubcategories.length === 0 && (
          <div className="text-center py-12 text-stone-400">
            <p>No aromas found matching "{searchQuery}"</p>
            <p className="text-sm mt-1">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AromaReference;
