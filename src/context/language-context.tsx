
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type Locale = 'en' | 'am' | 'ti';

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translations: Record<string, string>;
  t: (key: string, variables?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('en');
  const [translations, setTranslations] = useState<Record<string, string>>({});

  useEffect(() => {
    const savedLocale = localStorage.getItem('locale') as Locale;
    if (savedLocale) {
      setLocale(savedLocale);
    }
  }, []);

  useEffect(() => {
    async function loadTranslations() {
      try {
        const translationsModule = await import(`@/locales/${locale}.json`);
        setTranslations(translationsModule.default);
      } catch (error) {
        console.error(`Could not load translations for locale: ${locale}`, error);
        // Fallback to English if the locale file is not found
        const englishModule = await import(`@/locales/en.json`);
        setTranslations(englishModule.default);
      }
    }
    loadTranslations();
  }, [locale]);
  
  const handleSetLocale = (newLocale: Locale) => {
    setLocale(newLocale);
    localStorage.setItem('locale', newLocale);
  };

  const t = useCallback((key: string, variables: Record<string, string | number> = {}) => {
    let translation = translations[key] || key;

    for (const variable in variables) {
        const regex = new RegExp(`{${variable}}`, 'g');
        translation = translation.replace(regex, String(variables[variable]));
    }

    return translation;
  }, [translations]);

  return (
    <LanguageContext.Provider value={{ locale, setLocale: handleSetLocale, translations, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
