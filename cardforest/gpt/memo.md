# CardForest 开发备忘录

！！NOTE 绝对不要删掉或者修改这一行：这是 memo.md ，是用来在大量修改中记录易错易混点防止丢失上下文反复导致相同 bug 或者忘记之前设计的，！！你需要少用列表换行多用信息非常紧凑的方式记录！！，只记录我们调试过程中产生的必要信息不要空话套话general的。另外过去的 memo 有可能会出错，这时候问我要不要修正他们的特定位置，告诉我从什么修改成什么让我决策！！！

## 杂项

* 我们都用 pnpm 。我们使用 radix ui 且会自动支持夜间模式。我们使用 jotai 。记得看我们的架构和技术选型。

## 系统架构设计
* CardForest采用三种部署模式的同构架构设计：基于Next.js的Web应用支持公开访问与实时协作；Electron桌面应用提供本地存储与系统集成；同构部署模式在共享核心业务逻辑基础上适配不同运行环境。核心代码组织分为core（共享逻辑）、web-client（Next.js应用）、desktop（Electron应用）和server（后端服务）四个包，通过Repository模式隔离数据访问实现Web模式使用远程ArangoDB、Desktop模式使用本地存储的数据层抽象，认证系统在Web模式下使用OAuth+JWT、Desktop模式使用系统级认证，文件系统则分别对应云存储和本地文件系统，使用Jotai通过Provider模式注入环境依赖实现状态管理。

## 认证与安全

* 系统实现两套认证流程：后端调试认证使用/user/auth/github路径与/user/auth/auth-callback-backend回调，用于开发调试和后端状态查看；前端应用认证通过前端路由处理OAuth回调供实际用户使用。Auth.js(NextAuth升级版)+Apollo+JWT认证流程中，使用hook管理JWT避免服务端操作cookie。Auth.js配置中jwt回调获取并存储backendJwt，session回调传递给前端，不要在jwt回调中读取cookie；CORS配置必须同时设置credentials:true和exposedHeaders:['Set-Cookie']允许跨域cookie，origin需精确匹配前端域名；Apollo Client需设置credentials:'include'确保发送cookie。Web环境需要CSRF、XSS防护，Desktop环境需要本地权限管理，所有环境都需要加密敏感数据。GraphQL mutation必须在resolver层使用@UseGuards(AuthGuard)保护，前端组件需要useSession和useJWT双重确保，Apollo Client的authLink必须在SSR环境下安全处理window对象。AuthGuard需要同时支持从Authorization header和cookies中获取JWT，确保在不同场景下都能正确验证用户身份。使用Auth.js时避免使用Edge Runtime以防止JWT处理问题，确保在jwt回调中正确处理OAuth provider返回的profile信息。Auth.js集成关键点：1)jwt回调必须在token中存储backendJwt(而非直接返回新对象)；2)session回调必须从token读取并传递backendJwt；3)GitHub OAuth profile可能使用sub或id字段作为用户标识，后端需兼容处理；4)Apollo Client的authLink应异步获取session确保JWT最新；5)useJWT hook应通过useEffect响应session变化；6)调试时需记录完整生命周期日志(OAuth回调、JWT生成、Session传递、GraphQL请求)。

