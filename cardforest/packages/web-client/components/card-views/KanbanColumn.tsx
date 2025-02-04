import { useDroppable } from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { KanbanCard } from './KanbanCard';

interface KanbanColumnProps {
  id: string;
  title: string;
  items: Array<{
    _id: string;
    title: string;
    content: string;
  }>;
}

export function KanbanColumn({ id, title, items }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({
    id,
  });

  return (
    <div className="flex-shrink-0 w-80 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <div className="p-4">
        <h3 className="font-medium text-gray-900 dark:text-white flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {items.length}
          </span>
        </h3>
      </div>

      <div
        ref={setNodeRef}
        className="p-2 space-y-2 min-h-[200px]"
      >
        <SortableContext
          items={items.map((item) => item._id)}
          strategy={verticalListSortingStrategy}
        >
          {items.map((item) => (
            <KanbanCard
              key={item._id}
              id={item._id}
              title={item.title}
              content={item.content}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
