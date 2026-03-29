'use client';

import { LanguageProvider } from '@/lib/i18n';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AppHeader />
      <main className="flex-1">{children}</main>
      <AppFooter />
    </LanguageProvider>
  );
}
