# database

## cards

字段
- id: 唯一标识符，用于引用和识别 CardRecord。
- title: 卡片标题，通过正文的第一行作为默认标题。
- content: 卡片正文，可以是以下三种类型之一：
  - `type`: 内容类型，可以是 `plainText`、`richText` 或 `treeText`。
  - `value`: 实际的内容值，以 JSON 字符串表示，根据类型的不同可以是字符串、富文本格式或树状列表结构的 JSON 字符串。
- created_at: 创建时间，记录卡片创建的日期和时间。
- modified_at: 修改时间，记录卡片最后修改的日期和时间。
- model: 指示卡片是否基于某个模板创建，存储模板的名称。
- nodes: 表示卡片所属的节点列表，包括 Mutex Node 和 Non-Mutex Nodes。按顺序显示 Mutex Node，然后显示 Non-Mutex Nodes。
- meta: 卡片的元数据字段集合，用于存储一组元数据。
  - meta_name: 元数据名称，描述元数据字段的名称。
  - meta_type: 元数据类型，可以是 url、file、text 等，也可以是这些类型的数组，如 url(array)、file(array)。

## files

该集合存储文件信息。

- **名称**：Attachments

### 字段

- **path**：字符串类型，文件在 attachments 文件夹下的相对路径。
- **userId**：字符串类型，关联的用户ID，用于权限控制。
- **uuid**：字符串类型，文件的唯一标识符或键。
- **uploadTime**：日期时间类型，文件的上传时间。
- **updateTime**：日期时间类型，文件的修改或替换时间。
- **fileName**：字符串类型，文件的完整名称。
- **fileExtension**：字符串类型，文件的后缀名。

## users

存储用户信息
- \_key: 用户唯一标识
- username: 用户名
- password: 密码
- ...
