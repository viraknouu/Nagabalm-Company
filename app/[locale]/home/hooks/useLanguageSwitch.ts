"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition, useCallback } from 'react';
import { locales, type Locale } from '../../../../i18n';

export function useLanguageSwitch() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const extractPathWithoutLocale = useCallback((path: string): string => {
    // Vérifier si le chemin commence par une locale valide
    for (const loc of locales) {
      if (path.startsWith(`/${loc}`)) {
        // Extraire le chemin sans la locale
        const pathWithoutLocale = path.slice(loc.length + 1);
        return pathWithoutLocale || '/';
      }
    }
    // Si aucune locale trouvée, retourner le chemin tel quel
    return path;
  }, []);

  const switchToLocale = useCallback((targetLocale: Locale) => {
    if (targetLocale === locale) return;

    startTransition(() => {
      // Extraire le chemin sans la locale actuelle de manière plus robuste
      const pathWithoutLocale = extractPathWithoutLocale(pathname);
      
      // Construire la nouvelle URL avec la nouvelle locale
      const newPath = pathWithoutLocale === '/' 
        ? `/${targetLocale}` 
        : `/${targetLocale}${pathWithoutLocale}`;
      
      console.log('🚀 useLanguageSwitch navigation:', {
        from: locale,
        to: targetLocale,
        currentPath: pathname,
        extractedPath: pathWithoutLocale,
        newPath
      });
      
      // Naviguer vers la nouvelle URL
      router.push(newPath);
    });
  }, [locale, pathname, router, extractPathWithoutLocale]);

  const toggleLanguage = useCallback(() => {
    const newLocale = locale === 'en' ? 'km' : 'en';
    switchToLocale(newLocale);
  }, [locale, switchToLocale]);

  const getOppositeLocale = useCallback((): Locale => {
    return locale === 'en' ? 'km' : 'en';
  }, [locale]);

  const getLanguageName = useCallback((localeCode: Locale): string => {
    const names = {
      en: 'English',
      km: 'ខ្មែរ'
    };
    return names[localeCode];
  }, []);

  return {
    currentLocale: locale,
    oppositeLocale: getOppositeLocale(),
    isPending,
    switchToLocale,
    toggleLanguage,
    getLanguageName,
    availableLocales: locales,
    extractPathWithoutLocale
  };
}