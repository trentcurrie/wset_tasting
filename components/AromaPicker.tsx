import React, { useState, useMemo } from 'react';
import { ALL_AROMA_CATEGORIES, getDescriptorColor } from '../constants/aromas';
import { X, Check, Search } from 'lucide-react';

interface Props {
  selectedAromas: string[];
  onChange: (aromas: string[]) => void;
  onClose?: () => void;
}

// Beautiful gradient-friendly colors for each subcategory
const PALETTE_COLORS: Record<string, { bg: string; gradient: string; text: string }> = {
  // Fruits - warm spectrum
  'Citrus Fruit': { bg: '#FEF3C7', gradient: 'from-amber-100 to-yellow-200', text: 'text-amber-900' },
  'Green Fruit': { bg: '#D1FAE5', gradient: 'from-emerald-100 to-green-200', text: 'text-emerald-900' },
  'Stone Fruit': { bg: '#FED7AA', gradient: 'from-orange-100 to-amber-200', text: 'text-orange-900' },
  'Tropical Fruit': { bg: '#FEF08A', gradient: 'from-yellow-200 to-lime-200', text: 'text-yellow-900' },
  'Red Fruit': { bg: '#FECACA', gradient: 'from-red-100 to-rose-200', text: 'text-red-900' },
  'Black Fruit': { bg: '#DDD6FE', gradient: 'from-violet-200 to-purple-300', text: 'text-violet-900' },
  'Dried Fruit': { bg: '#E9D5FF', gradient: 'from-purple-100 to-fuchsia-200', text: 'text-purple-900' },
  // Floral & Herbal
  'Floral': { bg: '#FBCFE8', gradient: 'from-pink-100 to-rose-200', text: 'text-pink-900' },
  'Herbaceous / Herbal': { bg: '#A7F3D0', gradient: 'from-emerald-200 to-teal-200', text: 'text-emerald-900' },
  // Earth & Spice
  'Spice (Primary)': { bg: '#FED7AA', gradient: 'from-orange-200 to-amber-300', text: 'text-orange-900' },
  'Earth': { bg: '#D6D3D1', gradient: 'from-stone-200 to-stone-300', text: 'text-stone-800' },
  // Secondary
  'Yeast / MLF': { bg: '#FEF3C7', gradient: 'from-amber-50 to-yellow-100', text: 'text-amber-800' },
  'Oak': { bg: '#D97706', gradient: 'from-amber-500 to-orange-600', text: 'text-white' },
  'Other Winemaking': { bg: '#FDE68A', gradient: 'from-amber-200 to-yellow-300', text: 'text-amber-900' },
  // Tertiary
  'Oxidative': { bg: '#FDBA74', gradient: 'from-orange-300 to-amber-400', text: 'text-orange-900' },
  'Developed (Fruit)': { bg: '#FCA5A5', gradient: 'from-red-300 to-orange-300', text: 'text-red-900' },
  'Bottle Age (White)': { bg: '#FEF9C3', gradient: 'from-yellow-50 to-amber-100', text: 'text-yellow-900' },
  'Bottle Age (Red)': { bg: '#78716C', gradient: 'from-stone-500 to-stone-600', text: 'text-white' },
  // Faults
  'Cork Taint (TCA)': { bg: '#E5E5E5', gradient: 'from-neutral-200 to-neutral-300', text: 'text-neutral-800' },
  'Oxidation': { bg: '#FCD34D', gradient: 'from-amber-300 to-orange-300', text: 'text-amber-900' },
  'Reduction / Sulfides': { bg: '#BEF264', gradient: 'from-lime-200 to-lime-300', text: 'text-lime-900' },
  'Volatile Acidity': { bg: '#FCA5A5', gradient: 'from-red-200 to-red-300', text: 'text-red-900' },
  'Brettanomyces': { bg: '#D6D3D1', gradient: 'from-stone-300 to-stone-400', text: 'text-stone-800' },
  'Other Faults': { bg: '#A8A29E', gradient: 'from-stone-400 to-stone-500', text: 'text-white' },
};

// Category accent colors (left border)
const CATEGORY_ACCENTS: Record<string, string> = {
  'Primary (Grape-Derived)': 'border-l-vine',
  'Secondary (Winemaking)': 'border-l-tangerine',
  'Tertiary (Aging)': 'border-l-grape',
  'Faults / Off-Aromas': 'border-l-stone-500',
};

const CATEGORY_LABELS: Record<string, string> = {
  'Primary (Grape-Derived)': '1°',
  'Secondary (Winemaking)': '2°',
  'Tertiary (Aging)': '3°',
  'Faults / Off-Aromas': '!',
};

