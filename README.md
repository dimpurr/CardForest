# CardForest
Graph note database

## 初次设置

安装所需工具:

- node
- brew
- yarn

使用 n 来管理 Node 版本。

在项目的根目录执行：

```
yarn
```

## 运行方法

文档 (docs)

```
cd cardforest/packages/docs
npm run dev
```

服务器 (server)

```
cd cardforest/packages/server
ts-node scripts/generate-typings.ts
yarn start:dev
```

访问链接:
http://127.0.0.1:3000/

