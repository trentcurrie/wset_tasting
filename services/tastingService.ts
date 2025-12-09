import { supabase, isSupabaseConfigured } from './supabase';
import { TastingNote } from '../types';

const STORAGE_KEY = 'pourdecisions_tastings';

// localStorage fallback functions
const getLocalTastings = (): TastingNote[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load tastings from localStorage", e);
    return [];
  }
};

const saveLocalTasting = (note: TastingNote): void => {
  const notes = getLocalTastings();
  const index = notes.findIndex(n => n.id === note.id);
  
  if (index >= 0) {
    notes[index] = note;
  } else {
    notes.unshift(note);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

const deleteLocalTasting = (id: string): void => {
  const notes = getLocalTastings().filter(n => n.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

// Supabase functions
export const getTastings = async (userId?: string): Promise<TastingNote[]> => {
  if (!isSupabaseConfigured() || !userId) {
    return getLocalTastings();
  }

  try {
    const { data, error } = await supabase
      .from('tastings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tastings:', error);
      return getLocalTastings();
    }

    return data?.map(row => row.data as unknown as TastingNote) || [];
  } catch (e) {
    console.error('Failed to fetch tastings:', e);
    return getLocalTastings();
  }
};

export const saveTasting = async (note: TastingNote, userId?: string): Promise<void> => {
  if (!isSupabaseConfigured() || !userId) {
    saveLocalTasting(note);
    return;
  }

  try {
    const { error } = await supabase
      .from('tastings')
      .upsert({
        id: note.id,
        user_id: userId,
        data: JSON.parse(JSON.stringify(note)),
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id'
      });

    if (error) {
      console.error('Error saving tasting:', error);
      // Fallback to localStorage
      saveLocalTasting(note);
    }
  } catch (e) {
    console.error('Failed to save tasting:', e);
    saveLocalTasting(note);
  }
};

export const deleteTasting = async (id: string, userId?: string): Promise<void> => {
  if (!isSupabaseConfigured() || !userId) {
    deleteLocalTasting(id);
    return;
  }

  try {
    const { error } = await supabase
      .from('tastings')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting tasting:', error);
      deleteLocalTasting(id);
    }
  } catch (e) {
    console.error('Failed to delete tasting:', e);
    deleteLocalTasting(id);
  }
};

// Migration helper: Move localStorage data to Supabase
export const migrateLocalToSupabase = async (userId: string): Promise<number> => {
  if (!isSupabaseConfigured()) return 0;

  const localTastings = getLocalTastings();
  if (localTastings.length === 0) return 0;

  let migrated = 0;
  for (const note of localTastings) {
    try {
      const { error } = await supabase
        .from('tastings')
        .upsert({
          id: note.id,
          user_id: userId,
          data: JSON.parse(JSON.stringify(note)),
          created_at: new Date(note.createdAt).toISOString(),
          updated_at: new Date().toISOString(),
        }, {
          onConflict: 'id'
        });

      if (!error) {
        migrated++;
      }
    } catch (e) {
      console.error('Failed to migrate tasting:', note.id, e);
    }
  }

  // Clear localStorage after successful migration
  if (migrated === localTastings.length) {
    localStorage.removeItem(STORAGE_KEY);
  }

  return migrated;
};
