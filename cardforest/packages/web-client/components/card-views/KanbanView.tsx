import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Card } from '@/types/card';
import { KanbanColumn } from './KanbanColumn';
import { KanbanCard } from './KanbanCard';

interface KanbanViewProps {
  data: Card[];
}

type Status = 'todo' | 'in_progress' | 'done';

interface KanbanItem extends Card {
  status: Status;
}

const defaultStatuses: Status[] = ['todo', 'in_progress', 'done'];
const statusLabels: Record<Status, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export function KanbanView({ data }: KanbanViewProps) {
  // 将卡片数据转换为看板项
  const initialItems = data.map((card) => ({
    ...card,
    status: 'todo' as Status, // 默认状态
  }));

  const [items, setItems] = useState<KanbanItem[]>(initialItems);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getColumnItems = (status: Status) => {
    return items.filter((item) => item.status === status);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragOver = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    const activeItem = items.find((item) => item._id === active.id);
    const overStatus = over.id as Status;

    if (activeItem && activeItem.status !== overStatus) {
      setItems((items) =>
        items.map((item) =>
          item._id === activeItem._id
            ? { ...item, status: overStatus }
            : item
        )
      );
    }
  };

  const handleDragEnd = () => {
    setActiveId(null);
  };

  const activeItem = activeId ? items.find((item) => item._id === activeId) : null;

  return (
    <div className="h-full flex gap-4 p-4 overflow-x-auto">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        {defaultStatuses.map((status) => (
          <KanbanColumn
            key={status}
            id={status}
            title={statusLabels[status]}
            items={getColumnItems(status)}
          />
        ))}

        <DragOverlay>
          {activeItem ? (
            <KanbanCard
              id={activeItem._id}
              title={activeItem.title}
              content={activeItem.content}
              isDragging
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
