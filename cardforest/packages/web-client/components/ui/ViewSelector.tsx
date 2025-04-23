import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Squares2X2Icon, ListBulletIcon, TableCellsIcon } from '@heroicons/react/24/outline';

export type ViewMode = 'grid' | 'list' | 'table';

interface ViewSelectorProps {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
  className?: string;
}

export function ViewSelector({ value, onChange, className = '' }: ViewSelectorProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(val) => onChange(val as ViewMode)}
      className={className}
    >
      <TabsList className="bg-gray-100 dark:bg-gray-800">
        <TabsTrigger value="grid" className="flex items-center">
          <Squares2X2Icon className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Grid</span>
        </TabsTrigger>
        <TabsTrigger value="list" className="flex items-center">
          <ListBulletIcon className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">List</span>
        </TabsTrigger>
        <TabsTrigger value="table" className="flex items-center">
          <TableCellsIcon className="h-4 w-4 mr-1" />
          <span className="hidden sm:inline">Table</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
