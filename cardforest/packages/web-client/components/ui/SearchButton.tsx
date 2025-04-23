import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchButtonProps {
  onClick: () => void;
}

export function SearchButton({ onClick }: SearchButtonProps) {
  return (
    <button
      type="button"
      className="p-2 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
      onClick={onClick}
      aria-label="Search"
    >
      <MagnifyingGlassIcon className="h-5 w-5" />
    </button>
  );
}
