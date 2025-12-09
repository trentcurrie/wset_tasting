import React, { useState } from 'react';
import { Search, X, Leaf, Beaker, Clock } from 'lucide-react';
import { ALL_AROMA_CATEGORIES, searchDescriptors, getDescriptorColor } from '../constants/wsatAromas';

interface Props {
  onClose?: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'Primary (Grape-Derived)': <Leaf size={18} />,
  'Secondary (Winemaking)': <Beaker size={18} />,
  'Tertiary (Aging)': <Clock size={18} />,
};

const categoryColors: Record<string, string> = {
  'Primary (Grape-Derived)': 'bg-vine text-white',
  'Secondary (Winemaking)': 'bg-tangerine text-white',
  'Tertiary (Aging)': 'bg-grape text-white',
};

export const AromaReference: React.FC<Props> = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(
    ALL_AROMA_CATEGORIES.map(c => c.name)
  );

  const searchResults = searchQuery ? searchDescriptors(searchQuery) : [];

  const toggleCategory = (name: string) => {
    setExpandedCategories(prev =>
      prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]
    );
  };

  const filteredCategories = searchQuery
    ? ALL_AROMA_CATEGORIES.map(cat => ({
        ...cat,
        subcategories: cat.subcategories
          .map(sub => ({
            ...sub,
            descriptors: sub.descriptors.filter(d =>
              d.toLowerCase().includes(searchQuery.toLowerCase())
            )
          }))
          .filter(sub => sub.descriptors.length > 0)
      })).filter(cat => cat.subcategories.length > 0)
    : ALL_AROMA_CATEGORIES;

  return (
    <div className="h-full flex flex-col bg-canvas-warm dark:bg-stone-900">
      {/* Header */}
      <header className="bg-charcoal text-white p-4 md:p-6 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-serif">WSET Aroma Guide</h1>
            <p className="text-stone-400 text-sm">Systematic Approach to Tasting Descriptors</p>
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

        {/* Categories Grid */}
        <div className="space-y-6">
          {filteredCategories.map(category => (
            <div key={category.name} className="bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 overflow-hidden shadow-sm">
              {/* Category Header */}
              <button
                onClick={() => toggleCategory(category.name)}
                className={`w-full px-4 py-3 flex items-center gap-3 ${categoryColors[category.name]} transition-colors`}
              >
                {categoryIcons[category.name]}
                <span className="font-semibold flex-1 text-left">{category.name}</span>
                <span className="text-sm opacity-75">
                  {category.subcategories.reduce((acc, sub) => acc + sub.descriptors.length, 0)} descriptors
                </span>
              </button>

              {/* Subcategories */}
              {expandedCategories.includes(category.name) && (
                <div className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {category.subcategories.map(sub => {
                    return (
                      <div key={sub.name} className="space-y-2">
                        <h4 className="font-medium text-charcoal dark:text-stone-100 text-sm border-b border-stone-200 dark:border-stone-600 pb-1">
                          {sub.name}
                        </h4>
                        <div className="flex flex-wrap gap-1.5">
                          {sub.descriptors.map(descriptor => {
                            const colors = getDescriptorColor(descriptor);
                            return (
                              <span
                                key={descriptor}
                                className={`px-2 py-1 rounded text-xs cursor-default transition-colors hover:opacity-80 ${colors ? `${colors.bg} ${colors.text} border ${colors.border}` : 'bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-300'}`}
                              >
                                {descriptor}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty state */}
        {searchQuery && filteredCategories.length === 0 && (
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
