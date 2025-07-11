
"use client";

import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';
import { AppLogo } from '@/components/common/app-logo';
import { Github } from 'lucide-react';

export function AppFooter() {
  const { t } = useTranslations();
  
  const scrollToTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="border-t">
      <div className="container flex h-24 items-center justify-between">
        <a href="#" onClick={scrollToTop} className="flex items-center space-x-2">
          <AppLogo className="h-6 w-6" />
          <span className="font-bold inline-block font-headline">{t('appName')}</span>
        </a>
        <div className="text-center text-sm text-muted-foreground">
           <p className="mb-1" dangerouslySetInnerHTML={{ __html: t('footerDisclaimer')}} />
           <p>{t('createdBy')}</p>
        </div>
        <a href="https://github.com/curiousanthony/SchoolMaker-Mods" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm font-medium text-muted-foreground underline-offset-4 hover:underline">
          <Github className="h-4 w-4" />
          {t('contributeOnGithub')}
        </a>
      </div>
    </footer>
  );
}
