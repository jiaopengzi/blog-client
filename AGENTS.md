# AGENTS.md

> 读者：自动化 / Agent 编码助手。
> 内容原则：只写「可执行命令 + 可验证约定」。命令、配置、路径和数字须能从 `package.json`、Nuxt/Vitest/TypeScript 配置、`src/`、`server/`、Docker 与 Nginx 文件或实际验收结果溯源，禁止凭印象编写。

## 1. 项目定位与验收基线

| 项目                            | git 记录                     | 角色                                       |
| ------------------------------- | ---------------------------- | ------------------------------------------ |
| `blog-client`（本项目，Nuxt 4） | 已发布至 v1.3.0（CHANGELOG） | **唯一维护主线**，所有代码修改只发生在这里 |
| `blog-client`（旧 SPA 仓库）    | tag v1.0.1                   | 历史参照（迁移期对照用），不再作为验收基线 |

验收基线：Nuxt 迁移已完成。回归验收以**本项目当前代码**为准——全量测试全绿（`pnpm test`）+ 页面行为/渲染/性能不劣化；不再逐项对照旧 SPA。行为语义不确定时，以本项目既有实现与测试为基准。

强制纪律：

- 前端端口统一 `7364`。命令行 / 无头场景用 `http://127.0.0.1:7364`，**不要用 `localhost`**（可能解析为 IPv6 `::1` 导致连接被拒）；人工对比或跨机访问用 `http://10.10.2.222:7364`。
- SPA 与 Nuxt 不能同时占用 7364，对比时先停一个。端口被占用 / 僵尸进程用 skill `dev-env-manage` kill。
- 改动 `nuxt.config.ts`、根 `server/` 或 `src/` 下的 `error.vue`（注意在 `src/` 而非根目录）、`middleware/`、`plugins/` 后若"代码已改但表现是旧的"，先重启 dev server；仍异常再 `pnpm nuxi cleanup` 后重启（冷启动变慢属正常）。
- AI 的非代码产物（截图、日志、临时调试脚本、无头浏览器数据目录）**只能**写入 `.spa2nuxt/cache`，禁止写进 `src/`、`scripts/` 等源码目录；任务结束前清理临时脚本与无头浏览器进程。
- `.debug/`、`.bug/`、`.feat/`、`.spa2nuxt/cache` 的全量内容**不要读取**（省 token），按文件名定位后单读。
- 用户 review 确认后才允许 commit；**AI 不得自行 commit / push**。

### 1.1 已知第三方控制台噪音（勿重复排查）

浏览器装有「沉浸式翻译」扩展时，`/login`、`/register`、`/reset-password` 等页面按键会在控制台出现（keydown/keyup 处理器）：

```text
Uncaught TypeError: Cannot read properties of undefined (reading 'toLowerCase')
    at _U.isTriggerKey (content_main.js:...)
    at HTMLDocument.handleKeyDown (content_main.js:...)
```

结论（bug 260926-02，2026-09-26 排查）：**`content_main.js` 属该浏览器扩展自身的脚本，非本站文件；本站代码无需修复**。浏览器验收时遇到该报错直接归为扩展噪音忽略，不要再立项排查。

排查证据：

- 报错位置与该扩展官方发行包逐字节对齐：其内容脚本在 document 上挂捕获型 keydown/keyup 监听做键盘触发判定，对 `event.key` 为 `undefined` 的合成事件未做防御。
- 真实键盘事件的 `event.key` 恒为字符串，只有 `new Event("keydown")` 之类合成事件才可能是 `undefined`；派发方在用户浏览器环境内（如其他扩展），不在页面。
- 无扩展的干净 Chromium 实测四个账号页 `/login` `/register` `/reset-password` `/register-admin`：页面加载、键入与提交链路全程零合成键盘事件、零 JS 异常，仅有测试环境后端业务错误对应的正常提示。
- 站点源码不派发键盘事件；三个问题页面独有的 `vue3-slide-verify` 只用 mousemove/mouseup/touch 事件；四个账号页首屏 HTML 脚本清单完全一致，无第三方脚本注入。

处置：报错可安全忽略；如需消除，更新或停用该扩展，或排查浏览器内派发合成键盘事件的其他扩展。

测试 DOM 统一使用 `jsdom`；`@types/jsdom` 非直接依赖，DOM 全局类型来自 TypeScript 的 DOM lib。

Nuxt 官方模块：`@pinia/nuxt`、`@nuxt/fonts`、`@nuxt/scripts`、`@nuxt/image`，外加本地模块 `@/modules/set-env-version`。

## 2. 技术栈

项目使用 Nuxt 4、Vue 3、TypeScript、Pinia、Vue Router、Element Plus、ofetch 和 Vitest；依赖及 pnpm 的精确版本以 `package.json` 和 `pnpm-lock.yaml` 为准。容器构建与运行使用同版本 Node Alpine，见 §15。

## 3. 常用命令

全部取自 `package.json` scripts：

