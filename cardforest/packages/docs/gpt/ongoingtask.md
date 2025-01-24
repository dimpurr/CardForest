# CardForest 开发任务追踪

## 相关文档

### 设计文档
- 卡片内容与关系设计: `/packages/docs/src/guide/card_content_and_relations.md`
- 技术架构概览: `/packages/docs/src/tech/architecture.md`
- 模板系统技术文档: `/packages/docs/src/tech/modules/template.md`
- 卡片系统技术文档: `/packages/docs/src/tech/modules/card.md`
- 用户系统技术文档: `/packages/docs/src/tech/modules/user.md`
- 认证系统技术文档: `/packages/docs/src/tech/modules/auth.md`

## 已完成任务

### 1. 后端：基础设施
- [x] 创建基本数据集合（users, templates, cards, relations）
- [x] 实现基础服务（UserService, TemplateService, CardService）
- [x] 设置认证系统（GitHub OAuth）
- [x] 配置 GraphQL（类型定义、解析器）

### 2. 后端：模板系统
- [x] 实现 TemplateService
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
- [ ] 重构卡片编辑器
  - [x] 迁移到 Jotai 状态管理
  - [x] 修复暗色模式样式
  - [ ] 实现字段分组展示
    - [ ] 基础字段区域（title/body/content）
    - [ ] Meta区域按模板来源分组
    - [ ] 字段来源标签
- [ ] 优化编辑体验
  - [ ] 字段验证和错误提示
  - [ ] 实时保存
  - [ ] 历史记录

### 2. 前端：UI 组件库
- [x] 基础组件迁移到 Radix UI
  - [x] Select 组件
  - [x] Dialog 组件
  - [x] DatePicker 组件
  - [x] Calendar 组件
  - [x] Popover 组件
- [ ] 主题系统
  - [ ] 定义主题变量
  - [ ] 实现暗色模式
  - [ ] 支持自定义主题
- [ ] 动画效果
  - [ ] 页面转场动画
  - [ ] 组件交互动画
  - [ ] 加载状态动画

### 3. 前端：用户界面优化
- [ ] 改进导航体验
  - [ ] 面包屑导航
  - [ ] 快捷操作菜单
- [ ] 添加搜索功能
  - [ ] 卡片搜索
  - [ ] 模板搜索
- [ ] 实现批量操作
  - [ ] 多选功能
  - [ ] 批量编辑/删除

## 下一步计划

1. 实现字段系统
   - 开发字段类型注册机制
   - 创建内置字段类型
   - 实现字段验证和配置

2. 完善模板继承系统
   - 实现基础模板和系统模板
   - 添加用户自定义模板支持
   - 处理字段继承规则

3. 开发编辑器组件
   - 实现动态表单生成
   - 创建模板编辑器
   - 添加字段预览功能

4. 改进用户体验
   - 优化编辑界面
   - 添加实时预览
   - 完善错误处理

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
   - React Flow：关系图可视化
   - React DnD：拖拽功能
   - CodeMirror：代码编辑器

2. **布局组件**
   - react-resizable-panels：可调整大小的面板
   - react-grid-layout：网格布局系统
   - Floating UI：弹出层定位

### 开发工具
- **类型检查**: TypeScript
- **构建工具**: Vite
- **测试**: Vitest + Testing Library
- **代码规范**: ESLint + Prettier
- **包管理**: pnpm

### 性能优化
- React Suspense 和 lazy loading
- 图片懒加载和优化
- Service Worker 缓存

这个技术栈的优势：
1. 高度可定制性：可以完全控制 UI 外观
2. 优秀的可访问性：符合 ARIA 标准
3. 良好的开发体验：TypeScript 支持和开发工具
4. 性能优化：支持代码分割和懒加载
5. 社区支持：活跃的社区和丰富的资源
