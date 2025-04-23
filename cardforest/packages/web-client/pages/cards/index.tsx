import { Button } from '@/components/ui/Button';
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useAtom, atom } from 'jotai';
import { sortedCardsAtom, Card } from '@/atoms/cardAtoms';
import { Layout } from '@/components/Layout';
import { useCards } from '@/hooks/api/useCards';
import { useRouter } from 'next/router';
import { withAuth } from '@/components/auth';
import { SearchInput } from '@/components/ui/SearchInput';
import { ViewSelector, ViewMode } from '@/components/ui/ViewSelector';
import { FilterDropdown, FilterOption } from '@/components/ui/FilterDropdown';
import { SortDropdown, SortOption } from '@/components/ui/SortDropdown';
import { CardListView } from '@/components/card/CardListView';
import { CreateCardModal } from '@/components/card/CreateCardModal';
import { PlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { atomWithStorage } from 'jotai/utils';

// 持久化存储卡片列表视图设置
const viewModeAtom = atomWithStorage<ViewMode>('cardListViewMode', 'grid');
const sortOptionAtom = atomWithStorage<string>('cardListSortOption', 'updatedAt_desc');
const filterOptionsAtom = atomWithStorage<string[]>('cardListFilterOptions', []);

// 排序选项
const sortOptions: SortOption[] = [
  { id: 'updatedAt_desc', label: 'Recently Updated', direction: 'desc' },
  { id: 'updatedAt_asc', label: 'Oldest Updated', direction: 'asc' },
  { id: 'createdAt_desc', label: 'Recently Created', direction: 'desc' },
  { id: 'createdAt_asc', label: 'Oldest Created', direction: 'asc' },
  { id: 'title_asc', label: 'Title (A-Z)', direction: 'asc' },
  { id: 'title_desc', label: 'Title (Z-A)', direction: 'desc' },
];

function CardsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { cards, loading: cardsLoading, error, refetchCards } = useCards();
  const [sortedCards, setSortedCards] = useState<Card[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useAtom(viewModeAtom);
  const [sortOption, setSortOption] = useAtom(sortOptionAtom);
  const [filterOptions, setFilterOptions] = useAtom(filterOptionsAtom);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [availableFilters, setAvailableFilters] = useState<FilterOption[]>([]);

  // 处理卡片点击
  const handleCardClick = useCallback((card: Card) => {
    router.push(`/cards/${card._key}`);
  }, [router]);

  // 处理刷新
  const handleRefresh = useCallback(() => {
    refetchCards();
  }, [refetchCards]);

  // 生成可用的过滤选项
  useEffect(() => {
    if (!cards) return;

    // 收集所有模型作为过滤选项
    const modelFilters: FilterOption[] = [];
    const modelIds = new Set<string>();

    cards.forEach(card => {
      if (card.model && !modelIds.has(card.model._id)) {
        modelIds.add(card.model._id);
        modelFilters.push({
          id: `model:${card.model._id}`,
          label: card.model.name,
          group: 'Models'
        });
      }
    });

    // 添加其他过滤选项
    const otherFilters: FilterOption[] = [
      { id: 'recent', label: 'Recently Updated', group: 'Time' },
      { id: 'created_by_me', label: 'Created by Me', group: 'Author' },
    ];

    setAvailableFilters([...modelFilters, ...otherFilters]);
  }, [cards]);

  // 应用搜索、排序和过滤
  useEffect(() => {
    if (!cards) return;

    let filtered = [...cards];

    // 应用搜索
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(card =>
        card.title.toLowerCase().includes(query) ||
        (card.content && card.content.toLowerCase().includes(query))
      );
    }

    // 应用过滤
    if (filterOptions.length > 0) {
      filtered = filtered.filter(card => {
        // 检查每个过滤选项
        return filterOptions.some(filter => {
          // 按模型过滤
          if (filter.startsWith('model:')) {
            const modelId = filter.replace('model:', '');
            return card.model && card.model._id === modelId;
          }

          // 按最近更新过滤
          if (filter === 'recent') {
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            return new Date(card.updatedAt) > oneWeekAgo;
          }

          // 按创建者过滤
          if (filter === 'created_by_me') {
            return card.createdBy && card.createdBy.username === user?.username;
          }

          return false;
        });
      });
    }

    // 应用排序
    if (sortOption) {
      const [field, direction] = sortOption.split('_');

      filtered.sort((a, b) => {
        let valueA, valueB;

        if (field === 'updatedAt' || field === 'createdAt') {
          valueA = new Date(a[field]).getTime();
          valueB = new Date(b[field]).getTime();
        } else if (field === 'title') {
          valueA = a.title.toLowerCase();
          valueB = b.title.toLowerCase();
        } else {
          return 0;
        }

        if (direction === 'asc') {
          return valueA > valueB ? 1 : -1;
        } else {
          return valueA < valueB ? 1 : -1;
        }
      });
    }

    setSortedCards(filtered);
  }, [cards, searchQuery, sortOption, filterOptions, user]);

  return (
    <Layout
      title="My Cards"
      description="View and manage your knowledge cards"
      breadcrumbs={[
        { label: 'Cards' }
      ]}
      actions={
        <Button
          variant="primary"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <PlusIcon className="h-4 w-4 mr-1" />
          Create Card
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Debug section - only shown when URL has ?debug=true */}
        {typeof window !== 'undefined' && window.location.search.includes('debug=true') && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded mb-6">
            <h2 className="text-lg font-semibold mb-2">Debug Info</h2>
            <div className="text-sm">
              <p>JWT: {user ? 'Yes' : 'No'}</p>
              <p>User: {user?.username || 'None'}</p>
            </div>
          </div>
        )}

        {/* 工具栏 */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <SearchInput
            placeholder="Search cards..."
            value={searchQuery}
            onChange={setSearchQuery}
            className="w-full sm:w-64"
          />

          <div className="flex flex-wrap items-center gap-2">
            <FilterDropdown
              options={availableFilters}
              selectedOptions={filterOptions}
              onChange={setFilterOptions}
            />

            <SortDropdown
              options={sortOptions}
              selectedOption={sortOption}
              onChange={setSortOption}
            />

            <ViewSelector
              value={viewMode}
              onChange={setViewMode}
            />

            <Button
              variant="ghost"
              size="icon"
              onClick={handleRefresh}
              title="Refresh"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* 卡片列表 */}
        <CardListView
          cards={sortedCards}
          loading={cardsLoading}
          error={error}
          viewMode={viewMode}
          onCardClick={handleCardClick}
          emptyMessage="No cards found. Create your first card to get started!"
        />
      </div>

      {/* 创建卡片模态框 */}
      <CreateCardModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </Layout>
  );
}

export default withAuth(CardsPage, { handleErrors: true });
