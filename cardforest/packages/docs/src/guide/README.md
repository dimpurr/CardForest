# CardForest 设计文档

## 概述

CardForest 是一个个人数据库/知识库/笔记软件，致力于将记录以卡片形式组织成一个数字花园。通过灵活的卡片链接方式，它整合了 Roam, Obsidian, Airtable, 和 Django 的特性。

## 主要功能

### 1. 左侧区域：库和透视

#### Perspective (透视)

允许用户创建和保存自定义可视化面板（类似于 AirTable 的 Extensions）或 RuleSet（一系列预定义的搜索条件）。

#### Library (库)

包括三个部分：All, Mutex Node Group 和 Non-mutex Node Group。

- **All**: 显示库中的所有 CardRecord，类似于 Pinterest。
- **Mutex Node Group**: 类似于文件夹，一个 CardRecord 只能属于一个 Mutex Node。
- **Non-mutex Node Group**: 允许一个 CardRecord 属于多个 Non-mutex Nodes，类似于标签。

### 2. 中间区域：Explorer 和 Editor

#### Explorer (资源浏览区)

通过筛选、排序和显示选项（如卡片、列表、表格、看板、时间线等）展示 CardRecord。包含 RuleSet 设置区，允许用户定义搜索条件。

#### Editor (编辑器)

用于编辑单个 CardRecord。包括：

- CardRecord 所属的所有 Nodes。
- Discard 和 Save/Post 按钮。
- CardRecord 的唯一哈希 ID，类似于 git commit。
- 修改和创建时间。
- CardRecord 的模板类型。
- CardRecord 分为 meta 区和 Content 区。

### 3. 右侧区域：Model 和 Template

#### Model

定义 CardRecord 的数据结构。例如，一个名为“todo”的 model 可能有一系列特定的字段。

#### Template

将 Model、一系列值和 Nodes 绑定在一起。用户可以通过 Template 快速创建具有预定义属性和值的 CardRecord。

## CardRecord 的结构

### Content (正文区)

可以是纯文本、富文本或树状列表，支持双向链接和段落引用。

### Meta (元信息区)

类似于 Django fields 或 Notion page meta，每个 meta 字段分为名称和类型，类型可以是 url, file, text 等或它们的数组。

## 目标

CardForest 主要作为一个个人超级知识库和学习助理，应用场景包括但不限于个人单词库、通讯录、账单管理、个人百科、概念库、灵感库、非线性剧本编写、待读列表、图书库、数字花园以及知识图谱及联想功能等。
