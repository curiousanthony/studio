import type { Mod } from '@/types';

export const mod: Mod = {
  id: 'sticky-sections',
  name: 'Sticky Section Headers',
  description: 'Makes the section headers in a program sticky to the top of the page when scrolling.',
  category: 'Appearance',
  tags: ['ui', 'lessons', 'sticky'],
  enabled: false,
  published: true,
  modType: 'css',
  configOptions: [
    {
      key: 'topPosition',
      label: 'Top Position (in px)',
      type: 'text',
      value: '0',
      placeholder: 'e.g. 0',
      required: true,
    },
  ],
  cssString: `
div.product-section-view-frame div[id^="products_section_"] > div {
  position: sticky;
  top: {{topPosition}}px;
  background-color: white;
  border-radius: 0.75rem !important;
  z-index: 100;
}
  `,
  mediaUrl: 'https://placehold.co/600x400.png',
  previewEnabled: true,
};
