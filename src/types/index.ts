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
  configOptions?: ConfigOption[];
  modType: 'javascript' | 'css';
  functionString?: string;
  cssString?: string;
  mediaUrl?: string;
  previewEnabled?: boolean;
}
