import { useForm, FormProvider } from 'react-hook-form';
import { Model, FieldDefinition } from '@/types/model';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { DebugPanel } from '@/components/debug/DebugPanel';
import { useEffect } from 'react';

interface CardFormProps {
  model: Model;
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
}

export function CardForm({ model, onSubmit, defaultValues = {} }: CardFormProps) {
  const form = useForm({
    defaultValues,
  });

  const { fields } = model;

  // 将 form 对象传递给父组件
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).form = form;
      (window as any).handleSubmit = form.handleSubmit(onSubmit);
    }
  }, [form, onSubmit]);

  const renderField = (field: FieldDefinition) => {
    const { name, type = 'text', required = false, config = {} } = field;

    return (
      <FormField
        key={name}
        name={name}
        control={form.control}
        rules={{ required }}
        render={({ field: formField }) => {
          const renderInput = () => {
            switch (type) {
              case 'text':
                return (
                  <Input
                    {...formField}
                    type="text"
                    placeholder={config.placeholder || `Enter ${name}`}
                  />
                );
              case 'textarea':
                return (
                  <Textarea
                    {...formField}
                    placeholder={config.placeholder || `Enter ${name}`}
                  />
                );
              case 'checkbox':
                return (
                  <Checkbox
                    {...formField}
                    checked={formField.value}
                    onCheckedChange={formField.onChange}
                  />
                );
              default:
                return (
                  <Input
                    {...formField}
                    type="text"
                    placeholder={config.placeholder || `Enter ${name}`}
                  />
                );
            }
          };

          return (
            <FormItem>
              <FormLabel>
                {name}
                <span className="ml-2 text-xs text-gray-500">({type})</span>
              </FormLabel>
              <FormControl>
                {renderInput()}
              </FormControl>
              <FormMessage />
            </FormItem>
          );
        }}
      />
    );
  };

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* 基础字段 */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Basic Information</h3>
          <div className="grid gap-4">
            {renderField({ name: 'title', type: 'text', required: true })}
            {renderField({ name: 'content', type: 'textarea' })}
            {renderField({ name: 'body', type: 'textarea' })}
          </div>
        </div>

        {/* 模板字段 */}
        {model.fields.map((group, index) => (
          <div key={index} className="space-y-4">
            <h3 className="text-lg font-medium">
              {group._inherit_from === '_self'
                ? 'Custom Fields'
                : `Inherited from ${group._inherit_from}`}
            </h3>
            <div className="grid gap-4">
              {group.fields.map((field) => renderField(field))}
            </div>
          </div>
        ))}
        <DebugPanel
          title="Form State"
          data={{
            values: form.getValues(),
            errors: form.formState.errors,
          }}
        />
      </form>
    </FormProvider>
  );
}
