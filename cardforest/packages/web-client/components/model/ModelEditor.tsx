import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CREATE_MODEL, UPDATE_MODEL } from '@/graphql/mutations/modelMutations';
import { GET_MODELS } from '@/graphql/queries/modelQueries';
import { FieldEditor } from './FieldEditor';
import { ModelInheritanceSelector } from './ModelInheritanceSelector';
import { Model, FieldGroup, FieldDefinition } from '@/types/model';

interface ModelEditorProps {
  mode: 'create' | 'edit';
  model?: Model;
}

export function ModelEditor({ mode, model }: ModelEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(model?.name || '');
  const [inheritsFrom, setInheritsFrom] = useState<string[]>(() => {
    // Initialize with parent models and ensure they can't be removed
    const parentModels = model?.fields
      ?.filter(group => group._inherit_from !== '_self')
      .map(group => `models/${group._inherit_from}`) || [];
    return parentModels;
  });
  const [fields, setFields] = useState<FieldGroup[]>(
    model?.fields || [{ _inherit_from: '_self', fields: [] }]
  );

  const { data: modelsData } = useQuery(GET_MODELS);
  const availableModels = modelsData?.models || [];

  // 获取继承的模板
  const inheritedModel = modelsData?.models?.find(
    (t: any) => t._id === `models/${fields[0]?._inherit_from}`
  );

  // 获取继承的字段
  const inheritedFields = inheritedModel?.fields?.filter(
    (group: FieldGroup) => group._inherit_from === '_self'
  ) || [];

  // 获取当前模板的字段
  const currentFields = fields[0]?.fields || [];

  // 处理字段更新
  const handleFieldsChange = (newFields: FieldDefinition[]) => {
    setFields([
      { 
        _inherit_from: fields[0]?._inherit_from || '_self',
        fields: newFields
      }
    ]);
  };

  const [createModel] = useMutation(CREATE_MODEL, {
    refetchQueries: [{ query: GET_MODELS }],
  });

  const [updateModel] = useMutation(UPDATE_MODEL, {
    refetchQueries: [{ query: GET_MODELS }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 清理字段数据，移除 __typename
      const cleanFields = fields.map(group => ({
        _inherit_from: group._inherit_from,
        fields: group.fields.map(field => ({
          name: field.name,
          type: field.type,
          required: field.required,
          default: field.default
        }))
      }));

      const input = {
        name,
        inherits_from: inheritsFrom,
        fields: cleanFields,
      };

      if (mode === 'create') {
        await createModel({ variables: { input } });
      } else if (model?._id) {
        await updateModel({
          variables: {
            id: model._id,
            input,
          },
        });
      }

      router.push('/models');
    } catch (error) {
      console.error('Failed to save model:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Model Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600"
          required
        />
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Inheritance</h3>
        <ModelInheritanceSelector
          availableModels={availableModels}
          selectedModels={inheritsFrom}
          currentModelId={model?._id || ''}
          onChange={setInheritsFrom}
        />
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Fields</h2>
          <FieldEditor
            fields={currentFields}
            onChange={handleFieldsChange}
          />
        </div>

        {inheritedFields.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Inherited Fields</h2>
            <div className="pl-4">
              {inheritedFields[0]?.fields?.map((field) => (
                <div key={field.name} className="py-2 text-gray-600">
                  <span className="font-medium">{field.name}</span>
                  <span className="ml-2 text-sm">({field.type})</span>
                  {field.required && (
                    <span className="ml-2 text-xs text-red-500">Required</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {mode === 'create' ? 'Create Model' : 'Update Model'}
        </button>
      </div>
    </form>
  );
}
