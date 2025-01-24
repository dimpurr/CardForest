import { Template } from '@/types/template';
import { useRouter } from 'next/router';
import { Badge } from '@/components/ui/badge';

interface TemplateCardProps {
  template: Template;
  isSelected: boolean;
  onClick: () => void;
}

export function TemplateCard({ template, isSelected, onClick }: TemplateCardProps) {
  const router = useRouter();
  const hasInheritance = template.inherits_from && template.inherits_from.length > 0;

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
        <h3 className="text-lg font-semibold">{template.name}</h3>
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // 从 _id 中提取纯数字 ID
              const id = template._id.replace('templates/', '');
              router.push({
                pathname: '/templates/[id]/edit',
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
          {template.inherits_from.map((parentId) => (
            <Badge key={parentId} variant="secondary" className="text-xs">
              Inherits: {parentId}
            </Badge>
          ))}
        </div>
      )}

      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        <div className="mb-2">
          <strong>Fields:</strong>{' '}
          {template.fields.reduce((count, group) => count + group.fields.length, 0)}
        </div>
        {template.fields.map((group) => (
          <div key={group._inherit_from} className="text-xs">
            <span className="text-gray-500">
              {group._inherit_from === '_self' ? 'Own fields' : `From ${group._inherit_from}`}:
            </span>{' '}
            {group.fields.map((field) => field.name).join(', ')}
          </div>
        ))}
      </div>
    </div>
  );
}
