import type { Mod } from '@/types';

export const mod: Mod = {
  id: 'global-font-customizer',
  name: 'Global Font Customizer',
  description: 'Changes the default font for your entire school by importing a Google Font.',
  category: 'Appearance',
  tags: ['ui', 'branding', 'font', 'customization'],
  enabled: false,
  published: true,
  modType: 'css',
  configOptions: [
    {
      key: 'fontFamily',
      label: 'Font Family',
      type: 'select',
      value: 'Inter',
      required: true,
      options: [
        'Inter',
        'Lato',
        'Montserrat',
        'Open Sans',
        'Poppins',
        'Roboto',
        'Source Sans Pro',
      ],
      preview: {
        type: 'font',
        text: 'The quick brown fox jumps over the lazy dog.',
      }
    },
  ],
  cssString: `
html, :host {
  font-family: '{{fontFamily}}', sans-serif !important;
}
  `,
};
