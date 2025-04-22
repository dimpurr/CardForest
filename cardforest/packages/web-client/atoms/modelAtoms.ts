import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface FieldDefinition {
  name: string;
  type: string;
  required?: boolean;
  default?: any;
  config?: Record<string, any>;
}

export interface FieldGroup {
  _inherit_from: string;
  fields: FieldDefinition[];
}

export interface Model {
  _id: string;
  _key: string;
  name: string;
  inherits_from: string[];
  fields: FieldGroup[];
  system: boolean;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
}

// 模型列表 atom
export const modelListAtom = atom<Model[]>([]);

// 当前选中的模型 atom
export const selectedModelAtom = atom<Model | null>(null);

// 模型编辑器数据 atom
export const modelEditorAtom = atom<Partial<Model>>({
  name: '',
  inherits_from: [],
  fields: [],
  system: false,
});

// 持久化存储最近使用的模型 ID
export const recentModelsAtom = atomWithStorage<string[]>('recentModels', []);