```bash
pnpm install          # postinstall 自动执行 nuxt prepare
pnpm dev              # nuxi dev
pnpm dev:fresh        # nuxi cleanup && nuxi dev
pnpm build            # node --no-deprecation ./node_modules/nuxt/bin/nuxt.mjs build
pnpm preview          # nuxi preview
pnpm type-check       # vue-tsc 三工程: tsconfig.nuxt.json(app) + tsconfig.server.json(server/) + tsconfig.vitest.json(测试与工具)
pnpm lint             # oxlint --fix（注意: 会写文件; 只读检查用 pnpm exec oxlint）
pnpm fmt              # oxfmt --write（全仓, 按 ignorePatterns 排除）
pnpm test             # vitest run（CI 风格单次）
pnpm testOnline       # vitest（监视模式）
pnpm cc               # lint + fmt + test + type-check + build 全链机器验收
```

注意：`type-check` 是 `vue-tsc --noEmit` 分别跑 `tsconfig.nuxt.json`、`tsconfig.server.json` 和 `tsconfig.vitest.json`，**不是** `nuxi typecheck`；`lint:fix` 脚本已移除（`lint` 本身即 `--fix`）。

运行单个测试文件：

```bash
pnpm exec vitest run src/utils/dateTime.test.ts
pnpm exec vitest run src/components/common/date-range-shortcuts/__tests__/index.test.ts
```

按用例名运行（`-t` 支持子串 / 正则）：

```bash
pnpm exec vitest -t "渲染 7 个默认快捷按钮"
pnpm run test -- -t "格式化日期包含年月日时分秒和时区偏移"
```

## 4. 目录结构速查

`src/` 下 1286 个 `.ts`/`.vue`，其中 1012 个 `.ts`、274 个 `.vue`（含测试与声明文件）。

| 目录                                           | 职责                                                                             | 规模                         |
| ---------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------- |
| `src/api/`                                     | 接口层，**一接口一文件**，按业务域分目录                                         | 233 个 `.ts`                 |
| `src/components/`                              | 组件，按 `common/` `views/` `editor/` `layout/` `player/` `hooks/` 分区          | 241 个 `.vue` + 527 个 `.ts` |
| `src/pkg/`                                     | 自研封装层：`codemirror/` `marked/` `highlight.js/` `hls/` `mermaid/`            | 79 个 `.ts`                  |
| `src/stores/`                                  | 状态与初始化模块，全部显式导入                                                   | 11 个运行时文件 + 2 个测试   |
| `src/pages/`                                   | 文件路由                                                                         | 28 个 `.vue`                 |
| `src/utils/`                                   | 通用工具                                                                         | 91 个 `.ts`                  |
| `src/theme/`                                   | 主题域（预设定义 / 运行时 / 状态 / UI 四层）                                     | 16 个                        |
| `src/composables/`                             | `useSiteOptions` / `useSeo` / `useAppLoadingIndicator` / `useDetailLoginRefresh` | 4 个运行时文件 + 1 个测试    |
| `src/middleware/`                              | 路由中间件（3 个 `.global` + 4 个命名）                                          | 7 个运行时文件 + 1 个测试    |
| `src/plugins/`                                 | Nuxt 插件                                                                        | 8 个                         |
| `src/layouts/`                                 | `default.vue` / `bare-shell.vue`                                                 | 2 个                         |
| `src/modules/`                                 | 本地 Nuxt 模块 `set-env-version.ts`                                              | 1 个                         |
| `src/customElements/` + `customElementsMount/` | 自定义元素解析与独立 `createApp()` 挂载                                          | 6 + 10 个                    |
| `src/types/`                                   | 全局 `.d.ts`                                                                     | 7 个                         |
| `src/server-stubs/`                            | 服务端替身（`emoji-picker.ts`，`export default {}`）                             | 1 个                         |

根目录 `server/`（Nitro 服务端，14 个文件，含 3 个测试）：`middleware/`（`legacy-redirect.ts`、`normalize-path.ts`）、`plugins/favicon-sync.ts`、`routes/`（`robots.txt.ts`、`favicon.ico.ts`、`api/[...].ts` 反代兜底、`internal/cache-invalidate.post.ts`、`internal/favicon-sync.post.ts`）、`utils/`（`favicon.ts`、`optionAsset.ts`）、`drivers/swr-lru-cache.mjs`（swr 缓存 driver，见 §7.3）。

`src/components/` 的 `.vue` 分区：`common/` 101、`views/admin/` 78、`views/`（非 admin）21、`editor/` 18、`layout/` 16、`player/` 7；`hooks/` 为 50 个 `.ts` 文件。

## 5. 核心架构约定（最易踩坑，优先读本节）

### 5.1 自动导入双向关闭，一切显式 import（沿袭自 SPA 迁移）

`nuxt.config.ts` 里：

```ts
components: false,        // 避免 icons/index.ts 与 index.vue 同名冲突（NUXT_B3011）
imports: { dirs: [] },    // 避免 stores 目录被 unimport 扫描产生 Duplicated imports
pinia: { storesDirs: [] },
```

**这是本项目最大的反直觉约定。** 项目组件不自动注册，项目工具、composable、store 不扫描自动导入，必须显式 `import`；Nuxt/Vue 内建自动导入仍可使用。缺少项目组件导入可能静默失效。

