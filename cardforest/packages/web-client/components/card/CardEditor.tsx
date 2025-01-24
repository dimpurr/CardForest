import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/client';
import { CREATE_CARD, UPDATE_CARD } from '@/graphql/mutations/cardMutations';
import { GET_TEMPLATE_WITH_INHERITANCE } from '@/graphql/queries/templateQueries';
import { CardForm } from './CardForm';
import { Button } from '@/components/ui/Button';
import { Template } from '@/types/template';
import { DebugPanel } from '@/components/debug/DebugPanel';

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
  const [createCard] = useMutation(CREATE_CARD);
  const [updateCard] = useMutation(UPDATE_CARD);

  // 如果是编辑模式，获取模板数据
  const { data: templateData } = useQuery(GET_TEMPLATE_WITH_INHERITANCE, {
    variables: { id: card?.templateId },
    skip: mode === 'create' || !card?.templateId,
  });

  const handleSubmit = async (data: any) => {
    try {
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
      } else {
        await updateCard({
          variables: {
            id: card._id,
            input
          }
        });
      }
      onSuccess?.();
      router.push('/cards');
    } catch (error) {
      console.error('Failed to save card:', error);
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

      <CardForm
        template={activeTemplate}
        onSubmit={handleSubmit}
        defaultValues={card?.fields?.reduce((acc: any, field: any) => {
          acc[field.name] = field.value;
          return acc;
        }, {})}
      />

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button type="submit" form="card-form">
          {mode === 'create' ? 'Create Card' : 'Update Card'}
        </Button>
      </div>
    </div>
  );
}
