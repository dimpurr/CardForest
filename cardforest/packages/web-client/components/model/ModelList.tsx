import { useQuery } from '@apollo/client';
import { GET_MODELS } from '@/graphql/queries/modelQueries';
import { ModelCard } from './ModelCard';
import { useAtom } from 'jotai';
import { selectedModelAtom } from '@/atoms/modelAtoms';
import { Model } from '@/types/model';

export function ModelList() {
  const { data, loading, error } = useQuery(GET_MODELS);
  const [selectedModel, setSelectedModel] = useAtom(selectedModelAtom);

  if (loading) return <div>Loading models...</div>;
  if (error) return <div>Error loading models: {error.message}</div>;

  const models = data?.models || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {models.map((model: Model) => (
        <ModelCard
          key={model._id}
          model={model}
          isSelected={selectedModel?._id === model._id}
          onClick={() => setSelectedModel(model)}
        />
      ))}
      {models.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          No models found. Create your first model!
        </div>
      )}
    </div>
  );
}
