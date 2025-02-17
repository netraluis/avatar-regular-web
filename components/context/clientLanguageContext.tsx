"use client";
import { createContext, useContext, useState, useEffect } from "react";
import CA from "@/public/client-translations/ca.json";
import EN from "@/public/client-translations/en.json";

export enum Language {
  CA = "CA",
  EN = "EN",
}

// Definimos los idiomas disponibles
const translations = { CA, EN };

// Creamos el contexto
const ClientLanguageContext = createContext<any>(null);

// Proveedor del idioma
export const ClientLanguageProvider = ({
  children,
  userLanguage,
}: {
  children: React.ReactNode;
  userLanguage?: Language;
}) => {
  const [language, setLanguage] = useState<Language>(
    userLanguage === Language.CA || userLanguage === Language.EN
      ? userLanguage
      : Language.EN,
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
    <ClientLanguageContext.Provider
      value={{
        t: (key: string) => getTranslation(key, currentTranslations),
        changeLanguage,
        language,
      }}
    >
      {children}
    </ClientLanguageContext.Provider>
  );
};

// Función para obtener la traducción de una clave
const getTranslation = (key: string, translations: any) => {
  return key.split(".").reduce((obj, k) => (obj || {})[k], translations) || key;
};

// Hook para usar el contexto
export const useClientLanguage = () => useContext(ClientLanguageContext);
