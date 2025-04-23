import { ReactNode } from 'react';

interface PageTitleProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageTitle({ title, description, actions, className = '' }: PageTitleProps) {
  return (
    <div className={`mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between ${className}`}>
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{description}</p>
        )}
      </div>
      {actions && (
        <div className="mt-4 sm:mt-0 flex space-x-3 justify-end">
          {actions}
        </div>
      )}
    </div>
  );
}
