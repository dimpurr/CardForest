import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface CardFormProps {
  mode: 'create' | 'edit';
  template: any;
  initialValues?: any;
  onSubmit: (data: any) => void;
}

export function CardForm({ mode, template, initialValues, onSubmit }: CardFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues || {});

  useEffect(() => {
    if (initialValues) {
      setFormData(initialValues);
    }
  }, [initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (fieldName: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  const allFields = template.fields.reduce((acc: any[], group: any) => {
    return [...acc, ...group.fields];
  }, []);

  return (
    <form id="card-form" onSubmit={handleSubmit} className="space-y-6">
      {allFields.map((field: any) => (
        <div key={field.name} className="space-y-2">
          <label htmlFor={field.name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {field.name}
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>

          {field.type === 'text' && (
            <Input
              id={field.name}
              type="text"
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          )}

          {field.type === 'date' && (
            <Input
              id={field.name}
              type="date"
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            />
          )}

          {field.type === 'boolean' && (
            <Input
              id={field.name}
              type="checkbox"
              checked={formData[field.name] || false}
              onChange={(e) => handleChange(field.name, e.target.checked)}
              required={field.required}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
          )}

          {field.type === 'select' && (
            <Select
              id={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
            >
              <option value="">Select...</option>
              {field.options?.map((option: string) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </Select>
          )}

          {field.type === 'richtext' && (
            <Textarea
              id={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => handleChange(field.name, e.target.value)}
              required={field.required}
              rows={4}
            />
          )}
        </div>
      ))}
    </form>
  );
}
