import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { LocaleCode, SUPPORTED_LOCALES, translate, formatNumber as fmtNumber, formatDate as fmtDate } from '../locales';
import { StorageService } from '../services/storage-service';

interface I18nContextType {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => Promise<void>;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
  formatNumber: (num: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | number, options?: Intl.DateTimeFormatOptions) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<LocaleCode>('en-US');

  useEffect(() => {
    StorageService.getSettings().then((settings) => {
      if (settings.language) {
        setLocaleState(settings.language);
      }
    });
  }, []);

  const currentLocaleInfo = useMemo(() => {
    return SUPPORTED_LOCALES.find((l) => l.code === locale) || SUPPORTED_LOCALES[0];
  }, [locale]);

  const isRTL = currentLocaleInfo.dir === 'rtl';

  useEffect(() => {
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', locale);
  }, [locale, isRTL]);

  const setLocale = useCallback(async (newLocale: LocaleCode) => {
    setLocaleState(newLocale);
    await StorageService.saveSettings({ language: newLocale });
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return translate(locale, key, params);
    },
    [locale]
  );

  const formatNumber = useCallback(
    (num: number, options?: Intl.NumberFormatOptions) => {
      return fmtNumber(locale, num, options);
    },
    [locale]
  );

  const formatDate = useCallback(
    (date: Date | number, options?: Intl.DateTimeFormatOptions) => {
      return fmtDate(locale, date, options);
    },
    [locale]
  );

  return (
    <I18nContext.Provider value={{ locale, setLocale, t, isRTL, formatNumber, formatDate }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};

