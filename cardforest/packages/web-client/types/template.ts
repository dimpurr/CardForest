export interface FieldDefinition {
  name: string;
  type: string;
  required?: boolean;
  defaultValue?: any;
}

export interface FieldGroup {
  _inherit_from: string;
  fields: FieldDefinition[];
}

export interface FlattenedField extends FieldDefinition {
  sourceTemplate: string;
}

export interface Template {
  _id: string;
  name: string;
  inherits_from: string[];
  fields: FieldGroup[];
  flattenedFields?: FlattenedField[];
  createdAt: string;
  updatedAt: string;
}
