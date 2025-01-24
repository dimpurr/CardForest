import React from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'success' | 'error';
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
        {
          'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100':
            variant === 'default',
          'bg-neutral-100 text-neutral-900 hover:bg-neutral-200/80 dark:bg-neutral-800 dark:text-neutral-100 dark:hover:bg-neutral-800/80':
            variant === 'secondary',
          'bg-green-100 text-green-900 dark:bg-green-900/20 dark:text-green-100':
            variant === 'success',
          'bg-red-100 text-red-900 dark:bg-red-900/20 dark:text-red-100':
            variant === 'error',
        },
        className
      )}
      {...props}
    />
  );
}
