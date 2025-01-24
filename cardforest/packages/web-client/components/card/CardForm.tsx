import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { getInheritedFields, getOwnFields } from '@/utils/templateUtils';
import { Template } from '@/types/template';

interface CardFormProps {
  template: Template;
  onSubmit: (data: any) => void;
  defaultValues?: any;
}

export function CardForm({ template, onSubmit, defaultValues = {} }: CardFormProps) {
  // 构建动态的 schema
  const formSchema = z.object(
    template.fields.reduce((acc: any, group) => {
      const fields = group._inherit_from === '_self' ? group.fields : [];
      fields.forEach((field: any) => {
        let fieldSchema = z.string();
        if (field.required) {
          fieldSchema = fieldSchema.min(1, { message: 'Required' });
        } else {
          fieldSchema = fieldSchema.optional();
        }
        acc[field.name] = fieldSchema;
      });
      return acc;
    }, {})
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const ownFields = getOwnFields(template);
  const inheritedFields = getInheritedFields(template);

  const renderField = (field: any, formField: any) => (
    <FormControl>
      {field.type === 'text' || field.type === 'date' || field.type === 'boolean' ? (
        <Input {...formField} type={field.type} />
      ) : (
        <Textarea {...formField} />
      )}
    </FormControl>
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" id="card-form">
        {/* 显示自己的字段 */}
        {ownFields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Own fields</h3>
            {ownFields.map((field: any) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>
                      {field.name}
                      {field.required && '*'}
                    </FormLabel>
                    {renderField(field, formField)}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        )}

        {/* 显示继承的字段 */}
        {inheritedFields.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-700">Inherited fields</h3>
            {inheritedFields.map((field: any) => (
              <FormField
                key={field.name}
                control={form.control}
                name={field.name}
                render={({ field: formField }) => (
                  <FormItem>
                    <FormLabel>
                      {field.name}
                      {field.required && '*'}
                    </FormLabel>
                    {renderField(field, formField)}
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        )}
      </form>
    </Form>
  );
}
