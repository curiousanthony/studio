"use client";

import React, { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import en from '@/locales/en.json';
import fr from '@/locales/fr.json';

type Locale = 'en' | 'fr';
type Translations = typeof en;

const translations: Record<Locale, Translations> = { en, fr };

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: keyof Translations, replacements?: Record<string, string | number>) => string;
}

export const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// A simple plural handler for English and French
const handlePlural = (str: string, count: number): string => {
  const parts = str.split(' | ');
  if (parts.length === 2) {
    return count === 1 ? parts[0] : parts[1];
  }
  return str;
};

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>('fr'); // Default to French

  useEffect(() => {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'en' || browserLang === 'fr') {
      setLocale(browserLang);
    } else {
      setLocale('fr');
    }
  }, []);

  const t = useCallback((key: keyof Translations, replacements?: Record<string, string | number>) => {
    let translation = translations[locale]?.[key] || translations['en']?.[key] || String(key);
    
    if (replacements) {
      Object.keys(replacements).forEach(replaceKey => {
        const value = replacements[replaceKey];
        if (typeof value === 'number' && translation.includes('|')) {
            translation = handlePlural(translation, value);
        }
        translation = translation.replace(`{${replaceKey}}`, String(value));
      });
    }

    return translation;
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}