## 模板与卡片系统
* 模板字段验证：基础模板必须使用_inherit_from:'_self'，继承模板使用_inherit_from:modelKey。验证时basic/meta字段分开验证，meta字段在cardData.meta下。createUser需分别传入username和password参数而非对象。模板字段验证时需区分基础字段和元字段位置，避免字段定义和数据结构不匹配。
* 模板字段处理：继承模板的字段分为两类：1)当前模板字段(_inherit_from:modelId)；2)继承字段(_inherit_from:'_self')。处理时需要先将当前模板字段标记为_self，然后添加继承模板的_self字段。不要用继承字段替换当前字段，而是构建包含两者的新字段数组。
* 模板继承UI规则：继承选择界面中，当前模板自身需要被禁用且永远不选中(disabled+unchecked)，已继承的父模板需要被禁用且永远选中(disabled+checked)，只有其他独立模板可以被自由选择。这确保了继承关系的单向性和一致性，避免循环继承。父模板状态初始化必须从model.fields中的_inherit_from提取(排除'_self')，而非使用model.inherits_from。模板ID需要加'models/'前缀。
* 卡片创建格式：CreateCardInput必须分开处理基础字段(title/content/body)和meta字段。基础字段直接放在input对象中，其他字段放在meta对象中。不要使用fields数组格式，这是旧版本的格式已废弃。
* API命名规范：使用my前缀表示当前用户相关查询如myCards而非userCards，使用full后缀表示包含完整关联数据的查询如card/full，需保持命名一致性避免同一概念使用不同名称。模板系统支持从基础模板到特化模板的继承关系，字段定义包含验证规则和UI展示信息，自动处理系统字段。卡片系统包含title/content/body基础字段，使用meta字段存储模板特定数据，通过relations集合管理父子关系。数据关联使用_key而非完整_id路径，GraphQL查询需要通过AQL JOIN获取完整关联对象。

## GraphQL Mutation 认证与卡片创建体验
* GraphQL mutation的认证流程需要确保在resolver层使用@UseGuards(AuthGuard)保护，防止未授权的请求。卡片创建体验需要确保在创建卡片时，正确设置卡片的所有者和权限，避免未授权的用户访问或修改卡片。卡片创建流程需要遵循以下步骤：1. 用户输入卡片标题和内容；2. 系统验证用户的身份和权限；3. 系统创建卡片并设置所有者和权限；4. 系统返回卡片的ID和创建成功的消息。

## GraphQL配置要点
* Apollo Client配置：URI必须显式包含/graphql路径(如`${baseUrl}/graphql`)；authLink需要在SSR环境下安全处理window对象；请求需要credentials: 'include'确保cookie传递。服务端配置：使用ApolloDriver，需要正确设置typePaths加载schema；playground需要配置request.credentials: 'include'；CORS配置必须允许credentials且指定allowedHeaders包含Authorization。错误处理需要在formatError中统一处理并记录日志。

## 数据模型与API设计
* API命名规范：使用my前缀表示当前用户相关查询如myCards而非userCards，使用full后缀表示包含完整关联数据的查询如card/full，需保持命名一致性避免同一概念使用不同名称。模板系统支持从基础模板到特化模板的继承关系，字段定义包含验证规则和UI展示信息，自动处理系统字段。卡片系统包含title/content/body基础字段，使用meta字段存储模板特定数据，通过relations集合管理父子关系。数据关联使用_key而非完整_id路径，GraphQL查询需要通过AQL JOIN获取完整关联对象。

## 模板系统

* 模板字段使用FieldGroup分组，支持继承链，使用inherits_from数组存储父模板ID。字段验证在ModelService.validateFields中处理，使用isValidFieldType检查类型。模板编辑器需要同时支持字段编辑和继承管理，使用Jotai atom管理模板状态避免prop drilling。模板列表需要展示继承关系，可以用树形结构或者标签形式。字段覆盖时需要保留原字段信息便于还原。前端使用GraphQL fragments优化模板查询，使用useModel hook封装模板操作逻辑。模板预览需要考虑继承字段的显示方式，可以用不同颜色或图标区分来源。

