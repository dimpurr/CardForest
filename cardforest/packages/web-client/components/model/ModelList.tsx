import { useQuery } from '@apollo/client';
import { GET_MODELS } from '@/graphql/queries/modelQueries';
import { ModelCard } from './ModelCard';
import { useAtom, atom } from 'jotai';
import { selectedModelAtom, Model } from '@/atoms/modelAtoms';
import { useState, useEffect } from 'react';
import { SearchInput } from '@/components/ui/SearchInput';
import { ModelCategoryTabs, ModelCategory } from './ModelCategoryTabs';
import { PageState } from '@/components/ui/PageState';
import { useRouter } from 'next/router';
import { atomWithStorage } from 'jotai/utils';

// 持久化存储模型列表视图设置
const modelCategoryAtom = atomWithStorage<ModelCategory>('modelListCategory', 'all');

interface ModelListProps {
  onCreateCard?: (model: Model) => void;
}

export function ModelList({ onCreateCard }: ModelListProps) {
  const router = useRouter();
  const { data, loading, error, refetch } = useQuery(GET_MODELS);
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);
  const [category, setCategory] = useAtom(modelCategoryAtom);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);

  // 当数据加载完成时，应用过滤器
  useEffect(() => {
    if (data?.models) {
      let filtered = [...data.models];

      // 应用分类过滤
      if (category !== 'all') {
        filtered = filtered.filter(model =>
          category === 'system' ? model.system : !model.system
        );
      }

      // 应用搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filtered = filtered.filter(model =>
          model.name.toLowerCase().includes(query)
        );
      }

      setFilteredModels(filtered);
    }
  }, [data, category, searchQuery]);

  // 处理模型点击
  const handleModelClick = (model: Model) => {
    setSelectedModel(model);
  };

  // 处理模型编辑
  const handleEditModel = (model: Model) => {
    router.push(`/models/${model._key}/edit`);
  };

  // 处理创建卡片
  const handleCreateCard = (model: Model) => {
    if (onCreateCard) {
      onCreateCard(model);
    } else {
      router.push(`/cards/new?modelId=${model._key}`);
    }
  };

  // 计算每个模型的使用统计
  const getModelUsageCount = (modelId: string) => {
    // 这里应该实现实际的统计逻辑
    // 目前只是返回一个随机数作为示例
    return Math.floor(Math.random() * 10);
  };

  return (
    <div className="space-y-6">
      {/* 工具栏 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SearchInput
          placeholder="Search models..."
          value={searchQuery}
          onChange={setSearchQuery}
          className="w-full sm:w-64"
        />

        <ModelCategoryTabs
          value={category}
          onChange={setCategory}
        />
      </div>

      {/* 模型列表 */}
      <PageState
        loading={loading}
        error={error}
        empty={filteredModels.length === 0}
        emptyMessage={
          searchQuery
            ? "No models found matching your search."
            : "No models found. Create your first model!"
        }
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModels.map((model: Model) => (
            <ModelCard
              key={model._id}
              model={model}
              isSelected={selectedModel?._id === model._id}
              onClick={() => handleModelClick(model)}
              onCreateCard={() => handleCreateCard(model)}
              usageCount={getModelUsageCount(model._id)}
            />
          ))}
        </div>
      </PageState>
    </div>
  );
}
