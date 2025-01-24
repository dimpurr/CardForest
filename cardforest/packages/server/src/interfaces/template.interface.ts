export interface FieldDefinition {
  type: string;
  required?: boolean;
  default?: any;
  options?: string[];
  config?: Record<string, any>;
}

export interface Template {
  _key?: string;
  name: string;
  extends?: string;
  fields: Record<string, FieldDefinition>;
  system: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}