`unplugin-vue-components` 负责 Element Plus 按需导入（`ElementPlusResolver` + `directoryAsNamespace: true`）：模板里的 `<el-*>` 标签由 resolver 自动注册，`ElMessage` / `ElMessageBox` 等命令式 API 需显式 import。构建生成的 `src/components.d.ts` 包含 Element Plus 与 Router 声明，`src/auto-imports.d.ts` 的声明块为空；项目组件仍必须显式导入。Vitest 可能在项目根生成另一形态的 `components.d.ts` / `auto-imports.d.ts`，两者已由 `.gitignore` 忽略，勿提交；Nuxt 生成的应用配置会通过根目录 `*.d.ts` 包含它们，不能依据其类型声明推断项目组件已在运行时自动注册。`tsconfig.vitest.json` 不显式引入根目录生成声明。

### 5.2 目录即组件 + 就近同名 ts

每个组件是 `index.vue` + `index.ts` 的最小单元，逻辑 / 类型 / 测试平铺在同目录：

```
components/editor/
├── index.vue          # 组件本体，defineOptions({ name: "..." }) 自持组件名
├── index.ts           # export { default } from "./index.vue" + 导出 types/utils
├── state.ts  types.ts  layout.ts
├── command/{constant,index,insert,keys}.ts
├── hooks/{index,useCodemirror,usePreview,useToolbar}.ts
└── utils/{copy,css-inline,dom,markdown,vim-ime}.ts
```

组件名由各 `.vue` 内 `defineOptions({ name: "Xxx" })` 自持，不依赖目录名。

### 5.3 API 一接口一文件

`src/api/<域>/<动作>.ts`，动作名为 `create` / `update` / `view` / `list` / `delete` / `insert` / `deleteItem` / `viewItem` / `getRoles` 等。域：`post`(30) `user`(25) `setting`(19) `video`(13) `membership`(13) `upload`(12) `order`(10) `billingCenter`(10) `postTag`(10) `coupon`(9) `comment`(9) `notification`(9) `permissionRole`(9) `accountKey`(8) `postCategory`(8) `link`(7) `dashboard`(5) `captcha`(4) `loginLog`(3) `pay`(3) `helper`(2) `visit`(1)；另有基础设施目录 `request`(9)（见 §6）与 `response`(4)（响应码）。公用类型在 `src/api/common.ts`。

### 5.4 自研封装层 `src/pkg/`

不是第三方 fork，是本项目的封装：

- `pkg/codemirror/` — 编辑器装配，含**自建 Markdown lint 引擎** `extension/mdlint/`（`rule/001~010.ts` 十条规则 + `worker.ts` + `workerManager.ts`，每条规则配套 `__test__/` 用例）、`extension/completion/`（emoji / mention）、`extension/theme/`（github / vue / tokyonight / md 四套明暗主题）
- `pkg/marked/` — `new-marked.ts` + 九个扩展（emoji / footnote / highlight / katex / mark / sub / sup / todo-list / renderer）
- `pkg/highlight.js/` — 高亮装配 + `theme-switcher.ts`
- `pkg/hls/` — HLS 播放装配
- `pkg/mermaid/` — 图表惰性加载、渲染、主题联动与错误降级

## 6. 请求层

统一入口 `src/api/request/ofetch.ts`。迁移时用 ofetch 替换了 axios，但**刻意保留 axios 风格的调用签名与响应形状**，使 200+ 个 api 模块零改动：

```ts
request({ url, method, data, params, headers, timeout, onUploadProgress })
// => { data, status, statusText, headers, config }
```

### 6.1 SSR / CSR baseURL 三态（`request/base.ts`）

```ts
export function resolveApiBase(): string {
    if (typeof window !== "undefined") return "" // 浏览器：同源相对路径 /api
    const apiBase = tryUseNuxtApp()?.$config?.apiBase // SSR：runtimeConfig.apiBase
    if (typeof apiBase === "string" && apiBase) return apiBase
    return process.env.NUXT_API_BASE || "" // 非 Nuxt 运行时（vitest）回退
}
```

- SSR 优先读取 `runtimeConfig.apiBase`（由 `NUXT_API_BASE` 提供），非 Nuxt 上下文回退环境变量；两者都未设置时返回空字符串
- 浏览器走同源 `/api`：dev 的 `nitro.devProxy` 目标为 `http://10.10.2.222:5426/api`；preview / 生产的 `routeRules["/api/**"].proxy` 使用构建时的 `NUXT_API_BASE`，未设置时回退 `http://10.10.2.222:5426`
- 绝对地址（`^https?://`）不拼接 baseURL

### 6.2 token 仅客户端注入

`buildHeaders()` 在 `typeof window === "undefined"` 时直接返回，**SSR 不携带用户 token，公开接口无鉴权直出**。客户端读 `useUserStore().accessToken` 注入 `Authorization: Bearer`。

### 6.3 上传进度走 XHR

fetch / ofetch 无法监听上传进度：浏览器端且调用方传入 `onUploadProgress` 时，改走 `requestWithXhrProgress()`（XHR），响应再塑形回同一结构。FormData 的 `Content-Type` 交浏览器自动生成（显式设置会丢失 multipart boundary，导致分片上传失败）。

### 6.4 重试策略

GET 等幂请求由 ofetch 默认重试覆盖；写方法（`POST`/`PUT`/`PATCH`/`DELETE`）默认不重试，仅浏览器端对"无响应"的网络错误补一次；有响应（4xx/5xx）不重试。网络错误仍可能发生在服务端已处理后，写接口需依靠自身幂等设计避免重复提交。

### 6.5 其他

