import { useState } from 'react';
import { FieldDefinition } from '@/types/model';

interface FieldEditorProps {
  fields: FieldDefinition[];
  onChange: (fields: FieldDefinition[]) => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
  { value: 'date', label: 'Date' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'select', label: 'Select' },
  { value: 'multiselect', label: 'Multi-Select' },
  { value: 'richtext', label: 'Rich Text' },
];

export function FieldEditor({ fields, onChange }: FieldEditorProps) {
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('text');
  const [newFieldRequired, setNewFieldRequired] = useState(false);

  const handleAddField = () => {
    if (!newFieldName.trim()) return;

    const newField: FieldDefinition = {
      name: newFieldName.trim(),
      type: newFieldType,
      required: newFieldRequired,
    };

    onChange([...fields, newField]);
    setNewFieldName('');
    setNewFieldType('text');
    setNewFieldRequired(false);
  };

  const handleRemoveField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
  };

  const handleUpdateField = (index: number, updates: Partial<FieldDefinition>) => {
    onChange(
      fields.map((field, i) => (i === index ? { ...field, ...updates } : field))
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        {fields.map((field, index) => (
          <div
            key={index}
            className="p-4 border rounded-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 space-y-2">
                <input
                  type="text"
                  value={field.name}
                  onChange={(e) => handleUpdateField(index, { name: e.target.value })}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  placeholder="Field name"
                />
                <div className="flex items-center space-x-4">
                  <select
                    value={field.type}
                    onChange={(e) => handleUpdateField(index, { type: e.target.value })}
                    className="block rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
                  >
                    {FIELD_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={field.required}
                      onChange={(e) => handleUpdateField(index, { required: e.target.checked })}
                      className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Required</span>
                  </label>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleRemoveField(index)}
                className="ml-4 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Add New Field</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            value={newFieldName}
            onChange={(e) => setNewFieldName(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
            placeholder="Field name"
          />
          <select
            value={newFieldType}
            onChange={(e) => setNewFieldType(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600"
          >
            {FIELD_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={newFieldRequired}
              onChange={(e) => setNewFieldRequired(e.target.checked)}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Required</span>
          </label>
          <button
            type="button"
            onClick={handleAddField}
            disabled={!newFieldName.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Add Field
          </button>
        </div>
      </div>
    </div>
  );
}
