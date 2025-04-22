import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export interface User {
  _id: string;
  _key: string;
  username: string;
  createdAt: string;
  updatedAt?: string;
}

// 当前用户 atom
export const currentUserAtom = atom<User | null>(null);

// JWT token atom
export const jwtAtom = atom<string | null>(null);

// 认证状态 atom
export const isAuthenticatedAtom = atom<boolean>(false);

// 认证来源 atom（'nextauth' | 'backend' | null）
export const authSourceAtom = atom<string | null>(null);

// 持久化存储认证相关设置
export const authSettingsAtom = atomWithStorage<{
  rememberMe: boolean;
  preferredAuthMethod: string;
}>('authSettings', {
  rememberMe: false,
  preferredAuthMethod: 'nextauth',
});
