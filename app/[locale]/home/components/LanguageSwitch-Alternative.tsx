"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { useTransition } from 'react';

interface LanguageSwitcherProps {
  isMobile?: boolean;
  className?: string;
}

const LanguageSwitcherAlternative = ({ isMobile = false, className = '' }: LanguageSwitcherProps) => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'km' : 'en';
    
    console.log('🔄 Alternative switching language:', {
      from: locale,
      to: newLocale,
      currentPath: pathname
    });
    
    startTransition(async () => {
      // Améliorer l'extraction du chemin
      let pathWithoutLocale = '';
      
      // Si le pathname commence par /en ou /km, on l'enlève
      if (pathname.startsWith('/en')) {
        pathWithoutLocale = pathname.slice(3);
      } else if (pathname.startsWith('/km')) {
        pathWithoutLocale = pathname.slice(3);
      } else {
        pathWithoutLocale = pathname;
      }
      
      // Si le chemin est vide, utiliser '/'
      if (!pathWithoutLocale || pathWithoutLocale === '') {
        pathWithoutLocale = '/';
      }
      
      // Si le chemin ne commence pas par '/', l'ajouter
      if (!pathWithoutLocale.startsWith('/')) {
        pathWithoutLocale = '/' + pathWithoutLocale;
      }
      
      // Construire la nouvelle URL
      const newPath = `/${newLocale}${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;
      
      console.log('🎯 Alternative navigating to:', newPath);
      
      // Naviguer puis forcer un refresh
      router.push(newPath);
      router.refresh();
    });
  };

  const baseClasses = isMobile 
    ? "bg-gradient-to-r from-[#FED7AA] to-[#FBBF24] text-[#F97316] text-sm font-bold rounded-full w-9 h-9 flex items-center justify-center transition-all duration-300 hover:scale-110 border-2 border-[#F97316]/20"
    : "bg-gradient-to-r from-[#FED7AA] to-[#FBBF24] text-[#F97316] text-sm font-bold rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg border-2 border-[#F97316]/20";

  return (
    <button
      className={`${baseClasses} ${className} ${isPending ? 'opacity-75 cursor-wait' : 'hover:bg-gradient-to-r hover:from-[#FBBF24] hover:to-[#FED7AA]'}`}
      onClick={switchLanguage}
      disabled={isPending}
      aria-label={`Switch to ${locale === 'en' ? 'Khmer' : 'English'}`}
      title={`Switch to ${locale === 'en' ? 'ខ្មែរ' : 'English'}`}
    >
      <span className="relative flex items-center justify-center">
        {isPending ? (
          <div className="w-3 h-3 border border-[#F97316] border-t-transparent rounded-full animate-spin" />
        ) : (
          <span className="transition-all duration-200">
            {locale === 'en' ? 'EN' : 'KM'}
          </span>
        )}
      </span>
    </button>
  );
};

export default LanguageSwitcherAlternative; 