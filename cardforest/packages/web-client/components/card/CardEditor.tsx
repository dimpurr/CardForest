import { useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { Alert } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CREATE_CARD, UPDATE_CARD } from '@/graphql/mutations/cardMutations';
import { CardForm } from './CardForm';

interface CardEditorProps {
  mode: 'create' | 'edit';
  template?: any;
  card?: any;
}

export function CardEditor({ mode, template, card }: CardEditorProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const [createCard] = useMutation(CREATE_CARD);
  const [updateCard] = useMutation(UPDATE_CARD);

  const handleSubmit = async (formData: any) => {
    try {
      if (mode === 'create') {
        const { data } = await createCard({
          variables: {
            input: {
              templateId: template._id,
              ...formData,
            },
          },
        });
        router.push(`/cards/${data.createCard._id}`);
      } else {
        const { data } = await updateCard({
          variables: {
            input: {
              id: card._id,
              ...formData,
            },
          },
        });
        router.push(`/cards/${data.updateCard._id}`);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert variant="error">
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>{error}</Alert.Description>
        </Alert>
      )}

      <CardForm
        mode={mode}
        template={template}
        initialValues={card}
        onSubmit={handleSubmit}
      />

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" form="card-form">
          {mode === 'create' ? 'Create Card' : 'Update Card'}
        </Button>
      </div>
    </div>
  );
}
