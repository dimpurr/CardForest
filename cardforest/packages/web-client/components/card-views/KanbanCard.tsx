import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface KanbanCardProps {
  id: string;
  title: string;
  content: string;
  isDragging?: boolean;
}

export function KanbanCard({ id, title, content, isDragging }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm cursor-pointer
        hover:shadow-md transition-shadow
        ${isDragging ? 'opacity-50' : ''}
      `}
      {...attributes}
      {...listeners}
    >
      <h4 className="font-medium text-gray-900 dark:text-white truncate">
        {title}
      </h4>
      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
        {content}
      </p>
    </div>
  );
}
