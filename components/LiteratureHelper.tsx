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
        <i className="fa fa-book" />
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
