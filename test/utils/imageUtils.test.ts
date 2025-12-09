import { describe, it, expect } from 'vitest';
import { isValidImageFile, formatFileSize } from '../../utils/imageUtils';

describe('imageUtils', () => {
  describe('isValidImageFile', () => {
    it('returns true for image files', () => {
      const jpegFile = new File([''], 'test.jpg', { type: 'image/jpeg' });
      const pngFile = new File([''], 'test.png', { type: 'image/png' });
      const gifFile = new File([''], 'test.gif', { type: 'image/gif' });
      const webpFile = new File([''], 'test.webp', { type: 'image/webp' });

      expect(isValidImageFile(jpegFile)).toBe(true);
      expect(isValidImageFile(pngFile)).toBe(true);
      expect(isValidImageFile(gifFile)).toBe(true);
      expect(isValidImageFile(webpFile)).toBe(true);
    });

    it('returns false for non-image files', () => {
      const pdfFile = new File([''], 'test.pdf', { type: 'application/pdf' });
      const textFile = new File([''], 'test.txt', { type: 'text/plain' });
      const jsonFile = new File([''], 'test.json', { type: 'application/json' });

      expect(isValidImageFile(pdfFile)).toBe(false);
      expect(isValidImageFile(textFile)).toBe(false);
      expect(isValidImageFile(jsonFile)).toBe(false);
    });
  });

  describe('formatFileSize', () => {
    it('formats 0 bytes correctly', () => {
      expect(formatFileSize(0)).toBe('0 Bytes');
    });

    it('formats bytes correctly', () => {
      expect(formatFileSize(500)).toBe('500 Bytes');
    });

    it('formats kilobytes correctly', () => {
      expect(formatFileSize(1024)).toBe('1 KB');
      expect(formatFileSize(1536)).toBe('1.5 KB');
    });

    it('formats megabytes correctly', () => {
      expect(formatFileSize(1048576)).toBe('1 MB');
      expect(formatFileSize(2621440)).toBe('2.5 MB');
    });

    it('formats gigabytes correctly', () => {
      expect(formatFileSize(1073741824)).toBe('1 GB');
    });
  });

  // Note: compressImage is harder to test due to canvas/image dependencies
  // It would require mocking canvas context, Image constructor, and FileReader
  // Consider integration tests for full image compression flow
});
