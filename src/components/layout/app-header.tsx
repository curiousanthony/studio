
"use client";

import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';
import LocaleSwitcher from '@/components/common/locale-switcher';
import { AppLogo } from '@/components/common/app-logo';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const { t } = useTranslations();
  
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm"
    )}>
      <div className="container grid h-16 grid-cols-3 items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <AppLogo className="h-6 w-6" />
            <span className="font-bold inline-block font-headline">{t('appName')}</span>
          </Link>
        </div>

        <nav className="hidden md:flex justify-self-center gap-6 text-sm font-medium">
          <Link href="#how-to-use" className="transition-colors hover:text-foreground/80 text-foreground/60">{t('navHowToUse')}</Link>
          <Link href="#why-mods" className="transition-colors hover:text-foreground/80 text-foreground/60">{t('navWhyMods')}</Link>
        </nav>

        <div className="flex items-center justify-self-end">
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