`request/` 下还有 `ofetchHandlers.ts`（token 刷新重放、异地登录提示仅弹一次、setup 状态一次性检查）、`refreshTokenManager.ts`（并发刷新防抖）、`tabSyncManager.ts`（BroadcastChannel + localStorage 多标签页同步）、`routerGroup.ts`。

## 7. SSR / CSR 边界与数据获取

### 7.1 routeRules 明细

| 规则                                                        | 值           | 说明                                                                                              |
| ----------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------- |
| `/admin/**` `/s/**` `/md` `/user-info` `/checkout` `/setup` | `ssr: false` | 纯 CSR                                                                                            |
| `/`                                                         | `swr: 600`   | SSR + ISR；payload 已内联于缓存 HTML（`payloadExtraction: "client"`），hydration 使用同一渲染快照 |
| `/category/**` `/tag/**` `/year/**`                         | `swr: 3600`  | SSR + ISR                                                                                         |
| `/p/**`                                                     | `swr: 3600`  | SSR + ISR                                                                                         |
| `/sitemap.xml` `/sitemap/**`                                | `proxy`      | 反代到后端，sitemap 由后端生成                                                                    |
| `/api/**`                                                   | `proxy`      | dev/preview/生产三态一致转发                                                                      |

此外 `/login` `/register` `/register-admin` `/reset-password` `/unsubscribe` `/social/[...callback]` 未关 SSR 但模板整体包 `ClientOnly`，实际按 CSR 行为。

### 7.2 公开页取数模板

统一用 `useAsyncData`（**不是** `useFetch`，也不是裸 `$fetch`），分两层：站点配置由 `useSiteOptions()` 共享同一 asyncData key（布局与页面自动去重），页面正文单独一个 key。

```ts
await useSiteOptions()
const { data: detailData, pending } = await useAsyncData<PostDetailSsrPayload>(
    `post-detail-${postId.value}`,
    async () => {
        /* viewPostByIDAPI({ post_id: postId.value }) */
    },
    { watch: [postId] },
)
usePostSeo(() => detailMeta.value)
if (!pending.value && detailMeta.value === null) throw createError({ statusCode: 404, fatal: true })
```

列表类页面（首页 / 分类 / 标签 / 归档）走 `PostListView`：SSR 用 `useAsyncData` 和 `getListDataForSsr()` 预取匿名列表并写入 payload，水合复用；客户端路由切换和登录态校准由 hooks 拉取。登录态用户经 `data-list-pending` 标记 + 骨架屏避免重排抖动，匿名访问直接展示 SSR 列表供 SEO。

`/user/:username` 是"SSR 只做存在性校验"模式：`if (!pending.value && profile.value == null) throw createError({ statusCode: 404, fatal: true })`，视图包 `<ClientOnly>`。

**反面清单**：公开页里不要用 `onMounted` 取首屏数据、不要在组件或 composable 里直接 `$fetch`（这一条已审计通过，勿破坏）。

### 7.3 payload 瘦身与水合禁忌

四件套：

1. `experimental.payloadExtraction: "client"` — 首访（SWR 首渲染）payload 保持内联于 HTML，仅客户端路由跳转时抽离为独立 `/_payload.json`（bug01 260901-04：避免缓存 HTML 与独立 payload 分别渲染时实时字段（浏览量/点赞）hydration mismatch）
2. `plugins/payload-hygiene.ts` — 在 `app:rendered` 剔除 payload 中的 `pinia.user` / `pinia.status`，`options.navList` 置空
3. `plugins/init-stores.client.ts` — `onNuxtReady` 后才初始化 stores（守卫经 `getInitStoresPromise()` 共享同一就绪承诺）
4. `features.inlineStyles: false` — SSR 不在 head 内联组件样式，样式只走外链 css 分片（HTML 首页 -40KB / 文章页 -62KB，外链可被浏览器缓存跨页复用）

**`breadcrumb` 与 `device` 两个 store 必须保留在 payload 中，否则 hydration mismatch。**

swr 渲染缓存另有治理（bugfix 260916-02 / bf-260919-02）：nitro `storage.cache` 挂自定义 lru driver（根 `server/drivers/swr-lru-cache.mjs`，max 500 / ttl 2h，空态响应经 `x-swr-no-store` 标记头不进缓存），dev 与生产共用同款 driver。

## 8. 认证与权限

RBAC 模型，核心在 `src/stores/permissionRole.ts`：

- `PermissionNames` 枚举定义权限点：`LoginAdmin`、`ViewDashboard`、`AddPost`/`EditPost`/`DeletePost`/`ViewPost`、`AddMedia`/`EditMedia`/`DeleteMedia`/`ViewMedia`、`AddCategory`…、`AddLink`…、`AddAvatar`、`PermissionRole`、`AddMediaByPost` 等几十项
- 配套接口：`getPermissionsAPI` / `hasPermissionAPI` / `getRolesAPI` / `getMembershipRolesAPI`
- 指令 `v-permission`（无权限移除元素），由 `plugins/directives.client.ts` 注册
- `PostDetailEditCacheScope`（`anonymous` / `authenticated`）区分两种登录态的本地权限缓存，避免互相污染
- **SSR 守卫**：服务端无 `localStorage` 时替换为 no-op 替身对象

