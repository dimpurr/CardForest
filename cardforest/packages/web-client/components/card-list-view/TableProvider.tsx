import { useEffect, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  FilterFn,
  Table,
} from '@tanstack/react-table';
import { useAtom } from 'jotai';
import { tableConfigAtom } from '@/atoms/tableConfig';

interface TableProviderProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  children: (table: Table<T>) => React.ReactNode;
}

// 定义过滤器函数
const filterFns: Record<string, FilterFn<any>> = {
  contains: (row, columnId, value) => {
    const cellValue = row.getValue(columnId);
    return String(cellValue)
      .toLowerCase()
      .includes(String(value).toLowerCase());
  },
  equals: (row, columnId, value) => {
    const cellValue = row.getValue(columnId);
    return String(cellValue).toLowerCase() === String(value).toLowerCase();
  },
  startsWith: (row, columnId, value) => {
    const cellValue = row.getValue(columnId);
    return String(cellValue)
      .toLowerCase()
      .startsWith(String(value).toLowerCase());
  },
  endsWith: (row, columnId, value) => {
    const cellValue = row.getValue(columnId);
    return String(cellValue)
      .toLowerCase()
      .endsWith(String(value).toLowerCase());
  },
};

export function TableProvider<T>({ data, columns, children }: TableProviderProps<T>) {
  const [tableConfig, setTableConfig] = useAtom(tableConfigAtom);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting: tableConfig.sorting,
      columnFilters: tableConfig.filters,
      columnVisibility: tableConfig.columnVisibility,
      columnOrder: tableConfig.columnOrder,
      columnSizing: tableConfig.columnSizing,
    },
    onSortingChange: (sorting) => {
      setTableConfig((prev) => ({
        ...prev,
        sorting: sorting as SortingState,
      }));
    },
    onColumnFiltersChange: (filters) => {
      setTableConfig((prev) => ({
        ...prev,
        filters,
      }));
    },
    onColumnVisibilityChange: (columnVisibility) => {
      setTableConfig((prev) => ({
        ...prev,
        columnVisibility,
      }));
    },
    onColumnOrderChange: (columnOrder) => {
      setTableConfig((prev) => ({
        ...prev,
        columnOrder,
      }));
    },
    onColumnSizingChange: (columnSizing) => {
      setTableConfig((prev) => ({
        ...prev,
        columnSizing,
      }));
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    filterFns,
  });

  // 保存表格配置到本地存储
  useEffect(() => {
    localStorage.setItem('tableConfig', JSON.stringify(tableConfig));
  }, [tableConfig]);

  return (
    <div className="w-full">
      {children(table)}
    </div>
  );
}
