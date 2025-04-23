import { Card } from '@/atoms/cardAtoms';
import { CardItem } from './CardItem';
import { PageState } from '@/components/ui/PageState';
import { ViewMode } from '@/components/ui/ViewSelector';

interface CardListViewProps {
  cards: Card[];
  loading?: boolean;
  error?: Error | null;
  viewMode: ViewMode;
  onCardClick?: (card: Card) => void;
  onCardDelete?: (card: Card) => void;
  onCardDuplicate?: (card: Card) => void;
  emptyMessage?: string;
  className?: string;
}

export function CardListView({ 
  cards, 
  loading, 
  error, 
  viewMode,
  onCardClick,
  onCardDelete,
  onCardDuplicate,
  emptyMessage = 'No cards found',
  className = ''
}: CardListViewProps) {
  // 根据视图模式设置布局类名
  const getLayoutClassName = () => {
    switch (viewMode) {
      case 'grid':
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
      case 'list':
        return 'flex flex-col space-y-4';
      case 'table':
        return 'flex flex-col space-y-2';
      default:
        return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4';
    }
  };

  return (
    <PageState
      loading={loading}
      error={error}
      empty={cards.length === 0}
      emptyMessage={emptyMessage}
    >
      <div className={`${getLayoutClassName()} ${className}`}>
        {cards.map((card) => (
          <CardItem 
            key={card._id} 
            card={card} 
            onClick={onCardClick}
            onDelete={onCardDelete}
            onDuplicate={onCardDuplicate}
            compact={viewMode === 'table'}
          />
        ))}
      </div>
    </PageState>
  );
}
