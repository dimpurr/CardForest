# CardForest 开发备忘录

！！NOTE 绝对不要删掉或者修改这一行：这是 memo.md ，是用来在大量修改中记录易错易混点防止丢失上下文反复导致相同 bug 或者忘记之前设计的，你需要少用列表换行多用信息非常紧凑的方式记录，只记录我们调试过程中产生的必要信息不要空话套话general的 ！！！


## 系统架构设计
* CardForest采用三种部署模式的同构架构设计：基于Next.js的Web应用支持公开访问与实时协作；Electron桌面应用提供本地存储与系统集成；同构部署模式在共享核心业务逻辑基础上适配不同运行环境。核心代码组织分为core（共享逻辑）、web-client（Next.js应用）、desktop（Electron应用）和server（后端服务）四个包，通过Repository模式隔离数据访问实现Web模式使用远程ArangoDB、Desktop模式使用本地存储的数据层抽象，认证系统在Web模式下使用OAuth+JWT、Desktop模式使用系统级认证，文件系统则分别对应云存储和本地文件系统，使用Jotai通过Provider模式注入环境依赖实现状态管理。

## 认证与安全
* 系统实现两套认证流程：后端调试认证使用/user/auth/github路径与/user/auth/auth-callback-backend回调，用于开发调试和后端状态查看；前端应用认证通过前端路由处理OAuth回调供实际用户使用。Next-Auth+Apollo+JWT认证流程中，使用hook管理JWT避免服务端操作cookie，Apollo Client需正确设置auth header并跳过无token请求，登出时必须清理所有相关cookie。Web环境需要CSRF、XSS防护，Desktop环境需要本地权限管理，所有环境都需要加密敏感数据。

## 数据模型与API设计
* API命名规范：使用my前缀表示当前用户相关查询如myCards而非userCards，使用full后缀表示包含完整关联数据的查询如card/full，需保持命名一致性避免同一概念使用不同名称。模板系统支持从基础模板到特化模板的继承关系，字段定义包含验证规则和UI展示信息，自动处理系统字段。卡片系统包含title/content/body基础字段，使用meta字段存储模板特定数据，通过relations集合管理父子关系。

## 开发重点与优先级
* 当前以Web端核心功能为重点，包括卡片编辑管理、模板系统、基础UI组件和单用户数据流；基础架构采用Next.js+Radix UI设置，集成GraphQL，使用Jotai状态管理；UI/UX设计关注响应式布局、主题系统、交互设计和可访问性。开发顺序：基础框架搭建、核心UI组件实现、GraphQL集成、卡片编辑器开发、模板系统实现、关系管理添加、用户体验优化。

## 暂缓功能与注意事项
* 暂不考虑：本地文件系统集成与云存储方案、附件预览管理、多用户权限系统、协作功能、数据隔离策略、实时同步机制、多设备同步、离线功能、用户数据迁移。特别注意：路径处理需区分Web的URL路径和Desktop的文件系统路径确保跨平台兼容；API调用在Web使用REST/GraphQL、Desktop使用IPC通信需要统一抽象层；数据同步Web端实时、Desktop端定期且需处理冲突；GraphQL相关查询需使用AuthGuard保护并通过@CurrentUser()获取用户信息，注意ArangoDB查询中绑定参数必须显式提供，使用aql标签字符串处理复杂查询，关注关系查询性能影响。

## 调试与错误处理
* 后端调试页面（如/install、/card/full）保持简单HTML风格仅用于开发调试和状态查看。环境检测通过typeof window和process.type判断，条件导入根据环境选择具体实现。认证调试要点：检查Network中/api/auth/session返回和GraphQL请求Authorization header；检查Cookie中jwt和next-auth.session-token存在性；常见问题包括循环登录（检查JWT同步和cookie设置）、401/403（检查Authorization header格式）、Session数据不完整（检查next-auth callbacks）。