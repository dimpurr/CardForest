export interface FieldDefinition {
  name: string;
  type: string;
  required?: boolean;
  default?: any;
  options?: string[];
  config?: Record<string, any>;
}

export interface FieldGroup {
  _inherit_from: string;  // Template name this group inherits from
  fields: FieldDefinition[];
}

export interface Template {
  _key?: string;
  _id?: string;
  name: string;
  inherits_from: string[];  // List of templates this template inherits from
  fields: FieldGroup[];     // Fields grouped by their source template
  system: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

// Helper type for the flattened view used in the GraphQL API
export interface FlattenedTemplate {
  _key?: string;
  _id?: string;
  name: string;
  fields: Record<string, FieldDefinition>;  // Flattened fields for backward compatibility
  system: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}
