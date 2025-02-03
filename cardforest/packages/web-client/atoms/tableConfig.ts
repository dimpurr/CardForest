import { atom } from 'jotai';
import { SortingState, ColumnFiltersState } from '@tanstack/react-table';

export interface TableConfig {
  sorting: SortingState;
  filters: ColumnFiltersState;
  columnVisibility: Record<string, boolean>;
  columnOrder: string[];
  columnSizing: Record<string, number>;
}

const defaultConfig: TableConfig = {
  sorting: [],
  filters: [],
  columnVisibility: {},
  columnOrder: [],
  columnSizing: {},
};

// 从本地存储加载配置
const loadConfig = (): TableConfig => {
  if (typeof window === 'undefined') return defaultConfig;
  
  const saved = localStorage.getItem('tableConfig');
  if (!saved) return defaultConfig;

  try {
    return JSON.parse(saved) as TableConfig;
  } catch {
    return defaultConfig;
  }
};

export const tableConfigAtom = atom<TableConfig>(loadConfig());
