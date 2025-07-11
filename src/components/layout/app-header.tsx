
"use client";

import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';
import LocaleSwitcher from '@/components/common/locale-switcher';
import { Button } from '@/components/ui/button';
import { AppLogo } from '@/components/common/app-logo';

export function AppHeader() {
  const { t } = useTranslations();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <AppLogo className="h-6 w-6" />
            <span className="font-bold inline-block font-headline">{t('appName')}</span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="#how-to-use" className="transition-colors hover:text-foreground/80 text-foreground/60">{t('navHowToUse')}</Link>
          <Link href="#why-mods" className="transition-colors hover:text-foreground/80 text-foreground/60">{t('navWhyMods')}</Link>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