* 模板继承采用原型链机制：festival_date_card -> datecard -> basic_card，字段按来源分组存储，每组用_inherit_from标记来源模板。编辑器中title/body/content在顶部，meta区域按模板来源分组显示。字段存储格式：{name:"festival_date_card", inherits_from:["datecard"], fields:[{_inherit_from:"basic_card",fields:[{name:"title",type:"text"}]},{_inherit_from:"datecard",fields:[{name:"start_date",type:"date"}]},{_inherit_from:"_self",fields:[{name:"origin",type:"text"}]}]}。GraphQL返回扁平化字段用flattenedFields保持兼容。
* 模板字段设计关键点：(1)Model和FlattenedModel的fields类型必须保持一致，统一用FieldGroup[]数组结构，避免使用Record<string,FieldDefinition>以防前后端不一致；(2)字段分组用_inherit_from区分基础字段(basic/_self)和meta字段；(3)GraphQL schema中不要用JSON类型表示复杂结构，应该完整定义字段类型以获得类型检查；(4)前端根据_inherit_from渲染不同区域，basic字段和meta字段分开展示。
* 模板继承实现注意点：(1)所有获取模板的接口都要处理继承关系，包括getModelById；(2)继承处理通过getModelWithInheritance方法合并所有父模板的字段；(3)字段合并时保持_inherit_from标记以便前端区分字段来源；(4)GraphQL查询需要包含完整的字段结构。/ GraphQL 查询 - `GET_MODEL_WITH_INHERITANCE`: 获取模板及其继承关系 - `CREATE_MODEL`, `UPDATE_MODEL`: 分别用于创建和更新模板   - 查询和变更分别放在 queries/ 和 mutations/ 目录下
* 在设计 GraphQL Schema 时，需要注意以下几点： **类型统一性**：如果两个类型有相同的字段结构，应该尽量合并成一个类型，而不是创建多个相似的类型。这样可以： - 允许 Fragment 在不同查询间复用 - 减少类型定义的重复 - 简化客户端的类型处理  **类型扩展方式**： - 使用字段标记而不是新类型来区分变体 - 必要时使用 interface 来共享字段 - 考虑使用 union type 来处理多态性  **实际案例**： - 原本将 `Model` 和 `FlattenedModel` 分开定义，导致 Fragment 无法复用 - 解决方案是合并为单一的 `Model` 类型，通过查询方法的不同来返回不同的数据结构 - 保持了类型系统的简洁性，同时提高了代码的可维护性

## GraphQL 字段处理

* **非空字段回退值**：GraphQL schema 中的非空字段(`!`)必须确保所有查询都返回值。解决方案：(1)在 resolver 中提供合理的回退值，如 `user.username || user.name || user.email || user._key`；(2)统一所有相关查询的返回结构；(3)在 schema 中谨慎使用非空标记。
* **保留字段**：以双下划线开头的字段名(如`__typename`)是 GraphQL 保留的，不能在 schema 中显式定义。这些字段由 GraphQL 运行时自动处理，用于内省和类型信息。

## 组件渲染规则

* **Radix UI Slot 组件**：Slot 组件要求只能有单个子元素，条件渲染多个元素时需要先合并为一个。解决方案：(1)使用 switch/renderFn 返回单一元素；(2)避免在 Slot 内使用多个条件渲染。错误示例：`<Slot>{cond1 && <A/>}{cond2 && <B/>}</Slot>`，正确示例：`<Slot>{cond1 ? <A/> : <B/>}</Slot>`。

## 前端调试
* 调试数据展示：创建全局DebugPanel组件，支持折叠/展开，仅在开发环境显示。使用JSON.stringify(data,null,2)格式化展示。调试GraphQL数据时展示original和processed两部分，帮助理解数据转换过程。组件放在@/components/debug目录。

## 前端路由与认证保护
* 路由保护实现：使用`ProtectedRoute`组件和`withAuth`高阶组件统一处理认证保护。`withAuth`接收两个参数：组件和配置选项(fallbackUrl和handleErrors)。路由保护流程：1)检查认证状态；2)未认证时重定向到登录页面并传递回调URL；3)认证成功时渲染组件；4)可选处理API错误(如401/403)。路由配置集中在`config/routes.ts`，包含路由定义、导航菜单和面包屑生成函数，确保路径一致性。
* 双重认证系统维护：CardForest维护两套认证系统：1)前端NextAuth认证(主要用户流程)；2)后端直接OAuth认证(API调试用)。关键点：a)保持`/auth/signin`页面同时支持两种登录方式；b)使用统一的`AuthContext`和`useAuth`钩子管理认证状态；c)JWT处理从多个来源获取(session/cookie/URL)；d)认证回调页面(`/auth/callback`)处理两种认证流程；e)使用`routes.ts`确保所有认证相关URL一致。前端组件使用`withAuth(Component, {handleErrors:true})`保护，后端API使用`@UseGuards(AuthGuard)`保护。

