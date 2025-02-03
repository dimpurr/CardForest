import { Model } from '@/types/model';

interface ModelInheritanceSelectorProps {
  availableModels: Model[];
  selectedModels: string[];
  currentModelId: string;  
  onChange: (models: string[]) => void;
}

export function ModelInheritanceSelector({
  availableModels,
  selectedModels,
  currentModelId,
  onChange,
}: ModelInheritanceSelectorProps) {
  const handleModelToggle = (modelId: string) => {
    const model = availableModels.find(t => t._id === modelId);
    if (!model || !canToggleModel(model)) {
      return;
    }

    if (selectedModels.includes(modelId)) {
      onChange(selectedModels.filter((id) => id !== modelId));
    } else {
      onChange([...selectedModels, modelId]);
    }
  };

  const isModelDisabled = (model: Model) => {
    return model._id === currentModelId || selectedModels.includes(model._id);
  };

  const isModelForceChecked = (model: Model) => {
    return selectedModels.includes(model._id);
  };

  const canToggleModel = (model: Model) => {
    return model._id !== currentModelId && !selectedModels.includes(model._id);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Select models to inherit fields from. Fields from parent models will be available in this
        model.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
        {availableModels.map((model) => {
          const isDisabled = isModelDisabled(model);
          const isForceChecked = isModelForceChecked(model);
          
          return (
            <label
              key={model._id}
              className={`flex items-center p-3 rounded-md border border-gray-200 dark:border-gray-700 
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'}`}
            >
              <input
                type="checkbox"
                checked={isForceChecked || selectedModels.includes(model._id)}
                onChange={() => handleModelToggle(model._id)}
                disabled={isDisabled}
                className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded 
                  ${isDisabled ? 'cursor-not-allowed' : ''}`}
              />
              <div className="ml-3">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {model.name}
                  {model._id === currentModelId && " (Current)"}
                  {isForceChecked && " (Parent)"}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {model.fields.reduce((count, group) => count + group.fields.length, 0)} fields
                </div>
              </div>
            </label>
          );
        })}
      </div>
      {selectedModels.length > 0 && (
        <div className="mt-2">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Selected Models:</h4>
          <div className="flex flex-wrap gap-2 mt-1">
            {selectedModels.map((modelId) => {
              const model = availableModels.find((t) => t._id === modelId);
              const isForceChecked = model && isModelForceChecked(model);
              
              return (
                <span
                  key={modelId}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                >
                  {model?.name || modelId}
                  {!isForceChecked && (
                    <button
                      type="button"
                      onClick={() => handleModelToggle(modelId)}
                      className="ml-1.5 hover:text-blue-900 dark:hover:text-blue-100"
                    >
                      ×
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
