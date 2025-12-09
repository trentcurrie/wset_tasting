import { describe, it, expect } from 'vitest';
import { 
  scaleToNum, 
  numToScale, 
  averageScaleValues, 
  formatNumber 
} from '../../utils/tastingHelpers';

describe('tastingHelpers', () => {
  describe('scaleToNum', () => {
    it('converts low intensity values to 1', () => {
      expect(scaleToNum('Low')).toBe(1);
      expect(scaleToNum('Light')).toBe(1);
      expect(scaleToNum('Dry')).toBe(1);
      expect(scaleToNum('Short')).toBe(1);
      expect(scaleToNum('Pale')).toBe(1);
      expect(scaleToNum('Poor')).toBe(1);
    });

    it('converts medium-low values to 2', () => {
      expect(scaleToNum('Medium(-)')).toBe(2);
      expect(scaleToNum('Off-Dry')).toBe(2);
      expect(scaleToNum('Medium-Dry')).toBe(2);
    });

    it('converts medium values to 3', () => {
      expect(scaleToNum('Medium')).toBe(3);
      expect(scaleToNum('Medium-Sweet')).toBe(3);
      expect(scaleToNum('Acceptable')).toBe(3);
      expect(scaleToNum('Good')).toBe(3);
    });

    it('converts medium-high values to 4', () => {
      expect(scaleToNum('Medium(+)')).toBe(4);
      expect(scaleToNum('Sweet')).toBe(4);
      expect(scaleToNum('Very Good')).toBe(4);
    });

    it('converts high intensity values to 5', () => {
      expect(scaleToNum('High')).toBe(5);
      expect(scaleToNum('Full')).toBe(5);
      expect(scaleToNum('Long')).toBe(5);
      expect(scaleToNum('Pronounced')).toBe(5);
      expect(scaleToNum('Luscious')).toBe(5);
      expect(scaleToNum('Outstanding')).toBe(5);
      expect(scaleToNum('Deep')).toBe(5);
    });

    it('returns 3 for unknown values', () => {
      expect(scaleToNum('Unknown')).toBe(3);
      expect(scaleToNum('')).toBe(3);
      expect(scaleToNum('InvalidValue')).toBe(3);
    });
  });

  describe('numToScale', () => {
    it('converts 1 to Low', () => {
      expect(numToScale(1)).toBe('Low');
      expect(numToScale(0.5)).toBe('Low');
    });

    it('converts 2 to Medium(-)', () => {
      expect(numToScale(2)).toBe('Medium(-)');
      expect(numToScale(1.5)).toBe('Medium(-)');
    });

    it('converts 3 to Medium', () => {
      expect(numToScale(3)).toBe('Medium');
      expect(numToScale(2.5)).toBe('Medium');
    });

    it('converts 4 to Medium(+)', () => {
      expect(numToScale(4)).toBe('Medium(+)');
      expect(numToScale(3.5)).toBe('Medium(+)');
    });

    it('converts 5 to High', () => {
      expect(numToScale(5)).toBe('High');
      expect(numToScale(4.5)).toBe('High');
    });
  });

  describe('averageScaleValues', () => {
    it('returns 3 for empty array', () => {
      expect(averageScaleValues([])).toBe(3);
    });

    it('calculates average of single value', () => {
      expect(averageScaleValues(['High'])).toBe(5);
      expect(averageScaleValues(['Low'])).toBe(1);
    });

    it('calculates average of multiple values', () => {
      expect(averageScaleValues(['Low', 'High'])).toBe(3); // (1 + 5) / 2
      expect(averageScaleValues(['Medium', 'Medium', 'Medium'])).toBe(3);
    });

    it('rounds to one decimal place', () => {
      // (1 + 2 + 5) / 3 = 2.666...
      expect(averageScaleValues(['Low', 'Medium(-)', 'High'])).toBe(2.7);
    });
  });

  describe('formatNumber', () => {
    it('formats to 1 decimal place by default', () => {
      expect(formatNumber(3.456)).toBe('3.5');
      expect(formatNumber(3)).toBe('3.0');
    });

    it('formats to specified decimal places', () => {
      expect(formatNumber(3.456, 2)).toBe('3.46');
      expect(formatNumber(3.456, 0)).toBe('3');
    });
  });
});
