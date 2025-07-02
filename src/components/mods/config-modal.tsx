"use client"

import type { Mod } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslations } from '@/hooks/use-translations';

interface ConfigModalProps {
  mod: Mod;
  onSave: (modId: string, newConfig: Record<string, string>) => void;
  onClose: () => void;
}

export default function ConfigModal({ mod, onSave, onClose }: ConfigModalProps) {
  const { t } = useTranslations();

  const schema = z.object(
    mod.configOptions?.reduce((acc, option) => {
      let fieldSchema = z.string();
      if (option.required) {
        fieldSchema = fieldSchema.min(1, { message: t('fieldIsRequired') });
      }
      acc[option.key] = fieldSchema;
      return acc;
    }, {} as Record<string, z.ZodString>) || {}
  );
  
  const defaultValues = mod.configOptions?.reduce((acc, option) => {
    acc[option.key] = option.value;
    return acc;
  }, {} as Record<string, string>) || {};

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues
  });

  const onSubmit = (data: Record<string, string>) => {
    onSave(mod.id, data);
  };

  const modName = t(`mod_${mod.id}_name`);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{t('configureTitle', { modName })}</DialogTitle>
          <DialogDescription>
            {t('configureDescription')}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            {mod.configOptions?.map(option => (
              <FormField
                key={option.key}
                control={form.control}
                name={option.key}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t(`mod_${mod.id}_config_${option.key}_label`)}</FormLabel>
                    <FormControl>
                      {option.type === 'text' ? (
                        <Input placeholder={t(`mod_${mod.id}_config_${option.key}_placeholder`)} {...field} />
                      ) : (
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
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>{t('cancel')}</Button>
              <Button type="submit">{t('saveChanges')}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
