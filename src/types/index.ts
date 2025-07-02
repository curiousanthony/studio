export interface ConfigOption {
  key: string;
  label: string;
  type: 'text' | 'select';
  placeholder?: string;
  options?: string[];
  value: string;
}

export interface Mod {
  id: string;
  name: string;
  description: string;
  category: 'Appearance' | 'Functionality';
  tags: string[];
  enabled: boolean;
  configOptions?: ConfigOption[];
  functionString: string;
  mediaUrl?: string;
}
