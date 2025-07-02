"use client"

import type { Mod } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import Image from 'next/image';
import { useTranslations } from '@/hooks/use-translations';

interface PreviewModalProps {
  mod: Mod;
  onClose: () => void;
}

const getYoutubeVideoId = (url: string): string | null => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export default function PreviewModal({ mod, onClose }: PreviewModalProps) {
  const { t } = useTranslations();

  if (!mod.mediaUrl) return null;
  
  const videoId = getYoutubeVideoId(mod.mediaUrl);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle className="font-headline">{t('previewTitle', { modName: mod.name })}</DialogTitle>
           <DialogDescription>
            {t('previewDescription')}
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 bg-muted rounded-lg overflow-hidden">
          {videoId ? (
            <div className="relative w-full" style={{ paddingTop: '56.25%' }}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full"
              ></iframe>
            </div>
          ) : (
            <Image
              src={mod.mediaUrl}
              alt={`Preview for ${mod.name}`}
              width={1280}
              height={720}
              className="w-full h-auto object-contain"
              data-ai-hint="abstract technology"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
