# 卡片系统

## 概述

卡片系统是 CardForest 的核心，负责卡片的创建、查询、更新和关系管理。每个卡片都是一个继承自特定模板的实例，包含结构化和非结构化数据。

## 数据模型

### 卡片结构
```typescript
interface Card {
  _key: string;         // ArangoDB 文档键
  template: string;     // 模板引用
  title: string;        // 标题（基础字段）
  body?: string;        // 主体内容（基础字段）
  content?: string;     // 富文本内容（基础字段）
  meta: object;         // 模板定义的元数据
  createdAt: string;    // 创建时间
  updatedAt: string;    // 更新时间
  createdBy: string;    // 创建者引用
}
```

## 核心组件

### 1. GraphQL API

**卡片解析器** (`graphql/card.resolver.ts`)
- 处理卡片相关的查询和变更
- 实现卡片的 CRUD 操作
- 处理卡片关系查询

### 2. 服务层

**CardService** (`services/card.service.ts`)
- 实现卡片业务逻辑
- 管理卡片数据
- 处理模板验证

## 关键操作

### 1. 卡片创建
```typescript
async createCard(input: CreateCardInput, userId: string) {
  // 1. 验证模板
  // 2. 验证数据
  // 3. 创建卡片
  // 4. 建立关系
}
```

### 2. 卡片查询
```typescript
async getCardById(id: string) {
  // 1. 获取卡片数据
  // 2. 加载关联数据
  // 3. 处理权限
}
```

### 3. 关系管理
```typescript
async createCardRelation(fromId: string, toId: string, type: string) {
  // 1. 验证卡片
  // 2. 创建关系
  // 3. 更新索引
}
```

## 数据库设计

### 集合
1. `cards`：存储卡片数据
2. `card_relations`：存储卡片间的关系
3. `templates`：存储模板定义

### 示例查询
```aql
// 获取卡片及其关系
FOR card IN cards
  FILTER card._key == @cardId
  LET relations = (
    FOR rel IN card_relations
    FILTER rel._from == card._id
    RETURN rel
  )
  RETURN { card, relations }
```

## 相关文件

- `src/graphql/card.resolver.ts`
- `src/services/card.service.ts`
- `src/graphql/schema.graphql`

## 扩展点

1. **新的卡片类型**
   - 实现新的模板
   - 添加特定的处理逻辑
   - 扩展查询能力

2. **高级查询**
   - 实现全文搜索
   - 添加聚合查询
   - 支持复杂过滤
