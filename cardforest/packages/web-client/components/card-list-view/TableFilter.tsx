import { useAtom } from 'jotai';
import { Column } from '@tanstack/react-table';
import * as Select from '@radix-ui/react-select';
import * as Popover from '@radix-ui/react-popover';
import { tableConfigAtom } from '@/atoms/tableConfig';
import { useState } from 'react';

interface FilterProps<T> {
  column: Column<T, unknown>;
}

export function TableFilter<T>({ column }: FilterProps<T>) {
  const [tableConfig, setTableConfig] = useAtom(tableConfigAtom);
  const [filterValue, setFilterValue] = useState('');

  const operators = [
    { value: 'contains', label: 'Contains' },
    { value: 'equals', label: 'Equals' },
    { value: 'startsWith', label: 'Starts with' },
    { value: 'endsWith', label: 'Ends with' },
  ];

  const handleFilterChange = (value: string) => {
    setFilterValue(value);
    column.setFilterValue(value);
  };

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
          <FilterIcon className="w-4 h-4" />
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 w-64"
          sideOffset={5}
        >
          <div className="space-y-4">
            <Select.Root>
              <Select.Trigger className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 dark:border-gray-700 rounded">
                <Select.Value placeholder="Select operator" />
                <Select.Icon>
                  <ChevronDownIcon className="w-4 h-4" />
                </Select.Icon>
              </Select.Trigger>
              <Select.Portal>
                <Select.Content className="bg-white dark:bg-gray-800 p-1 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                  <Select.Viewport>
                    {operators.map((operator) => (
                      <Select.Item
                        key={operator.value}
                        value={operator.value}
                        className="px-2 py-1 outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <Select.ItemText>{operator.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.Viewport>
                </Select.Content>
              </Select.Portal>
            </Select.Root>

            <input
              type="text"
              value={filterValue}
              onChange={(e) => handleFilterChange(e.target.value)}
              placeholder="Filter value..."
              className="w-full px-3 py-2 border border-gray-200 dark:border-gray-700 rounded bg-transparent"
            />
          </div>

          <Popover.Arrow className="fill-white dark:fill-gray-800" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function FilterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  );
}

function ChevronDownIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
