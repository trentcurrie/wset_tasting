import { QualityLevel } from '../types';

/**
 * Wine color category styling utilities
 * Returns CSS class strings for wine type badges
 */

export type WineColorCategory = 'Red' | 'White' | 'Rose';

export interface ColorClassResult {
  background: string;
  text: string;
  border: string;
}

/**
 * Get CSS custom property values for wine color category
 */
export const getWineColorVars = (category: WineColorCategory): ColorClassResult => {
  switch (category) {
    case 'Red':
      return {
        background: 'var(--color-wine-red-bg)',
        text: 'var(--color-wine-red)',
        border: 'var(--color-wine-red-border)',
      };
    case 'White':
      return {
        background: 'var(--color-wine-white-bg)',
        text: 'var(--color-wine-white)',
        border: 'var(--color-wine-white-border)',
      };
    case 'Rose':
      return {
        background: 'var(--color-wine-rose-bg)',
        text: 'var(--color-wine-rose)',
        border: 'var(--color-wine-rose-border)',
      };
    default:
      return {
        background: 'var(--bg-tertiary)',
        text: 'var(--text-secondary)',
        border: 'var(--border-light)',
      };
  }
};

/**
 * Get quality badge color as CSS custom property
 */
export const getQualityColor = (quality: QualityLevel): string => {
  switch (quality) {
    case 'Outstanding':
      return 'var(--color-quality-outstanding)';
    case 'Very Good':
      return 'var(--color-quality-verygood)';
    case 'Good':
      return 'var(--color-quality-good)';
    case 'Acceptable':
      return 'var(--color-quality-acceptable)';
    case 'Poor':
    default:
      return 'var(--color-quality-poor)';
  }
};

/**
 * Get quality badge abbreviation
 */
export const getQualityInitial = (quality: QualityLevel): string => {
  switch (quality) {
    case 'Outstanding': return 'O';
    case 'Very Good': return 'VG';
    case 'Good': return 'G';
    case 'Acceptable': return 'A';
    case 'Poor': return 'P';
    default: return '?';
  }
};
