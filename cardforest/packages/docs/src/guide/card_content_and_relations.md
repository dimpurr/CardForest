# CardForest: 面向对象的卡片系统设计

## 设计哲学

CardForest 的核心是一个面向对象的卡片系统。每张卡片都是一个对象，继承自特定的模板类。这种设计让我们能够结合 Notion 的结构化数据管理和 Obsidian/Roam 的动态链接能力，创建一个既灵活又规范的知识管理系统。

### 模板继承体系

在 CardForest 中，所有卡片都继承自基础模板（Basic Model）。模板系统采用原型链式的继承机制，允许多层次的模板继承和字段扩展。

#### 基础模板（Basic Model）

基础模板定义了卡片的核心结构：

- **系统字段**（不可删除）：
  - 创建时间（createdAt）
  - 更新时间（updatedAt）
  - 创建者（createdBy）

- **基础字段**（不可删除，可修改）：
  - 标题（title）：文本输入
  - 主体（body）：默认为文本输入，可根据需要改为其他类型
  - 正文（content）：富文本区域，支持动态链接和嵌入

#### 模板继承机制

模板继承遵循以下原则：

1. **原型链继承**
   - 每个模板都可以继承自一个或多个父模板
   - 形成清晰的继承链，如：festival_date_card -> datecard -> basic_card
   - 子模板可以访问和使用所有父模板的字段定义

2. **字段继承和扩展**
   ```typescript
   interface Model {
     name: string;
     inherits_from: string[];  // 继承自哪些模板
     fields: {
       _inherit_from: string;  // 字段来源模板
       fields: Field[];        // 字段定义
     }[];
   }
   ```

3. **字段组织**
   - 字段按来源模板分组组织
   - 每组字段都标明其来源模板
   - 支持覆盖和扩展父模板的字段定义

例如，一个节日日期卡片（festival_date_card）的定义：
```typescript
{
  name: "festival_date_card",
  inherits_from: ["datecard", "basic_card"],
  fields: [
    {
      _inherit_from: "basic_card",
      fields: [
        { name: "title", type: "text", required: true },
        { name: "body", type: "text" },
        { name: "content", type: "richtext" }
      ]
    },
    {
      _inherit_from: "datecard",
      fields: [
        { name: "start_date", type: "date", required: true },
        { name: "end_date", type: "date" }
      ]
    },
    {
      _inherit_from: "_self",
      fields: [
        { name: "festival_origin_country", type: "text" },
        { name: "celebration_type", type: "select" }
      ]
    }
  ]
}
```

#### 编辑器字段展示

编辑器界面应该清晰地展示字段的继承关系：

1. **基础字段区域**
   - 标题、正文等基础字段始终显示在最上方
   - 这些字段来自基础模板，是所有卡片共有的

2. **Meta 区域**
   - 按模板来源分组显示字段
   - 使用分隔符或标题标明字段来源
   - 示例结构：
     ```
     Title: Festival Name
     Body: Description
     Content: Detailed Content

     Meta Fields:
     ## From DateCard Model:
     - Start Date: 2025-01-01
     - End Date: 2025-01-02

     ## From FestivalCard Model:
     - Origin Country: Japan
     - Celebration Type: Religious
     ```

这种设计带来以下好处：

1. **清晰的继承关系**：用户可以清楚地看到字段来自哪个模板
2. **灵活的扩展性**：可以方便地添加新的模板和字段
3. **结构化的数据**：字段按模板分组，便于理解和管理
4. **更好的可维护性**：模板之间的关系明确，便于后期维护和扩展

### 卡片的多层次内容

每个卡片包含三个主要部分，它们的组织遵循明确的优先级：

1. **Body（主体内容）**
   - 卡片的核心内容载体
   - 可以是文本、图片、视频等多种类型
   - 当存在时，作为卡片的主要展示内容

2. **Content（富文本正文）**
   - 支持 TipTap 编辑器的动态内容
   - 可以包含双向链接和动态嵌入
   - 当 body 存在时，作为补充说明

3. **Meta（元数据）**
   - 由模板定义的结构化数据字段
   - 支持多种数据类型和卡片引用
   - 用于组织和检索

## 动态链接系统

CardForest 的链接系统支持多种引用方式，所有引用都会在 ArangoDB 中建立关系：

1. **Meta 引用**
   - 通过元数据字段建立的结构化引用
   - 类似于关系数据库中的外键
   - 用于建立卡片间的强关系

2. **内联引用**
   - 在富文本中通过 `[[]]` 语法创建的链接
   - 支持悬浮预览和快速导航
   - 用于建立知识间的关联