Token 流程：登录 → `userStore.setAccessToken()` → `tabSyncManager` 广播到其他标签页 → 请求层客户端注入 → 401 时 `refreshTokenManager` 防抖刷新并重放挂起请求 → 异地登录（`ResponseCode.UserLoggedInElsewhere`）只提示一次 → 登出 `tokenClearByLogout` 广播清除。

`src/dev.ts` 的 `devRun()` 在开发环境校验 `iconMap` 键与 `IconKeys` 枚举一致性（`devCheckIconKeys`），由 `plugins/dev.client.ts` 在 `import.meta.dev` 时调用。

## 9. 路由与中间件

### 9.1 路由清单（28 个页面文件）

| 路由                                                                                            | 文件                                   | 渲染                                                                                                |
| ----------------------------------------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------------------------------------------- |
| `/`                                                                                             | `index.vue`                            | SSR                                                                                                 |
| `/category/:slug` `/tag/:slug`                                                                  | `category/[slug].vue` `tag/[slug].vue` | SSR + swr 3600                                                                                      |
| `/p/:id`                                                                                        | `p/[id].vue`                           | SSR + swr 3600                                                                                      |
| `/page/:customPath`                                                                             | `page/[customPath].vue`                | SSR（先 slug→id 再取详情）                                                                          |
| `/year/:year`、`/year/:year/month/:month`                                                       | `year/` 下两个文件                     | SSR                                                                                                 |
| `/link-list`                                                                                    | `link-list.vue`                        | SSR，`layout: false` 自组合 header/footer                                                           |
| `/not-found`、`/user/:username`                                                                 | `not-found.vue`、`user/[username].vue` | SSR，用 `layout: "bare-shell"`                                                                      |
| `/s/:keyword`                                                                                   | `s/[keyword].vue`                      | 纯 CSR                                                                                              |
| `/md` `/user-info` `/checkout` `/setup`                                                         | 同名 `.vue`                            | 纯 CSR                                                                                              |
| `/login` `/register` `/register-admin` `/reset-password` `/unsubscribe` `/social/[...callback]` | 同名 `.vue`                            | 模板包 `ClientOnly`                                                                                 |
| `/admin/**`                                                                                     | `admin.vue` + `admin/[...slug].vue`    | 纯 CSR                                                                                              |
| `/test`                                                                                         | `test.vue`                             | 迁移自 SPA 的极简演示页                                                                             |
| `/__test-404` `/__test-500` `/__test-503`                                                       | `__test-*.vue`                         | 错误渲染探针：`layout: false` + `throw createError({ status })`                                     |
| `/[...slug]`                                                                                    | `[...slug].vue`                        | 全站 catch-all 兜底，`throw createError({ statusCode: 404, fatal: true })`，保证返回真 404 而非 200 |

### 9.2 admin 动态组件映射

`pages/admin.vue`（父，`definePageMeta({ name: "admin", layout: false })`）渲染 AdminHeader / AdminAside 壳层，内部条件渲染 `<NuxtPage v-if="hasPermissionContent" />`，并负责 `LoginAdmin` 权限与 404 兜底。

子路由 `pages/admin/[...slug].vue` 用 `adminMenuItemMapWithIndexMap[route.path]` 反查菜单 key → `toKebabCase` → `import.meta.glob` 匹配 `components/views/admin/component/main/<kebab>/index.vue`，并用 `asyncComponentCache` 缓存组件身份，避免 query 变化时重挂载。

### 9.3 中间件

| 文件                      | 作用                                                                                    |
| ------------------------- | --------------------------------------------------------------------------------------- |
| `admin.global.ts`         | `/admin` → `/admin/dashboard`；未知子路径 → `/not-found`；未登录 → `/login?redirect=`   |
| `auth.global.ts`          | 保护 `/user-info`、`/checkout`                                                          |
| `legacy.global.ts`        | 首页旧查询参数软导航 301，动态路径段显式编码；`/:username` 不再重定向                   |
| `register-admin.ts`       | 已存在管理员时访问 `/register-admin` → `/not-found`（复刻 SPA registerAdminMiddleware） |
| `setup.ts`                | 已初始化时访问 `/setup` → `/not-found`                                                  |
| `not-found-breadcrumb.ts` | 站内 404 页面包屑，在布局渲染前就位                                                     |
| `user-breadcrumb.ts`      | 用户公开主页面包屑，在布局渲染前就位                                                    |

`nuxt.config.ts` 的 `hooks["pages:extend"]` 把 `year/[year]/month/[month]` 从 `year/[year]` 的 children 中提升为平级路由，否则月归档页会挂载父级页面组件、点击年面包屑后不重挂载。

`src/router.options.ts` 只覆写 `scrollBehavior`：hash 元素不存在时返回 `false`（规避 VUE_ROUTER_R0042），hash 滚动一律 `smooth`。

## 10. 模块与插件清单

模块（`nuxt.config.ts` 的 `modules`）：

| 模块                        | 作用                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------- |
| `@pinia/nuxt`               | 状态管理，`storesDirs: []`                                                                         |
| `@nuxt/fonts`               | 接管本地字体；禁用全部远程 provider；两个自托管字体 `JBMonoWOFF2` / `SmileySans`；`preload: false` |
| `@nuxt/scripts`             | 接管统计脚本（GA 走 registry，百度走通用 `useScript`）                                             |
| `@nuxt/image`               | 文章缩略图 png→webp q80；本项目 `components: false`，用 `useImage()` composable 构建 `/_ipx` 地址  |
| `@/modules/set-env-version` | 启动时 `git describe --tags --abbrev=0` 写入 `public/VERSION`                                      |

