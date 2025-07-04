export interface ConfigOption {
  key: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  options?: string[];
  value: string;
  required?: boolean;
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
