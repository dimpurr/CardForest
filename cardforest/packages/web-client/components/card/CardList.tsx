import { Card } from '@/atoms/cardAtoms';
import { CardItem } from './CardItem';
import { Alert } from '@/components/ui/Alert';

interface CardListProps {
  cards: Card[];
  loading?: boolean;
  error?: Error | null;
  onCardClick?: (card: Card) => void;
  emptyMessage?: string;
  className?: string;
}

export function CardList({ 
  cards, 
  loading, 
  error, 
  onCardClick,
  emptyMessage = 'No cards found',
  className = ''
}: CardListProps) {
  if (loading) {
    return (
      <Alert>
        <Alert.Description>Loading cards...</Alert.Description>
      </Alert>
    );
  }

  if (error) {
    return (
      <Alert variant="error">
        <Alert.Title>Error</Alert.Title>
        <Alert.Description>{error.message}</Alert.Description>
      </Alert>
    );
  }

  if (cards.length === 0) {
    return (
      <Alert variant="default">
        <Alert.Description>{emptyMessage}</Alert.Description>
      </Alert>
    );
  }

  return (
    <div className={`grid gap-4 ${className}`}>
      {cards.map((card) => (
        <CardItem 
          key={card._id} 
          card={card} 
          onClick={onCardClick} 
        />
      ))}
    </div>
  );
}
