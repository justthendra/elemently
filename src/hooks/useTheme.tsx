import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppTheme, InterfaceDensity } from '../types/storage';
import { StorageService } from '../services/storage-service';

interface ThemeContextType {
  theme: AppTheme;
  density: InterfaceDensity;
  accentColor: string;
  setTheme: (theme: AppTheme) => Promise<void>;
  setDensity: (density: InterfaceDensity) => Promise<void>;
  setAccentColor: (color: string) => Promise<void>;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<AppTheme>('dark');
  const [density, setDensityState] = useState<InterfaceDensity>('comfortable');
  const [accentColor, setAccentColorState] = useState<string>('#8b5cf6');
  const [systemIsDark, setSystemIsDark] = useState<boolean>(true);

  useEffect(() => {
    // Check system preference
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(media.matches);

    const listener = (e: MediaQueryListEvent) => setSystemIsDark(e.matches);
    media.addEventListener('change', listener);

    // Load saved settings
    StorageService.getSettings().then((s) => {
      if (s.theme) setThemeState(s.theme);
      if (s.density) setDensityState(s.density);
      if (s.accentColor) setAccentColorState(s.accentColor);
    });

    return () => media.removeEventListener('change', listener);
  }, []);

  const isDark = theme === 'system' ? systemIsDark : theme === 'dark';

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.add('theme-dark');
      root.classList.remove('theme-light');
    } else {
      root.classList.remove('dark');
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
    }

    if (density === 'compact') {
      root.classList.add('density-compact');
    } else {
      root.classList.remove('density-compact');
    }

    root.style.setProperty('--brand-primary', accentColor);
  }, [isDark, density, accentColor]);

  const setTheme = useCallback(async (newTheme: AppTheme) => {
    setThemeState(newTheme);
    await StorageService.saveSettings({ theme: newTheme });
  }, []);

  const setDensity = useCallback(async (newDensity: InterfaceDensity) => {
    setDensityState(newDensity);
    await StorageService.saveSettings({ density: newDensity });
  }, []);

  const setAccentColor = useCallback(async (color: string) => {
    setAccentColorState(color);
    await StorageService.saveSettings({ accentColor: color });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, density, accentColor, setTheme, setDensity, setAccentColor, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

