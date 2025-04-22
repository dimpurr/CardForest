export interface FieldDefinition {
  name: string;
  type: string;
  required?: boolean;
  default?: any;
  options?: string[];
  config?: Record<string, any>;
}

export interface FieldGroup {
  _inherit_from: string;  // Model name this group inherits from
  fields: FieldDefinition[];
}

export interface Model {
  _key?: string;
  _id?: string;
  _rev?: string;
  name: string;
  inherits_from: string[];  // List of models this model inherits from
  fields: FieldGroup[];     // Fields grouped by their source model
  system: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

// Helper type for the flattened view used in the GraphQL API
export interface FlattenedModel {
  _key?: string;
  _id?: string;
  _rev?: string;
  name: string;
  inherits_from: string[];  // List of models this model inherits from
  fields: FieldGroup[];  // Changed from Record<string, FieldDefinition> to FieldGroup[]
  system: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}
