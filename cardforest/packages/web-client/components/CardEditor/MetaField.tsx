import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { DatePicker } from '../ui/DatePicker';
import { Select } from '../ui/Select';

interface MetaFieldProps {
  name: string;
  field: {
    type: string;
    required?: boolean;
    config?: any;
  };
  value: any;
  onChange: (value: any) => void;
}

export function MetaField({ name, field, value, onChange }: MetaFieldProps) {
  const renderField = () => {
    switch (field.type) {
      case 'date':
        return (
          <DatePicker
            value={value}
            onChange={onChange}
            required={field.required}
            {...field.config}
          />
        );
      
      case 'select':
        return (
          <Select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          >
            {field.config?.options?.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </Select>
        );
      
      case 'text':
        return field.config?.multiline ? (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            {...field.config}
          />
        ) : (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            {...field.config}
          />
        );
      
      default:
        return (
          <Input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
          />
        );
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1">
        {name}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {renderField()}
    </div>
  );
}
