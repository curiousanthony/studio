
"use client"

import { useEffect } from 'react';
import type { Mod, ConfigOption } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '@/hooks/use-translations';
import { Switch } from '@/components/ui/switch';

interface ConfigModalProps {
  mod: Mod;
  onSave: (modId: string, newConfig: Record<string, string>) => void;
  onClose: () => void;
}

// Helper to format color strings for the color picker input
const toPickerHex = (color: string): string => {
    if (typeof color !== 'string') return '#000000';
    if (color.startsWith('#')) {
        // color picker only supports #rrggbb, so we truncate if alpha is present
        return color.length === 9 ? color.slice(0, 7) : color;
    }
    // Check for 6 digit hex codes and prepend #
    if (/^[0-9a-fA-F]{6}$/.test(color)) {
        return `#${color}`;
    }
    // Check for 8 digit hex codes and prepend #, but drop alpha for picker
    if (/^[0-9a-fA-F]{8}$/.test(color)) {
        return `#${color.slice(0, 6)}`;
    }
    // If it's not a recognizable hex, return black for the picker to prevent errors
    return '#000000'; 
}


export default function ConfigModal({ mod, onSave, onClose }: ConfigModalProps) {
  const { t } = useTranslations();

  const schema = z.object(
    mod.configOptions?.reduce((acc, option) => {
      let fieldSchema: z.ZodTypeAny;

      switch (option.type) {
        case 'checkbox':
          fieldSchema = z.boolean();
          break;
        case 'number':
          fieldSchema = z.coerce.number({ invalid_type_error: t('fieldIsNumber') });
          if (option.required) {
            // Coercing an empty string to a number results in NaN, which fails the number validation.
            // This implicitly handles the "required" check.
          }
          break;
        case 'text':
        case 'color':
        case 'select':
        default:
          let stringSchema = z.string();
          if (option.required) {
            stringSchema = stringSchema.min(1, { message: t('fieldIsRequired') });
          }
          if (option.type === 'text' && option.validationRegex) {
            try {
              const regex = new RegExp(option.validationRegex);
              const messageKey = (option.validationMessage || 'fieldInvalid') as any;
              const message = t(messageKey);
              stringSchema = stringSchema.regex(regex, { message });
            } catch (error) {
                console.error("Invalid regex provided for mod config:", error);
            }
          }
          fieldSchema = stringSchema;
          break;
      }
      
      acc[option.key] = fieldSchema;
      return acc;
    }, {} as Record<string, z.ZodTypeAny>) || {}
  );
  
  const defaultValues = mod.configOptions?.reduce((acc, option) => {
    if (option.type === 'checkbox') {
        acc[option.key] = option.value === 'true';
    } else if (option.type === 'number') {
        const num = parseFloat(option.value);
        acc[option.key] = isNaN(num) ? '' : num;
    }
    else {
        acc[option.key] = option.value;
    }
    return acc;
  }, {} as Record<string, any>) || {};

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange'
  });

  const onSubmit = (data: Record<string, any>) => {
    const newConfig: Record<string, string> = {};
    for (const key in data) {
        const option = mod.configOptions?.find(o => o.key === key);
        let value = data[key];

        if (option?.type === 'color' && typeof value === 'string') {
            // Ensure hex codes have a '#' for CSS validity
            if (!value.startsWith('#') && /^[0-9a-fA-F]{6,8}$/.test(value)) {
                value = `#${value}`;
            }
        }

        newConfig[key] = String(value);
    }
    onSave(mod.id, newConfig);
    onClose();
  };

  const modName = t(`mod_${mod.id}_name`);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="pr-8">
          <DialogTitle className="font-headline">{t('configureTitle', { modName })}</DialogTitle>
          <DialogDescription>
            {t('configureDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            {mod.configOptions?.map(option => {
              const watchedValue = form.watch(option.key);

              // eslint-disable-next-line react-hooks/rules-of-hooks
              useEffect(() => {
                if (option.preview?.type === 'font' && watchedValue) {
                  const fontName = watchedValue as string;
                  const linkId = `dynamic-font-preview-${fontName.replace(/\s+/g, '-')}`;
                  if (!document.getElementById(linkId)) {
                    const link = document.createElement('link');
                    link.id = linkId;
                    link.rel = 'stylesheet';
                    link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}&display=swap`;
                    document.head.appendChild(link);
                  }
                }
              }, [watchedValue, option.preview]);

              return (
                <FormField
                  key={option.key}
                  control={form.control}
                  name={option.key}
                  render={({ field }) => {
                    const placeholderKey = `mod_${mod.id}_config_${option.key}_placeholder` as const;
                    const translatedPlaceholder = t(placeholderKey);
                    // If translation key is returned, it means translation was not found. Fallback to mod definition.
                    const placeholder = translatedPlaceholder === placeholderKey ? option.placeholder : translatedPlaceholder;

                    return (
                      <FormItem>
                        <FormLabel>
                          {t(`mod_${mod.id}_config_${option.key}_label`)}
                          {option.required && <span className="text-destructive"> *</span>}
                        </FormLabel>
                        <FormControl>
                          {(() => {
                            switch (option.type) {
                              case 'number':
                                return <Input type="number" placeholder={placeholder} {...field} />;
                              case 'color':
                                return (
                                    <div className="flex items-center gap-2">
                                        <Input 
                                            type="color" 
                                            className="h-10 w-12 p-1 cursor-pointer" 
                                            // The color picker should update the form with a # prefixed value
                                            onChange={(e) => field.onChange(e.target.value)}
                                            value={toPickerHex(field.value)}
                                        />
                                        <Input 
                                            type="text" 
                                            placeholder={placeholder}
                                            {...field}
                                        />
                                    </div>
                                );
                              case 'checkbox':
                                return (
                                    <div className="flex items-center pt-2">
                                        <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </div>
                                );
                              case 'select':
                                return (
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger>
                                            <SelectValue placeholder={placeholder} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {option.options?.map(opt => (
                                            <SelectItem key={opt} value={opt}>
                                                {opt}
                                            </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                );
                              case 'text':
                              default:
                                return <Input placeholder={placeholder} {...field} />;
                            }
                          })()}
                        </FormControl>
                        {option.preview?.type === 'font' && watchedValue && (
                          <div 
                            className="p-3 border rounded-md mt-2 bg-muted text-muted-foreground" 
                            style={{ fontFamily: `'${watchedValue}', sans-serif`}}
                          >
                            {option.preview.text}
                          </div>
                        )}
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              )
            })}
            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={onClose}>{t('cancel')}</Button>
              <Button type="submit" disabled={!form.formState.isValid}>{t('saveChanges')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
