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

  // The main URL is used for YouTube videos, the "after" image, or a single preview image.
  const mainMediaUrl = mod.mediaUrl;
  const beforeMediaUrl = mod.mediaBeforeUrl;

  if (!mainMediaUrl) return null;
  
  const videoId = getYoutubeVideoId(mainMediaUrl);
  const modName = t(`mod_${mod.id}_name`);

  const hasBeforeAfter = beforeMediaUrl && mainMediaUrl && !videoId;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl">
        <DialogHeader>
          <DialogTitle className="font-headline">{t('previewTitle', { modName })}</DialogTitle>
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
          ) : hasBeforeAfter ? (
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2">{t('previewBefore')}</h3>
                    <div className="border rounded-md overflow-hidden">
                        <Image
                            src={beforeMediaUrl!}
                            alt={`'Before' preview for ${modName}`}
                            width={800}
                            height={450}
                            className="w-full h-auto object-contain"
                            data-ai-hint="user interface before"
                        />
                    </div>
                </div>
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold mb-2">{t('previewAfter')}</h3>
                    <div className="border rounded-md overflow-hidden">
                        <Image
                            src={mainMediaUrl}
                            alt={`'After' preview for ${modName}`}
                            width={800}
                            height={450}
                            className="w-full h-auto object-contain"
                            data-ai-hint="user interface after"
                        />
                    </div>
                </div>
            </div>
          ) : (
            <Image
              src={mainMediaUrl}
              alt={`Preview for ${modName}`}
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
