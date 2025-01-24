import { atom } from 'jotai';

export interface CardEditorData {
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

export const cardTemplateAtom = atom<any>(null);
