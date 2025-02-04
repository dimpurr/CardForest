import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useState } from 'react';
import { Card } from '@/types/card';
import Image from 'next/image';
import { Dialog, DialogContent } from '@/components/ui/Dialog';

interface GalleryViewProps {
  data: Card[];
}

export function GalleryView({ data }: GalleryViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);

  // 计算每行显示的卡片数量
  const getItemsPerRow = () => {
    if (!containerRef.current) return 4;
    const width = containerRef.current.offsetWidth;
    // 根据容器宽度动态计算，最小 200px 宽度
    return Math.max(1, Math.floor(width / 250));
  };

  const itemsPerRow = getItemsPerRow();
  const rows = Math.ceil(data.length / itemsPerRow);

  const rowVirtualizer = useVirtualizer({
    count: rows,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 250, // 卡片高度 + 间距
    overscan: 5,
  });

  const getCardPreviewImage = (card: Card) => {
    // 这里可以根据卡片内容解析第一张图片
    // 暂时返回一个占位图
    return '';
  };

  return (
    <>
      <div
        ref={containerRef}
        className="w-full h-full overflow-auto"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const rowStart = virtualRow.index * itemsPerRow;
            const rowEnd = Math.min(rowStart + itemsPerRow, data.length);
            const rowCards = data.slice(rowStart, rowEnd);

            return (
              <div
                key={virtualRow.index}
                className="absolute top-0 left-0 w-full grid gap-4 p-4"
                style={{
                  transform: `translateY(${virtualRow.start}px)`,
                  gridTemplateColumns: `repeat(${itemsPerRow}, minmax(0, 1fr))`,
                }}
              >
                {rowCards.map((card) => (
                  <div
                    key={card._id}
                    className="aspect-square bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => setSelectedCard(card)}
                  >
                    <div className="relative w-full h-3/5">
                      <Image
                        src={getCardPreviewImage(card)}
                        alt={card.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-900 dark:text-white truncate">
                        {card.title}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                        {card.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>

      <Dialog open={!!selectedCard} onOpenChange={() => setSelectedCard(null)}>
        <DialogContent className="sm:max-w-2xl">
          {selectedCard && (
            <div className="space-y-4">
              <div className="relative w-full aspect-video">
                <Image
                  src={getCardPreviewImage(selectedCard)}
                  alt={selectedCard.title}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {selectedCard.title}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {selectedCard.content}
                </p>
                <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                  Created by {selectedCard.createdBy.username} on{' '}
                  {new Date(selectedCard.createdAt).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
