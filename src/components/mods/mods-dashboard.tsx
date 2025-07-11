
"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Mod } from '@/types';
import { allMods } from '@/lib/mods';
import ModCard from './mod-card';
import ConfigModal from './config-modal';
import CodeOutput from './code-output';
import PreviewModal from './preview-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast";
import { ClipboardCopy, Check, LayoutGrid, List, AlertCircle, ChevronDown, Filter } from 'lucide-react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTranslations } from '@/hooks/use-translations';
import LocaleSwitcher from '@/components/common/locale-switcher';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type Category = 'All' | 'Appearance' | 'Functionality';
type Layout = 'grid' | 'list';

const LOCAL_STORAGE_KEY = 'schoolmakerModsState';

export default function ModsDashboard() {
  const [mods, setMods] = useState<Mod[]>(allMods);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [selectedMod, setSelectedMod] = useState<Mod | null>(null);
  const [previewingMod, setPreviewingMod] = useState<Mod | null>(null);
  const [layout, setLayout] = useState<Layout>('grid');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslations();
  const isMobile = useIsMobile();
  const [isMounted, setIsMounted] = useState(false);
  const [tagDropdownOpen, setTagDropdownOpen] = useState(false);

  useEffect(() => {
    try {
      const savedStateJSON = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (savedStateJSON) {
        const savedState = JSON.parse(savedStateJSON);
        
        const rehydratedMods = allMods.map(initialMod => {
          const savedMod = savedState.mods?.find(m => m.id === initialMod.id);
          if (savedMod) {
            const rehydratedOptions = initialMod.configOptions?.map(opt => {
              const savedValue = savedMod.configOptions?.find(c => c.key === opt.key)?.value;
              return { ...opt, value: savedValue ?? opt.value };
            });
            return { ...initialMod, enabled: savedMod.enabled, configOptions: rehydratedOptions };
          }
          return initialMod;
        });

        setMods(rehydratedMods);
        setSearchQuery(savedState.searchQuery || '');
        setActiveCategory(savedState.activeCategory || 'All');
        setActiveTags(savedState.activeTags || []);
        setLayout(savedState.layout || 'grid');
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    try {
      const stateToSave = {
        mods: mods.map(mod => ({
          id: mod.id,
          enabled: mod.enabled,
          configOptions: mod.configOptions?.map(opt => ({
            key: opt.key,
            value: opt.value
          }))
        })),
        searchQuery,
        activeCategory,
        activeTags,
        layout,
      };
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(stateToSave));
    } catch (error) {
      console.error("Failed to save state to localStorage", error);
    }
  }, [isMounted, mods, searchQuery, activeCategory, activeTags, layout]);

  const { allTags, tagCounts } = useMemo(() => {
    const tags = new Set<string>();
    const counts: Record<string, number> = {};
    allMods.forEach(mod => {
      mod.tags.forEach(tag => {
        tags.add(tag);
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return {
      allTags: Array.from(tags).sort((a, b) => a.localeCompare(b)),
      tagCounts: counts,
    };
  }, []);

  const enabledModsCount = useMemo(() => mods.filter(mod => mod.enabled).length, [mods]);

  const isModConfigValid = (mod: Mod): boolean => {
    if (!mod.configOptions) {
      return true;
    }
    return mod.configOptions.every(opt => {
      if (!opt.required) return true;
       if (opt.type === 'level_config') {
        try {
          const levels = JSON.parse(opt.value);
          if (!Array.isArray(levels) || levels.length === 0) return false;
          return levels.every(level => level.level && level.title && level.icon && level.color);
        } catch {
          return false;
        }
      }
      return opt.value !== undefined && opt.value !== null && opt.value !== '';
    });
  };

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
        const name = t(`mod_${mod.id}_name`).toLowerCase();
        const description = t(`mod_${mod.id}_description`).toLowerCase();
        return (
          name.includes(lowerCaseQuery) ||
          description.includes(lowerCaseQuery)
        );
      });
  }, [mods, activeCategory, activeTags, searchQuery, t]);

  const handleToggleMod = (modId: string) => {
    const modToToggle = mods.find(m => m.id === modId);
    if (!modToToggle) return;

    // If user is trying to enable a mod with invalid config
    if (!modToToggle.enabled && !isModConfigValid(modToToggle)) {
      toast({
        title: t('modCantBeEnabledTitle'),
        description: t('modCantBeEnabledDescription'),
        variant: "destructive",
      });
      return;
    }

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
    if (enabledMods.length === 0) return '';
    
    const jsMods = enabledMods.filter(mod => mod.modType === 'javascript');
    const cssMods = enabledMods.filter(mod => mod.modType === 'css');
    
    // --- Link Generation ---
    const fontMod = enabledMods.find(m => m.id === 'global-font-customizer');
    const selectedFont = fontMod?.configOptions?.find(o => o.key === 'fontFamily')?.value;
    const needsGoogleIcons = enabledMods.some(mod => mod.requiresGoogleIcons);
    const needsFontAwesome = enabledMods.some(mod => mod.requiresFontAwesome);
    
    const links: string[] = [];
    if (needsGoogleIcons) {
      links.push('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,1,0" />');
    }
     if (needsFontAwesome) {
      links.push('<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css" />');
    }
    if (selectedFont) {
      const fontUrl = `https://fonts.googleapis.com/css2?family=${selectedFont.replace(/ /g, '+')}:wght@400;700&display=swap`;
      links.push(`<link rel="stylesheet" href="${fontUrl}" />`);
    }
    const linksBlock = links.join('\n');

    // --- CSS Generation ---
    const cssString = cssMods.length > 0 ?
      cssMods.map(mod => {
        let modCss = mod.cssString || '';
        const config: Record<string, string> = {};
        if (mod.configOptions) {
          mod.configOptions.forEach(opt => {
            config[opt.key] = opt.value;
          });
        }
        
        // Process conditionals based on config values
        modCss = modCss.replace(
            /\/\*\[--if ([a-zA-Z0-9_]+)--\]\*\/([\s\S]*?)\/\*\[--endif \1--\]\*\//g,
            (match, key, content) => {
                const configValue = config[key.trim()];
                const isTruthy = configValue && configValue !== 'false' && configValue !== '';
                return isTruthy ? content : '';
            }
        );

        // Replace placeholders
        modCss = modCss.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (_, key) => config[key.trim()] || '');
        
        if (modCss.trim() === '') return '';

        return `/* --- Mod: ${t(`mod_${mod.id}_name`)} --- */\n${modCss.trim()}`;
      }).filter(Boolean).join('\n\n')
      : '';
    
    const styleBlock = cssString ? `<style>\n${cssString}\n</style>` : '';

    // --- JS Generation ---
    const scriptBlock = jsMods.length > 0 ? (() => {
      const modObjects = jsMods.map(mod => {
        const config: Record<string, string> = {};
        mod.configOptions?.forEach(opt => {
          config[opt.key] = opt.value;
        });

        const functionImplementation = mod.functionString;
        
        return `{
          id: '${mod.id}',
          name: "${t(`mod_${mod.id}_name`)}",
          config: ${JSON.stringify(config, null, 2)},
          run: ${functionImplementation}
        }`;
      });

      const modsArrayString = `const mods = [\n  ${modObjects.join(',\n  ')}\n];`;

      return `<script>
  // Helper functions for targeting elements
  const qs = (arg, queryFrom = document) => queryFrom.querySelector(arg);
  const qsa = (arg, queryFrom = document) => queryFrom.querySelectorAll(arg);

  // Set to true when debugging. Will log tests to the console
  const debug = false;

  // Helper function for conditional logging
  function log(message, ...args) {
    if (debug) {
      console.log(message, ...args);
    }
  }

  ${modsArrayString}

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

  // Run on Turbo frame element reload
  document.addEventListener("turbo:frame-render", executeMods);
  
  // Run on Turbo navigation
  document.addEventListener("turbo:load", executeMods);
<\/script>`;
    })() : '';

    return [linksBlock, styleBlock, scriptBlock].filter(Boolean).join('\n\n');
  }, [mods, t]);

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
  
  if (!isMounted) {
    return null;
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto px-4 flex flex-col min-h-full">
        <div className="flex-grow">
          <header className="text-center pt-8 mb-6">
              <div className="flex justify-end mb-4 -mt-4">
                <LocaleSwitcher />
              </div>
              <h1 className="font-headline text-4xl font-bold mb-1">{t('pageTitle')}</h1>
              <p className="text-md text-muted-foreground max-w-2xl mx-auto">
                  {t('pageDescription')}
              </p>
              <p className="text-base text-primary font-semibold mt-2">
                  {enabledModsCount > 0 
                    ? t('enabledMods', { count: enabledModsCount }) 
                    : t('gettingStarted')}
              </p>
          </header>
          
          <Accordion type="single" collapsible className="w-full mb-8">
              <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-headline hover:no-underline">{t('howToUseTitle')}</AccordionTrigger>
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

          <div className="relative">
            <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm -mx-4 px-4 pt-2 pb-4 mb-8 border-b">
                <div className="p-4 bg-card border rounded-lg shadow-sm">
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
                                {category === 'All' ? t('all') : t(`category_${category.toLowerCase()}`)}
                            </Button>
                            ))}
                        </div>
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex flex-wrap gap-2 items-center">
                          <DropdownMenu open={tagDropdownOpen} onOpenChange={setTagDropdownOpen}>
                              <DropdownMenuTrigger asChild>
                                  <Button variant="outline">
                                      <Filter className="mr-2 h-4 w-4" />
                                      {t('tagsLabel')}
                                      {activeTags.length > 0 && (
                                          <div className="ml-2 h-4 w-4 text-xs flex items-center justify-center rounded-full bg-primary text-primary-foreground">
                                              {activeTags.length}
                                          </div>
                                      )}
                                      <ChevronDown className="ml-2 h-4 w-4" />
                                  </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="w-64" align="start">
                                  <Command>
                                      <CommandInput placeholder={t('filterByTag')} />
                                      <CommandList>
                                          <CommandEmpty>{t('noTagsFound')}</CommandEmpty>
                                          <CommandGroup>
                                              {allTags.map(tag => {
                                                  const isSelected = activeTags.includes(tag);
                                                  return (
                                                      <CommandItem
                                                          key={tag}
                                                          value={tag}
                                                          onSelect={() => {
                                                            handleTagClick(tag);
                                                          }}
                                                      >
                                                          <div className={cn(
                                                              "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                                              isSelected
                                                                  ? "bg-primary text-primary-foreground"
                                                                  : "opacity-50 [&_svg]:invisible"
                                                          )}>
                                                              <Check className={cn("h-4 w-4")} />
                                                          </div>
                                                          <span className="flex-grow">{t(`tag_${tag}`)}</span>
                                                          <span className="text-xs text-muted-foreground">{tagCounts[tag]}</span>
                                                      </CommandItem>
                                                  )
                                              })}
                                          </CommandGroup>
                                      </CommandList>
                                  </Command>
                              </DropdownMenuContent>
                          </DropdownMenu>

                          {activeTags.length > 0 && (
                              <Button variant="ghost" size="sm" onClick={() => setActiveTags([])} className="h-auto py-0.5 px-2">{t('clear')}</Button>
                          )}
                      </div>

                      {!isMobile && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium shrink-0">{t('layout')}</span>
                            <div className="flex items-center gap-2">
                                <Button variant={layout === 'grid' ? 'default' : 'outline'} size="sm" onClick={() => setLayout('grid')}>
                                  <LayoutGrid className="mr-2 h-4 w-4" />
                                  {t('layoutGrid')}
                                </Button>
                                <Button variant={layout === 'list' ? 'default' : 'outline'} size="sm" onClick={() => setLayout('list')}>
                                  <List className="mr-2 h-4 w-4" />
                                  {t('layoutList')}
                                </Button>
                              </div>
                        </div>
                      )}
                    </div>
                </div>
            </div>


            <div className={cn(
              "transition-all",
              !isMobile && layout === 'grid'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
                : 'grid grid-cols-1 gap-4'
            )}>
                {filteredMods.map(mod =>
                  <ModCard
                      key={mod.id}
                      mod={mod}
                      onToggle={() => handleToggleMod(mod.id)}
                      onConfigure={() => handleOpenConfig(mod)}
                      onPreview={() => setPreviewingMod(mod)}
                      isConfigValid={isModConfigValid(mod)}
                  />
                )}
            </div>
            
            {filteredMods.length === 0 && (
                <p className="text-center col-span-full text-muted-foreground mt-8">{t('noModsFound')}</p>
            )}

          </div>

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

        {enabledModsCount > 0 && (
          <div className="fixed bottom-6 right-6 z-50">
            <Button onClick={handleCopy} size="lg" className="shadow-2xl">
                {copied ? <Check className="mr-2 h-5 w-5" /> : <ClipboardCopy className="mr-2 h-5 w-5" />}
                {t('copyCodeButton', { count: enabledModsCount })}
            </Button>
          </div>
        )}

        <footer className="text-center p-4 text-muted-foreground text-sm">
          <p dangerouslySetInnerHTML={{ __html: t('footerDisclaimer')}}/>
        </footer>
      </div>
    </TooltipProvider>
  );
}

    