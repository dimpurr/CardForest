import { Card } from '@/atoms/cardAtoms';
import { formatDate } from '@/utils/date';
import { CardMenu } from './CardMenu';
import { ModelBadge } from '../model/ModelBadge';
import { CalendarIcon, UserIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';
import { routes } from '@/config/routes';

interface CardItemProps {
  card: Card;
  onClick?: (card: Card) => void;
  onDelete?: (card: Card) => void;
  onDuplicate?: (card: Card) => void;
  className?: string;
  compact?: boolean;
}

export function CardItem({
  card,
  onClick,
  onDelete,
  onDuplicate,
  className = '',
  compact = false
}: CardItemProps) {
  const router = useRouter();

  const handleClick = () => {
    if (onClick) {
      onClick(card);
    } else {
      router.push(routes.cards.view(card._key));
    }
  };

  // 提取卡片元数据的前几个字段用于显示
  const metaFields = card.meta ? Object.entries(card.meta).slice(0, 2) : [];

  // 计算更新时间
  const isRecent = new Date(card.updatedAt).getTime() > new Date(card.createdAt).getTime();
  const displayDate = isRecent ? card.updatedAt : card.createdAt;

  return (
    <div
      className={`card p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`}
      onClick={handleClick}
    >
      {/* 卡片头部 */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white pr-6">{card.title}</h3>
        <CardMenu
          card={card}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
        />
      </div>

      {/* 卡片内容 */}
      {!compact && (
        <div className="mb-3">
          <p className="text-gray-600 dark:text-gray-300 line-clamp-2">{card.content}</p>
        </div>
      )}

      {/* 卡片元数据 */}
      {!compact && metaFields.length > 0 && (
        <div className="mb-3 grid grid-cols-2 gap-2">
          {metaFields.map(([key, value]) => (
            <div key={key} className="text-xs">
              <span className="text-gray-500 dark:text-gray-400">{key}: </span>
              <span className="text-gray-700 dark:text-gray-300">{String(value)}</span>
            </div>
          ))}
        </div>
      )}

      {/* 卡片底部 */}
      <div className="flex flex-wrap justify-between items-center text-xs text-gray-500 dark:text-gray-400 mt-2">
        <div className="flex items-center space-x-3">
          {card.createdBy?.username && (
            <div className="flex items-center">
              <UserIcon className="h-3 w-3 mr-1" />
              <span>{card.createdBy.username}</span>
            </div>
          )}
          <div className="flex items-center">
            {isRecent ? (
              <ClockIcon className="h-3 w-3 mr-1" />
            ) : (
              <CalendarIcon className="h-3 w-3 mr-1" />
            )}
            <span>{formatDate(displayDate)}</span>
          </div>
        </div>

        {card.model && (
          <ModelBadge model={card.model} />
        )}
      </div>
    </div>
  );
}
