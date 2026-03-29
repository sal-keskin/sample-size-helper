'use client';

import Link from 'next/link';

interface ChoiceCardProps {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
}

export function ChoiceCard({ title, description, href, icon }: ChoiceCardProps) {
  return (
    <Link
      href={href}
      className="group block rounded-xl border border-stone-200 bg-white p-5 sm:p-6 
                 shadow-sm hover:shadow-md hover:border-sage-300 
                 transition-all duration-300 ease-out
                 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-sage-50 text-sage-600 
                        flex items-center justify-center group-hover:bg-sage-100 
                        transition-colors duration-300">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-stone-800 group-hover:text-sage-700 
                         transition-colors duration-200">
            {title}
          </h3>
          <p className="mt-1 text-sm text-stone-500 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex-shrink-0 text-stone-300 group-hover:text-sage-500 
                        transition-colors duration-200 mt-1">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
