import { useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_MODELS } from '@/graphql/queries/modelQueries';
import { ModelCard } from '@/components/model/ModelCard';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { getModelId } from '@/utils/modelUtils';

export function CreateCard({ onCardCreated }: { onCardCreated?: () => void }) {
  const router = useRouter();
  const [selectedModelId, setSelectedModelId] = useState<string | null>(null);

  const { data, loading, error } = useQuery(GET_MODELS);

  if (loading) {
    return (
      <div className="p-6">
        <Alert>
          <Alert.Description>Loading models...</Alert.Description>
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
    if (selectedModelId) {
      const modelId = getModelId(selectedModelId);
      if (modelId) {
        router.push(`/cards/new?modelId=${modelId}`);
        onCardCreated?.();
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.models?.map((model: any) => (
          <ModelCard
            key={model._id}
            model={model}
            models={data.models}
            isSelected={selectedModelId === model._id}
            onClick={() => setSelectedModelId(model._id)}
          />
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedModelId}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
