# CardForest 开发备忘录

！！NOTE 绝对不要删掉或者修改这一行：这是 memo.md ，是用来在大量修改中记录易错易混点防止丢失上下文反复导致相同 bug 或者忘记之前设计的，！！你需要少用列表换行多用信息非常紧凑的方式记录！！，只记录我们调试过程中产生的必要信息不要空话套话general的。另外过去的 memo 有可能会出错，这时候问我要不要修正他们的特定位置，告诉我从什么修改成什么让我决策！！！

## 杂项

* 我们都用 pnpm 。我们使用 radix ui 且会自动支持夜间模式。我们使用 jotai 。记得看我们的架构和技术选型。

## 系统架构设计
* CardForest采用三种部署模式的同构架构设计：基于Next.js的Web应用支持公开访问与实时协作；Electron桌面应用提供本地存储与系统集成；同构部署模式在共享核心业务逻辑基础上适配不同运行环境。核心代码组织分为core（共享逻辑）、web-client（Next.js应用）、desktop（Electron应用）和server（后端服务）四个包，通过Repository模式隔离数据访问实现Web模式使用远程ArangoDB、Desktop模式使用本地存储的数据层抽象，认证系统在Web模式下使用OAuth+JWT、Desktop模式使用系统级认证，文件系统则分别对应云存储和本地文件系统，使用Jotai通过Provider模式注入环境依赖实现状态管理。

## 认证与安全

* 系统实现两套认证流程：后端调试认证使用/user/auth/github路径与/user/auth/auth-callback-backend回调，用于开发调试和后端状态查看；前端应用认证通过前端路由处理OAuth回调供实际用户使用。Auth.js(NextAuth升级版)+Apollo+JWT认证流程中，使用hook管理JWT避免服务端操作cookie。Auth.js配置中jwt回调获取并存储backendJwt，session回调传递给前端，不要在jwt回调中读取cookie；CORS配置必须同时设置credentials:true和exposedHeaders:['Set-Cookie']允许跨域cookie，origin需精确匹配前端域名；Apollo Client需设置credentials:'include'确保发送cookie。Web环境需要CSRF、XSS防护，Desktop环境需要本地权限管理，所有环境都需要加密敏感数据。GraphQL mutation必须在resolver层使用@UseGuards(AuthGuard)保护，前端组件需要useSession和useJWT双重确保，Apollo Client的authLink必须在SSR环境下安全处理window对象。AuthGuard需要同时支持从Authorization header和cookies中获取JWT，确保在不同场景下都能正确验证用户身份。使用Auth.js时避免使用Edge Runtime以防止JWT处理问题，确保在jwt回调中正确处理OAuth provider返回的profile信息。Auth.js集成关键点：1)jwt回调必须在token中存储backendJwt(而非直接返回新对象)；2)session回调必须从token读取并传递backendJwt；3)GitHub OAuth profile可能使用sub或id字段作为用户标识，后端需兼容处理；4)Apollo Client的authLink应异步获取session确保JWT最新；5)useJWT hook应通过useEffect响应session变化；6)调试时需记录完整生命周期日志(OAuth回调、JWT生成、Session传递、GraphQL请求)。

## 模板与卡片系统
* 模板字段验证：基础模板必须使用_inherit_from:'_self'，继承模板使用_inherit_from:templateKey。验证时basic/meta字段分开验证，meta字段在cardData.meta下。createUser需分别传入username和password参数而非对象。模板字段验证时需区分基础字段和元字段位置，避免字段定义和数据结构不匹配。
* API命名规范：使用my前缀表示当前用户相关查询如myCards而非userCards，使用full后缀表示包含完整关联数据的查询如card/full，需保持命名一致性避免同一概念使用不同名称。模板系统支持从基础模板到特化模板的继承关系，字段定义包含验证规则和UI展示信息，自动处理系统字段。卡片系统包含title/content/body基础字段，使用meta字段存储模板特定数据，通过relations集合管理父子关系。数据关联使用_key而非完整_id路径，GraphQL查询需要通过AQL JOIN获取完整关联对象。

## GraphQL Mutation 认证与卡片创建体验
* GraphQL mutation的认证流程需要确保在resolver层使用@UseGuards(AuthGuard)保护，防止未授权的请求。卡片创建体验需要确保在创建卡片时，正确设置卡片的所有者和权限，避免未授权的用户访问或修改卡片。卡片创建流程需要遵循以下步骤：1. 用户输入卡片标题和内容；2. 系统验证用户的身份和权限；3. 系统创建卡片并设置所有者和权限；4. 系统返回卡片的ID和创建成功的消息。

## GraphQL配置要点
* Apollo Client配置：URI必须显式包含/graphql路径(如`${baseUrl}/graphql`)；authLink需要在SSR环境下安全处理window对象；请求需要credentials: 'include'确保cookie传递。服务端配置：使用ApolloDriver，需要正确设置typePaths加载schema；playground需要配置request.credentials: 'include'；CORS配置必须允许credentials且指定allowedHeaders包含Authorization。错误处理需要在formatError中统一处理并记录日志。

