import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_CARD, UPDATE_CARD } from '@/graphql/mutations/cardMutations';
import { GET_MODEL_WITH_INHERITANCE } from '@/graphql/queries/modelQueries';
import { GET_MY_CARDS } from '@/graphql/queries/cardQueries';
import { CardForm } from './CardForm';
import { Model } from '@/atoms/modelAtoms';
import { PageState } from '@/components/ui/PageState';
import { useState } from 'react';
import { Alert } from '@/components/ui/Alert';
import toast from 'react-hot-toast';
import { useAtom } from 'jotai';
import { recentModelsAtom } from '@/atoms/modelAtoms';

interface CardEditorProps {
  mode?: 'create' | 'edit';
  model: Model;
  card?: any;
  onSuccess?: () => void;
}

export function CardEditor({
  mode = 'create',
  model,
  card,
  onSuccess,
}: CardEditorProps) {
  const router = useRouter();
  const [, setRecentModels] = useAtom(recentModelsAtom);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 创建卡片 mutation
  const [createCard] = useMutation(CREATE_CARD, {
    update(cache, { data: { createCard } }) {
      try {
        const existingCards = cache.readQuery<{ myCards: any[] }>({
          query: GET_MY_CARDS
        });

        if (existingCards) {
          cache.writeQuery({
            query: GET_MY_CARDS,
            data: {
              myCards: [...existingCards.myCards, createCard]
            }
          });
        }
      } catch (error) {
        console.error('Error updating cache:', error);
      }
    },
    onCompleted: () => {
      // 添加到最近使用的模型
      setRecentModels(prev => {
        const modelId = model._id;
        return [modelId, ...prev.filter(id => id !== modelId)].slice(0, 5);
      });

      toast.success('Card created successfully!');
      router.push('/cards');
    },
    onError: (error) => {
      toast.error(`Failed to create card: ${error.message}`);
      setError(error.message);
    }
  });

  // 更新卡片 mutation
  const [updateCard] = useMutation(UPDATE_CARD, {
    onCompleted: () => {
      toast.success('Card updated successfully!');
      onSuccess?.();
      router.push('/cards');
    },
    onError: (error) => {
      toast.error(`Failed to update card: ${error.message}`);
      setError(error.message);
    }
  });

  // 如果是编辑模式，获取模板数据
  const { data: modelData, loading: modelLoading, error: modelError } = useQuery(GET_MODEL_WITH_INHERITANCE, {
    variables: { id: card?.modelId },
    skip: mode === 'create' || !card?.modelId,
  });

  // 处理表单提交
  const handleSubmit = async (data: any) => {
    try {
      setError(null);
      setIsSubmitting(true);

      // 准备输入数据
      const input = {
        modelId: model._id.split('/').pop() || '',
        title: data.title || '',
        content: data.content || '',
        body: data.body || '',
        meta: Object.entries(data)
          .filter(([name]) => !['title', 'content', 'body'].includes(name))
          .reduce((acc: any, [name, value]) => {
            acc[name] = value || '';
            return acc;
          }, {})
      };

      // 根据模式执行创建或更新操作
      if (mode === 'create') {
        await createCard({
          variables: { input }
        });
      } else {
        await updateCard({
          variables: {
            id: card._id,
            input
          }
        });
      }
    } catch (error: any) {
      console.error('Failed to save card:', error);
      setError(error.message || 'An error occurred while saving the card');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 处理取消操作
  const handleCancel = () => {
    router.back();
  };

  // 显示加载状态
  if (mode === 'edit' && modelLoading) {
    return (
      <PageState loading={true} />
    );
  }

  // 显示错误状态
  if (mode === 'edit' && modelError) {
    return (
      <PageState
        error={modelError}
        retry={() => router.reload()}
      />
    );
  }

  // 使用编辑模式下的模板数据或创建模式下传入的模板
  const activeModel = mode === 'edit' ? modelData?.model : model;

  // 准备默认值
  const defaultValues = card ? {
    title: card.title || '',
    content: card.content || '',
    body: card.body || '',
    ...(card.meta || {})
  } : {};

  return (
    <div>
      {error && (
        <Alert variant="error" className="mb-6">
          <Alert.Description>{error}</Alert.Description>
        </Alert>
      )}

      <CardForm
        model={activeModel}
        onSubmit={handleSubmit}
        defaultValues={defaultValues}
        onCancel={handleCancel}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
