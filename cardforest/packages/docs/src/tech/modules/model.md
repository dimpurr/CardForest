# 模态类系统

## 概述

模态类系统定义了卡片的结构和行为，采用面向对象的设计理念。每个模态类可以继承自一个或多个模态类，形成原型链式的继承结构。所有模态类最终都继承自基础模态类（Basic Model）。

## 数据模型

### 模态类结构
```typescript
interface Model {
  _key: string;            // ArangoDB 文档键
  name: string;            // 模态类名称
  inherits_from: string[]; // 继承的模态类列表
  fields: FieldGroup[];    // 按来源分组的字段
  system: boolean;         // 是否系统模态类
}

interface FieldGroup {
  _inherit_from: string;   // 字段来源模态类
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

### 基础模态类
```typescript
const BasicModel = {
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

### 日期卡片模态类
```typescript
const DateModel = {
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
- 模态类可以继承自多个父模态类
- 形成清晰的继承链，如：festival_date_card -> datecard -> basic_card
- 子模态类可以访问和使用所有父模态类的字段

### 2. 字段组织
- 字段按来源模态类分组存储
- 每组字段都标明其来源模态类
- 支持覆盖和扩展父模态类的字段

### 3. 向后兼容
- 提供扁平化字段视图（flattenedFields）
- 保持与旧版 API 的兼容性
- 自动处理字段冲突和覆盖

## 核心组件

### 1. 模态类服务
- 提供模态类的 CRUD 操作
- 处理模态类继承和字段合并
- 实现字段验证和类型检查

### 2. 编辑器组件
- 按来源分组显示字段
- 基础字段（title/body/content）始终显示在顶部
- Meta 区域按模态类来源分组展示字段
- 支持字段验证和错误提示

### 3. GraphQL API
```graphql
type Model {
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

### 1. 模态类设计
- 遵循单一职责原则，每个模态类专注于特定功能
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

- `src/services/model.service.ts`
- `src/graphql/model.resolver.ts`
- `src/graphql/schema.graphql`

## 扩展点

1. **新字段类型**
   - 实现字段类型定义
   - 添加验证逻辑
   - 扩展前端渲染

2. **模态类功能**
   - 添加模态类版本控制
   - 实现模态类迁移
   - 支持模态类复制

3. **验证规则**
   - 添加自定义验证
   - 支持字段间关系验证
   - 实现异步验证
