"use client";

import { useContext } from 'react';
import { LocaleContext } from '@/context/locale-context';

export function useTranslations() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a LocaleProvider');
  }
  return context;
}
