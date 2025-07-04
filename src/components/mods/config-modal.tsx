"use client"

import type { Mod } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, useFormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '@/hooks/use-translations';
import { Switch } from '@/components/ui/switch';

interface ConfigModalProps {
  mod: Mod;
  onSave: (modId: string, newConfig: Record<string, string>) => void;
  onClose: () => void;
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
        newConfig[key] = String(data[key]);
    }
    onSave(mod.id, newConfig);
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
            {mod.configOptions?.map(option => (
              <FormField
                key={option.key}
                control={form.control}
                name={option.key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t(`mod_${mod.id}_config_${option.key}_label`)}
                      {option.required && <span className="text-destructive"> *</span>}
                    </FormLabel>
                    <FormControl>
                      {(() => {
                        switch (option.type) {
                          case 'number':
                            return <Input type="number" placeholder={t(`mod_${mod.id}_config_${option.key}_placeholder`)} {...field} />;
                          case 'color':
                            return (
                                <div className="flex items-center gap-2">
                                    <Input 
                                        type="color" 
                                        className="h-10 w-12 p-1" 
                                        {...{...field, value: field.value || '#000000'}}
                                    />
                                    <Input 
                                        type="text" 
                                        placeholder={t(`mod_${mod.id}_config_${option.key}_placeholder`)} 
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
                                        <SelectValue placeholder={t(`mod_${mod.id}_config_${option.key}_placeholder`)} />
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
                            return <Input placeholder={t(`mod_${mod.id}_config_${option.key}_placeholder`)} {...field} />;
                        }
                      })()}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
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
