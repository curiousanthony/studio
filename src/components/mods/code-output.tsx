"use client"

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';

interface CodeOutputProps {
  generatedCode: string;
}

export default function CodeOutput({ generatedCode }: CodeOutputProps) {
  const { t } = useTranslations();
  return (
    <section className="mt-16 mb-8">
      <Card>
        <CardHeader>
            <div>
              <CardTitle className="font-headline">{t('generatedCodeTitle')}</CardTitle>
              <CardDescription>{t('generatedCodeDescription')}</CardDescription>
            </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-72 w-full rounded-md border bg-muted/50">
            <pre className="p-4 text-sm">
              <code className="font-code">{generatedCode}</code>
            </pre>
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
}
