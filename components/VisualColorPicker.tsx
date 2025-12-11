import React from 'react';
import { ColorWhite, ColorRose, ColorRed, WineColor } from '../types';
import { Check } from 'lucide-react';

interface Props {
  colorCategory: 'White' | 'Rose' | 'Red';
  selectedColor: WineColor;
  onCategoryChange: (category: 'White' | 'Rose' | 'Red') => void;
  onColorChange: (color: WineColor) => void;
}

interface ColorData {
  hex: string;
  gradient: string;
  description: string;
}

// Realistic wine color hex values
const WINE_COLORS: {
  White: Record<ColorWhite, ColorData>;
  Rose: Record<ColorRose, ColorData>;
  Red: Record<ColorRed, ColorData>;
} = {
  White: {
    'Lemon-Green': { 
      hex: '#E8F5C8', 
      gradient: 'linear-gradient(135deg, #E8F5C8 0%, #D4E8A8 50%, #C5DB8F 100%)',
      description: 'Young, cool climate'
    },
    'Lemon': { 
      hex: '#F5E6A3', 
      gradient: 'linear-gradient(135deg, #F8EDB8 0%, #F5E6A3 50%, #E8D68A 100%)',
      description: 'Classic white'
    },
    'Gold': { 
      hex: '#E8C864', 
      gradient: 'linear-gradient(135deg, #F0D880 0%, #E8C864 50%, #D4B44C 100%)',
      description: 'Oak-aged, richer'
    },
    'Amber': { 
      hex: '#D4A050', 
      gradient: 'linear-gradient(135deg, #E0B068 0%, #D4A050 50%, #C08838 100%)',
      description: 'Mature, oxidative'
    },
    'Brown': { 
      hex: '#A67C50', 
      gradient: 'linear-gradient(135deg, #B88C60 0%, #A67C50 50%, #8C6440 100%)',
      description: 'Very mature'
    },
  },
  
  Rose: {
    'Pink': { 
      hex: '#FFCCD5', 
      gradient: 'linear-gradient(135deg, #FFD9E0 0%, #FFCCD5 50%, #FFB8C5 100%)',
      description: 'Pale, Provence style'
    },
    'Salmon': { 
      hex: '#F5A98C', 
      gradient: 'linear-gradient(135deg, #FFB89C 0%, #F5A98C 50%, #E89578 100%)',
      description: 'Classic rosé'
    },
    'Orange': { 
      hex: '#E88C64', 
      gradient: 'linear-gradient(135deg, #F5A078 0%, #E88C64 50%, #D47850 100%)',
      description: 'Deep, skin contact'
    },
  },
  
  Red: {
    'Purple': { 
      hex: '#6B2D5B', 
      gradient: 'linear-gradient(135deg, #7C3D6B 0%, #6B2D5B 50%, #5A1D4A 100%)',
      description: 'Very young'
    },
    'Ruby': { 
      hex: '#9B2335', 
      gradient: 'linear-gradient(135deg, #B03345 0%, #9B2335 50%, #861828 100%)',
      description: 'Young to medium'
    },
    'Garnet': { 
      hex: '#733635', 
      gradient: 'linear-gradient(135deg, #864545 0%, #733635 50%, #602828 100%)',
      description: 'Medium maturity'
    },
    'Tawny': { 
      hex: '#8B4726', 
      gradient: 'linear-gradient(135deg, #A05830 0%, #8B4726 50%, #76381C 100%)',
      description: 'Mature, oxidative'
    },
    'Brown': { 
      hex: '#5C3A28', 
      gradient: 'linear-gradient(135deg, #704A38 0%, #5C3A28 50%, #482C1C 100%)',
      description: 'Very mature'
    },
  },
};

const CATEGORY_SWATCHES = {
  White: '#F5E6A3',
  Rose: '#FFCCD5',
  Red: '#9B2335',
};

// Helper to get color data for the selected color in the current category
const getSelectedColorData = (category: 'White' | 'Rose' | 'Red', color: WineColor): ColorData | undefined => {
  const categoryColors = WINE_COLORS[category];
  return (categoryColors as Record<string, ColorData>)[color];
};

export const VisualColorPicker: React.FC<Props> = ({
  colorCategory,
  selectedColor,
  onCategoryChange,
  onColorChange,
}) => {
  const colors = WINE_COLORS[colorCategory];

  return (
    <div className="space-y-4">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">
          Wine Type
        </label>
        <div className="flex gap-2">
          {(['White', 'Rose', 'Red'] as const).map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onCategoryChange(cat)}
              className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all duration-200 flex items-center justify-center gap-2 ${
                colorCategory === cat
                  ? 'border-charcoal dark:border-stone-300 shadow-md scale-105'
                  : 'border-stone-200 dark:border-stone-600 hover:border-stone-300 dark:hover:border-stone-500'
              }`}
            >
              <div 
                className="w-6 h-6 rounded-full shadow-inner border border-black/10"
                style={{ backgroundColor: CATEGORY_SWATCHES[cat] }}
              />
              <span className={`text-sm font-medium ${colorCategory === cat ? 'text-charcoal dark:text-stone-100' : 'text-stone-500 dark:text-stone-400'}`}>
                {cat === 'Rose' ? 'Rosé' : cat}
              </span>
              {colorCategory === cat && <Check size={16} className="text-vine" />}
            </button>
          ))}
        </div>
      </div>

      {/* Color Hue Selection - Visual Swatches */}
      <div>
        <label className="block text-sm font-medium text-stone-600 dark:text-stone-400 mb-2">
          Color Hue
        </label>
        <div className="grid grid-cols-5 gap-2 sm:gap-3">
          {Object.entries(colors).map(([color, data]) => {
            const isSelected = selectedColor === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => onColorChange(color as WineColor)}
                className={`group relative aspect-square rounded-xl transition-all duration-200 overflow-hidden ${
                  isSelected 
                    ? 'ring-2 ring-charcoal dark:ring-white ring-offset-2 ring-offset-white dark:ring-offset-stone-800 scale-105 shadow-lg' 
                    : 'hover:scale-105 hover:shadow-md'
                }`}
                title={`${color}: ${data.description}`}
              >
                {/* Wine glass shape with color */}
                <div 
                  className="absolute inset-0 rounded-xl"
                  style={{ background: data.gradient }}
                />
                
                {/* Glass reflection effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent rounded-xl" />
                
                {/* Selection checkmark */}
                {isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
                    <div className="bg-white rounded-full p-1 shadow-lg">
                      <Check size={14} className="text-charcoal" />
                    </div>
                  </div>
                )}
                
                {/* Label on hover/selected */}
                <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-1.5 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                  <span className="text-white text-[10px] sm:text-xs font-medium leading-tight block text-center truncate">
                    {color}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
        
        {/* Selected color description */}
        {(() => {
          const selectedColorData = getSelectedColorData(colorCategory, selectedColor);
          return selectedColorData ? (
            <div className="mt-3 text-center">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-100 dark:bg-stone-700 rounded-full text-sm">
                <div 
                  className="w-4 h-4 rounded-full border border-black/10"
                  style={{ backgroundColor: selectedColorData.hex }}
                />
                <span className="font-medium text-charcoal dark:text-stone-100">{selectedColor}</span>
                <span className="text-stone-500 dark:text-stone-400">—</span>
                <span className="text-stone-500 dark:text-stone-400 text-xs">
                  {selectedColorData.description}
                </span>
              </span>
            </div>
          ) : null;
        })()}
      </div>
    </div>
  );
};
