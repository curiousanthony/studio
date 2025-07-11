
"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';
import LocaleSwitcher from '@/components/common/locale-switcher';
import { AppLogo } from '@/components/common/app-logo';
import { cn } from '@/lib/utils';

export function AppHeader() {
  const { t } = useTranslations();
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      if (typeof window !== 'undefined') {
        const header = document.querySelector('header');
        if (header) {
          // Hide if scrolling down past header height, show if scrolling up
          if (window.scrollY > lastScrollY && window.scrollY > header.offsetHeight) {
            setIsHidden(true);
          } else {
            setIsHidden(false);
          }
        }
        setLastScrollY(window.scrollY);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);
  
  return (
    <header className={cn(
      "sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm transition-transform duration-300",
      isHidden ? '-translate-y-full' : 'translate-y-0'
    )}>
      <div className="container flex h-16 items-center">
        <div className="mr-auto flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <AppLogo className="h-6 w-6" />
            <span className="font-bold inline-block font-headline">{t('appName')}</span>
          </Link>
        </div>

        <nav className="flex items-center justify-center gap-6 text-sm font-medium">
          <Link href="#how-to-use" className="transition-colors hover:text-foreground/80 text-foreground/60">{t('navHowToUse')}</Link>
          <Link href="#why-mods" className="transition-colors hover:text-foreground/80 text-foreground/60">{t('navWhyMods')}</Link>
        </nav>

        <div className="flex ml-auto items-center justify-end space-x-4">
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  );
}