3. **嵌入引用**
   - 在富文本中动态嵌入其他卡片的内容
   - 支持实时更新和交互
   - 用于知识的组合和展示

## 实现路线图

1. **基础模板系统**（第一阶段）
   - 实现基础模板（Basic Model）
   - 建立模板继承机制
   - 完成核心字段的处理

2. **元数据系统**（第二阶段）
   - 实现自定义字段的定义和验证
   - 支持多种数据类型
   - 添加字段引用功能

3. **富文本系统**（第三阶段）
   - 集成 TipTap 编辑器
   - 实现双向链接功能
   - 添加动态嵌入支持

## 技术实现要点

在 ArangoDB 中，我们需要特别注意以下几点：

1. **模板继承**
   - 使用模板引用记录继承关系
   - 在查询时合并字段定义
   - 确保基础字段的完整性

2. **关系存储**
   - 使用边集合存储不同类型的引用
   - 建立高效的图遍历查询
   - 维护双向链接的一致性

3. **数据验证**
   - 根据模板定义验证字段值
   - 确保必填字段的完整性
   - 处理字段类型转换

这种设计既保持了面向对象的严谨性，又提供了知识管理所需的灵活性。通过模板继承，我们可以轻松创建各种专门的卡片类型，同时保持系统的一致性和可维护性。

## 字段系统设计

CardForest 采用了类似 Django 的字段系统设计，但进行了面向对象的扩展。每个字段类型都是一个独立的类，定义了字段的行为和验证规则。

### 字段类型注册系统

所有字段类型都需要在系统中注册，这样模板才能使用它们：

```typescript
interface IFieldType {
  type: string;
  validate: (value: any) => boolean;
  render: (props: FieldProps) => React.ReactNode;
  defaultConfig?: Record<string, any>;
}

// 系统内置字段类型
const BUILTIN_FIELD_TYPES = {
  text: TextFieldType,
  richtext: RichTextFieldType,
  date: DateFieldType,
  number: NumberFieldType,
  select: SelectFieldType,
  multiselect: MultiSelectFieldType,
  reference: ReferenceFieldType,
  // ... 更多字段类型
};
```

### 字段配置

每个字段都可以有自己的配置选项：

```typescript
interface IFieldConfig {
  type: string;
  required?: boolean;
  default?: any;
  config?: {
    maxLength?: number;
    multiline?: boolean;
    dateFormat?: string;
    options?: string[];
    // ... 其他配置选项
  };
}
```

## 模板继承系统

CardForest 的模板系统采用面向对象的继承机制，类似于类的继承。

### 基础模板（BaseCard）

- 由系统管理员维护
- 所有模板的根模板
- 定义了核心字段（title, content, body）
- 不可删除，但可以扩展

### 系统模板

- 由系统管理员维护（如 DateCard）
- 继承自 BaseCard
- 所有用户可见
- 可以作为用户自定义模板的父模板
- 示例：
  ```typescript
  // DateCard 模板定义
  {
    name: "DateCard",
    parent: "BaseCard",
    fields: {
      date: {
        type: "date",
        required: true,
        config: {
          format: "YYYY-MM-DD"
        }
      }
    }
  }
  ```

### 用户自定义模板

- 用户可以创建自己的模板
- 必须指定父模板（可以是 BaseCard 或其他模板）
- 继承父模板的所有字段
- 可以添加新字段，但不能删除继承的字段
- 示例：
  ```typescript
  // StudentCard 模板定义
  {
    name: "StudentCard",
    parent: "DateCard",
    fields: {
      birthday: {
        type: "date",
        required: true
      },
      startSchoolDay: {
        type: "date",
        required: true
      },
      grade: {
        type: "select",
        required: true,
        config: {
          options: ["1年级", "2年级", "3年级"]
        }
      }
    }
  }
  ```

### 字段继承规则

1. **字段合并**
   - 子模板继承父模板的所有字段
   - 子模板可以添加新字段
   - 子模板可以覆盖父模板字段的配置（但不能改变字段类型）

2. **必填字段**
   - 如果父模板中的字段是必填的，子模板不能将其改为可选
   - 子模板可以将父模板中的可选字段改为必填

3. **字段验证**
   - 子模板必须满足父模板的所有验证规则
   - 子模板可以添加额外的验证规则

### 模板编辑器

前端需要提供一个模板编辑器，让用户可以：

1. 选择父模板
2. 查看继承的字段
3. 添加新字段
4. 配置字段属性
5. 预览卡片编辑界面

## 卡片编辑器

卡片编辑器会根据模板动态生成表单：

1. 根据模板的字段定义渲染对应的输入组件
2. 处理字段之间的依赖关系
3. 实时验证用户输入
4. 保存时进行完整性检查
