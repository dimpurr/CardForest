# CardForest 开发任务追踪

## 相关文档

重要！！干任何事情之前必读 cardforest/packages/docs/gpt/memo.md

### 设计文档
- 卡片内容与关系设计: `/packages/docs/src/guide/card_content_and_relations.md`
- 技术架构概览: `/packages/docs/src/tech/architecture.md`
- 模板系统技术文档: `/packages/docs/src/tech/modules/model.md`
- 卡片系统技术文档: `/packages/docs/src/tech/modules/card.md`
- 用户系统技术文档: `/packages/docs/src/tech/modules/user.md`
- 认证系统技术文档: `/packages/docs/src/tech/modules/auth.md`

## 已完成任务

### 1. 后端：基础设施
- [x] 创建基本数据集合（users, models, cards, relations）
- [x] 实现基础服务（UserService, ModelService, CardService）
- [x] 设置认证系统（GitHub OAuth）
- [x] 配置 GraphQL（类型定义、解析器）

### 2. 后端：模板系统
- [x] 实现 ModelService
  - [x] 基础 CRUD 操作
  - [x] 模板继承处理
  - [x] 字段验证逻辑
  - [x] 字段分组和继承链
- [x] 创建基础模板
  - [x] 系统字段（createdAt, updatedAt, createdBy）
  - [x] 基础字段（title, body, content）
- [x] 模板继承系统
  - [x] 原型链式继承机制
  - [x] 字段按来源分组
  - [x] 扁平化字段兼容

### 3. 后端：卡片系统
- [x] 实现 CardService
  - [x] 基础 CRUD 操作
  - [x] 关联模板处理
  - [x] 字段验证
- [x] GraphQL API
  - [x] 查询：card, cards, myCards, cardsWithRelations
  - [x] 变更：createCard, updateCard, deleteCard

### 4. 后端：认证系统
- [x] GitHub OAuth 集成
- [x] JWT 认证
- [x] 用户管理
- [x] 权限控制

## 当前任务

### 1. 前端：卡片编辑器
- [x] 重构卡片编辑器
  - [x] 迁移到 Jotai 状态管理
  - [x] 修复暗色模式样式
  - [x] 实现字段分组展示
    - [x] 基础字段区域（title/body/content）
    - [x] Meta区域按模板来源分组
    - [x] 字段来源标签

### 2. 前端：UI 组件库
- [x] 基础组件迁移到 Radix UI
  - [x] Select 组件
  - [x] Dialog 组件
  - [x] DatePicker 组件
  - [x] Calendar 组件
  - [x] Popover 组件

### 4. 前端：模板管理系统
#### 1.1 模板列表页面
- [x] 创建模板列表组件
  - [x] 显示所有可用模板
  - [x] 显示模板继承关系
  - [x] 支持模板搜索和筛选
  - [x] 模板预览功能

#### 1.2 模板编辑器
- [x] 创建模板编辑器组件
  - [x] 基本信息编辑（名称、描述）
  - [x] 字段管理
    - [x] 添加/删除字段
    - [x] 字段类型选择
    - [x] 字段属性配置（必填、默认值等）
  - [x] 继承关系管理
    - [x] 选择父模板
    - [x] 预览继承的字段
    - [x] 字段覆盖配置

#### 1.3 GraphQL 集成
- [x] 添加必要的 GraphQL 查询
  - [x] 获取模板列表
  - [x] 获取单个模板详情
  - [x] 获取模板继承链
- [x] 添加模板相关的 mutations
  - [x] 创建模板
  - [x] 更新模板
  - [x] 删除模板

#### 1.4 状态管理
- [x] 使用 Jotai 管理模板状态
  - [x] 模板列表状态
  - [x] 当前编辑模板状态
  - [x] 模板验证状态

#### 1.5 用户界面优化
- [x] 实现响应式设计
- [x] 添加加载状态和错误处理
- [x] 添加用户提示和引导
- [x] 实现拖拽排序字段

### 当前开发重点：模板创建功能
1. 创建新模板页面
   - [x] 实现基本的模板创建表单
   - [x] 添加字段编辑器组件
   - [x] 实现父模板选择器
   - [x] 添加字段验证逻辑

2. GraphQL Mutations
   - [x] 定义创建模板 mutation
   - [x] 添加字段验证
   - [x] 处理继承关系
   - [x] 错误处理和用户反馈

3. 组件开发
   - [x] FieldEditor 组件
   - [x] ModelInheritanceSelector 组件
   - [x] FieldPreview 组件
   - [x] ValidationFeedback 组件

### 下一步任务
1. 字段验证
   - [x] 前端字段验证逻辑
   - [x] 后端字段验证增强
   - [x] 错误提示优化

2. UI/UX 改进
   - [x] 添加加载状态
   - [x] 优化错误处理
   - [x] 添加成功提示
   - [x] 字段拖拽排序

3. 模板预览
   - [x] 实现预览组件
   - [x] 显示继承字段
   - [x] 添加示例数据

## 开发计划

1. 模板列表页面（/models）：
   - 路由：pages/models/index.tsx
   - 组件：components/model/ModelList.tsx, ModelCard.tsx
   - 状态：atoms/modelAtoms.ts (modelListAtom, selectedModelAtom)
   - GraphQL：queries/modelQueries.ts (GET_MODELS, GET_MODEL_WITH_INHERITANCE)

2. 模板编辑器（/models/[id]/edit）：
   - 路由：pages/models/[id]/edit.tsx
   - 组件：components/model/ModelEditor/, FieldEditor/, InheritanceManager/
   - Hook：hooks/useModel.ts (处理模板CRUD、字段管理、继承关系)
   - 状态：atoms/modelEditorAtoms.ts (editingModelAtom, fieldGroupsAtom)

3. 开发顺序：
   1. 基础模板列表 -> 查看详情 -> 简单创建
   2. 字段编辑器 -> 字段验证 -> 字段预览
   3. 继承选择器 -> 继承链展示 -> 字段覆盖
   4. UI优化 -> 拖拽排序 -> 响应式

## 技术实现要点

### 字段系统
- 使用 TypeScript 接口定义字段类型
- 实现字段验证器和渲染器
- 支持字段配置的序列化和反序列化

### 模板继承
- 使用 ArangoDB 图数据库存储模板关系
- 实现字段合并和验证规则继承
- 处理循环继承和冲突解决

### 前端组件
- 使用 React 组件库构建界面
- 实现动态表单生成
- 添加实时预览功能

## 前端技术选型建议

### 已确定技术栈
- **状态管理**: Jotai
  - 适合原子化的状态管理
  - 支持异步状态和派生状态
  - 与 React Suspense 完美配合
- **样式方案**: 
  - Tailwind CSS：原子化 CSS
  - Sass：自定义样式和主题

### 建议的 UI 组件库

#### 主要方案：Radix UI
- 提供无样式但可访问的基础组件
- 完全可定制的外观
- 优秀的键盘导航和屏幕阅读器支持
- 适合构建自定义设计系统
- 与 Tailwind 完美配合

#### 特定功能组件
1. **编辑器相关**
   - TipTap：富文本编辑器，支持协同编辑
   