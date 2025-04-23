import { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  className?: string;
  autoFocus?: boolean;
}

export function SearchInput({
  placeholder = 'Search...',
  value: externalValue,
  onChange,
  onSearch,
  className = '',
  autoFocus = false
}: SearchInputProps) {
  const [value, setValue] = useState(externalValue || '');
  const [isFocused, setIsFocused] = useState(false);

  // 同步外部值
  useEffect(() => {
    if (externalValue !== undefined && externalValue !== value) {
      setValue(externalValue);
    }
  }, [externalValue]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(value);
    }
  };

  const handleClear = () => {
    setValue('');
    
    if (onChange) {
      onChange('');
    }
    
    if (onSearch) {
      onSearch('');
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <MagnifyingGlassIcon
          className="h-5 w-5 text-gray-400 dark:text-gray-500"
          aria-hidden="true"
        />
      </div>
      <input
        type="text"
        className={`block w-full rounded-md border-0 py-2 pl-10 pr-10 text-gray-900 dark:text-gray-100 ring-1 ring-inset ${
          isFocused
            ? 'ring-primary-500 dark:ring-primary-400'
            : 'ring-gray-300 dark:ring-gray-700'
        } placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-primary-500 dark:focus:ring-primary-400 sm:text-sm sm:leading-6`}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        autoFocus={autoFocus}
      />
      {value && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 dark:text-gray-500 hover:text-gray-500 dark:hover:text-gray-400"
          onClick={handleClear}
        >
          <XMarkIcon className="h-5 w-5" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
