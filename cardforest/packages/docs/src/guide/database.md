字段
* id: 唯一标识符，用于引用和识别 CardRecord。
* title: 卡片标题，通过正文的第一行作为默认标题。
* content: 卡片正文，可以是以下三种类型之一：
  - `type`: 内容类型，可以是 `plainText`、`richText` 或 `treeText`。
  - `value`: 实际的内容值，以 JSON 字符串表示，根据类型的不同可以是字符串、富文本格式或树状列表结构的 JSON 字符串。
* created_at: 创建时间，记录卡片创建的日期和时间。
* modified_at: 修改时间，记录卡片最后修改的日期和时间。
* template: 指示卡片是否基于某个模板创建，存储模板的名称。
* nodes: 表示卡片所属的节点列表，包括 Mutex Node 和 Non-Mutex Nodes。按顺序显示 Mutex Node，然后显示 Non-Mutex Nodes。
* meta: 卡片的元数据字段集合，用于存储一组元数据。
    * meta_name: 元数据名称，描述元数据字段的名称。
    * meta_type: 元数据类型，可以是 url、file、text 等，也可以是这些类型的数组，如 url(array)、file(array)。


content: 卡片正文，表示卡片的详细内容。
* plainText: 纯文本类型，用于简单的文本内容。
* richText: 富文本类型，支持更丰富的文本样式和格式。
* treeText: 树状列表类型，类似 Roam 风格的树形结构，用于组织和展示层次化的信息。
    * 字段类型：array
    * 数组元素类型：object
        * text: 列表项的文本内容，字段类型为 string
        * children: 子列表项，字段类型为 array，递归结构