"use client";

import { useTranslations } from '@/hooks/use-translations';
import { Button } from '@/components/ui/button';

export default function LocaleSwitcher() {
  const { locale, setLocale } = useTranslations();

  return (
    <div className="flex gap-2">
      <Button
        variant={locale === 'en' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLocale('en')}
      >
        English
      </Button>
      <Button
        variant={locale === 'fr' ? 'default' : 'outline'}
        size="sm"
        onClick={() => setLocale('fr')}
      >
        Français
      </Button>
    </div>
  );
}
