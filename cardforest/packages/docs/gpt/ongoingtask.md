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
- [x] 创建基础模板
  - [x] 系统字段（createdAt, updatedAt, createdBy）
  - [x] 基础字段（title, body, content）

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
- [ ] 创建基础编辑器组件
  - [ ] 标题编辑
  - [ ] 内容编辑（富文本）
  - [ ] 元数据编辑
- [ ] 实现模板特定的编辑界面
  - [ ] 根据模板字段动态生成表单
  - [ ] 字段验证
  - [ ] 预览功能

### 2. 前端：卡片关系管理
- [ ] 创建关系可视化组件
  - [ ] 显示父子关系
  - [ ] 支持拖拽操作
- [ ] 实现关系编辑功能
  - [ ] 添加/删除关系
  - [ ] 修改关系类型

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

1. 完善前端编辑器
   - 实现基于模板的动态表单生成
   - 添加实时预览功能
   - 支持富文本编辑

2. 开发卡片关系管理功能
   - 设计关系可视化界面
   - 实现拖拽操作
   - 添加关系编辑功能

3. 改进用户体验
   - 添加加载状态提示
   - 实现错误处理和提示
   - 优化响应式布局
