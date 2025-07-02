"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Mod } from '@/types';
import { initialModsData } from '@/lib/mods-data';
import ModCard from './mod-card';
import ConfigModal from './config-modal';
import CodeOutput from './code-output';
import PreviewModal from './preview-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from "@/hooks/use-toast";
import { ClipboardCopy, Check, Eye } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslations } from '@/hooks/use-translations';
import LocaleSwitcher from '@/components/common/locale-switcher';

type Category = 'All' | 'Appearance' | 'Functionality';

export default function ModsDashboard() {
  const [mods, setMods] = useState<Mod[]>(initialModsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [selectedMod, setSelectedMod] = useState<Mod | null>(null);
  const [previewingMod, setPreviewingMod] = useState<Mod | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();


  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialModsData.forEach(mod => mod.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

  const enabledModsCount = useMemo(() => mods.filter(mod => mod.enabled).length, [mods]);

  const filteredMods = useMemo(() => {
    return mods
      .filter(mod => {
        if (activeCategory === 'All') return true;
        return mod.category === activeCategory;
      })
      .filter(mod => {
        if (activeTags.length === 0) return true;
        return activeTags.every(tag => mod.tags.includes(tag));
      })
      .filter(mod => {
        if (searchQuery.trim() === '') return true;
        const lowerCaseQuery = searchQuery.toLowerCase();
        return (
          mod.name.toLowerCase().includes(lowerCaseQuery) ||
          mod.description.toLowerCase().includes(lowerCaseQuery)
        );
      });
  }, [mods, activeCategory, activeTags, searchQuery]);

  const handleToggleMod = (modId: string) => {
    setMods(prevMods =>
      prevMods.map(mod =>
        mod.id === modId ? { ...mod, enabled: !mod.enabled } : mod
      )
    );
  };
  
  const handleOpenConfig = (mod: Mod) => {
    setSelectedMod(mod);
  };

  const handleCloseConfig = () => {
    setSelectedMod(null);
  };

  const handleSaveConfig = (modId: string, newConfig: Record<string, string>) => {
    setMods(prevMods =>
      prevMods.map(mod => {
        if (mod.id === modId && mod.configOptions) {
          const updatedConfigOptions = mod.configOptions.map(opt => ({
            ...opt,
            value: newConfig[opt.key] ?? opt.value,
          }));
          return { ...mod, configOptions: updatedConfigOptions };
        }
        return mod;
      })
    );
    handleCloseConfig();
  };

  const handleTagClick = (tag: string) => {
    setActiveTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const generatedCode = useMemo(() => {
    const enabledMods = mods.filter(mod => mod.enabled);

    const modObjects = enabledMods.map(mod => {
      const config: Record<string, string> = {};
      mod.configOptions?.forEach(opt => {
        config[opt.key] = opt.value;
      });

      const functionImplementation = mod.functionString;
      
      return `{
        id: '${mod.id}',
        name: '${mod.name}',
        config: ${JSON.stringify(config, null, 2)},
        run: ${functionImplementation}
      }`;
    });

    const modsArrayString = `const mods = [\n  ${modObjects.join(',\n  ')}\n];`;

    return `<script>
  // Helper functions for targeting elements
  const qs = (arg) => document.querySelector(arg);
  const qsa = (arg) => document.querySelectorAll(arg);

  // Set to true when debugging. Will log tests to the console
  const debug = true;

  // Helper function for conditional logging
  function log(message, ...args) {
    if (debug) {
      console.log(message, ...args);
    }
  }

  ${enabledMods.length > 0 ? modsArrayString : 'const mods = [];'}

  // Loops through mods and executes all enabled functions
  function executeMods() {
    mods.forEach(mod => {
      try {
        if (typeof mod.run === 'function') {
          mod.run(mod.config);
        }
      } catch (e) {
        console.error(\`Error executing mod: \${mod.name}\`, e);
      }
    });
  }
  
  // Run on initial load
  document.addEventListener("DOMContentLoaded", executeMods);
  
  // Run on Turbo navigation
  document.addEventListener("turbo:load", executeMods);
<\/script>`;
  }, [mods]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode).then(() => {
      setCopied(true);
      toast({
        title: t('copiedToClipboard'),
        description: t('copiedToClipboardDescription'),
      });
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      toast({
        title: t('copyFailed'),
        description: t('copyFailedDescription'),
        variant: "destructive",
      });
    });
  };
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 flex flex-col min-h-full">
       <div className="flex-grow">
        <header className="text-center mb-6 pt-8">
            <div className="flex justify-end mb-4 -mt-4">
              <LocaleSwitcher />
            </div>
            <h1 className="font-headline text-4xl font-bold mb-1">{t('pageTitle')}</h1>
            <p className="text-md text-muted-foreground max-w-2xl mx-auto">
                {t('pageDescription')}
            </p>
            <p className="text-base text-primary font-semibold mt-2">
                {t('enabledMods', { count: enabledModsCount })}
            </p>
        </header>
        
        <Accordion type="single" collapsible className="w-full mb-8">
            <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-headline">{t('howToUseTitle')}</AccordionTrigger>
            <AccordionContent>
                <Card>
                    <CardContent className="pt-6 text-sm space-y-4">
                        <p>{t('step1')}</p>
                        <p>{t('step2')}</p>
                        <p dangerouslySetInnerHTML={{ __html: t('step3') }} />
                        <p dangerouslySetInnerHTML={{ __html: t('step4') }} />
                    </CardContent>
                </Card>
            </AccordionContent>
            </AccordionItem>
        </Accordion>

        <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm -mx-4 px-4 pt-2 pb-4 mb-8 border-b">
            <div className="p-4 bg-card border rounded-lg shadow-sm max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <Input
                    type="search"
                    placeholder={t('searchPlaceholder')}
                    className="md:col-span-1"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="flex items-center gap-2 md:col-span-2 justify-center md:justify-start">
                    <span className="text-sm font-medium mr-2 shrink-0">{t('categoryLabel')}</span>
                    <div className="flex items-center gap-2 flex-wrap">
                        {(['All', 'Appearance', 'Functionality'] as Category[]).map(category => (
                        <Button
                            key={category}
                            variant={activeCategory === category ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setActiveCategory(category)}
                        >
                            {t(category.toLowerCase() as any)}
                        </Button>
                        ))}
                    </div>
                    </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2 items-center">
                    <span className="text-sm font-medium mr-2 shrink-0">{t('tagsLabel')}</span>
                    {allTags.map(tag => (
                        <Badge
                            key={tag}
                            variant={activeTags.includes(tag) ? 'default' : 'secondary'}
                            onClick={() => handleTagClick(tag)}
                            className="cursor-pointer transition-colors"
                        >
                            {tag}
                        </Badge>
                    ))}
                    {activeTags.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => setActiveTags([])} className="h-auto py-0.5 px-2">{t('clear')}</Button>
                    )}
                </div>
            </div>
        </div>


        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMods.map(mod => (
            <ModCard
                key={mod.id}
                mod={mod}
                onToggle={() => handleToggleMod(mod.id)}
                onConfigure={() => handleOpenConfig(mod)}
                onPreview={() => setPreviewingMod(mod)}
            />
            ))}
        </div>
        
        {filteredMods.length === 0 && (
            <p className="text-center col-span-full text-muted-foreground mt-8">{t('noModsFound')}</p>
        )}

        <section className="my-16">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">{t('whyTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="pt-2">
                    <p className="text-muted-foreground">{t('whyContent')}</p>
                </CardContent>
            </Card>
        </section>

        <CodeOutput generatedCode={generatedCode} />
      </div>
      
      {selectedMod && (
        <ConfigModal
          mod={selectedMod}
          onSave={handleSaveConfig}
          onClose={handleCloseConfig}
        />
      )}

      {previewingMod && (
        <PreviewModal
          mod={previewingMod}
          onClose={() => setPreviewingMod(null)}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50">
        <Button onClick={handleCopy} size="lg" className="shadow-2xl">
            {copied ? <Check className="mr-2 h-5 w-5" /> : <ClipboardCopy className="mr-2 h-5 w-5" />}
            {t('copyCodeButton', { count: enabledModsCount })}
        </Button>
      </div>

      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p dangerouslySetInnerHTML={{ __html: t('footerDisclaimer')}}/>
      </footer>
    </div>
  );
}
