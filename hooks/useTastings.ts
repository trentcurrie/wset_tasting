import { useState, useEffect, useCallback, useMemo } from 'react';
import { TastingNote } from '../types';
import { getTastings, saveTasting, deleteTasting } from '../services/storage';
import { SAMPLE_TASTINGS } from '../constants/sampleTastings';

export type FilterCategory = 'All' | 'Red' | 'White' | 'Rose';

interface UseTastingsOptions {
  initialFilter?: FilterCategory;
  initialSearch?: string;
}

interface UseTastingsReturn {
  // Data
  tastings: TastingNote[];
  filteredTastings: TastingNote[];
  isLoading: boolean;
  
  // Filters
  filter: FilterCategory;
  searchTerm: string;
  setFilter: (filter: FilterCategory) => void;
  setSearchTerm: (term: string) => void;
  
  // CRUD operations
  addTasting: (note: TastingNote) => void;
  updateTasting: (note: TastingNote) => void;
  removeTasting: (id: string) => void;
  
  // Helpers
  getTastingById: (id: string) => TastingNote | undefined;
  refreshTastings: () => void;
  
  // Stats
  totalCount: number;
  redCount: number;
  whiteCount: number;
  roseCount: number;
}

/**
 * Custom hook for managing wine tasting notes
 * Encapsulates storage operations and provides filtering/search functionality
 */
export const useTastings = (options: UseTastingsOptions = {}): UseTastingsReturn => {
  const { initialFilter = 'All', initialSearch = '' } = options;
  
  const [tastings, setTastings] = useState<TastingNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<FilterCategory>(initialFilter);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  // Load tastings from storage on mount
  const refreshTastings = useCallback(() => {
    setIsLoading(true);
    try {
      const loaded = getTastings();
      setTastings(loaded);
    } catch (error) {
      console.error('Failed to load tastings:', error);
      setTastings([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Seed sample data on first load
  useEffect(() => {
    const hasSeeded = localStorage.getItem('wset_tasting_seeded');
    if (!hasSeeded) {
      const existing = getTastings();
      if (existing.length === 0) {
        SAMPLE_TASTINGS.forEach(tasting => saveTasting(tasting));
        localStorage.setItem('wset_tasting_seeded', 'true');
      }
    }
  }, []);

  useEffect(() => {
    refreshTastings();
  }, [refreshTastings]);

  // Filtered tastings based on category and search term
  const filteredTastings = useMemo(() => {
    return tastings.filter((note) => {
      // Category filter
      const matchesCategory = filter === 'All' || note.appearance.colorCategory === filter;
      
      // Search filter (case-insensitive)
      if (!searchTerm.trim()) {
        return matchesCategory;
      }
      
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        note.name?.toLowerCase().includes(term) ||
        note.producer?.toLowerCase().includes(term) ||
        note.grape?.toLowerCase().includes(term) ||
        note.region?.toLowerCase().includes(term) ||
        note.country?.toLowerCase().includes(term);
      
      return matchesCategory && matchesSearch;
    });
  }, [tastings, filter, searchTerm]);

  // CRUD operations
  const addTasting = useCallback((note: TastingNote) => {
    const newNote = {
      ...note,
      id: note.id || crypto.randomUUID(),
      createdAt: note.createdAt || Date.now(),
    };
    saveTasting(newNote);
    setTastings((prev) => [newNote, ...prev]);
  }, []);

  const updateTasting = useCallback((note: TastingNote) => {
    saveTasting(note);
    setTastings((prev) => 
      prev.map((t) => (t.id === note.id ? note : t))
    );
  }, []);

  const removeTasting = useCallback((id: string) => {
    deleteTasting(id);
    setTastings((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const getTastingById = useCallback(
    (id: string) => tastings.find((t) => t.id === id),
    [tastings]
  );

  // Stats
  const stats = useMemo(() => ({
    totalCount: tastings.length,
    redCount: tastings.filter((t) => t.appearance.colorCategory === 'Red').length,
    whiteCount: tastings.filter((t) => t.appearance.colorCategory === 'White').length,
    roseCount: tastings.filter((t) => t.appearance.colorCategory === 'Rose').length,
  }), [tastings]);

  return {
    tastings,
    filteredTastings,
    isLoading,
    filter,
    searchTerm,
    setFilter,
    setSearchTerm,
    addTasting,
    updateTasting,
    removeTasting,
    getTastingById,
    refreshTastings,
    ...stats,
  };
};

export default useTastings;
