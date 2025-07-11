"use client"

import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTranslations } from '@/hooks/use-translations';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coldarkDark } from 'react-syntax-highlighter/dist/cjs/styles/prism';


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
          <ScrollArea className="h-72 w-full rounded-md border bg-[#111827]">
             <SyntaxHighlighter
                language="html"
                style={coldarkDark}
                wrapLongLines={true}
                customStyle={{ 
                  margin: 0, 
                  padding: "1rem", 
                  background: "transparent",
                  fontFamily: "monospace"
                }}
                codeTagProps={{
                  style: {
                    fontSize: "0.875rem",
                  }
                }}
              >
                {generatedCode}
              </SyntaxHighlighter>
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  );
}
