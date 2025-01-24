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

  const fields = template.fields || {};

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

  return (
    <div className="space-y-4">
      {/* Title Section */}
      <div>
        <label className="block text-sm font-medium mb-1">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="Enter title"
        />
      </div>

      {/* Body Section */}
      <div>
        <label className="block text-sm font-medium mb-1">Body</label>
        <Textarea
          value={formData.body}
          onChange={(e) => handleChange('body', e.target.value)}
          placeholder="Enter body text"
        />
      </div>

      {/* Content Section (Rich Text) */}
      <div>
        <label className="block text-sm font-medium mb-1">Content</label>
        <Textarea
          value={formData.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Enter rich text content"
        />
      </div>

      {/* Meta Section */}
      {Object.keys(fields).length > 0 && (
        <div>
          <label className="block text-sm font-medium mb-2">Meta</label>
          <div className="space-y-2 p-4 bg-background dark:bg-background border rounded-lg">
            {Object.entries(fields).map(([fieldName, field]: [string, any]) => (
              <MetaField
                key={fieldName}
                name={fieldName}
                field={field}
                value={formData.meta[fieldName]}
                onChange={(value) => handleMetaChange(fieldName, value)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
