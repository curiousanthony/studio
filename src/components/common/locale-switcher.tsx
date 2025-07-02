"use client";

import { useTranslations } from '@/hooks/use-translations';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function LocaleSwitcher() {
  const { locale, setLocale } = useTranslations();

  return (
    <Select value={locale} onValueChange={(value) => setLocale(value as 'en' | 'fr')}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Language" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="en">English</SelectItem>
        <SelectItem value="fr">Français</SelectItem>
      </SelectContent>
    </Select>
  );
}
