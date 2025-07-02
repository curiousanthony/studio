import type { Mod } from '@/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Settings, Eye } from 'lucide-react';
import { useTranslations } from '@/hooks/use-translations';

interface ModListItemProps {
  mod: Mod;
  onToggle: () => void;
  onConfigure: () => void;
  onPreview: () => void;
}

export default function ModListItem({ mod, onToggle, onConfigure, onPreview }: ModListItemProps) {
  const { t } = useTranslations();
  const modName = t(`mod_${mod.id}_name`);

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between p-4">
        <div className="flex-1 space-y-1 pr-4">
          <CardTitle className="font-headline text-lg">{modName}</CardTitle>
          <CardDescription>{t(`mod_${mod.id}_description`)}</CardDescription>
          <div className="flex flex-wrap gap-1 pt-2">
            <Badge variant="outline">{t(`category_${mod.category.toLowerCase()}`)}</Badge>
            {mod.tags.map(tag => (
              <Badge key={tag} variant="secondary">{t(`tag_${tag}`)}</Badge>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
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
            <Switch checked={mod.enabled} onCheckedChange={onToggle} aria-label={`Enable ${modName}`} />
        </div>
      </div>
    </Card>
  );
}