**`set-env-version` 只写静态资源 `public/VERSION` 供外部探活，不注入 `app.config` / `runtimeConfig` / 客户端产物**（安全决策：版本信息最小暴露）。`src/version.ts` 另读 `package.json` 生成控制台横幅，模块级守卫保证全生命周期只打印一次。

> 坑：`@nuxt/image` 域名白名单按 host **含端口**匹配，缩略图绝对 URL 携带 7364 端口，`image.domains` 需同时放行 `host` 与 `host:7364` 两种形态。

插件（`src/plugins/`）：

| 文件                     | 作用                                                                                            |
| ------------------------ | ----------------------------------------------------------------------------------------------- |
| `element-injection.ts`   | 全局 provide Element Plus 的 ID / ZIndex（覆盖 `error.vue` 路径）                               |
| `init-stores.client.ts`  | `onNuxtReady` 后初始化 stores，避免 hydration mismatch                                          |
| `payload-hygiene.ts`     | `app:rendered` 剔除 payload 敏感字段                                                            |
| `theme.client.ts`        | 首帧应用 localStorage 主题预设，避免闪烁                                                        |
| `visit-report.client.ts` | 站点访问上报（PV/UV）：首屏 isReady 后一次 + 路由 afterEach；路径归一、同路径 5s 防抖、失败静默 |
| `dev.client.ts`          | 开发环境调用 `devRun()`                                                                         |
| `directives.ts`          | 双端：`v-stable-html` + 全局组件 `j-icon`                                                       |
| `directives.client.ts`   | 仅客户端：`v-single-dbl-click` + `v-permission`                                                 |

SSR 适配必留配置：`nitro.externals.inline: ["element-plus", "nuxt/internal", "pinia"]` 与 `vite.ssr.noExternal: ["element-plus"]`；分别保证 Element Plus CSS、Nuxt 内部渲染器和 Pinia 注入实例正确处理。`nitro.alias["vue3-emoji-picker"]` 指向 `src/server-stubs/emoji-picker.ts`（该包顶层初始化 IndexedDB）。

## 11. 主题域 `src/theme/`

四层结构：

- `presets/definitions/` — 8 套预设：`light` `dark` `github-light` `github-dark` `vue-light` `vue-dark` `tokyonight-day` `tokyonight-night`
- `presets/index.ts` — `themePresetList` / `themePresetMap` / `getThemePreset` / `isValidThemePresetId` / `defaultThemePresetId`
- `presets/shared/` — 类型与工具
- `runtime.ts` — hex/RGB 换算、`buildThemePresetStyleContent()` 生成 CSS 变量串、`applyThemePresetToDocument()` 按 `id="theme-preset-style"` 原位更新
- `useTheme.ts` — 模块级响应式 `activeThemePresetState` / `activeThemeSchemeState` + localStorage 持久化 + 联动 hljs 代码块主题与 CodeMirror 主题
- `schemes/index.scss`、`preset-selector/` — 选择器 UI

目标：主题可 SSR 直出、客户端首帧无闪烁切换、与后台自定义 CSS 有稳定优先级顺序。视觉改动的主色必须与此保持一致。

## 12. 代码风格与文件头规范

### 12.1 文件头（重点，格式已定死）

当前仓库统一格式：分隔符 `/**`，字段**无 `@` 前缀**，字段名左对齐到 12 字符宽后接 `: `，路径前缀为 `blog-client\`（**不是** `\blog-client\`）。

```ts
/**
 * FilePath    : blog-client\src\plugins\directives.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 双端全局指令/组件注册 (阶段 0)
 */