## 经验教训

* GraphQL query 的 skip 条件要谨慎，比如 `skip: !isAuthenticated` 如果 isAuthenticated 判断不当会导致查询永远不执行。最好在 useJWT 这样的 hook 里只检查 session 状态而不要同时要求 JWT 存在，因为用户可能通过不同方式登录。
* 调试 cookie 和 JWT 问题时，在修改代码前先添加详细日志，包括：
  1. cookie 的原始内容和解析后的键值对
  2. JWT 在各个环节的传递过程（NextAuth session -> cookie -> Apollo client -> HTTP header）
  3. GraphQL 请求的完整 header
* 用户ID处理需要兼容多种格式：1)后端resolver中从user对象提取ID时需要考虑多种属性(user.sub/user._key/user.id)；2)数据库查询中需要处理不同格式的createdBy字段(字符串路径如'users/123'或对象如{username:'user'})；3)前端展示时需要处理可能缺失的用户信息。
* Apollo Client应该从多个来源获取JWT：1)NextAuth session；2)cookie；3)URL参数。这样可以支持不同的登录流程，特别是后端直接认证后重定向到前端的情况。
* 用户对象格式不一致问题：1)后端返回的用户对象可能是{_key:'123',username:'user'}或简单的'123'字符串；2)createdBy字段可能是字符串路径'users/123'或对象{username:'user'}；3)需要在resolver和service层都做兼容处理。

## 开发重点与优先级
* 当前以Web端核心功能为重点，包括卡片编辑管理、模板系统、基础UI组件和单用户数据流；基础架构采用Next.js+Radix UI设置，集成GraphQL，使用Jotai状态管理；UI/UX设计关注响应式布局、主题系统、交互设计和可访问性。开发顺序：基础框架搭建、核心UI组件实现、GraphQL集成、卡片编辑器开发、模板系统实现、关系管理添加、用户体验优化。

## 暂缓功能与注意事项
* 暂不考虑：本地文件系统集成与云存储方案、附件预览管理、多用户权限系统、协作功能、数据隔离策略、实时同步机制、多设备同步、离线功能、用户数据迁移。特别注意：路径处理需区分Web的URL路径和Desktop的文件系统路径确保跨平台兼容；API调用在Web使用REST/GraphQL、Desktop使用IPC通信需要统一抽象层；数据同步Web端实时、Desktop端定期且需处理冲突；GraphQL相关查询需使用AuthGuard保护并通过@CurrentUser()获取用户信息，注意ArangoDB查询中绑定参数必须显式提供，使用aql标签字符串处理复杂查询，关注关系查询性能影响。

## 调试与错误处理

* 后端调试页面（如/install、/card/full）保持简单HTML风格仅用于开发调试和状态查看。环境检测通过typeof window和process.type判断，条件导入根据环境选择具体实现。
* 认证调试要点：检查Network中/api/auth/session返回和GraphQL请求Authorization header；检查Cookie中jwt和next-auth.session-token存在性；常见问题包括循环登录（检查JWT同步和cookie设置）、401/403（检查Authorization header格式）、Session数据不完整（检查next-auth callbacks）。
* JWT处理关键：useJWT应该主要检查session状态而非必须要求JWT存在；cookie设置需要{secure:仅生产环境,sameSite:'lax',path:'/',expires:1}；Apollo Client的authLink中用js-cookie替代document.cookie解析；考虑从多个来源获取JWT（session/cookie/URL参数）。
* 用户ID处理问题：
  1. 后端resolver中从user对象提取ID时需要考虑多种属性（user.sub/user._key/user.id/user._id）
  2. 数据库查询中需要处理不同格式的createdBy字段（字符串路径如'users/123'或对象如{username:'user'}）
  3. ArangoDB查询中需要使用更灵活的查询条件，如`FILTER card.createdBy == @userRef || (IS_OBJECT(card.createdBy) && card.createdBy.username == @username)`
  4. Card.createdBy非空但返回null说明数据库中user关联丢失，检查Card创建时的user绑定和GraphQL resolver中的关系查询
