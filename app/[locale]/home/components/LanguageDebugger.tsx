"use client";

import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useLanguageSwitch } from '../hooks/useLanguageSwitch';

const LanguageDebugger = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const { 
    currentLocale, 
    oppositeLocale, 
    isPending, 
    toggleLanguage,
    extractPathWithoutLocale 
  } = useLanguageSwitch();

  const debugInfo = {
    locale,
    currentLocale,
    oppositeLocale,
    pathname,
    extractedPath: extractPathWithoutLocale(pathname),
    isPending
  };

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-sm font-mono z-50 max-w-sm">
      <h4 className="font-bold mb-2">🔍 Language Debug</h4>
      <pre className="text-xs overflow-auto">
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <button 
        onClick={toggleLanguage}
        disabled={isPending}
        className="mt-2 bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-xs"
      >
        {isPending ? 'Switching...' : `Switch to ${oppositeLocale.toUpperCase()}`}
      </button>
    </div>
  );
};

export default LanguageDebugger; 