```

三段判定：

1. **新建文件** — 一律用上述模板。`Copyright` 年份新文件写 2026。
2. **修改已有文件** — 保持该文件现有头注释格式不动，**不要顺手改写**（会造成无关 diff）；仅当文件体改动时同步更新 `Description`。
3. **批量转换** — 属独立任务，需用户明确指令，不得混在功能改动里执行。转换时路径前缀写 `blog-client\`。

已知未转换残留（18 个文件，均为旧 `@FilePath` 格式，非阻塞；`tsconfig.vitest.json` 与新增的 `tsconfig.server.json` 已是新格式）：

- 根目录 2 个：`tsconfig.json`、`tsconfig.nuxt.json`
- `src/types/` 6 个 `.d.ts`：clipboard / fake-progress / global / marked-custom-heading-id / table-extension / vue-router
- `src/pkg/hls/hls.d.ts`
- 样式 8 个：`src/assets/scss/` 下 `main.scss`、`mixin.scss`、`preview.scss`、`highlight.js.jpz.scss`、`platform/_phone.scss`、`platform/_pad.scss`、`platform/_pc.scss`，以及 `src/theme/schemes/index.scss`
- 文档 1 个：`src/assets/example/markdown1.md`

其中 `assets/` 部分属 oxfmt `ignorePatterns` 排除 `assets/` 的正常结果，不计入待办。

### 12.2 格式化（oxfmt，配置在 `.oxfmtrc.json`）

`semi: false`（不写分号）、`tabWidth: 4`（4 空格）、`useTabs: false`、`singleQuote: false`（双引号）、`printWidth: 160`、`trailingComma: "all"`、`bracketSpacing: true`、`arrowParens: "always"`。

`pnpm fmt` 写全仓（`oxfmt --write`）；`ignorePatterns` 排除 `dist/`、`node_modules/`、`coverage/`、`.prettierignore`、`assets/`、`.nuxt/`、`.output/`。oxlint 与 oxfmt 无联动，`lint` 本身即 `--fix`。

### 12.3 Lint（`oxlint.config.ts`）

插件 `["unicorn", "typescript", "oxc", "vue", "eslint"]`；分组 `correctness` / `suspicious` / `perf` 均为 `warn`，`pedantic` 为 `off`。

关键规则：`eslint/no-unused-vars: warn`、`no-console: off`、`no-debugger: error`、`eqeqeq: error`、`no-var: error`、`no-empty: warn`、`no-constant-condition: error`、`no-fallthrough: error`、`no-unreachable: error`、`no-duplicate-case: error`、`no-self-compare: error`、`no-unsafe-negation: error`、`no-template-curly-in-string: warn`、`use-isnan: error`、`valid-typeof: error`、`no-shadow: off`、`@typescript-eslint/no-unused-vars: warn`、`no-underscore-dangle: ["warn", { allow: ["_data", "_context"] }]`（ofetch 的 `_data` 与 Element Plus 命令式弹窗的 `_context` 均是官方 API）。`pedantic` 分组为 `off`，其中高价值且零命中规则在 `rules` 中逐条 `warn` 启用（260830-02，见配置内注释）。

`ignorePatterns` 含 `src/components/common/icons/assets/`。

### 12.4 TypeScript 两个刻意关闭的严格项

`tsconfig.nuxt.json`：

```jsonc
"noUncheckedIndexedAccess": false,        // 对齐旧 SPA：迁移代码大量按索引访问数组/对象且无 undefined 防御
"vueCompilerOptions": { "strictTemplates": false },  // 避免 el-tooltip placement 等模板字面量大面积 TS2322
```

**不要"顺手"打开这两项**，会引发成百上千处报错。`tsconfig.json` 继承 `tsconfig.nuxt.json`，覆盖 `exclude` 以让 IDE 识别测试文件，并通过 `files` 纳入 `vitest.config.ts`、`vitest.setup.ts`、`oxlint.config.ts`；不使用 project references。

`tsconfig.nuxt.json` 排除 src 侧 `*.test.ts` / `__tests__`；`tsconfig.server.json` 检查根 `server/`，包括服务端测试；`tsconfig.vitest.json` 检查 src 测试与工具配置，并通过 `files` 显式引入 `.nuxt/nuxt.d.ts` 和 `.nuxt/nuxt.node.d.ts`，避免覆盖 `include` 后丢失 Nuxt 声明。三者均由 `pnpm type-check` 执行。更新测试类型配置时不得通过排除文件、放宽严格项或过滤诊断来掩盖错误。

### 12.5 Import 顺序

组间空一行：Node 内置（`node:url`）→ 第三方（`vue` / `element-plus` / `vitest`）→ 项目内绝对路径（`@/utils/...`）→ 相对路径（`../` 再 `./`）。

### 12.6 命名

组件 `PascalCase`（文件名 kebab-case）；文件优先 kebab-case（跟随同目录既有风格）；变量 / 函数 `camelCase`；类型 `PascalCase`。

### 12.7 注释

中文注释，密度高，且要写"为什么"而非"是什么"。源码中大量使用决策编号（如 `P0-1(nuxt4-good)`、`bugfix 260825-03`、`计划 1.2/1.3`、`阶段 6`），新增注释沿用该风格。文件体改动需同步更新头注释的 `Description`。

标点与排版：注释内统一**英文标点**（`,` `;` `.` `:` `()`），逗号 / 分号后保留一个空格；必要的英文术语（API、HTTP、JSON、SSR、CSR 等）保持英文，中英文之间留空格。

函数文档注释：新增或修改的导出函数必须补 JSDoc，说明目的、参数含义、返回值与可能的错误。项目现有两种写法，择一沿用：

```ts
/**
 * isPayloadMethod 判断 HTTP 方法是否为携带请求体的写方法.
 * @param method - 大写 HTTP 方法名.
 * @returns true 表示写方法.
 */
```

```ts
/**
 * @description: 统一请求入口 (SSR/CSR 共用).
 * @remarks 默认泛型为 any, 对齐原项目 axios 的 AxiosPromise<any> 语义.
 */
