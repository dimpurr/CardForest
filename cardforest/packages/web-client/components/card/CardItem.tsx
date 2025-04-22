import { Card } from '@/atoms/cardAtoms';
import { formatDate } from '@/utils/date';

interface CardItemProps {
  card: Card;
  onClick?: (card: Card) => void;
  className?: string;
}

export function CardItem({ card, onClick, className = '' }: CardItemProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(card);
    }
  };

  return (
    <div 
      className={`card p-4 space-y-2 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${className}`}
      onClick={handleClick}
    >
      <h3 className="text-lg font-medium">{card.title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400 line-clamp-2">{card.content}</p>
      <div className="flex justify-between items-center text-sm text-neutral-500">
        <span>
          {card.createdBy?.username && (
            <>By {card.createdBy.username} · </>
          )}
          {formatDate(card.createdAt)}
        </span>
        {card.model && (
          <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-1 rounded text-xs">
            {card.model.name}
          </span>
        )}
      </div>
    </div>
  );
}
