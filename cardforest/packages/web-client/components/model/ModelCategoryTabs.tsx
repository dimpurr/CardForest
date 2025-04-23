import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

export type ModelCategory = 'all' | 'system' | 'custom';

interface ModelCategoryTabsProps {
  value: ModelCategory;
  onChange: (value: ModelCategory) => void;
  className?: string;
}

export function ModelCategoryTabs({ value, onChange, className = '' }: ModelCategoryTabsProps) {
  return (
    <Tabs
      defaultValue={value}
      value={value}
      onValueChange={(val: string) => onChange(val as ModelCategory)}
      className={className}
    >
      <TabsList className="bg-gray-100 dark:bg-gray-800">
        <TabsTrigger value="all">
          All Models
        </TabsTrigger>
        <TabsTrigger value="system">
          System Models
        </TabsTrigger>
        <TabsTrigger value="custom">
          Custom Models
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
