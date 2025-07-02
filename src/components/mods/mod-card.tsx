import type { Mod } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Eye } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';

interface ModCardProps {
  mod: Mod;
  onToggle: () => void;
  onConfigure: () => void;
  onPreview: () => void;
}

export default function ModCard({ mod, onToggle, onConfigure, onPreview }: ModCardProps) {
  const { t } = useTranslations();
  const modName = t(`mod_${mod.id}_name`);
  
  return (
    <Card className="flex flex-col hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="space-y-1">
            <CardTitle className="font-headline text-xl">{modName}</CardTitle>
            <CardDescription>{t(`category_${mod.category.toLowerCase()}`)}</CardDescription>
        </div>
        <Switch checked={mod.enabled} onCheckedChange={onToggle} aria-label={`Enable ${mod.name}`}/>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground">{t(`mod_${mod.id}_description`)}</p>
      </CardContent>
      <CardFooter className="flex justify-between items-end">
        <div className="flex flex-wrap gap-1">
          {mod.tags.map(tag => (
            <Badge key={tag} variant="secondary">{t(`tag_${tag}`)}</Badge>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {mod.mediaUrl && (
            <Button variant="ghost" size="icon" onClick={onPreview} aria-label={`Preview ${mod.name}`}>
              <Eye className="h-5 w-5 text-primary" />
            </Button>
          )}
          {mod.configOptions && mod.configOptions.length > 0 && (
            <Button variant="ghost" size="icon" onClick={onConfigure} aria-label={`Configure ${mod.name}`}>
              <Settings className="h-5 w-5 text-primary" />
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
