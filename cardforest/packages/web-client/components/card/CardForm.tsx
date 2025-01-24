import { useForm } from 'react-hook-form';
import { Template, FieldDefinition } from '@/types/template';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { DebugPanel } from '@/components/debug/DebugPanel';

interface CardFormProps {
  template: Template;
  onSubmit: (data: any) => void;
  defaultValues?: Record<string, any>;
}

export function CardForm({ template, onSubmit, defaultValues = {} }: CardFormProps) {
  const form = useForm({
    defaultValues: {
      title: '',
      content: '',
      body: '',
      ...defaultValues,
    },
  });

  const renderField = (field: FieldDefinition) => {
    const { name, type = 'text', required = false, config = {} } = field;

    return (
      <FormField
        key={name}
        name={name}
        control={form.control}
        rules={{ required }}
        render={({ field: formField }) => (
          <FormItem>
            <FormLabel className="flex items-center gap-2">
              <span>{name}</span>
              <span className="text-xs text-gray-500">({type})</span>
            </FormLabel>
            <FormControl>
              {type === 'text' && (
                <Input
                  {...formField}
                  type="text"
                  placeholder={config.placeholder || `Enter ${name}`}
                />
              )}
              {type === 'textarea' && (
                <Textarea
                  {...formField}
                  placeholder={config.placeholder || `Enter ${name}`}
                />
              )}
              {type === 'checkbox' && (
                <Checkbox
                  {...formField}
                  checked={formField.value}
                  onCheckedChange={formField.onChange}
                />
              )}
            </FormControl>
          </FormItem>
        )}
      />
    );
  };

  return (
    <form id="card-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
      {template.fields.map((group, index) => (
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
  );
}
