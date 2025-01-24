import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { DatePicker } from '../ui/DatePicker';
import { Select } from '../ui/Select';
import { FieldDefinition } from '../../stores/cardEditor';

interface MetaFieldProps {
  name: string;
  field: FieldDefinition;
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
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            {...field.config}
          />
        );
      
      default:
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            {...field.config}
          />
        );
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium mb-1 capitalize">
        {name}
      </label>
      {renderField()}
    </div>
  );
}
