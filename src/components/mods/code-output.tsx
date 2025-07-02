"use client"

import { useMemo, useState } from 'react';
import type { Mod } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardCopy, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from '@/components/ui/scroll-area';

interface CodeOutputProps {
  mods: Mod[];
}

export default function CodeOutput({ mods }: CodeOutputProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

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

  return (
    <section className="mt-16 mb-8">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline">Generated Code</CardTitle>
              <CardDescription>Copy the code for all enabled mods.</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy code">
              {copied ? <Check className="h-5 w-5 text-green-500" /> : <ClipboardCopy className="h-5 w-5" />}
            </Button>
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
