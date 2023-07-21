# CardForest 设计文档

## 概述

CardForest 是一个个人数据库/知识库/笔记软件，致力于将记录以卡片形式组织成一个数字花园。通过灵活的卡片链接方式，它整合了 Roam, Obsidian, Airtable, 和 Django 的特性。

| 产品     | 碎片化 | 流式 | OOP | 结构化 | 卡片式数据库 |
| -------- | ------ | ---- | --- | ------ | ------------ |
| CardForest | ✅ | ✅ | ✅ | ✅ | ✅ |
| AirTable | ✅ | ❌ | ❌ | ✅ | ✅ |
| Clipup  | ✅ | ❌ | ❌ | ✅ | ✅ |
| Coda    | ✅ | ❌ | ❌ | ✅ | ✅ |
| WebOOP  | ❌ | ❌ | ✅ | ❌ | ❌ |
| Flomo   | ❌ | ✅ | ❌ | ❌ | ❌ |
| Evernote | ❌ | ✅ | ❌ | ❌ | ❌ |

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

### CardForest: 面向对象的知识图谱

我们创造CardForest的初衷是希望每个人都能拥有自己的面向对象的知识图谱。在这个日益复杂的世界中，每个人都拥有丰富多样的社会关系、思想观念和知识结构。我们希望通过CardForest，让这些复杂的信息在大数据分析、可视化和GPT等工具的帮助下，变得更易于理解和管理。

例如，当你写下一个充满个人信息和专属名词的意识流日记，这份日记可能会对你的外国朋友来说充满了难以理解的地方。这时，你需要的是一个工具，一个能够帮助你把这个复杂的日记转化为“人话”，让你的朋友能理解的工具。这就是CardForest的价值所在。

CardForest就像是一个属于自己的“知识翻译器”。你可以在这里输入你的日记、社交网络、日历等信息，CardForest会利用它的算法，将这些信息转化为易于理解的形式。你也可以利用CardForest的大数据分析功能，深入了解自己的社会关系、思想观念和知识结构。通过可视化工具，你可以更清晰地看到自己的知识网络，并随时调整和优化。

总之，CardForest是你理解自我、理解世界的最佳伙伴。让我们一起打造属于每个人的知识图谱吧！

## CardForest URL 标识规则

CardForest 是一个个人数据库/知识库/笔记软件，每个资源都像一张卡片，并且可以相互连接形成数字花园。为了唯一标识 CardForest 中的文件和卡片资源，设计了以下 URL 标识规则：

```
cardf://[localhost|custhost.com|cardforest.dim.moe]/~username/(mutex/node/path/.. or _uncategorized or _files)/(slug or _key)
```

其中：

- `cardf://` 是协议头，表示这是一个 CardForest URL。
- `[localhost|custhost.com|cardforest.dim.moe]` 是服务器地址部分，可以是 `localhost`（本地主机），`custhost.com`（自定义的托管服务器）或 `cardforest.dim.moe`（官方托管服务器）。
- `~username` 是用户名部分，用于标识用户。
- `(mutex/node/path/.. or _uncategorized or _files)` 是资源路径部分，表示资源所属的路径。路径可以是 `mutex`（Mutex Node Group），`node`（Non-Mutex Node Group）或具体的路径。如果资源没有归属于任何节点组，则使用 `_uncategorized`。如果资源是附件、RuleSet、Template 或 Perspective，则使用 `_files`。
- `(slug or _key)` 是资源的自定义标识符或唯一标识符，用于标识具体的文件、RuleSet、Template 或 Perspective。

根据这个规则，可以唯一标识和访问 CardForest 中的各种资源，例如：

- 卡片资源：`cardf://cardforest.dim.moe/~username/node/group1/card1`
- 附件资源：`cardf://cardforest.dim.moe/~username/_files/attachment1`
- RuleSet 资源：`cardf://cardforest.dim.moe/~username/_rulesets/ruleset1`
- Template 资源：`cardf://cardforest.dim.moe/~username/_templates/template1`
- Perspective 资源：`cardf://cardforest.dim.moe/~username/_perspectives/perspective1`

这样的标识可以用于分享和访问 CardForest 中的资源。

