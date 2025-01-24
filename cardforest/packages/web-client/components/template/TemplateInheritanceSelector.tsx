import { Template } from '@/types/template';

interface TemplateInheritanceSelectorProps {
  availableTemplates: Template[];
  selectedTemplates: string[];
  onChange: (templates: string[]) => void;
}

export function TemplateInheritanceSelector({
  availableTemplates,
  selectedTemplates,
  onChange,
}: TemplateInheritanceSelectorProps) {
  const handleTemplateToggle = (templateId: string) => {
    if (selectedTemplates.includes(templateId)) {
      onChange(selectedTemplates.filter((id) => id !== templateId));
    } else {
      onChange([...selectedTemplates, templateId]);
    }
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Select templates to inherit fields from. Fields from parent templates will be available in this
        template.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {availableTemplates.map((template) => (
          <label
            key={template._id}
            className="flex items-center p-3 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
          >
            <input
              type="checkbox"
              checked={selectedTemplates.includes(template._id)}
              onChange={() => handleTemplateToggle(template._id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <div className="ml-3">
              <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {template.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {template.fields.reduce((count, group) => count + group.fields.length, 0)} fields
              </div>
            </div>
          </label>
        ))}
      </div>
      {selectedTemplates.length > 0 && (
        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Templates:</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {selectedTemplates.map((templateId) => {
              const template = availableTemplates.find((t) => t._id === templateId);
              return (
                <span
                  key={templateId}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {template?.name || templateId}
                  <button
                    type="button"
                    onClick={() => handleTemplateToggle(templateId)}
                    className="ml-1.5 hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
