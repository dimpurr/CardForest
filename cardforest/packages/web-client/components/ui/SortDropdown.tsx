import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ArrowsUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';

export interface SortOption {
  id: string;
  label: string;
  direction?: 'asc' | 'desc';
}

interface SortDropdownProps {
  options: SortOption[];
  selectedOption: string | null;
  onChange: (optionId: string) => void;
  label?: string;
  className?: string;
}

export function SortDropdown({
  options,
  selectedOption,
  onChange,
  label = 'Sort',
  className = ''
}: SortDropdownProps) {
  const selectedOptionLabel = selectedOption
    ? options.find(option => option.id === selectedOption)?.label
    : null;

  return (
    <Menu as="div" className={`relative inline-block text-left ${className}`}>
      <div>
        <Menu.Button className="inline-flex items-center justify-center rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 focus:ring-offset-2 dark:focus:ring-offset-gray-900">
          <ArrowsUpDownIcon className="h-4 w-4 mr-2" aria-hidden="true" />
          {selectedOptionLabel ? selectedOptionLabel : label}
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
            {options.map((option) => (
              <div
                key={option.id}
                className="flex items-center px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => onChange(option.id)}
              >
                <span className="flex-grow text-gray-700 dark:text-gray-300">{option.label}</span>
                {selectedOption === option.id && (
                  <CheckIcon className="h-4 w-4 text-primary-500 dark:text-primary-400" />
                )}
              </div>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
