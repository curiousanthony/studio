
"use client";

import { useTranslations } from '@/hooks/use-translations';
import { Button } from '@/components/ui/button';
import { Globe, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from '@/lib/utils';

export default function LocaleSwitcher() {
  const { locale, setLocale, t } = useTranslations();

  return (
     <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">{t('toggleLanguage')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLocale('en')}>
          <Check className={cn("mr-2 h-4 w-4", locale === 'en' ? 'opacity-100' : 'opacity-0')} />
          English
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLocale('fr')}>
           <Check className={cn("mr-2 h-4 w-4", locale === 'fr' ? 'opacity-100' : 'opacity-0')} />
          Français
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
