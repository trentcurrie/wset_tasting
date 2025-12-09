/**
 * WSET tasting scale conversion utilities
 * Converts WSET qualitative descriptors to numeric values for charting
 */

const SCALE_MAP: Record<string, number> = {
  // Low intensity
  "Low": 1,
  "Light": 1,
  "Dry": 1,
  "Short": 1,
  "Pale": 1,
  "Poor": 1,
  
  // Medium-low
  "Medium(-)": 2,
  "Off-Dry": 2,
  "Medium-Dry": 2,
  
  // Medium
  "Medium": 3,
  "Medium-Sweet": 3,
  "Acceptable": 3,
  "Good": 3,
  
  // Medium-high
  "Medium(+)": 4,
  "Sweet": 4,
  "Very Good": 4,
  
  // High intensity
  "High": 5,
  "Full": 5,
  "Long": 5,
  "Pronounced": 5,
  "Luscious": 5,
  "Outstanding": 5,
  "Deep": 5,
};

/**
 * Convert a WSET scale string to a numeric value (1-5)
 * @param value - The WSET scale descriptor (e.g., "Medium(+)", "High", "Dry")
 * @returns Numeric value from 1-5, defaults to 3 for unknown values
 */
export const scaleToNum = (value: string): number => {
  return SCALE_MAP[value] ?? 3;
};

/**
 * Convert numeric value back to a general descriptor
 * Useful for display purposes
 */
export const numToScale = (num: number): string => {
  if (num <= 1) return 'Low';
  if (num <= 2) return 'Medium(-)';
  if (num <= 3) return 'Medium';
  if (num <= 4) return 'Medium(+)';
  return 'High';
};

/**
 * Calculate average of WSET scale values
 */
export const averageScaleValues = (values: string[]): number => {
  if (values.length === 0) return 3;
  const sum = values.reduce((acc, val) => acc + scaleToNum(val), 0);
  return parseFloat((sum / values.length).toFixed(1));
};

/**
 * Format a number for display with specified decimal places
 */
export const formatNumber = (num: number, decimals: number = 1): string => {
  return num.toFixed(decimals);
};
