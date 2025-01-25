import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_CARD, UPDATE_CARD } from '@/graphql/mutations/cardMutations';
import { GET_TEMPLATE_WITH_INHERITANCE } from '@/graphql/queries/templateQueries';
import { GET_MY_CARDS } from '@/graphql/queries/cardQueries';
import { CardForm } from './CardForm';
import { Button } from '@/components/ui/Button';
import { Template } from '@/types/template';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import toast from 'react-hot-toast';

interface CardEditorProps {
  mode?: 'create' | 'edit';
  template: Template;
  card?: any;
  onSuccess?: () => void;
}

export function CardEditor({
  mode = 'create',
  template,
  card,
  onSuccess,
}: CardEditorProps) {
  const router = useRouter();
  const [createCard] = useMutation(CREATE_CARD, {
    update(cache, { data: { createCard } }) {
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
      } else {
        cache.writeQuery({
          query: GET_MY_CARDS,
          data: {
            myCards: [createCard]
          }
        });
      }
    },
    onCompleted: () => {
      toast.success('Card created successfully!');
      setTimeout(() => {
        router.push('/');
      }, 1000);
    },
    onError: (error) => {
      toast.error(`Failed to create card: ${error.message}`);
    }
  });
  const [updateCard] = useMutation(UPDATE_CARD);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 如果是编辑模式，获取模板数据
  const { data: templateData } = useQuery(GET_TEMPLATE_WITH_INHERITANCE, {
    variables: { id: card?.templateId },
    skip: mode === 'create' || !card?.templateId,
  });

  const handleSubmit = async (data: any) => {
    try {
      setError(null);
      setIsSubmitting(true);
      const input = {
        templateId: template._id.split('/').pop() || '',
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

      console.log('Submitting card data:', input);

      if (mode === 'create') {
        const result = await createCard({
          variables: { input }
        });
        console.log('Card created:', result);
        if (!result.data?.createCard) {
          throw new Error('Failed to create card');
        }
      } else {
        const result = await updateCard({
          variables: {
            id: card._id,
            input
          }
        });
        if (!result.data?.updateCard) {
          throw new Error('Failed to update card');
        }
        onSuccess?.();
        router.push('/cards');
      }
    } catch (error: any) {
      console.error('Failed to save card:', error);
      setError(error.message || 'An error occurred while saving the card');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  // 如果是编辑模式且需要模板数据，等待加载完成
  if (mode === 'edit' && !templateData?.template) {
    return <div>Loading template...</div>;
  }

  // 使用编辑模式下的模板数据或创建模式下传入的模板
  const activeTemplate = mode === 'edit' ? templateData?.template : template;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {mode === 'create' ? 'Create New Card' : 'Edit Card'}
        </h1>
        <div className="text-sm text-gray-500">
          using template: {activeTemplate.name}
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <CardForm
        template={activeTemplate}
        onSubmit={handleSubmit}
        defaultValues={card?.fields?.reduce((acc: any, field: any) => {
          acc[field.name] = field.value;
          return acc;
        }, {})}
      />

      <DebugPanel
        title="Form State"
        data={typeof window !== 'undefined' ? (window as any).form?.getValues() : null}
      />

      <DebugPanel
        title="Template Data"
        data={activeTemplate}
      />

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            if (typeof window !== 'undefined' && !isSubmitting) {
              (window as any).handleSubmit(e);
            }
          }}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : (mode === 'create' ? 'Create Card' : 'Update Card')}
        </Button>
      </div>

    </div>
  );
}
