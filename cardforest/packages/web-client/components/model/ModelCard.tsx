import { Model } from '@/atoms/modelAtoms';
import { useRouter } from 'next/router';
import { Badge } from '@/components/ui/badge';
import { ModelMenu } from './ModelMenu';
import { CubeIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import { formatDate } from '@/utils/date';

interface ModelCardProps {
  model: Model;
  isSelected?: boolean;
  onClick?: () => void;
  onDelete?: (model: Model) => void;
  onCreateCard?: (model: Model) => void;
  usageCount?: number;
  className?: string;
}

export function ModelCard({
  model,
  isSelected = false,
  onClick,
  onDelete,
  onCreateCard,
  usageCount = 0,
  className = ''
}: ModelCardProps) {
  const router = useRouter();
  const hasInheritance = model.inherits_from && model.inherits_from.length > 0;

  // 计算字段总数
  const totalFields = (model.fields || []).reduce(
    (count, group) => count + (group.fields?.length || 0),
    0
  );

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      className={`p-4 rounded-lg border cursor-pointer transition-all ${
        isSelected
          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
          : 'border-gray-200 hover:border-primary-300 dark:border-gray-700'
      } ${className}`}
      onClick={handleClick}
    >
      {/* 卡片头部 */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <CubeIcon className="h-5 w-5 text-primary-500 dark:text-primary-400 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white pr-6">{model.name}</h3>
        </div>
        <ModelMenu
          model={model}
          onDelete={onDelete}
          onCreateCard={onCreateCard}
        />
      </div>

      {/* 系统模型标记 */}
      {model.system && (
        <div className="mb-3">
          <Badge variant="outline" className="text-xs bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800">
            System Model
          </Badge>
        </div>
      )}

      {/* 继承信息 */}
      {hasInheritance && (
        <div className="flex flex-wrap gap-2 mb-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Inherits from:</div>
          <div className="flex flex-wrap gap-1">
            {model.inherits_from.map((parentId) => (
              <Badge key={parentId} variant="secondary" className="text-xs">
                {parentId.replace('models/', '')}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* 字段统计 */}
      <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400 mb-3">
        <div className="flex items-center">
          <DocumentTextIcon className="h-4 w-4 mr-1" />
          <span>{totalFields} fields</span>
        </div>
        {usageCount > 0 && (
          <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {usageCount} cards
          </span>
        )}
      </div>

      {/* 创建时间 */}
      <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
        <CalendarIcon className="h-3 w-3 mr-1" />
        <span>Created {formatDate(model.createdAt)}</span>
      </div>
    </div>
  );
}