## 数据模型与API设计
* API命名规范：使用my前缀表示当前用户相关查询如myCards而非userCards，使用full后缀表示包含完整关联数据的查询如card/full，需保持命名一致性避免同一概念使用不同名称。模板系统支持从基础模板到特化模板的继承关系，字段定义包含验证规则和UI展示信息，自动处理系统字段。卡片系统包含title/content/body基础字段，使用meta字段存储模板特定数据，通过relations集合管理父子关系。数据关联使用_key而非完整_id路径，GraphQL查询需要通过AQL JOIN获取完整关联对象。

## 模板系统

* 模板字段使用FieldGroup分组，支持继承链，使用inherits_from数组存储父模板ID。字段验证在TemplateService.validateFields中处理，使用isValidFieldType检查类型。模板编辑器需要同时支持字段编辑和继承管理，使用Jotai atom管理模板状态避免prop drilling。模板列表需要展示继承关系，可以用树形结构或者标签形式。字段覆盖时需要保留原字段信息便于还原。前端使用GraphQL fragments优化模板查询，使用useTemplate hook封装模板操作逻辑。模板预览需要考虑继承字段的显示方式，可以用不同颜色或图标区分来源。

* 模板继承采用原型链机制：festival_date_card -> datecard -> basic_card，字段按来源分组存储，每组用_inherit_from标记来源模板。编辑器中title/body/content在顶部，meta区域按模板来源分组显示。字段存储格式：{name:"festival_date_card", inherits_from:["datecard"], fields:[{_inherit_from:"basic_card",fields:[{name:"title",type:"text"}]},{_inherit_from:"datecard",fields:[{name:"start_date",type:"date"}]},{_inherit_from:"_self",fields:[{name:"origin",type:"text"}]}]}。GraphQL返回扁平化字段用flattenedFields保持兼容。
* 模板字段设计关键点：(1)Template和FlattenedTemplate的fields类型必须保持一致，统一用FieldGroup[]数组结构，避免使用Record<string,FieldDefinition>以防前后端不一致；(2)字段分组用_inherit_from区分基础字段(basic/_self)和meta字段；(3)GraphQL schema中不要用JSON类型表示复杂结构，应该完整定义字段类型以获得类型检查；(4)前端根据_inherit_from渲染不同区域，basic字段和meta字段分开展示。
* 模板继承实现注意点：(1)所有获取模板的接口都要处理继承关系，包括getTemplateById；(2)继承处理通过getTemplateWithInheritance方法合并所有父模板的字段；(3)字段合并时保持_inherit_from标记以便前端区分字段来源；(4)GraphQL查询需要包含完整的字段结构。

## 经验教训

- GraphQL query 的 skip 条件要谨慎，比如 `skip: !session || !jwt` 如果 jwt 获取不当会导致查询永远不执行。最好在 useJWT 这样的 hook 里同时检查 session 和 cookie 来源。
- 调试 cookie 和 JWT 问题时，在修改代码前先添加详细日志，包括：
  1. cookie 的原始内容和解析后的键值对
  2. JWT 在各个环节的传递过程（NextAuth session -> cookie -> Apollo client -> HTTP header）
  3. GraphQL 请求的完整 header

## 开发重点与优先级
* 当前以Web端核心功能为重点，包括卡片编辑管理、模板系统、基础UI组件和单用户数据流；基础架构采用Next.js+Radix UI设置，集成GraphQL，使用Jotai状态管理；UI/UX设计关注响应式布局、主题系统、交互设计和可访问性。开发顺序：基础框架搭建、核心UI组件实现、GraphQL集成、卡片编辑器开发、模板系统实现、关系管理添加、用户体验优化。

## 暂缓功能与注意事项
* 暂不考虑：本地文件系统集成与云存储方案、附件预览管理、多用户权限系统、协作功能、数据隔离策略、实时同步机制、多设备同步、离线功能、用户数据迁移。特别注意：路径处理需区分Web的URL路径和Desktop的文件系统路径确保跨平台兼容；API调用在Web使用REST/GraphQL、Desktop使用IPC通信需要统一抽象层；数据同步Web端实时、Desktop端定期且需处理冲突；GraphQL相关查询需使用AuthGuard保护并通过@CurrentUser()获取用户信息，注意ArangoDB查询中绑定参数必须显式提供，使用aql标签字符串处理复杂查询，关注关系查询性能影响。

## 调试与错误处理
* 后端调试页面（如/install、/card/full）保持简单HTML风格仅用于开发调试和状态查看。环境检测通过typeof window和process.type判断，条件导入根据环境选择具体实现。认证调试要点：检查Network中/api/auth/session返回和GraphQL请求Authorization header；检查Cookie中jwt和next-auth.session-token存在性；常见问题包括循环登录（检查JWT同步和cookie设置）、401/403（检查Authorization header格式）、Session数据不完整（检查next-auth callbacks）。JWT处理关键：useJWT必须同时处理session和cookie来源保持同步；cookie设置需要{secure:仅生产环境,sameSite:'lax',path:'/',expires:1}；Apollo Client的authLink中用js-cookie替代document.cookie解析。Card.createdBy非空但返回null说明数据库中user关联丢失，检查Card创建时的user绑定和GraphQL resolver中的关系查询。Apollo Client无限循环原因：fetchPolicy设为cache-and-network导致，改为network-only；userId处理需要从user对象中提取sub字段；ArangoDB查询中userRef格式必须为users/[userId]。

！！NOTE：绝对不要删掉或者修改这一行：你需要少用列表换行多用信息非常紧凑的方式记录！！保持这个是最后一行！！
