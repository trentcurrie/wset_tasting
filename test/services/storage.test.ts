import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { getTastings, saveTasting, deleteTasting } from '../../services/storage';
import { TastingNote, INITIAL_TASTING_NOTE } from '../../types';

// Helper to create a mock tasting note
const createMockNote = (overrides: Partial<TastingNote> = {}): TastingNote => ({
  ...INITIAL_TASTING_NOTE,
  id: crypto.randomUUID(),
  createdAt: Date.now(),
  name: 'Test Wine',
  producer: 'Test Producer',
  ...overrides,
});

describe('storage service', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('getTastings', () => {
    it('returns empty array when localStorage is empty', () => {
      const result = getTastings();
      expect(result).toEqual([]);
    });

    it('returns empty array when stored value is null', () => {
      const result = getTastings();
      expect(result).toEqual([]);
    });

    it('returns empty array when stored value is invalid JSON', () => {
      localStorage.setItem('sommlog_tastings', 'not valid json');
      const result = getTastings();
      expect(result).toEqual([]);
    });

    it('returns parsed array of TastingNote objects', () => {
      const mockNotes = [createMockNote({ name: 'Wine 1' }), createMockNote({ name: 'Wine 2' })];
      localStorage.setItem('sommlog_tastings', JSON.stringify(mockNotes));
      
      const result = getTastings();
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Wine 1');
      expect(result[1].name).toBe('Wine 2');
    });

    it('handles localStorage.getItem throwing an error', () => {
      const originalGetItem = localStorage.getItem;
      localStorage.getItem = vi.fn(() => {
        throw new Error('Storage error');
      });
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      const result = getTastings();
      expect(result).toEqual([]);
      expect(consoleSpy).toHaveBeenCalled();
      
      // Restore
      localStorage.getItem = originalGetItem;
    });
  });

  describe('saveTasting', () => {
    it('adds new tasting to beginning of list (unshift)', () => {
      const existingNote = createMockNote({ id: 'existing', name: 'Existing Wine' });
      localStorage.setItem('sommlog_tastings', JSON.stringify([existingNote]));
      
      const newNote = createMockNote({ id: 'new', name: 'New Wine' });
      saveTasting(newNote);
      
      const stored = JSON.parse(localStorage.getItem('sommlog_tastings') || '[]');
      expect(stored).toHaveLength(2);
      expect(stored[0].id).toBe('new');
      expect(stored[1].id).toBe('existing');
    });

    it('updates existing tasting when id matches', () => {
      const note = createMockNote({ id: 'test-id', name: 'Original Name' });
      localStorage.setItem('sommlog_tastings', JSON.stringify([note]));
      
      const updatedNote = { ...note, name: 'Updated Name' };
      saveTasting(updatedNote);
      
      const stored = JSON.parse(localStorage.getItem('sommlog_tastings') || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].name).toBe('Updated Name');
    });

    it('preserves order of other tastings when updating', () => {
      const notes = [
        createMockNote({ id: '1', name: 'First' }),
        createMockNote({ id: '2', name: 'Second' }),
        createMockNote({ id: '3', name: 'Third' }),
      ];
      localStorage.setItem('sommlog_tastings', JSON.stringify(notes));
      
      const updatedNote = { ...notes[1], name: 'Updated Second' };
      saveTasting(updatedNote);
      
      const stored = JSON.parse(localStorage.getItem('sommlog_tastings') || '[]');
      expect(stored[0].id).toBe('1');
      expect(stored[1].name).toBe('Updated Second');
      expect(stored[2].id).toBe('3');
    });

    it('handles empty existing tastings array', () => {
      const newNote = createMockNote({ id: 'first', name: 'First Wine' });
      saveTasting(newNote);
      
      const stored = JSON.parse(localStorage.getItem('sommlog_tastings') || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].name).toBe('First Wine');
    });
  });

  describe('deleteTasting', () => {
    it('removes tasting with matching id', () => {
      const notes = [
        createMockNote({ id: 'keep', name: 'Keep' }),
        createMockNote({ id: 'delete', name: 'Delete' }),
      ];
      localStorage.setItem('sommlog_tastings', JSON.stringify(notes));
      
      deleteTasting('delete');
      
      const stored = JSON.parse(localStorage.getItem('sommlog_tastings') || '[]');
      expect(stored).toHaveLength(1);
      expect(stored[0].id).toBe('keep');
    });

    it('preserves other tastings when deleting', () => {
      const notes = [
        createMockNote({ id: '1', name: 'First' }),
        createMockNote({ id: '2', name: 'Second' }),
        createMockNote({ id: '3', name: 'Third' }),
      ];
      localStorage.setItem('sommlog_tastings', JSON.stringify(notes));
      
      deleteTasting('2');
      
      const stored = JSON.parse(localStorage.getItem('sommlog_tastings') || '[]');
      expect(stored).toHaveLength(2);
      expect(stored.map((n: TastingNote) => n.id)).toEqual(['1', '3']);
    });

    it('handles deletion of non-existent id gracefully', () => {
      const notes = [createMockNote({ id: 'existing', name: 'Existing' })];
      localStorage.setItem('sommlog_tastings', JSON.stringify(notes));
      
      // Should not throw
      deleteTasting('non-existent');
      
      const stored = JSON.parse(localStorage.getItem('sommlog_tastings') || '[]');
      expect(stored).toHaveLength(1);
    });

    it('updates localStorage after deletion', () => {
      const notes = [createMockNote({ id: 'test', name: 'Test' })];
      localStorage.setItem('sommlog_tastings', JSON.stringify(notes));
      
      deleteTasting('test');
      
      const stored = JSON.parse(localStorage.getItem('sommlog_tastings') || '[]');
      expect(stored).toEqual([]);
    });
  });
});
