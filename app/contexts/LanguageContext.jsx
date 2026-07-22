import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { getLanguage, setLanguage as persistLanguage } from '../services/language-service';
import { translations } from '../i18n/translations';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en');

  useEffect(() => {
    getLanguage().then(setLanguageState);
  }, []);

  const changeLanguage = useCallback((code) => {
    setLanguageState(code);
    persistLanguage(code);
  }, []);

  const t = useCallback(
    (key, params) => {
      const lookup = (dict) => key.split('.').reduce((obj, part) => obj?.[part], dict);
      const value = lookup(translations[language]) ?? lookup(translations.en) ?? key;
      if (typeof value !== 'string' || !params) {
        return value;
      }
      return Object.keys(params).reduce(
        (result, param) => result.replace(`{${param}}`, params[param]),
        value
      );
    },
    [language]
  );

  const value = { language, changeLanguage, t, isRTL: language === 'ar' };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
