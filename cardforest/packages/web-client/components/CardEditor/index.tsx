import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useAtom } from 'jotai';
import { GET_MODEL_BY_ID } from '@/graphql/queries/modelQueries';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Alert } from '../ui/Alert';
import { DatePicker } from '../ui/DatePicker';
import { MetaField } from './MetaField';
import { cardEditorAtom, modelEditorAtom, type CardEditorData } from '@/atoms/cardAtoms';
import { Model } from '@/atoms/modelAtoms';

interface CardEditorProps {
  modelId: string;
  initialData?: CardEditorData;
  onChange?: (data: CardEditorData) => void;
}

export function CardEditor({ modelId, initialData, onChange }: CardEditorProps) {
  const [formData, setFormData] = useAtom(cardEditorAtom);
  const [model, setModel] = useAtom(modelEditorAtom);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, setFormData]);

  const { loading: modelLoading, error: modelError } = useQuery(
    GET_MODEL_BY_ID,
    {
      variables: { id: modelId },
      skip: !modelId,
      onCompleted: (data) => {
        setModel(data.model);
      },
    }
  );

  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  if (modelLoading) {
    return <div>Loading model...</div>;
  }

  if (modelError) {
    return <Alert variant="destructive">{modelError.message}</Alert>;
  }

  if (!model) {
    return <Alert variant="destructive">Model not found</Alert>;
  }

  const handleChange = (field: keyof CardEditorData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMetaChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      meta: {
        ...prev.meta,
        [field]: value,
      },
    }));
  };

  // Find basic fields group
  const basicFields = model.fields.find(group =>
    group._inherit_from === 'basic' || group._inherit_from === '_self'
  )?.fields || [];

  // Find meta fields groups (all except basic)
  const metaGroups = model.fields.filter(group =>
    group._inherit_from !== 'basic' && group._inherit_from !== '_self'
  );

  return (
    <div className="space-y-4">
      {/* Basic Fields Section */}
      <div className="space-y-4">
        {basicFields.map(field => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-1 capitalize">
              {field.name}
            </label>
            {field.type === 'richtext' ? (
              <Textarea
                value={formData[field.name as keyof CardEditorData] || ''}
                onChange={(e) => handleChange(field.name as keyof CardEditorData, e.target.value)}
                placeholder={`Enter ${field.name}`}
                required={field.required}
              />
            ) : (
              <Input
                value={formData[field.name as keyof CardEditorData] || ''}
                onChange={(e) => handleChange(field.name as keyof CardEditorData, e.target.value)}
                placeholder={`Enter ${field.name}`}
                required={field.required}
              />
            )}
          </div>
        ))}
      </div>

      {/* Meta Fields Section */}
      {metaGroups.map(group => (
        <div key={group._inherit_from} className="space-y-4">
          <h3 className="font-medium text-lg capitalize">{group._inherit_from} Fields</h3>
          {group.fields.map(field => (
            <MetaField
              key={field.name}
              field={field}
              value={formData.meta?.[field.name]}
              onChange={value => handleMetaChange(field.name, value)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
