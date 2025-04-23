import { ReactNode } from 'react';
import { useFormContext } from 'react-hook-form';
import { Input } from './Input';
import { Textarea } from './Textarea';
import { DatePicker } from './DatePicker';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface FormFieldProps {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'richtext' | 'date' | 'number' | 'select' | 'checkbox';
  required?: boolean;
  description?: string;
  placeholder?: string;
  options?: Array<{ value: string; label: string }>;
  children?: ReactNode;
  className?: string;
}

export function FormField({
  name,
  label,
  type = 'text',
  required = false,
  description,
  placeholder,
  options,
  children,
  className = '',
}: FormFieldProps) {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name];

  // 渲染不同类型的字段
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            {...register(name, { required: required ? `${label} is required` : false })}
            placeholder={placeholder}
            className="w-full"
          />
        );
      case 'richtext':
        // 富文本编辑器需要单独实现
        return (
          <Textarea
            {...register(name, { required: required ? `${label} is required` : false })}
            placeholder={placeholder}
            className="w-full h-32"
          />
        );
      case 'date':
        return (
          <DatePicker
            {...register(name, { required: required ? `${label} is required` : false })}
            placeholder={placeholder || 'Select date...'}
          />
        );
      case 'number':
        return (
          <Input
            type="number"
            {...register(name, { required: required ? `${label} is required` : false })}
            placeholder={placeholder}
            className="w-full"
          />
        );
      case 'select':
        return (
          <select
            {...register(name, { required: required ? `${label} is required` : false })}
            className="w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:border-primary-500 dark:focus:border-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400"
          >
            <option value="">Select {label}...</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'checkbox':
        return (
          <div className="flex items-center">
            <input
              type="checkbox"
              {...register(name)}
              className="h-4 w-4 rounded border-gray-300 dark:border-gray-700 text-primary-600 dark:text-primary-400 focus:ring-primary-500 dark:focus:ring-primary-400"
            />
            <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">{description}</span>
          </div>
        );
      case 'text':
      default:
        return (
          <Input
            type="text"
            {...register(name, { required: required ? `${label} is required` : false })}
            placeholder={placeholder}
            className="w-full"
          />
        );
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        {description && (
          <div className="group relative">
            <InformationCircleIcon className="h-4 w-4 text-gray-400 dark:text-gray-500 cursor-help" />
            <div className="absolute right-0 bottom-full mb-2 hidden group-hover:block w-64 p-2 bg-white dark:bg-gray-800 rounded shadow-lg text-xs text-gray-600 dark:text-gray-300 z-10">
              {description}
            </div>
          </div>
        )}
      </div>
      
      {children || renderField()}
      
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
          {error.message?.toString()}
        </p>
      )}
    </div>
  );
}
