import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { CREATE_CARD, UPDATE_CARD } from '@/graphql/mutations/cardMutations';
import { CardForm } from './CardForm';
import { Button } from '@/components/ui/Button';
import { Template } from '@/types/template';

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

  const handleSubmit = async (data: any) => {
    try {
      if (mode === 'create') {
        await createCard({
          variables: {
            input: {
              templateId: template._id,
              fields: Object.entries(data).map(([name, value]) => ({
                name,
                value: String(value)
              }))
            }
          }
        });
      } else {
        await updateCard({
          variables: {
            id: card._id,
            input: {
              fields: Object.entries(data).map(([name, value]) => ({
                name,
                value: String(value)
              }))
            }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          {mode === 'create' ? 'Create New Card' : 'Edit Card'}
        </h1>
        <div className="text-sm text-gray-500">
          using template: {template.name}
        </div>
      </div>

      <CardForm
        template={template}
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
