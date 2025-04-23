import { ReactNode } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface PageStateProps {
  loading?: boolean;
  error?: Error | null | string;
  empty?: boolean;
  emptyMessage?: string;
  loadingMessage?: string;
  children?: ReactNode;
  retry?: () => void;
}

export function PageState({
  loading = false,
  error = null,
  empty = false,
  emptyMessage = 'No data found',
  loadingMessage = 'Loading...',
  children,
  retry
}: PageStateProps) {
  // 显示加载状态
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-gray-300 dark:bg-gray-700 h-12 w-12"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">{loadingMessage}</p>
      </div>
    );
  }

  // 显示错误状态
  if (error) {
    const errorMessage = typeof error === 'string' ? error : error.message;
    
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-3 mb-4">
          <ExclamationTriangleIcon className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Something went wrong</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{errorMessage}</p>
        {retry && (
          <button
            onClick={retry}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-gray-900"
          >
            Try again
          </button>
        )}
      </div>
    );
  }

  // 显示空状态
  if (empty) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
          <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No results found</h3>
        <p className="text-gray-600 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  // 显示内容
  return <>{children}</>;
}
