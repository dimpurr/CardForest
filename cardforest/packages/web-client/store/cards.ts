import { atom } from 'jotai';

export interface Card {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy?: {
    username: string;
  };
}

// 存储卡片列表的 atom
export const cardsAtom = atom<Card[]>([]);

// 派生的 atom，用于排序和过滤
export const sortedCardsAtom = atom((get) => {
  const cards = get(cardsAtom);
  return [...cards].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
});
