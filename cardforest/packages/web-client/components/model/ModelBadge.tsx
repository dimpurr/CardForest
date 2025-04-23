import { CubeIcon } from '@heroicons/react/24/outline';

interface ModelBadgeProps {
  model: {
    name: string;
    _id?: string;
  } | null | undefined;
  className?: string;
}

export function ModelBadge({ model, className = '' }: ModelBadgeProps) {
  if (!model) return null;

  return (
    <span className={`inline-flex items-center rounded-md bg-primary-50 dark:bg-primary-900/20 px-2 py-1 text-xs font-medium text-primary-700 dark:text-primary-300 ${className}`}>
      <CubeIcon className="mr-1 h-3 w-3" />
      {model.name}
    </span>
  );
}
