import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useState } from 'react';
import { Card } from '@/types/card';
import { Dialog, DialogContent } from '@/components/ui/Dialog';

interface FeedViewProps {
  data: Card[];
}

export function FeedView({ data }: FeedViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 200,
    overscan: 5,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('default', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto px-4 md:px-0"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          <div className="max-w-2xl mx-auto">
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const card = data[virtualRow.index];
              return (
                <div
                  key={card._id}
                  className="absolute top-0 left-0 w-full"
                  style={{
                    transform: `translateY(${virtualRow.start}px)`,
                    padding: '1rem 0',
                  }}
                >
                  <div
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6"
                    onClick={() => setSelectedCard(card)}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                          {card.createdBy.username[0].toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">
                            {card.createdBy.username}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {formatDate(card.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {card.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                      {card.content}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selectedCard && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  {selectedCard.createdBy.username[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-white">
                    {selectedCard.createdBy.username}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(selectedCard.createdAt)}
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {selectedCard.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                {selectedCard.content}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
