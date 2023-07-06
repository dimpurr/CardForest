# Server

NestJS + Passport.js + Nest Access Control + Express + GraphQL (apollo) + ArangoDB

## 文件夹结构

- `src/`：应用程序代码根目录
  - `database/`：数据库连接和配置相关的代码
    - `database.providers.ts`：创建数据库连接和提供数据库相关的配置
  - `graphql/`：GraphQL 相关的代码
    - `cardRecord.resolver.ts`：处理与卡片记录相关的 GraphQL 请求
    - `node.resolver.ts`：处理与节点相关的 GraphQL 请求
    - `model.resolver.ts`：处理与模型相关的 GraphQL 请求
    - `template.resolver.ts`：处理与模板相关的 GraphQL 请求
  - `services/`：服务目录，包含业务逻辑和数据操作的代码
    - `cardRecord.service.ts`：处理与卡片记录相关的业务逻辑和数据操作
    - `node.service.ts`：处理与节点相关的业务逻辑和数据操作
    - `model.service.ts`：处理与模型相关的业务逻辑和数据操作
    - `template.service.ts`：处理与模板相关的业务逻辑和数据操作
  - `controllers/`：控制器目录，用于处理请求和路由处理的代码
    - `cardRecord.controller.ts`：处理与卡片记录相关的请求和路由处理
    - `node.controller.ts`：处理与节点相关的请求和路由处理
    - `model.controller.ts`：处理与模型相关的请求和路由处理
    - `template.controller.ts`：处理与模板相关的请求和路由处理
  - `modules/`：模块目录，用于组织和注册模块的代码
    - `cardRecord/`：与卡片记录相关的模块
      - `cardRecord.module.ts`：定义与卡片记录相关的模块
    - `node/`：与节点相关的模块
      - `node.module.ts`：定义与节点相关的模块
    - `model/`：与模型相关的模块
      - `model.module.ts`：定义与模型相关的模块
    - `template/`：与模板相关的模块
      - `template.module.ts`：定义与模板相关的模块
  - `app.module.ts`：应用程序的主模块，导入和配置其他模块

