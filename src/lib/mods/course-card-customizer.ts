import type { Mod } from '@/types';

export const mod: Mod = {
  id: 'course-card-customizer',
  name: 'Course Card Customizer',
  description: 'Customize the appearance of the course cards on the programs page.',
  category: 'Appearance',
  tags: ['ui', 'program', 'customization'],
  enabled: false,
  published: true,
  modType: 'css',
  previewEnabled: true,
  mediaUrl: 'https://placehold.co/1280x720.png',
  configOptions: [
    {
      key: 'enableCustomBorder',
      label: 'Enable Custom Border',
      type: 'checkbox',
      value: 'true',
    },
    {
      key: 'borderColor',
      label: 'Border Color',
      type: 'color',
      value: '#3b82f6',
      placeholder: '#3b82f6'
    },
    {
      key: 'borderRadius',
      label: 'Border Radius (px)',
      type: 'number',
      placeholder: 'e.g. 12',
      value: '12',
      required: true,
    },
    {
      key: 'cardTitleSuffix',
      label: 'Custom Card Title Suffix',
      type: 'text',
      placeholder: 'e.g. - New!',
      value: '',
      required: false,
      validationRegex: '^[\\s\\-a-zA-Z0-9!]*$',
      validationMessage: 'mod_course-card-customizer_config_cardTitleSuffix_validationMessage',
    },
  ],
  cssString: `
/*[--if enableCustomBorder--]*/
.product-card {
  border: 2px solid {{borderColor}} !important;
  border-radius: {{borderRadius}}px !important;
  overflow: hidden; /* To respect the border radius */
}
/*[--endif enableCustomBorder--]*/

/*[--if cardTitleSuffix--]*/
.product-card .product-card__title:after {
  content: '{{cardTitleSuffix}}';
  color: {{borderColor}};
  font-weight: bold;
  margin-left: 8px;
}
/*[--endif cardTitleSuffix--]*/
  `,
};
