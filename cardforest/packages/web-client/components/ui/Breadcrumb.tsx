import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/20/solid';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
  className?: string;
}

export function Breadcrumb({ items, showHome = true, className = '' }: BreadcrumbProps) {
  const allItems = showHome
    ? [{ label: 'Home', href: '/', icon: HomeIcon }, ...items]
    : items;

  return (
    <nav className={`flex text-sm text-gray-500 dark:text-gray-400 ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center flex-wrap">
        {allItems.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon className="h-4 w-4 mx-1 flex-shrink-0" aria-hidden="true" />
            )}
            <div className="flex items-center">
              {index === 0 && item.icon && (
                <item.icon className="h-4 w-4 mr-1 flex-shrink-0" aria-hidden="true" />
              )}
              {item.href && index < allItems.length - 1 ? (
                <Link
                  href={item.href}
                  className="hover:text-gray-700 dark:hover:text-gray-300 hover:underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={index === allItems.length - 1 ? 'font-medium text-gray-900 dark:text-white' : ''}>
                  {item.label}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
