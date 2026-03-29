'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';

type LitPath = 'prevalence' | 'twoProportions' | 'twoMeans' | 'predictors';

interface LiteratureHelperProps {
  path: LitPath;
}

export function LiteratureHelper({ path }: LiteratureHelperProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const lit = t.literature[path];

  return (
    <div className="mt-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm text-sage-600 hover:text-sage-800 
                   transition-colors duration-200 focus:outline-none focus:ring-2 
                   focus:ring-sage-500 rounded-lg px-2 py-1 -ml-2"
        aria-expanded={isOpen}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        {t.literature.title}
      </button>

      {isOpen && (
        <div className="mt-2 p-4 rounded-lg bg-stone-50 border border-stone-200 text-sm space-y-3 animate-in fade-in duration-200">
          <p className="font-medium text-stone-700">{lit.intro}</p>
          <ul className="list-disc list-inside space-y-1 text-stone-600">
            <li>{lit.item1}</li>
            <li>{lit.item2}</li>
            {'item3' in lit && <li>{(lit as typeof t.literature.predictors).item3}</li>}
          </ul>

          {'searches' in lit && (
            <>
              <p className="font-medium text-stone-700 mt-2">{lit.searches}</p>
              <ul className="list-none space-y-1 text-stone-500">
                <li className="font-mono text-xs bg-white px-2 py-1 rounded border border-stone-200">
                  {lit.search1}
                </li>
                <li className="font-mono text-xs bg-white px-2 py-1 rounded border border-stone-200">
                  {lit.search2}
                </li>
                <li className="font-mono text-xs bg-white px-2 py-1 rounded border border-stone-200">
                  {lit.search3}
                </li>
              </ul>
            </>
          )}

          <p className="text-stone-500 italic">{lit.fallback}</p>
        </div>
      )}
    </div>
  );
}