```

抽离函数为独立函数时，与被抽离逻辑相关的原注释必须**等价移植**到新函数，保持原意并按新上下文调整措辞；需补充说明的追加在移植注释下方；若原注释有误，用 `修正：...` 标注并给出正确内容。

### 12.8 禁止 `v-html`，统一 `v-stable-html`

项目已全局禁用 `v-html`（当前 0 处使用），统一用自定义指令 `v-stable-html`——内容更新时保留已加载图片尺寸，避免重排闪烁。指令定义在 `src/utils/stableHtmlDirective.ts`。

三处注册，缺一即静默失效：

1. **主 app 树** — `src/plugins/directives.ts` 已注册，路由页面与组件自动可用。
2. **`src/customElementsMount/` 独立 `createApp()`** — 必须手动注册。已注册的 4 个：`LoginView.ts:46`、`PayContent.ts:87`、`VideoPlayer.ts:88`、`WechatCaptcha.ts:54`；**未注册**的 3 个（`PayKey.ts:65`、`PayMembership.ts:40`、`PowerBI.ts:43`）若其渲染的组件用到 `v-stable-html`，需补 `app.directive("stable-html", stableHtmlDirective)`。
3. **单元测试** — `@vue/test-utils` 的 `mount` 需传 `global: { directives: { "stable-html": stableHtmlDirective } }`。

## 13. 测试约定

`vitest.config.ts` 用 `defineVitestConfig`（`@nuxt/test-utils`）挂载 Nuxt 的 vite 链。

三个实证坑（都已付出过调试成本，勿回退）：

1. DOM 测试使用 `environment: "jsdom"`，Nuxt 运行时还必须设置 `environmentOptions.nuxt.domEnvironment: "jsdom"`，否则 Nuxt 测试仍默认使用 happy-dom。纯计算测试按 `vitest.config.ts` 的 `nodeTestPatterns` 分配到独立 Node 项目，并从 jsdom 项目排除；加入新文件前需确认不依赖浏览器环境。所有项目保持文件隔离。
2. **不要重复挂 `@vitejs/plugin-vue`**——`defineVitestConfig` 的 Nuxt vite 链已含 vue 插件，双插件叠加会对带 `[...]` 的路由文件产生空 SFC 解析错误。
3. **`Components` 插件必须 `dirs: []`**，与主应用 `components: false` 哲学一致；默认扫描会跨目录撞名（Edit/Add/View/Header 等 flat 命名）产生大量命名冲突告警。

其他：`hookTimeout: 120000`（`setupNuxt` 首启拉起完整应用超过默认 10s）；`defineVitestConfig` 按 `.nuxt.test.ts` 后缀分配 Nuxt 测试，目前仅 `src/theme/presets/index.nuxt.test.ts` 走真实 Nuxt 运行时；`server.deps.inline: ["element-plus"]`；`exclude` 含 `**/icons/**`、`**/vue3-emoji-picker/**`。

`vitest.setup.ts` 为 jsdom / Nuxt 项目提供 `vi.mock(...)`（如 `vue3-emoji-picker`）与 console 精准过滤白名单（`initStores 执行异常` 404 warn、剪贴板成功 log、统计脚本加载 info、`<Suspense>` 实验特性 info）；独立 Node 项目使用 `extends: false`，不继承该 setup。新增测试优先复用已有测试设施。

测试文件位置：`src/**/__tests__/**`、`src/**/*.test.ts`、`src/**/__test__/**`（如 `src/pkg/codemirror/extension/mdlint/rule/__test__/007.test.ts`）。

终态指标：**108 个测试文件 / 998 个用例全绿**，无测试告警或未捕获异常。新增或修改测试后应保持全绿，不得为求"全绿"而放宽断言或扩宽过滤白名单；Vitest 的性能建议是提示，不代表测试失败。

## 14. Agent 执行准则

改代码后按序验证：

1. `pnpm lint`（全仓 `--fix`，会写文件）+ `pnpm type-check`（三工程零报错）
2. `pnpm test`（全量，保持全绿且无非预期输出、告警或未捕获异常）
3. 涉及路由 / 构建配置时补 `pnpm build`
4. 起 `pnpm dev`（7364）做浏览器验收：无 hydration mismatch、无 Vue 警告、无未捕获异常
5. 停止 dev server，交用户 review

其他：

- 新增 / 修复尽量补齐同目录 `*.test.ts` 或 `__tests__` 用例，复用 `vitest.setup.ts` 的全局 mock
- 不提交产物：`dist/`、`node_modules/`、`coverage/`、`.nuxt/`、`.output/` 保持忽略
- 不自行 commit / push

## 15. Docker 构建与运行

- `Dockerfile` 为正式构建：复制源码后执行 `pnpm exec nuxi prepare`、只读 `pnpm exec oxlint`、`pnpm type-check`、`pnpm test`、`pnpm build`；`Dockerfile.env` 预装依赖，`Dockerfile.dev` 基于该镜像只执行构建，不替代完整验收。
- 构建阶段与运行阶段 Node 均使用同版本 Alpine/musl；运行阶段基于 `nginx:1.31.8-alpine`，避免构建出的 sharp 等原生依赖与运行时 libc 不匹配。更新 Node 时同步检查三个 Dockerfile 中的镜像版本。
- `docker-entrypoint.sh` 仅对 `NGINX_SERVER_NAME`、`NUXT_API_BASE` 执行 envsubst，先 `nginx -t`，再启动 Node 与 Nginx 并监控进程；不要全量替换 Nginx 的 `$host` 等运行时变量。
- Node 默认监听 `7364`，`nginx.conf.template` 的 Node 反代端口固定为 `127.0.0.1:7364`；调整 `NITRO_PORT` 时必须同步调整模板。`NUXT_API_BASE` 供 SSR 与 Nginx 上游使用。
- 运行镜像把 `.output/public` 链接到 `/usr/share/nginx/html`，Nginx 与 Nitro 共用静态资源；保持目录可写及软链接，避免静态资源、favicon 同步失败。`redirects.map` 虽在 Nginx 配置中为可选 include，Dockerfile 的 `COPY` 仍要求构建上下文包含该文件。

-- End of AGENTS.md --
