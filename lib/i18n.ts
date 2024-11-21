import { LanguageType } from "@prisma/client";

export async function getSupportedLocales() {
  return Object.values(LanguageType);
}

export async function getDefaultLocale() {
  return LanguageType.ES;
}

export const getDictionary = async (locale: string) => {
  switch (locale) {
    case "en":
      return (await import(`../locales/en.json`)).default;
    case "es":
      return (await import(`../locales/es.json`)).default;
    default:
      return (await import(`../locales/es.json`)).default;
  }
};
