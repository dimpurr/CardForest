import { useForm, FormProvider } from 'react-hook-form';
import { Model } from '@/atoms/modelAtoms';
import { FieldDefinition } from '@/types/model';
import { FormField } from '@/components/ui/FormField';
import { Button } from '@/components/ui/Button';
import { CardPreview } from './CardPreview';
import { useEffect, useState } from 'react';
import { DebugPanel } from '@/components/debug/DebugPanel';

interface CardFormProps {
  model: Model;
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export function CardForm({
  model,
  onSubmit,
  defaultValues = {},
  onCancel,
  isSubmitting = false
}: CardFormProps) {
  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
      body: '',
      ...defaultValues
    },
  });

  const [showPreview, setShowPreview] = useState(false);
  const formValues = form.watch();

  // 将 form 对象传递给父组件（仅用于调试）
  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
      (window as any).form = form;
    }
  }, [form]);

  const renderField = (field: FieldDefinition) => {
    const { name, type = 'text', required = false, config = {} } = field;

    return (
      <FormField
        key={name}
        name={name}
        label={name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g, ' ')}
        type={type as any}
        required={required}
        description={config.description}
        placeholder={config.placeholder || `Enter ${name}`}
        options={config.options}
      />
    );
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 左侧：表单 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 基础字段区域 */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
              <div className="space-y-4">
                <FormField name="title" label="Title" type="text" required={true} />
                <FormField name="content" label="Content" type="textarea"
                  description="Main content of the card. Supports markdown formatting." />
                <FormField name="body" label="Body" type="textarea"
                  description="Additional content or notes for the card." />
              </div>
            </div>

            {/* 模板字段区域 - 按模板分组并有清晰视觉区分 */}
            {model.fields.map((group, index) => (
              <div key={index} className={`card p-6 ${
                group._inherit_from === '_self'
                  ? 'border-primary-100 dark:border-primary-900/30'
                  : 'border-gray-100 dark:border-gray-800'
              }`}>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  {group._inherit_from === '_self'
                    ? 'Custom Fields'
                    : `Fields from ${group._inherit_from}`}
                  {group._inherit_from !== '_self' && (
                    <span className="ml-2 text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-600 dark:text-gray-400">
                      Inherited
                    </span>
                  )}
                </h3>
                <div className="space-y-4">
                  {group.fields.map((field) => renderField(field))}
                </div>
              </div>
            ))}
          </div>

          {/* 右侧：上下文和预览 */}
          <div className="space-y-6">
            {/* 卡片信息 */}
            <div className="card p-6">
              <h3 className="text-lg font-semibold mb-3">Card Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Model:</span>
                  <span className="font-medium">{model.name}</span>
                </div>
                {model.inherits_from && model.inherits_from.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">Inherits from:</span>
                    <span>{model.inherits_from.length} models</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500 dark:text-gray-400">Fields:</span>
                  <span>{model.fields.reduce((acc, group) => acc + group.fields.length, 0)} fields</span>
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="card p-6">
              <div className="space-y-3">
                <Button
                  variant="primary"
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Card'}
                </Button>

                {onCancel && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={onCancel}
                    type="button"
                  >
                    Cancel
                  </Button>
                )}

                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={() => setShowPreview(!showPreview)}
                  type="button"
                >
                  {showPreview ? 'Hide Preview' : 'Show Preview'}
                </Button>
              </div>
            </div>

            {/* 卡片预览 */}
            {showPreview && (
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-3">Preview</h3>
                <CardPreview
                  formData={formValues}
                  model={{ name: model.name, _id: model._id }}
                />
              </div>
            )}
          </div>
        </div>

        {/* 调试面板 - 仅在开发环境显示 */}
        {process.env.NODE_ENV === 'development' && (
          <DebugPanel
            title="Form State"
            data={{
              values: form.getValues(),
              errors: form.formState.errors,
            }}
          />
        )}
      </form>
    </FormProvider>
  );
}
