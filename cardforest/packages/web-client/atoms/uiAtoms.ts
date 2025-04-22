import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

// 主题设置 atom
export const themeAtom = atomWithStorage<'light' | 'dark' | 'system'>('theme', 'system');

// 侧边栏状态 atom
export const sidebarOpenAtom = atom<boolean>(true);

// 移动端菜单状态 atom
export const mobileMenuOpenAtom = atom<boolean>(false);

// 全局加载状态 atom
export const isLoadingAtom = atom<boolean>(false);

// 全局错误状态 atom
export const errorAtom = atom<string | null>(null);

// 全局通知 atom
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
}

export const notificationsAtom = atom<Notification[]>([]);

// 用户界面设置
export const uiSettingsAtom = atomWithStorage<{
  denseMode: boolean;
  cardViewMode: 'grid' | 'list';
  fontSize: 'small' | 'medium' | 'large';
}>('uiSettings', {
  denseMode: false,
  cardViewMode: 'grid',
  fontSize: 'medium',
});