* Apollo Client相关问题：
  1. 无限循环原因：fetchPolicy设为cache-and-network导致，改为network-only
  2. 查询跳过原因：skip条件过于严格，如`skip: !isAuthenticated && !jwt`改为只检查session状态
  3. 认证失败原因：authorization header不正确或缺失，确保JWT正确传递

## GraphQL 错误处理

* **错误传递链**：GraphQL 错误需要从后端传递到前端并展示给用户。解决方案：(1)后端 resolver 抛出具体错误；(2)前端检查 mutation 结果 `if (!result.data?.mutationName)`；(3)使用 React 状态管理错误消息；(4)用 Alert 组件展示错误。错误示例：`result = await mutation()`，正确示例：`result = await mutation(); if (!result.data?.x) throw new Error()`。

## GraphQL 查询和缓存

* **查询字段同步**：GraphQL 查询和缓存更新必须使用相同的字段集。解决方案：(1)在一个地方定义查询，确保复用；(2)缓存更新时使用完整的查询对象；(3)处理缓存为空的情况。错误示例：`cache.writeQuery({query,data:{myCards:[{_id,title}]}})`，正确示例：`cache.writeQuery({query,data:{myCards:[{...完整字段}]}})`。

## React Hook Form

* **Controller 作用域**：`Controller` 组件的 `render` 回调中才能访问到 `field` 对象，需要确保所有使用 `field` 的逻辑都在回调内部。错误示例：`render={({field})=><A>{helperFn(field)}</A>}`，正确示例：`render={({field})=>{const helper=()=>field.x; return <A>{helper()}</A>}}`。
* **表单提交处理**：表单组件和提交按钮在不同组件时，需要正确关联。解决方案：(1)表单组件导出 `handleSubmit`；(2)按钮组件调用 `handleSubmit`；(3)使用 `window` 对象或 Context 共享。错误示例：`<Button type="submit" form="form-id">`，正确示例：`<Button onClick={()=>handleSubmit()}>`。

## 调试与开发工具

* **调试面板事件处理**：调试面板中的交互（如展开/折叠）不应影响主应用。解决方案：(1)使用 `e.preventDefault()` 防止事件冒泡；(2)避免在调试组件中使用可能触发导航的元素；(3)调试状态共享优先使用 props，必要时可通过 window 对象。错误示例：`onClick={()=>setExpand(!expand)}`，正确示例：`onClick={e=>{e.preventDefault();setExpand(!expand)}}`。

## Apollo Client

* **缓存更新**：mutation 后需要更新相关查询的缓存。解决方案：(1)在 mutation 配置中使用 `update` 回调；(2)使用 `cache.readQuery` 读取现有数据；(3)使用 `cache.writeQuery` 写入更新后的数据。错误示例：`useMutation(CREATE_CARD)`，正确示例：`useMutation(CREATE_CARD,{update(cache,{data})=>{cache.writeQuery({...})}})`。

## 表单提交

* **重复提交防护**：表单提交时要防止重复点击。解决方案：(1)使用 `isSubmitting` 状态；(2)禁用提交按钮；(3)显示加载状态。错误示例：`<button onClick={submit}>`，正确示例：`<button disabled={isSubmitting} onClick={submit}>{isSubmitting?'Saving':'Submit'}</button>`。

！！NOTE：绝对不要删掉或者修改这一行：你需要少用列表换行多用信息非常紧凑的方式记录！！保持这个是最后一行！！
