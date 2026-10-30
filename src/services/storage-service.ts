import { StorageData, UserSettings, DEFAULT_SETTINGS, SavedCollection } from '../types/storage';
import { getInitialLocale } from '../locales';

const STORAGE_KEYS = {
  SETTINGS: 'elemently_settings',
  FAVORITES: 'elemently_favorites',
  COLLECTIONS: 'elemently_collections',
  RECENT_ELEMENTS: 'elemently_recent_elements',
  RECENT_COLORS: 'elemently_recent_colors',
};

const memoryStore: Record<string, string> = {};

function getStoredString(key: string): string | null {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem) {
      const item = localStorage.getItem(key);
      if (item !== null) return item;
    }
  } catch {
    // ignore
  }
  return memoryStore[key] ?? null;
}

function setStoredString(key: string, val: string): void {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.setItem) {
      localStorage.setItem(key, val);
    }
  } catch {
    // ignore
  }
  memoryStore[key] = val;
}

function clearStoredStrings(): void {
  try {
    if (typeof localStorage !== 'undefined' && localStorage.clear) {
      localStorage.clear();
    }
  } catch {
    // ignore
  }
  for (const k in memoryStore) {
    delete memoryStore[k];
  }
}

const isChromeStorageAvailable = (): boolean => {
  return typeof chrome !== 'undefined' && !!chrome.storage && !!chrome.storage.local;
};

export const StorageService = {
  async getSettings(): Promise<UserSettings> {
    const initialLang = getInitialLocale();
    const defaults: UserSettings = {
      ...DEFAULT_SETTINGS,
      language: initialLang,
    };

    if (isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEYS.SETTINGS], (result: { [key: string]: any }) => {
          if (chrome.runtime.lastError || !result[STORAGE_KEYS.SETTINGS]) {
            resolve(defaults);
          } else {
            resolve({ ...defaults, ...(result[STORAGE_KEYS.SETTINGS] as Partial<UserSettings>) });
          }
        });
      });
    }

    const stored = getStoredString(STORAGE_KEYS.SETTINGS);
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  },

  async saveSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };

    if (isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEYS.SETTINGS]: updated }, () => {
          resolve(updated);
        });
      });
    }

    setStoredString(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    return updated;
  },

  async getFavorites(): Promise<StorageData['favorites']> {
    const defaults: StorageData['favorites'] = {
      colors: [],
      fonts: [],
      snippets: [],
      elements: [],
    };

    if (isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEYS.FAVORITES], (result: { [key: string]: any }) => {
          if (chrome.runtime.lastError || !result[STORAGE_KEYS.FAVORITES]) {
            resolve(defaults);
          } else {
            resolve({ ...defaults, ...(result[STORAGE_KEYS.FAVORITES] as Partial<StorageData['favorites']>) });
          }
        });
      });
    }

    const stored = getStoredString(STORAGE_KEYS.FAVORITES);
    return stored ? { ...defaults, ...JSON.parse(stored) } : defaults;
  },

  async saveFavorites(favorites: StorageData['favorites']): Promise<void> {
    if (isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEYS.FAVORITES]: favorites }, () => resolve());
      });
    }

    setStoredString(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  },

  async getCollections(): Promise<SavedCollection[]> {
    if (isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEYS.COLLECTIONS], (result: { [key: string]: any }) => {
          if (chrome.runtime.lastError || !result[STORAGE_KEYS.COLLECTIONS]) {
            resolve([]);
          } else {
            resolve((result[STORAGE_KEYS.COLLECTIONS] as SavedCollection[]) || []);
          }
        });
      });
    }

    const stored = getStoredString(STORAGE_KEYS.COLLECTIONS);
    return stored ? JSON.parse(stored) : [];
  },

  async saveCollections(collections: SavedCollection[]): Promise<void> {
    if (isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEYS.COLLECTIONS]: collections }, () => resolve());
      });
    }

    setStoredString(STORAGE_KEYS.COLLECTIONS, JSON.stringify(collections));
  },

  async getRecentColors(): Promise<string[]> {
    if (isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.get([STORAGE_KEYS.RECENT_COLORS], (result: { [key: string]: any }) => {
          resolve((result[STORAGE_KEYS.RECENT_COLORS] as string[]) || []);
        });
      });
    }

    const stored = getStoredString(STORAGE_KEYS.RECENT_COLORS);
    return stored ? JSON.parse(stored) : [];
  },

  async addRecentColor(color: string): Promise<void> {
    const existing = await this.getRecentColors();
    const filtered = existing.filter((c) => c.toLowerCase() !== color.toLowerCase());
    const updated = [color, ...filtered].slice(0, 20);

    if (isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [STORAGE_KEYS.RECENT_COLORS]: updated }, () => resolve());
      });
    }

    setStoredString(STORAGE_KEYS.RECENT_COLORS, JSON.stringify(updated));
  },

  async exportAllData(): Promise<string> {
    const [settings, favorites, collections, recentColors] = await Promise.all([
      this.getSettings(),
      this.getFavorites(),
      this.getCollections(),
      this.getRecentColors(),
    ]);

    const data: StorageData = {
      settings,
      favorites,
      collections,
      recentElements: [],
      recentColors,
    };

    return JSON.stringify(data, null, 2);
  },

  async importData(jsonString: string): Promise<boolean> {
    try {
      const parsed: StorageData = JSON.parse(jsonString);
      if (parsed.settings) await this.saveSettings(parsed.settings);
      if (parsed.favorites) await this.saveFavorites(parsed.favorites);
      if (parsed.collections) await this.saveCollections(parsed.collections);
      return true;
    } catch (e) {
      console.error('Failed to import Elemently data:', e);
      return false;
    }
  },

  async clearAllData(): Promise<void> {
    if (isChromeStorageAvailable()) {
      return new Promise((resolve) => {
        chrome.storage.local.clear(() => resolve());
      });
    }
    clearStoredStrings();
  },
};
