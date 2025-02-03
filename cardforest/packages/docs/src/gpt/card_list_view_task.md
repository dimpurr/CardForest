# CardForest Card List View 开发任务追踪

## 相关文档

重要！！干任何事情之前必读 cardforest/packages/docs/gpt/memo.md

### 设计文档
- 主要设计文档: `/packages/docs/src/guide/README.md`
- 卡片内容设计: `/packages/docs/src/guide/card_content_and_relations.md`
- 技术架构概览: `/packages/docs/src/tech/architecture.md`

## 开发目标

实现一个类 Notion 的强大卡片列表界面，支持多种视图模式和高级交互功能。

### 1. 基础架构
- [ ] 集成 TanStack Table
  - [ ] 设置基础配置
  - [ ] 实现虚拟滚动
  - [ ] 实现排序和过滤
  - [ ] 实现列自定义
- [ ] 实现视图切换系统
  - [ ] 视图状态管理
  - [ ] 视图配置持久化
  - [ ] 视图切换动画
- [ ] 字段动态配置
  - [ ] 字段类型识别
  - [ ] 字段选择器
  - [ ] 视图字段映射

### 2. 表格视图 (Table)
- [ ] 基础功能
  - [ ] 列配置和调整
  - [ ] 单元格编辑
  - [ ] 行选择和批量操作
  - [ ] 排序和过滤
- [ ] 高级功能
  - [ ] 列固定
  - [ ] 列分组
  - [ ] 行展开/折叠
  - [ ] 自定义列宽
  - [ ] 快捷键支持

### 3. 看板视图 (Kanban)
- [ ] 基础功能
  - [ ] 动态字段分组
  - [ ] 卡片拖拽
  - [ ] 状态切换
  - [ ] 卡片预览
- [ ] 高级功能
  - [ ] 自定义分组
  - [ ] 列折叠
  - [ ] WIP 限制
  - [ ] 批量操作

### 4. 画廊视图 (Gallery)
- [ ] 基础功能
  - [ ] 网格布局
  - [ ] 图片预览
  - [ ] 卡片信息展示
  - [ ] 动态主图选择
- [ ] 高级功能
  - [ ] 自适应布局
  - [ ] 懒加载优化
  - [ ] 图片裁剪
  - [ ] 排序和过滤

### 5. 信息流视图 (Stream)
- [ ] 基础功能
  - [ ] 时间轴布局
  - [ ] 无限滚动
  - [ ] 卡片预览
  - [ ] 快速操作
- [ ] 高级功能
  - [ ] 智能分组
  - [ ] 内容摘要
  - [ ] 交互动画
  - [ ] 上下文预加载

### 6. 文章连读视图 (Reader)
- [ ] 基础功能
  - [ ] 长文阅读模式
  - [ ] 文章导航
  - [ ] 阅读进度
  - [ ] 大纲导航
- [ ] 高级功能
  - [ ] 双栏布局
  - [ ] 文章关联
  - [ ] 笔记标注
  - [ ] 阅读位置记忆

## 技术方案

### 核心组件选择
- 表格引擎：TanStack Table
- 虚拟滚动：@tanstack/react-virtual
- 拖拽支持：react-beautiful-dnd
- 状态管理：jotai
- UI组件：radix-ui

### 数据流设计
1. 数据源层
   ```typescript
   interface DataSource {
     fetch(): Promise<CardRecord[]>;
     update(changes: Change[]): Promise<void>;
     subscribe(callback: (changes: Change[]) => void): () => void;
   }
   ```

2. 视图层
   ```typescript
   interface ViewConfig {
     type: 'table' | 'kanban' | 'gallery' | 'stream' | 'reader';
     settings: {
       columns?: Column[];
       groupBy?: string[];
       sortBy?: Sort[];
       filters?: Filter[];
       displayFields?: {
         primary?: string;   // 主要显示字段
         secondary?: string[]; // 次要显示字段
         media?: string;     // 媒体字段
         group?: string;     // 分组字段
       };
     };
   }
   ```

3. 状态管理
   ```typescript
   const viewConfigAtom = atom<ViewConfig>({
     type: 'table',
     settings: defaultSettings
   });

   const viewDataAtom = atom(async (get) => {
     const config = get(viewConfigAtom);
     const data = await dataSource.fetch();
     return processData(data, config);
   });
   ```

### 性能优化策略
1. 虚拟化渲染
   - 表格行虚拟化
   - 看板列虚拟化
   - 画廊图片懒加载

2. 状态管理优化
   - 原子化更新
   - 选择性重渲染
   - 状态分片

3. 渲染优化
   - React.memo 优化
   - 使用 CSS 动画
   - 批量更新策略

### 协作功能
1. 实时更新
   - 乐观更新
   - 冲突解决
   - 状态同步

2. 并发控制
   - 锁机制
   - 版本控制
   - 变更追踪

## 开发顺序

1. 第一阶段：基础框架
   1. 表格引擎集成
   2. 视图切换系统
   3. 字段动态配置

2. 第二阶段：核心视图
   1. 表格视图完整功能
   2. 看板视图基础功能
   3. 画廊视图基础功能

3. 第三阶段：高级功能
   1. 性能优化
   2. 协作功能
   3. 高级交互

4. 第四阶段：扩展视图
   1. 信息流视图
   2. 文章连读视图
   3. 自定义视图支持

## 注意事项

1. 性能关注点
   - 大数据量渲染优化
   - 实时更新性能
   - 内存占用控制

2. 用户体验
   - 响应式设计
   - 快捷键支持
   - 动画过渡
   - 错误处理

3. 开发规范
   - TypeScript 类型完整性
   - 组件复用性
   - 测试覆盖
   - 文档完整性