export const AromaPicker: React.FC<Props> = ({ selectedAromas, onChange, onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const toggleAroma = (aroma: string) => {
    if (selectedAromas.includes(aroma)) {
      onChange(selectedAromas.filter(a => a !== aroma));
    } else {
      onChange([...selectedAromas, aroma]);
    }
  };

  const filteredResults = useMemo(() => {
    if (!searchQuery.trim()) return null;
    const query = searchQuery.toLowerCase();
    const results: { descriptor: string; subcategory: string }[] = [];
    for (const category of ALL_AROMA_CATEGORIES) {
      for (const sub of category.subcategories) {
        for (const desc of sub.descriptors) {
          if (desc.toLowerCase().includes(query)) {
            results.push({ descriptor: desc, subcategory: sub.name });
          }
        }
      }
    }
    return results.slice(0, 24);
  }, [searchQuery]);

  // Flatten all subcategories with their category info
  const allSubcategories = useMemo(() => {
    return ALL_AROMA_CATEGORIES.flatMap(cat => 
      cat.subcategories.map(sub => ({
        ...sub,
        categoryName: cat.name,
        accent: CATEGORY_ACCENTS[cat.name] || 'border-l-stone-400',
        label: CATEGORY_LABELS[cat.name] || '',
      }))
    );
  }, []);

  const getChipStyle = (descriptor: string) => {
    const colors = getDescriptorColor(descriptor);
    return colors ? `${colors.bg} ${colors.text} border ${colors.border}` : 'bg-stone-100 dark:bg-stone-700 text-charcoal dark:text-stone-100 border border-stone-200 dark:border-stone-600';
  };

  return (
    <div className="bg-white dark:bg-stone-800 rounded-xl overflow-hidden flex flex-col h-[85vh] max-h-[700px]">
      {/* Header */}
      <div className="bg-charcoal p-3 flex items-center justify-between text-white shrink-0">
        <h3 className="font-medium text-sm">Flavor Palette</h3>
        {onClose && (
          <button onClick={onClose} className="p-1 hover:bg-stone-700 rounded transition-colors">
            <X size={18} />
          </button>
        )}
      </div>

      {/* Search */}
      <div className="p-3 border-b border-stone-200 dark:border-stone-700 shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 h-4 w-4" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search flavors..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-stone-200 dark:border-stone-600 rounded-lg bg-white dark:bg-stone-700 text-charcoal dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
          />
        </div>
      </div>

      {/* Selected Pills */}
      {selectedAromas.length > 0 && (
        <div className="px-3 py-2 border-b border-stone-200 dark:border-stone-700 flex flex-wrap gap-1.5 max-h-20 overflow-y-auto shrink-0">
          {selectedAromas.map((aroma) => (
            <button key={aroma} onClick={() => toggleAroma(aroma)} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${getChipStyle(aroma)} hover:opacity-80 transition-opacity`}>
              {aroma}<X size={12} />
            </button>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Search Results */}
        {filteredResults && (
          <div className="p-3">
            {filteredResults.length === 0 ? (
              <p className="text-center text-stone-400 py-8 text-sm">No flavors found</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {filteredResults.map(({ descriptor, subcategory }) => {
                  const isSelected = selectedAromas.includes(descriptor);
                  const palette = PALETTE_COLORS[subcategory] || { bg: '#F5F5F4', gradient: 'from-stone-100 to-stone-200', text: 'text-stone-800' };
                  
                  return (
                    <button
                      key={descriptor}
                      onClick={() => toggleAroma(descriptor)}
                      className={`relative p-3 rounded-xl text-left transition-all ${
                        isSelected 
                          ? 'ring-2 ring-vine ring-offset-2 scale-[1.02]' 
                          : 'hover:scale-[1.02] active:scale-[0.98]'
                      }`}
                      style={{ backgroundColor: palette.bg }}
                    >
                      <span className={`text-sm font-medium block ${palette.text}`}>{descriptor}</span>
                      <span className={`text-[10px] opacity-60 ${palette.text}`}>{subcategory}</span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-vine rounded-full flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* All Flavor Categories */}
        {!filteredResults && (
          <div className="p-3 space-y-3">
            {allSubcategories.map((sub) => {
              const palette = PALETTE_COLORS[sub.name] || { bg: '#F5F5F4', gradient: 'from-stone-100 to-stone-200', text: 'text-stone-800' };
              const selectedInSub = sub.descriptors.filter(d => selectedAromas.includes(d)).length;
              
              return (
                <div key={sub.name} className={`rounded-xl overflow-hidden border border-stone-200 dark:border-stone-700 border-l-4 ${sub.accent}`}>
                  {/* Subcategory Header */}
                  <div className={`px-3 py-2 flex items-center justify-between bg-gradient-to-r ${palette.gradient}`}>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold text-sm ${palette.text}`}>{sub.name}</span>
                      <span className={`text-[10px] opacity-50 ${palette.text}`}>{sub.label}</span>
                    </div>
                    {selectedInSub > 0 && (
                      <span className="px-2 py-0.5 bg-vine text-white text-xs rounded-full font-medium">
                        {selectedInSub}
                      </span>
                    )}
                  </div>
                  
                  {/* Flavor Chips */}
                  <div className="p-2 bg-white dark:bg-stone-800 flex flex-wrap gap-1.5">
                    {sub.descriptors.map((descriptor) => {
                      const isSelected = selectedAromas.includes(descriptor);
                      
                      return (
                        <button
                          key={descriptor}
                          onClick={() => toggleAroma(descriptor)}
                          className={`inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                            isSelected
                              ? 'bg-vine text-white shadow-sm'
                              : 'hover:scale-105 active:scale-95'
                          }`}
                          style={!isSelected ? { backgroundColor: palette.bg } : undefined}
                        >
                          {isSelected && <Check size={12} />}
                          <span className={isSelected ? '' : palette.text}>{descriptor}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-700 flex justify-between items-center shrink-0">
        <span className="text-sm text-stone-500 dark:text-stone-400">{selectedAromas.length} selected</span>
        {onClose && (
          <button onClick={onClose} className="px-4 py-1.5 bg-vine text-white rounded-lg text-sm font-medium hover:bg-vine/90 transition-colors">Done</button>
        )}
      </div>
    </div>
  );
};
