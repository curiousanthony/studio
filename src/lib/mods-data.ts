import type { Mod } from '@/types';

export const initialModsData: Mod[] = [
  {
    id: 'welcome-banner',
    name: 'Welcome Banner',
    description: 'Displays a customizable welcome banner at the top of the page.',
    category: 'Appearance',
    tags: ['ui', 'messaging', 'welcome'],
    enabled: true,
    configOptions: [
      {
        key: 'message',
        label: 'Banner Message',
        type: 'text',
        placeholder: 'e.g. Welcome to our school!',
        value: 'Welcome to our school!',
      },
      {
        key: 'position',
        label: 'Banner Position',
        type: 'select',
        options: ['top', 'bottom'],
        value: 'top',
      },
    ],
    functionString: `(config) => {
      const banner = document.createElement('div');
      banner.textContent = config.message || 'Welcome!';
      banner.style.position = 'fixed';
      banner.style.left = '0';
      banner.style.right = '0';
      banner.style[config.position || 'top'] = '0';
      banner.style.backgroundColor = '#2563EB';
      banner.style.color = 'white';
      banner.style.padding = '12px';
      banner.style.textAlign = 'center';
      banner.style.zIndex = '1000';
      document.body.appendChild(banner);
    }`,
  },
  {
    id: 'custom-cursor',
    name: 'Custom Cursor',
    description: 'Changes the default mouse cursor to a custom one.',
    category: 'Appearance',
    tags: ['ui', 'cosmetic'],
    enabled: false,
    configOptions: [
      {
        key: 'cursorUrl',
        label: 'Cursor Image URL',
        type: 'text',
        placeholder: 'https://example.com/cursor.png',
        value: '',
      },
    ],
    functionString: `(config) => {
      if (config.cursorUrl) {
        document.body.style.cursor = \`url(\${config.cursorUrl}), auto\`;
      }
    }`,
  },
  {
    id: 'live-chat',
    name: 'Live Chat Widget',
    description: 'Integrates a third-party live chat widget on your site.',
    category: 'Functionality',
    tags: ['support', 'integration', 'communication'],
    enabled: false,
    configOptions: [
      {
        key: 'widgetId',
        label: 'Widget ID',
        type: 'text',
        placeholder: 'Enter your live chat provider Widget ID',
        value: '',
      },
    ],
    functionString: `(config) => {
      // This is a placeholder for a real integration script
      console.log('Live Chat Widget enabled with ID:', config.widgetId);
      const chatScript = document.createElement('script');
      chatScript.src = \`https://example-chat.com/widget.js?id=\${config.widgetId}\`;
      chatScript.async = true;
      document.body.appendChild(chatScript);
    }`,
  },
  {
    id: 'analytics',
    name: 'Analytics Integration',
    description: 'Adds analytics tracking to your site.',
    category: 'Functionality',
    tags: ['analytics', 'tracking', 'data'],
    enabled: false,
    functionString: `() => {
      console.log('Analytics tracking enabled.');
      // Placeholder for analytics script like Google Analytics
    }`,
  },
    {
    id: 'disable-right-click',
    name: 'Disable Right-Click',
    description: 'Disables the context menu to prevent content copying.',
    category: 'Functionality',
    tags: ['security', 'content protection'],
    enabled: false,
    functionString: `() => {
      document.addEventListener('contextmenu', event => event.preventDefault());
    }`,
  },
  {
    id: 'snow-fall-effect',
    name: 'Snow Fall Effect',
    description: 'Adds a festive snow falling animation to the background.',
    category: 'Appearance',
    tags: ['animation', 'seasonal', 'cosmetic'],
    enabled: false,
    functionString: `() => {
      // A simple implementation of a snow effect
      console.log('Let it snow!');
    }`,
  },
];
