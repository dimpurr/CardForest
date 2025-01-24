import { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { useAtom } from 'jotai';
import { GET_TEMPLATE_BY_ID } from '../../graphql/queries';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Alert } from '../ui/Alert';
import { DatePicker } from '../ui/DatePicker';
import { MetaField } from './MetaField';
import { cardEditorAtom, cardTemplateAtom, type CardEditorData } from '../../stores/cardEditor';

interface CardEditorProps {
  templateId: string;
  initialData?: CardEditorData;
  onChange?: (data: CardEditorData) => void;
}

export function CardEditor({ templateId, initialData, onChange }: CardEditorProps) {
  const [formData, setFormData] = useAtom(cardEditorAtom);
  const [template, setTemplate] = useAtom(cardTemplateAtom);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData, setFormData]);

  const { loading: templateLoading, error: templateError } = useQuery(
    GET_TEMPLATE_BY_ID,
    {
      variables: { id: templateId },
      skip: !templateId,
      onCompleted: (data) => {
        setTemplate(data.template);
      },
    }
  );

  useEffect(() => {
    if (onChange) {
      onChange(formData);
    }
  }, [formData, onChange]);

  if (templateLoading) {
    return <div>Loading template...</div>;
  }

  if (templateError) {
    return <Alert variant="destructive">{templateError.message}</Alert>;
  }

  if (!template) {
    return <Alert variant="destructive">Template not found</Alert>;
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
  const basicFields = template.fields.find(group => 
    group._inherit_from === 'basic' || group._inherit_from === '_self'
  )?.fields || [];

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
      {template.fields.length > 1 && (
        <div>
          <label className="block text-sm font-medium mb-2">Meta Fields</label>
          <div className="space-y-4">
            {template.fields
              .filter(group => group._inherit_from !== 'basic' && group._inherit_from !== '_self')
              .map(group => (
                <div key={group._inherit_from} className="p-4 bg-background dark:bg-background border rounded-lg">
                  <h3 className="text-sm font-medium mb-3 capitalize">
                    {group._inherit_from === '_self' ? 'Custom Fields' : `From ${group._inherit_from}`}
                  </h3>
                  <div className="space-y-3">
                    {group.fields.map(field => (
                      <MetaField
                        key={field.name}
                        name={field.name}
                        field={field}
                        value={formData.meta[field.name]}
                        onChange={(value) => handleMetaChange(field.name, value)}
                      />
                    ))}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
