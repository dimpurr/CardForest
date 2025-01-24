import { atom } from 'jotai';

export interface FieldDefinition {
  name: string;
  type: string;
  required?: boolean;
  config?: Record<string, any>;
}

export interface FieldGroup {
  _inherit_from: string;
  fields: FieldDefinition[];
}

export interface Template {
  _key: string;
  name: string;
  inherits_from: string[];
  fields: FieldGroup[];
  system: boolean;
}

export interface CardEditorData {
  [key: string]: any;
  title: string;
  body: string;
  content: string;
  meta: Record<string, any>;
}

export const cardEditorAtom = atom<CardEditorData>({
  title: '',
  body: '',
  content: '',
  meta: {},
});

export const cardTemplateAtom = atom<Template | null>(null);
