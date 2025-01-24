# 模板系统

## 概述

模板系统定义了卡片的结构和行为，采用面向对象的设计理念。每个模板可以继承自一个或多个模板，形成原型链式的继承结构。所有模板最终都继承自基础模板（Basic Template）。

## 数据模型

### 模板结构
```typescript
interface Template {
  _key: string;            // ArangoDB 文档键
  name: string;            // 模板名称
  inherits_from: string[]; // 继承的模板列表
  fields: FieldGroup[];    // 按来源分组的字段
  system: boolean;         // 是否系统模板
}

interface FieldGroup {
  _inherit_from: string;   // 字段来源模板
  fields: FieldDefinition[];
}

interface FieldDefinition {
  name: string;           // 字段名称
  type: string;           // 字段类型
  required?: boolean;     // 是否必填
  default?: any;         // 默认值
  config?: object;       // 字段配置
}
```

### 基础模板
```typescript
const BasicTemplate = {
  name: 'basic',
  system: true,
  inherits_from: [],
  fields: [
    {
      _inherit_from: '_self',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true
        },
        {
          name: 'body',
          type: 'text',
          required: false
        },
        {
          name: 'content',
          type: 'richtext',
          required: false
        }
      ]
    }
  ]
};
```

### 日期卡片模板
```typescript
const DateTemplate = {
  name: 'datecard',
  system: true,
  inherits_from: ['basic'],
  fields: [
    {
      _inherit_from: '_self',
      fields: [
        {
          name: 'start_date',
          type: 'date',
          required: true
        },
        {
          name: 'end_date',
          type: 'date',
          required: false
        }
      ]
    }
  ]
};
```

## 继承机制

### 1. 原型链继承
- 模板可以继承自多个父模板
- 形成清晰的继承链，如：festival_date_card -> datecard -> basic_card
- 子模板可以访问和使用所有父模板的字段

### 2. 字段组织
- 字段按来源模板分组存储
- 每组字段都标明其来源模板
- 支持覆盖和扩展父模板的字段

### 3. 向后兼容
- 提供扁平化字段视图（flattenedFields）
- 保持与旧版 API 的兼容性
- 自动处理字段冲突和覆盖

## 核心组件

### 1. 模板服务
- 提供模板的 CRUD 操作
- 处理模板继承和字段合并
- 实现字段验证和类型检查

### 2. 编辑器组件
- 按来源分组显示字段
- 基础字段（title/body/content）始终显示在顶部
- Meta 区域按模板来源分组展示字段
- 支持字段验证和错误提示

### 3. GraphQL API
```graphql
type Template {
  _key: ID!
  name: String!
  inherits_from: [String!]!
  fields: [FieldGroup!]!
  flattenedFields: JSON!  # 向后兼容
  system: Boolean!
}

type FieldGroup {
  _inherit_from: String!
  fields: [FieldDefinition!]!
}

type FieldDefinition {
  name: String!
  type: String!
  required: Boolean
  default: JSON
  config: JSON
}
```

## 最佳实践

### 1. 模板设计
- 遵循单一职责原则，每个模板专注于特定功能
- 使用继承来复用通用字段和行为
- 避免过深的继承层次

### 2. 字段组织
- 基础字段（title/body/content）保持在顶层
- Meta 字段按功能分组
- 清晰标注字段来源

### 3. 编辑器实现
- 提供直观的字段分组展示
- 实现实时验证和错误提示
- 支持字段依赖关系

## 相关文件

- `src/services/template.service.ts`
- `src/graphql/template.resolver.ts`
- `src/graphql/schema.graphql`

## 扩展点

1. **新字段类型**
   - 实现字段类型定义
   - 添加验证逻辑
   - 扩展前端渲染

2. **模板功能**
   - 添加模板版本控制
   - 实现模板迁移
   - 支持模板复制

3. **验证规则**
   - 添加自定义验证
   - 支持字段间关系验证
   - 实现异步验证
