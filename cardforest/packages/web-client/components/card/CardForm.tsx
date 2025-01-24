import { useForm, FormProvider } from 'react-hook-form';
import { Form, FormField, FormLabel, FormControl, FormMessage, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { getOwnFields, getInheritedFields } from '@/utils/templateUtils';
import { Template } from '@/types/template';
import { DebugPanel } from '@/components/debug/DebugPanel';

interface CardFormProps {
  template: Template;
  onSubmit: (data: any) => void;
  defaultValues?: any;
}

export function CardForm({ template, onSubmit, defaultValues = {} }: CardFormProps) {
  const form = useForm({
    defaultValues,
  });

  const {
    handleSubmit,
    watch,
    formState: { errors },
  } = form;

  const formValues = watch();

  const ownFields = getOwnFields(template);
  const inheritedFields = getInheritedFields(template);

  const renderField = (field: any) => (
    <FormField
      key={field.name}
      name={field.name}
      render={({ field: formField }) => (
        <FormItem className="space-y-2">
          <FormLabel className="flex items-center gap-2">
            <span className="font-medium">{field.name}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
              {field.type}
            </span>
            {field.required && <span className="text-red-500">*</span>}
          </FormLabel>
          {field.type === 'text' && (
            <FormControl>
              <Input 
                {...formField} 
                className="w-full"
                placeholder={field.default || `Enter ${field.name}`} 
              />
            </FormControl>
          )}
          {field.type === 'date' && (
            <FormControl>
              <Input 
                {...formField} 
                className="w-full"
                type="date" 
                placeholder={field.default || 'Select date'} 
              />
            </FormControl>
          )}
          {field.type === 'boolean' && (
            <FormControl>
              <div className="flex items-center space-x-2">
                <Checkbox
                  checked={formField.value}
                  onCheckedChange={formField.onChange}
                  className="h-5 w-5"
                />
                <span className="text-sm text-gray-600">
                  {field.default ? 'Enabled by default' : 'Disabled by default'}
                </span>
              </div>
            </FormControl>
          )}
          {field.type === 'richtext' && (
            <FormControl>
              <Textarea 
                {...formField} 
                className="w-full min-h-[100px]"
                placeholder={field.default || `Enter ${field.name}`} 
              />
            </FormControl>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <FormProvider {...form}>
      <Form id="card-form" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-8">
          <DebugPanel
            title="Form State"
            data={{
              values: formValues,
              errors,
              submitData: {
                templateId: template._id,
                title: formValues.title || '',
                content: formValues.content || '',
                body: formValues.body || '',
                meta: Object.entries(formValues)
                  .filter(([name]) => !['title', 'content', 'body'].includes(name))
                  .reduce((acc: any, [name, value]) => {
                    acc[name] = value || '';
                    return acc;
                  }, {})
              }
            }}
          />

          {inheritedFields.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Inherited fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {inheritedFields.map(renderField)}
              </div>
            </div>
          )}

          {ownFields.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium border-b pb-2">Own fields</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {ownFields.map(renderField)}
              </div>
            </div>
          )}
        </div>
      </Form>
    </FormProvider>
  );
}
