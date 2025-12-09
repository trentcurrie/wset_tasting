import { TastingNote } from "../types";

const STORAGE_KEY = 'pourdecisions_tastings';

export const getTastings = (): TastingNote[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load tastings", e);
    return [];
  }
};

export const saveTasting = (note: TastingNote): void => {
  const notes = getTastings();
  const index = notes.findIndex(n => n.id === note.id);
  
  if (index >= 0) {
    notes[index] = note;
  } else {
    notes.unshift(note);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};

export const deleteTasting = (id: string): void => {
  const notes = getTastings().filter(n => n.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
};
