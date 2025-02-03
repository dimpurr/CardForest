import { atom } from 'jotai';

export type CardViewType = 'table' | 'gallery' | 'kanban' | 'feed' | 'article';

interface CardViewsConfig {
  currentView: CardViewType;
}

const defaultConfig: CardViewsConfig = {
  currentView: 'table',
};

// 从本地存储加载配置
const loadConfig = (): CardViewsConfig => {
  if (typeof window === 'undefined') return defaultConfig;
  
  const saved = localStorage.getItem('cardViewsConfig');
  if (!saved) return defaultConfig;

  try {
    return JSON.parse(saved) as CardViewsConfig;
  } catch {
    return defaultConfig;
  }
};

export const cardViewsConfigAtom = atom<CardViewsConfig>(loadConfig());
