import { CardEditorData } from '@/atoms/cardAtoms';
import { ModelBadge } from '../model/ModelBadge';
import { formatDate } from '@/utils/date';

interface CardPreviewProps {
  formData: CardEditorData;
  model?: {
    name: string;
    _id?: string;
  };
  className?: string;
}

export function CardPreview({ formData, model, className = '' }: CardPreviewProps) {
  // 提取要显示的元数据字段
  const metaFields = formData.meta ? Object.entries(formData.meta).slice(0, 3) : [];

  return (
    <div className={`overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* 卡片头部 */}
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-4 py-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
            {formData.title || 'Untitled Card'}
          </h3>
          {model && <ModelBadge model={model} />}
        </div>
      </div>
      
      {/* 卡片内容 */}
      <div className="p-4 bg-white dark:bg-gray-900">
        {/* 内容预览 */}
        {formData.content ? (
          <div className="prose dark:prose-invert prose-sm max-w-none mb-4">
            <p className="text-gray-600 dark:text-gray-300 line-clamp-3">{formData.content}</p>
          </div>
        ) : (
          <p className="text-gray-400 dark:text-gray-500 italic mb-4">No content</p>
        )}
        
        {/* 元数据预览 */}
        {metaFields.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Metadata</h4>
            <div className="grid grid-cols-2 gap-2">
              {metaFields.map(([key, value]) => (
                <div key={key} className="text-xs">
                  <span className="text-gray-500 dark:text-gray-400">{key}: </span>
                  <span className="text-gray-700 dark:text-gray-300">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* 创建时间 */}
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
          <p>Created {formatDate(new Date().toISOString())}</p>
        </div>
      </div>
    </div>
  );
}
