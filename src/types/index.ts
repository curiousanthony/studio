export interface ConfigOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'number' | 'color' | 'checkbox';
  placeholder?: string;
  options?: string[];
  value: string;
  required?: boolean;
  validationRegex?: string;
  validationMessage?: string;
}

export interface Mod {
  id: string;
  name: string;
  description: string;
  category: 'Appearance' | 'Functionality';
  tags: string[];
  enabled: boolean;
  published?: boolean;
  configOptions?: ConfigOption[];
  modType: 'javascript' | 'css';
  functionString?: string;
  cssString?: string;
  /** A URL or a local path (e.g., /images/mod-preview.png) for the "After" or single preview image. */
  mediaUrl?: string;
  /** A URL or a local path for the "Before" preview image. */
  mediaBeforeUrl?: string;
  previewEnabled?: boolean;
  requiresGoogleIcons?: boolean;
}
