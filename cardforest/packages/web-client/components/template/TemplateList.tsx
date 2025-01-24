import { useQuery } from '@apollo/client';
import { GET_TEMPLATES } from '@/graphql/queries/templateQueries';
import { TemplateCard } from './TemplateCard';
import { useAtom } from 'jotai';
import { selectedTemplateAtom } from '@/atoms/templateAtoms';
import { Template } from '@/types/template';

export function TemplateList() {
  const { data, loading, error } = useQuery(GET_TEMPLATES);
  const [selectedTemplate, setSelectedTemplate] = useAtom(selectedTemplateAtom);

  if (loading) return <div>Loading templates...</div>;
  if (error) return <div>Error loading templates: {error.message}</div>;

  const templates = data?.templates || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {templates.map((template: Template) => (
        <TemplateCard
          key={template._id}
          template={template}
          isSelected={selectedTemplate?._id === template._id}
          onClick={() => setSelectedTemplate(template)}
        />
      ))}
      {templates.length === 0 && (
        <div className="col-span-full text-center py-8 text-gray-500">
          No templates found. Create your first template!
        </div>
      )}
    </div>
  );
}
