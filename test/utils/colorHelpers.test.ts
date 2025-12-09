import { describe, it, expect } from 'vitest';
import { 
  getWineColorVars, 
  getQualityColor, 
  getQualityInitial 
} from '../../utils/colorHelpers';

describe('colorHelpers', () => {
  describe('getWineColorVars', () => {
    it('returns red wine CSS variables', () => {
      const result = getWineColorVars('Red');
      expect(result.background).toBe('var(--color-wine-red-bg)');
      expect(result.text).toBe('var(--color-wine-red)');
      expect(result.border).toBe('var(--color-wine-red-border)');
    });

    it('returns white wine CSS variables', () => {
      const result = getWineColorVars('White');
      expect(result.background).toBe('var(--color-wine-white-bg)');
      expect(result.text).toBe('var(--color-wine-white)');
      expect(result.border).toBe('var(--color-wine-white-border)');
    });

    it('returns rosé wine CSS variables', () => {
      const result = getWineColorVars('Rose');
      expect(result.background).toBe('var(--color-wine-rose-bg)');
      expect(result.text).toBe('var(--color-wine-rose)');
      expect(result.border).toBe('var(--color-wine-rose-border)');
    });

    it('returns default variables for unknown category', () => {
      // @ts-expect-error Testing invalid input
      const result = getWineColorVars('Unknown');
      expect(result.background).toBe('var(--bg-tertiary)');
      expect(result.text).toBe('var(--text-secondary)');
      expect(result.border).toBe('var(--border-light)');
    });
  });

  describe('getQualityColor', () => {
    it('returns purple for Outstanding', () => {
      expect(getQualityColor('Outstanding')).toBe('var(--color-quality-outstanding)');
    });

    it('returns green for Very Good', () => {
      expect(getQualityColor('Very Good')).toBe('var(--color-quality-verygood)');
    });

    it('returns teal for Good', () => {
      expect(getQualityColor('Good')).toBe('var(--color-quality-good)');
    });

    it('returns yellow for Acceptable', () => {
      expect(getQualityColor('Acceptable')).toBe('var(--color-quality-acceptable)');
    });

    it('returns gray for Poor', () => {
      expect(getQualityColor('Poor')).toBe('var(--color-quality-poor)');
    });
  });

  describe('getQualityInitial', () => {
    it('returns abbreviation for quality levels', () => {
      expect(getQualityInitial('Outstanding')).toBe('O');
      expect(getQualityInitial('Very Good')).toBe('VG');
      expect(getQualityInitial('Good')).toBe('G');
      expect(getQualityInitial('Acceptable')).toBe('A');
      expect(getQualityInitial('Poor')).toBe('P');
    });
  });
});
