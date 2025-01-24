import * as React from 'react';
import { cn } from '../../lib/utils';

interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'error' | 'warning' | 'success';
}

export function Alert({
  className,
  variant = 'default',
  ...props
}: AlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'rounded-lg border p-4',
        {
          'bg-neutral-50 border-neutral-200 text-neutral-800 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-200':
            variant === 'default',
          'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/10 dark:border-red-800 dark:text-red-200':
            variant === 'error',
          'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/10 dark:border-yellow-800 dark:text-yellow-200':
            variant === 'warning',
          'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/10 dark:border-green-800 dark:text-green-200':
            variant === 'success',
        },
        className
      )}
      {...props}
    />
  );
}

interface AlertTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

Alert.Title = function AlertTitle({
  className,
  ...props
}: AlertTitleProps) {
  return (
    <h5
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  );
};

interface AlertDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

Alert.Description = function AlertDescription({
  className,
  ...props
}: AlertDescriptionProps) {
  return (
    <div
      className={cn('text-sm [&_p]:leading-relaxed', className)}
      {...props}
    />
  );
};
