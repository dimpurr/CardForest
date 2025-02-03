import { Model } from '@/types/model';
import { useRouter } from 'next/router';
import { Badge } from '@/components/ui/badge';

interface ModelCardProps {
  model: Model;
  isSelected: boolean;
  onClick: () => void;
}

export function ModelCard({ model, isSelected, onClick }: ModelCardProps) {
  const router = useRouter();
  const hasInheritance = model.inherits_from && model.inherits_from.length > 0;

  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 hover:border-blue-300 dark:border-gray-700'
      }`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{model.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // 从 _id 中提取纯数字 ID
              const id = model._id.replace('models/', '');
              router.push({
                pathname: '/models/[id]/edit',
                query: { id }
              });
            }}
            className="text-sm px-2 py-1 text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
          >
            Edit
          </button>
        </div>
      </div>

      {hasInheritance && (
        <div className="flex flex-wrap gap-2 mb-2">
          {model.inherits_from.map((parentId) => (
            <Badge key={parentId} variant="secondary" className="text-xs">
              Inherits: {parentId}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="mb-2">
          <strong>Fields:</strong>{' '}
          {(model.fields || []).reduce((count, group) => count + (group.fields?.length || 0), 0)}
        </div>
        {(model.fields || []).map((group) => (
          <div key={group._inherit_from} className="text-xs">
            <span className="text-gray-500">
              {group._inherit_from === '_self' ? 'Own fields' : `From ${group._inherit_from}`}:
            </span>{' '}
            {(group.fields || []).map((field) => field.name).join(', ')}
          </div>
        ))}
      </div>
    </div>
  );
}
