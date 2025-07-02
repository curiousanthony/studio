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
import { Card, CardContent } from "@/components/ui/card";

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
        title: "Copied to clipboard!",
        description: "You can now paste the code into your project.",
      });
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      toast({
        title: "Failed to copy",
        description: "Could not copy code to clipboard.",
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
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-8">
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2">SchoolMaker Mods</h1>
        <p className="text-lg text-muted-foreground">
          Enable, disable, and configure mods to customize your experience.
        </p>
         <p className="text-base text-primary font-semibold mt-2">
          {enabledModsCount} mod{enabledModsCount !== 1 ? 's' : ''} enabled
        </p>
      </header>
      
      <Accordion type="single" collapsible className="w-full mb-8">
        <AccordionItem value="item-1">
          <AccordionTrigger className="text-lg font-headline">How to Use This Tool</AccordionTrigger>
          <AccordionContent>
              <Card>
                  <CardContent className="pt-6 text-sm space-y-4">
                      <p>
                          <strong>Step 1:</strong> Enable and configure the mods you want to use from the list below.
                      </p>
                      <p>
                          <strong>Step 2:</strong> Click the floating "Copy Code" button in the bottom right corner to copy the generated script to your clipboard.
                      </p>
                      <p>
                          <strong>Step 3:</strong> In your SchoolMaker admin dashboard, navigate to <strong>Settings</strong> &gt; <strong>Custom Code</strong>.
                      </p>
                        <p>
                          <strong>Step 4:</strong> Paste the copied code into the text area labeled <strong>&lt;head&gt; Custom Code</strong> and save your changes. The mods will be active on your live school site.
                      </p>
                  </CardContent>
              </Card>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <div className="mb-8 p-4 bg-card border rounded-lg shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <Input
              type="search"
              placeholder="Search mods..."
              className="md:col-span-1"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="flex items-center gap-2 md:col-span-2 justify-center md:justify-start">
              <span className="text-sm font-medium mr-2 shrink-0">Category:</span>
              <div className="flex items-center gap-2 flex-wrap">
                {(['All', 'Appearance', 'Functionality'] as Category[]).map(category => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium mr-2 shrink-0">Tags:</span>
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
                <Button variant="ghost" size="sm" onClick={() => setActiveTags([])} className="h-auto py-0.5 px-2">Clear</Button>
            )}
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
          <p className="text-center col-span-full text-muted-foreground mt-8">No mods match your criteria.</p>
      )}

      <CodeOutput generatedCode={generatedCode} />
      
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
            Copy Code ({enabledModsCount} enabled)
        </Button>
      </div>
    </div>
  );
}
