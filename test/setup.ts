import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Create a fresh localStorage mock for each test
const createLocalStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
    // Expose store for testing
    __getStore: () => store,
    __setStore: (newStore: Record<string, string>) => { store = newStore; },
  };
};

let localStorageMock = createLocalStorageMock();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

// Reset localStorage mock before each test
beforeEach(() => {
  // Create a completely fresh mock to avoid spy interference
  localStorageMock = createLocalStorageMock();
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });
  vi.clearAllMocks();
});
