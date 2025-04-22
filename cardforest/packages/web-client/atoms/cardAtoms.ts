import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface Card {
  _id: string;
  _key: string;
  modelId: string;
  title: string;
  content: string;
  body?: string;
  meta?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  model?: {
    _id: string;
    _key: string;
    name: string;
    fields: {
      _inherit_from: string;
      fields: {
        name: string;
        type: string;
        required?: boolean;
        default?: any;
        config?: any;
      }[];
    }[];
  };
  createdBy?: {
    username: string;
  };
}

// 存储所有卡片的 atom
export const cardsAtom = atom<Card[]>([]);

// 排序后的卡片 atom
export const sortedCardsAtom = atom((get) => {
  const cards = get(cardsAtom);
  return [...cards].sort(
    (a, b) =>
      new Date(b.updatedAt || b.createdAt).getTime() -
      new Date(a.updatedAt || a.createdAt).getTime()
  );
});

// 当前选中的卡片 atom
export const selectedCardAtom = atom<Card | null>(null);

// 卡片编辑器数据 atom
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

// 持久化存储最近编辑的卡片 ID
export const recentCardsAtom = atomWithStorage<string[]>('recentCards', []);
