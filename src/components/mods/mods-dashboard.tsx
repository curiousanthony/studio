"use client";

import { useState, useMemo, useEffect } from 'react';
import type { Mod } from '@/types';
import { initialModsData } from '@/lib/mods-data';
import ModCard from './mod-card';
import ConfigModal from './config-modal';
import CodeOutput from './code-output';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

type Category = 'All' | 'Appearance' | 'Functionality';

export default function ModsDashboard() {
  const [mods, setMods] = useState<Mod[]>(initialModsData);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [selectedMod, setSelectedMod] = useState<Mod | null>(null);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    initialModsData.forEach(mod => mod.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags).sort();
  }, []);

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
  
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2">SchoolMaker Mods</h1>
        <p className="text-lg text-muted-foreground">
          Enable, disable, and configure mods to customize your experience.
        </p>
      </header>
      
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
          />
        ))}
      </div>
      
      {filteredMods.length === 0 && (
          <p className="text-center col-span-full text-muted-foreground mt-8">No mods match your criteria.</p>
      )}

      <CodeOutput mods={mods} />
      
      {selectedMod && (
        <ConfigModal
          mod={selectedMod}
          onSave={handleSaveConfig}
          onClose={handleCloseConfig}
        />
      )}
    </div>
  );
}
