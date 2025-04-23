import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { FunnelIcon, CheckIcon } from '@heroicons/react/24/outline';

export interface FilterOption {
  id: string;
  label: string;
  group?: string;
}

interface FilterDropdownProps {
  options: FilterOption[];
  selectedOptions: string[];
  onChange: (selectedIds: string[]) => void;
  label?: string;
  className?: string;
}

export function FilterDropdown({
  options,
  selectedOptions,
  onChange,
  label = 'Filter',
  className = ''
}: FilterDropdownProps) {
  // 按组分组选项
  const groupedOptions = options.reduce((acc, option) => {
    const group = option.group || 'Default';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(option);
    return acc;
  }, {} as Record<string, FilterOption[]>);

  const handleToggleOption = (optionId: string) => {
    if (selectedOptions.includes(optionId)) {
      onChange(selectedOptions.filter(id => id !== optionId));
    } else {
      onChange([...selectedOptions, optionId]);
    }
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <div>
        <Menu.Button className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
          <FunnelIcon className="h-4 w-4 mr-2" aria-hidden="true" />
          {label}
          {selectedOptions.length > 0 && (
            <span className="ml-1 rounded-full bg-primary-100 dark:bg-primary-900 px-2 py-0.5 text-xs font-medium text-primary-700 dark:text-primary-300">
              {selectedOptions.length}
            </span>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {Object.entries(groupedOptions).map(([group, groupOptions]) => (
              <div key={group} className="px-1 py-1">
                {group !== 'Default' && (
                  <div className="px-3 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {group}
                  </div>
                )}
                {groupOptions.map((option) => (
                  <div
                    key={option.id}
                    className="flex items-center px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    onClick={() => handleToggleOption(option.id)}
                  >
                    <div className={`w-4 h-4 mr-3 rounded border flex items-center justify-center ${
                      selectedOptions.includes(option.id)
                        ? 'bg-primary-500 border-primary-500 dark:bg-primary-600 dark:border-primary-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {selectedOptions.includes(option.id) && (
                        <CheckIcon className="h-3 w-3 text-white" />
                      )}
                    </div>
                    <span className="text-gray-700 dark:text-gray-300">{option.label}</span>
                  </div>
                ))}
              </div>
            ))}
            
            {selectedOptions.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-700 px-3 py-2">
                <button
                  className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={handleClearAll}
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
