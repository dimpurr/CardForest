import { atom } from 'jotai';
import { Model } from '@/types/model';

export const selectedModelAtom = atom<Model | null>(null);
export const modelListAtom = atom<Model[]>([]);
