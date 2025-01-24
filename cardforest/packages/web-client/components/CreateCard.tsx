import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_TEMPLATES } from '@/graphql/queries/templateQueries';
import { TemplateCard } from '@/components/template/TemplateCard';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/alert';
import { getTemplateId } from '@/utils/templateUtils';

export function CreateCard({ onCardCreated }: { onCardCreated?: () => void }) {
  const router = useRouter();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_TEMPLATES);

  if (loading) {
    return (
      <div className="p-6">
        <Alert>
          <Alert.Description>Loading templates...</Alert.Description>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <Alert variant="error">
          <Alert.Title>Error</Alert.Title>
          <Alert.Description>{error.message}</Alert.Description>
        </Alert>
      </div>
    );
  }

  const handleContinue = () => {
    if (selectedTemplateId) {
      const templateId = getTemplateId(selectedTemplateId);
      if (templateId) {
        router.push(`/cards/new?templateId=${templateId}`);
        onCardCreated?.();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.templates?.map((template: any) => (
          <TemplateCard
            key={template._id}
            template={template}
            templates={data.templates}
            isSelected={selectedTemplateId === template._id}
            onClick={() => setSelectedTemplateId(template._id)}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedTemplateId}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
