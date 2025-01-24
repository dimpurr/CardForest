import { atom } from 'jotai';
import { Template } from '@/types/template';

export const selectedTemplateAtom = atom<Template | null>(null);
export const templateListAtom = atom<Template[]>([]);
