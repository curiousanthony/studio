
"use client";

import Link from 'next/link';
import { useTranslations } from '@/hooks/use-translations';
import { AppLogo } from '@/components/common/app-logo';

export function AppFooter() {
  const { t } = useTranslations();
  
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <AppLogo className="h-6 w-6" />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t('createdBy')}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
           <p>{t('footerDisclaimer')}</p>
           <a href="https://github.com/curiousanthony/SchoolMaker-Mods" target="_blank" rel="noopener noreferrer" className="font-medium underline underline-offset-4">{t('contributeOnGithub')}</a>
        </div>
      </div>
    </footer>
  );
}
