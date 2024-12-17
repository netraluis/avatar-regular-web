"use client";
import { createContext, useContext, useState, useEffect } from "react";
import CA from "@/public/dashboard-translations/ca.json";
import EN from "@/public/dashboard-translations/en.json";

export enum Language {
  CA = "CA",
  EN = "EN",
}

// Definimos los idiomas disponibles
const translations = { CA, EN };

// Creamos el contexto
const DashboardLanguageContext = createContext<any>(null);

// Proveedor del idioma
export const DashboardLanguageProvider = ({
  children,
  userLanguage,
}: {
  children: React.ReactNode;
  userLanguage?: Language;
}) => {
  const [language, setLanguage] = useState<Language>(
    userLanguage || Language.EN,
  );
  const [currentTranslations, setCurrentTranslations] = useState(
    translations[language],
  );

  useEffect(() => {
    setCurrentTranslations(translations[language]); // Cargar traducciones al cambiar el idioma
  }, [language]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <DashboardLanguageContext.Provider
      value={{
        t: (key: string) => getTranslation(key, currentTranslations),
        changeLanguage,
        language,
      }}
    >
      {children}
    </DashboardLanguageContext.Provider>
  );
};

// Función para obtener la traducción de una clave
const getTranslation = (key: string, translations: any) => {
  return key.split(".").reduce((obj, k) => (obj || {})[k], translations) || key;
};

// Hook para usar el contexto
export const useDashboardLanguage = () => useContext(DashboardLanguageContext);
