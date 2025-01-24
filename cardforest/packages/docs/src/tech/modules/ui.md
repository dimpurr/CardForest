# UI 组件系统

CardForest 使用 Radix UI 作为基础组件库，提供了一套完整的、无障碍的组件系统。

## 组件架构

所有 UI 组件位于 `packages/web-client/components/ui` 目录下，采用以下架构：

```
components/ui/
├── Button.tsx       # 按钮组件
├── Input.tsx        # 输入框组件
├── Select.tsx       # 选择器组件
├── Dialog.tsx       # 对话框组件
├── DatePicker.tsx   # 日期选择器
├── Calendar.tsx     # 日历组件
└── Popover.tsx      # 弹出层组件
```

## 组件使用指南

### Select 组件

基于 `@radix-ui/react-select` 构建的选择器组件：

```tsx
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../ui/Select';

<Select value={value} onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Select option" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="option1">Option 1</SelectItem>
    <SelectItem value="option2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### DatePicker 组件

结合 `@radix-ui/react-popover` 和 `react-day-picker` 的日期选择器：

```tsx
import { DatePicker } from '../ui/DatePicker';

<DatePicker
  value={date}
  onChange={setDate}
  required={true}
/>
```

### Dialog 组件

基于 `@radix-ui/react-dialog` 的对话框组件：

```tsx
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/Dialog';

<Dialog>
  <DialogTrigger>Open</DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

## 主题系统

组件库支持主题定制，使用 CSS 变量实现：

```css
:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(222.2 47.4% 11.2%);
  
  --muted: hsl(210 40% 96.1%);
  --muted-foreground: hsl(215.4 16.3% 46.9%);
  
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(222.2 47.4% 11.2%);
  
  --border: hsl(214.3 31.8% 91.4%);
  --input: hsl(214.3 31.8% 91.4%);
  
  --primary: hsl(222.2 47.4% 11.2%);
  --primary-foreground: hsl(210 40% 98%);
  
  --secondary: hsl(210 40% 96.1%);
  --secondary-foreground: hsl(222.2 47.4% 11.2%);
  
  --accent: hsl(210 40% 96.1%);
  --accent-foreground: hsl(222.2 47.4% 11.2%);
  
  --ring: hsl(215 20.2% 65.1%);
  
  --radius: 0.5rem;
}

.dark {
  --background: hsl(224 71% 4%);
  --foreground: hsl(213 31% 91%);
  
  /* ... other dark theme variables */
}
```

## 动画系统

使用 Tailwind CSS 的动画类和 CSS 变量实现一致的动画效果：

```css
@keyframes in {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: in 0.2s ease-out;
}
```

## 无障碍性

所有组件都遵循 WAI-ARIA 规范，支持：

- 键盘导航
- 屏幕阅读器
- ARIA 属性
- 焦点管理

## 最佳实践

1. **组件复用**
   - 优先使用基础组件构建复杂界面
   - 保持组件接口的一致性
   - 使用组合而不是继承

2. **主题定制**
   - 使用 CSS 变量进行主题定制
   - 保持颜色系统的一致性
   - 支持深色模式

3. **性能优化**
   - 使用 React.memo 优化渲染
   - 避免不必要的状态更新
   - 合理使用动画效果

4. **可访问性**
   - 确保正确的语义化标签
   - 提供合适的 ARIA 标签
   - 测试键盘导航
