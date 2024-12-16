'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import ca from '@/public/user-managment-translations/ca.json';

enum Language {
    ca = 'ca'
}

// Definimos los idiomas disponibles
const translations = {ca};

// Creamos el contexto
const UserManagmanteLanguageContext = createContext<any>(null);

// Proveedor del idioma
export const UserManagmentLanguageProvider = ({ children, userLanguage }: { children: React.ReactNode; userLanguage?: Language }) => {
  const [language, setLanguage] = useState<Language>(userLanguage || Language.ca);
  const [currentTranslations, setCurrentTranslations] = useState(translations[language]);

  useEffect(() => {
    setCurrentTranslations(translations[language]); // Cargar traducciones al cambiar el idioma
  }, [language]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <UserManagmanteLanguageContext.Provider value={{ t: (key: string) => getTranslation(key, currentTranslations), changeLanguage, language }}>
      {children}
    </UserManagmanteLanguageContext.Provider>
  );
};

// Función para obtener la traducción de una clave
const getTranslation = (key: string, translations: any) => {
  return key.split('.').reduce((obj, k) => (obj || {})[k], translations) || key;
};

// Hook para usar el contexto
export const useUserManagmentLanguage = () => useContext(UserManagmanteLanguageContext);