
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
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-2">
          <a href="#" onClick={scrollToTop} className="flex items-center space-x-2">
            <AppLogo className="h-6 w-6" />
            <span className="font-bold inline-block font-headline">{t('appName')}</span>
          </a>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t('createdBy')}
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          <p dangerouslySetInnerHTML={{ __html: t('footerDisclaimer')}} />
          <a href="https://github.com/curiousanthony/SchoolMaker-Mods" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 font-medium underline-offset-4 hover:underline">
            <Github className="h-4 w-4" />
            {t('contributeOnGithub')}
          </a>
        </div>
      </div>
    </footer>
  );
}
