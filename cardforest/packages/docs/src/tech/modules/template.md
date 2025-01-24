# 模板系统

## 概述

模板系统定义了卡片的结构和行为，采用面向对象的设计理念。每个模板可以继承自其他模板，所有模板最终都继承自基础模板（Basic Template）。

## 数据模型

### 模板结构
```typescript
interface Template {
  _key: string;         // ArangoDB 文档键
  name: string;         // 模板名称
  extends?: string;     // 父模板引用
  fields: {            // 字段定义
    [fieldName: string]: {
      type: string;     // 字段类型
      required: boolean;
      default?: any;
      config?: object;  // 字段配置
    }
  };
  system: boolean;      // 是否系统模板
}
```

### 基础模板
```typescript
const BasicTemplate = {
  name: 'basic',
  system: true,
  fields: {
    title: {
      type: 'text',
      required: true
    },
    body: {
      type: 'text',
      required: false
    },
    content: {
      type: 'richtext',
      required: false
    }
  }
};
```

## 核心组件

### 1. 模板服务

**TemplateService** (`services/template.service.ts`)
- 管理模板的生命周期
- 处理模板继承
- 验证卡片数据

关键方法：
```typescript
// 获取完整的模板定义（包含继承字段）
async getTemplateWithInheritance(templateId: string) {
  // 1. 获取模板
  // 2. 递归获取父模板
  // 3. 合并字段定义
}

// 验证卡片数据
async validateCardData(templateId: string, data: any) {
  // 1. 获取完整模板
  // 2. 验证必填字段
  // 3. 验证字段类型
  // 4. 验证字段值
}
```

### 2. GraphQL API

**模板解析器** (`graphql/template.resolver.ts`)
- 提供模板的查询和变更
- 处理模板继承关系
- 验证模板定义

## 字段类型系统

支持的字段类型：
1. **基础类型**
   - text：文本
   - number：数字
   - boolean：布尔值
   - date：日期时间

2. **复杂类型**
   - richtext：富文本
   - reference：卡片引用
   - array：数组
   - object：对象

3. **特殊类型**
   - file：文件引用
   - image：图片
   - location：地理位置

## 数据库操作

### 示例查询
```aql
// 获取模板及其父模板
FOR template IN templates
  FILTER template._key == @templateId
  LET inheritance = (
    FOR parent IN templates
    FILTER template.extends == parent._id
    RETURN parent
  )
  RETURN { template, inheritance }
```

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
