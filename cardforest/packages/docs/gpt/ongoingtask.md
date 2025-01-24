# CardForest 开发任务追踪

## 相关文档

### 设计文档
- 卡片内容与关系设计: `/packages/docs/src/guide/card_content_and_relations.md`
- 技术架构概览: `/packages/docs/src/tech/architecture.md`
- 模板系统技术文档: `/packages/docs/src/tech/modules/template.md`
- 卡片系统技术文档: `/packages/docs/src/tech/modules/card.md`
- 用户系统技术文档: `/packages/docs/src/tech/modules/user.md`
- 认证系统技术文档: `/packages/docs/src/tech/modules/auth.md`

## 当前任务：实现模板系统

### 1. 后端：模板系统基础设施
- [x] 创建 `templates` 集合（通过 TemplateService）
- [x] 实现 `TemplateService`
  - [x] 基础 CRUD 操作
  - [x] 模板继承处理
  - [x] 字段验证逻辑
- [x] 添加 GraphQL 类型和解析器
  - [x] 更新 schema.graphql
  - [x] 创建 template.resolver.ts
- [x] 修改 `CardService` 支持模板

### 2. 后端：基础模板实现
- [x] 创建 BasicTemplate
  - [x] 系统字段（createdAt, updatedAt, createdBy）
  - [x] 基础字段（title, body, content）
  - [x] 字段验证规则

### 3. 后端：安装服务更新
- [x] 修改 InstallService
  - [x] 创建基础模板
  - [x] 创建测试模板（DateCard）
- [x] 更新测试数据
  - [x] 将现有卡片关联到基础模板
  - [x] 创建测试 DateCard 实例

### 4. 后端：认证系统更新
- [x] 修复认证相关问题
  - [x] 添加缺失的 AuthGuard
  - [x] 更新 AuthService 实现
  - [x] 更新 AuthResolver
  - [x] 完善用户认证流程

### 5. 前端：模板选择器
- [ ] 创建 TemplateSelector 组件
  - [ ] 实现模板列表展示
  - [ ] 添加模板搜索功能
  - [ ] 支持模板继承显示
- [ ] 添加模板预览功能
  - [ ] 显示模板字段和配置
  - [ ] 预览继承的字段
  - [ ] 展示验证规则

### 6. 前端：模板管理器
- [ ] 创建模板管理页面
  - [ ] 模板列表视图
  - [ ] 模板详情视图
  - [ ] 模板编辑表单
- [ ] 实现模板 CRUD 界面
  - [ ] 创建模板表单
  - [ ] 编辑模板表单
  - [ ] 删除模板确认
- [ ] 添加字段类型配置
  - [ ] 支持所有基础字段类型
  - [ ] 字段验证规则配置
  - [ ] 字段默认值设置

### 7. 前端：卡片创建更新
- [ ] 更新卡片创建表单
  - [ ] 集成模板选择器
  - [ ] 动态生成字段表单
  - [ ] 添加字段验证
- [ ] 更新卡片编辑表单
  - [ ] 显示模板信息
  - [ ] 支持字段编辑
  - [ ] 维护字段验证

## 注意事项

### 数据迁移
- [x] 确保现有卡片数据完整性
- [x] 平滑处理模板关联

### 性能优化
- [ ] 模板继承查询优化
- [ ] 字段验证性能
- [ ] 缓存策略

### 用户体验
- [ ] 模板选择的直观性
- [ ] 字段配置的易用性
- [ ] 错误提示友好性

## 开发进度

### 2025-01-24
- 完成模板系统基础设施
  - 实现 TemplateService
  - 创建 GraphQL schema
  - 添加 TemplateResolver
  - 注册到 AppModule
- 实现基础模板系统
  - 创建模板接口和类型定义
  - 实现基础模板和日期模板
  - 更新安装服务支持模板创建
  - 添加测试数据
- 完成卡片服务模板支持
  - 更新卡片创建和更新逻辑
  - 添加模板验证
  - 支持模板字段
  - 完善错误处理
- 修复认证系统问题
  - 添加 AuthGuard
  - 更新 AuthService
  - 完善用户认证流程
