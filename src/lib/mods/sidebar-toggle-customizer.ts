import type { Mod } from '@/types';

export const mod: Mod = {
  id: 'sidebar-toggle-customizer',
  name: 'Sidebar Toggle Customizer',
  description: 'Replaces the default sidebar toggle icons with Google Material Icons and allows color customization.',
  category: 'Appearance',
  tags: ['ui', 'customization', 'sidebar', 'icons'],
  enabled: false,
  published: true,
  modType: 'javascript',
  requiresGoogleIcons: true,
  configOptions: [
    {
      key: 'backgroundColor',
      label: 'Background Color',
      type: 'color',
      value: '#111827',
      placeholder: '#111827',
    },
    {
      key: 'iconColor',
      label: 'Icon Color',
      type: 'color',
      value: '#FFFFFF',
      placeholder: '#FFFFFF',
    }
  ],
  functionString: `(config) => {
    const applyStyles = (element, iconName) => {
        if (!element) return;

        // Create the icon span
        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-symbols-outlined';
        iconSpan.textContent = iconName;

        // Apply styles from config
        if (config.backgroundColor) {
            element.style.backgroundColor = config.backgroundColor;
        }
        if (config.iconColor) {
            iconSpan.style.color = config.iconColor;
        }

        // Remove existing SVG
        const existingSvg = element.querySelector('svg');
        if (existingSvg) {
            existingSvg.remove();
        }

        // Remove any old icon before adding the new one
        const existingIcon = element.querySelector('.material-symbols-outlined');
        if(existingIcon) {
            existingIcon.remove();
        }

        element.appendChild(iconSpan);
    };

    // --- Close Button ---
    const closeButton = qs('#lesson-close-sidebar');
    if (closeButton) {
        applyStyles(closeButton, 'left_panel_close');
        log("Sidebar close button customized.");
    } else {
        log("Sidebar close button not found.");
    }

    // --- Open Button ---
    const openButton = qs('#lesson-open-sidebar');
    if (openButton) {
        applyStyles(openButton, 'left_panel_open');
        log("Sidebar open button customized.");
    } else {
        log("Sidebar open button not found.");
    }
}`
};
