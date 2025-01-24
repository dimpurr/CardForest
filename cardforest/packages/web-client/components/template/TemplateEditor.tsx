import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { CREATE_TEMPLATE, UPDATE_TEMPLATE } from '@/graphql/mutations/templateMutations';
import { GET_TEMPLATES } from '@/graphql/queries/templateQueries';
import { FieldEditor } from './FieldEditor';
import { TemplateInheritanceSelector } from './TemplateInheritanceSelector';
import { Template, FieldGroup } from '@/types/template';

interface TemplateEditorProps {
  mode: 'create' | 'edit';
  template?: Template;
}

export function TemplateEditor({ mode, template }: TemplateEditorProps) {
  const router = useRouter();
  const [name, setName] = useState(template?.name || '');
  const [inheritsFrom, setInheritsFrom] = useState<string[]>(template?.inherits_from || []);
  const [fields, setFields] = useState<FieldGroup[]>(
    template?.fields || [{ _inherit_from: '_self', fields: [] }]
  );

  const { data: templatesData } = useQuery(GET_TEMPLATES);
  const availableTemplates = templatesData?.templates || [];

  // 当前模板的字段组应该是从其他模板继承的字段
  const inheritedTemplate = templatesData?.templates?.find(
    (t: any) => t._id === `templates/${fields[0]?._inherit_from}`
  );

  // 获取继承模板的自有字段
  const inheritedFields = inheritedTemplate?.fields?.filter(
    (group: FieldGroup) => group._inherit_from === '_self'
  ) || [];

  const [createTemplate] = useMutation(CREATE_TEMPLATE, {
    refetchQueries: [{ query: GET_TEMPLATES }],
  });

  const [updateTemplate] = useMutation(UPDATE_TEMPLATE, {
    refetchQueries: [{ query: GET_TEMPLATES }],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const input = {
        name,
        inherits_from: inheritsFrom,
        fields: fields,  // 保持原有的字段组
      };

      if (mode === 'create') {
        await createTemplate({ variables: { input } });
      } else if (template?._id) {
        await updateTemplate({
          variables: {
            id: template._id,
            input,
          },
        });
      }

      router.push('/templates');
    } catch (error) {
      console.error('Failed to save template:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Template Name
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
        <TemplateInheritanceSelector
          availableTemplates={availableTemplates}
          selectedTemplates={inheritsFrom}
          onChange={setInheritsFrom}
        />
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">Fields</h2>
          <FieldEditor
            fields={fields[0]?.fields || []}
            onChange={(newFields) =>
              setFields([{ _inherit_from: fields[0]?._inherit_from || '_self', fields: newFields }])
            }
          />
        </div>

        {inheritedFields.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Inherited Fields</h2>
            {inheritedFields.map((group) => (
              <div key={group._inherit_from} className="mt-4">
                <div className="pl-4">
                  {group.fields.map((field) => (
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
            ))}
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
          {mode === 'create' ? 'Create Template' : 'Update Template'}
        </button>
      </div>
    </form>
  );
}
