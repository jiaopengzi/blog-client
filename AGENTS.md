# AGENTS.md

> 读者：自动化 / Agent 编码助手。
> 内容原则：只写「可执行命令 + 可验证约定」。所有命令、配置、路径、数字均可在 `package.json`、`nuxt.config.ts`、`vitest.config.ts`、`oxlint.config.ts`、`oxfmt` 配置（`.oxfmtrc.json`）、`tsconfig*.json` 中溯源，禁止凭印象编写。
> Nuxt 4 最佳实践优化的待办与进度不在此文件，见 `.spa2nuxt/nuxt4-good.md`。

## 1. 项目定位与验收基线

| 项目 | 路径 | 角色 |
| --- | --- | --- |
| `blog-client`（旧 SPA，已上线） | `C:\Users\jiaopengzi\Desktop\blog-client` | **行为基准（标准答案），源码只读** |
| `blog-client-nuxt`（本项目） | 当前仓库 | **被验收对象**，所有代码修改只发生在这里 |

验收基线：以 SPA 为标准，逐项比对功能、交互、渲染、性能，确保迁移后表现一致。

强制纪律：

- 前端端口统一 `7364`。命令行 / 无头场景用 `http://127.0.0.1:7364`，**不要用 `localhost`**（可能解析为 IPv6 `::1` 导致连接被拒）；人工对比或跨机访问用 `http://10.10.2.222:7364`。
- SPA 与 Nuxt 不能同时占用 7364，对比时先停一个。端口被占用 / 僵尸进程用 skill `dev-env-manage` kill。
- 改动根级文件（`error.vue`、`nuxt.config.ts`、`middleware/`、`plugins/`）后若"代码已改但表现是旧的"，先重启 dev server；仍异常再 `pnpm nuxi cleanup` 后重启（冷启动变慢属正常）。
- AI 的非代码产物（截图、日志、临时调试脚本、无头浏览器数据目录）**只能**写入 `.spa2nuxt/cache`，禁止写进 `src/`、`scripts/` 等源码目录；任务结束前清理临时脚本与无头浏览器进程。
- `.debug/`、`.bug/`、`.feat/`、`.spa2nuxt/cache` 的全量内容**不要读取**（省 token），按文件名定位后单读。
- 用户 review 确认后才允许 commit；**AI 不得自行 commit / push**。

## 2. 技术栈与关键版本

| 类别 | 版本 | 备注 |
| --- | --- | --- |
| Nuxt | 4.5.2 | `srcDir: "src"`，`compatibilityDate: "2026-08-22"` |
| Vue | 3.5.41 | — |
| Vite | 8.2.1 | 内置 Rolldown；`build.minify: "oxc"` |
| TypeScript | 6.0.3 | — |
| Pinia | 4.0.3 | 经 `@pinia/nuxt` 1.0.2 |
| vue-router | 5.2.0 | — |
| Element Plus | 2.14.4 | 按需导入（unplugin-vue-components + ElementPlusResolver） |
| oxlint / oxfmt | 1.78.0 / 0.63.0 | 规则在 `oxlint.config.ts`，格式在 `.oxfmtrc.json` |
| vitest | 4.1.10 | DOM 环境 **happy-dom** 20.11.8 |
| @nuxt/test-utils | 4.1.0 | 挂载 Nuxt vite 链 |
| pnpm | 11.21.0 | `.npmrc` 启用 `shell-emulator=true` |

**`jsdom` 与 `@types/jsdom` 已移除**，DOM 统一 happy-dom。

Nuxt 官方模块：`@pinia/nuxt`、`@nuxt/fonts`、`@nuxt/scripts`、`@nuxt/image`，外加本地模块 `@/modules/set-env-version`。

## 3. 常用命令

全部取自 `package.json` scripts：

```bash
pnpm install          # postinstall 自动执行 nuxt prepare
pnpm dev              # nuxi dev
pnpm dev:fresh        # nuxi cleanup && nuxi dev
pnpm build            # node --no-deprecation ./node_modules/nuxt/bin/nuxt.mjs build
pnpm preview          # nuxi preview
pnpm type-check       # vue-tsc --noEmit -p tsconfig.nuxt.json --composite false
pnpm lint             # oxlint
pnpm lint:fix         # oxlint --fix
pnpm fmt              # oxfmt --write src/
pnpm test             # vitest run（CI 风格单次）
pnpm testOnline       # vitest（监视模式）
```

注意：`type-check` 走的是 `vue-tsc -p tsconfig.nuxt.json`，**不是** `nuxi typecheck`。

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

`src/` 下 1223 个 `.ts`/`.vue`，268 个 `.vue`。

| 目录 | 职责 | 规模 |
| --- | --- | --- |
| `src/api/` | 接口层，**一接口一文件**，按业务域分目录 | 229 个 `.ts` |
| `src/components/` | 组件，按 `common/` `views/` `editor/` `layout/` `player/` 分区 | 235 个 `.vue` + 498 个 `.ts` |
| `src/pkg/` | 自研封装层：`codemirror/` `marked/` `highlight.js/` `hls/` | 75 个 `.ts` |
| `src/stores/` | Pinia store，全部显式导入 | 12 个 |
| `src/pages/` | 文件路由 | 28 个 `.vue` |
| `src/utils/` | 通用工具 | 78 个 |
| `src/theme/` | 主题域（预设定义 / 运行时 / 状态 / UI 四层） | 17 个 |
| `src/composables/` | `useSiteOptions` / `useSeo` / `useAppLoadingIndicator` | 3 个 |
| `src/middleware/` | 路由中间件（3 个 `.global` + 1 个命名） | 4 个 |
| `src/plugins/` | Nuxt 插件 | 7 个 |
| `src/layouts/` | `default.vue` / `bare-shell.vue` | 2 个 |
| `src/modules/` | 本地 Nuxt 模块 `set-env-version.ts` | 1 个 |
| `src/customElements/` + `customElementsMount/` | 自定义元素解析与独立 `createApp()` 挂载 | 7 + 10 个 |
| `src/types/` | 全局 `.d.ts` | 7 个 |
| `src/server-stubs/` | 服务端替身（`emoji-picker.ts`，`export default {}`） | 1 个 |

根目录还有 `server/`（`middleware/legacy-redirect.ts`、`routes/robots.txt.ts`、`routes/api/[...].ts`）。

`src/components/` 分区占比：`common/` 98、`views/admin/` 78、`views/`（非 admin）21、`editor/` 17、`layout/` 14、`player/` 7。

## 5. 核心架构约定（最易踩坑，优先读本节）

### 5.1 SPA迁移过来的，自动导入双向关闭，一切显式 import

`nuxt.config.ts` 里：

```ts
components: false,        // 避免 icons/index.ts 与 index.vue 同名冲突（NUXT_B3011）
imports: { dirs: [] },    // 避免 stores 目录被 unimport 扫描产生 Duplicated imports
pinia: { storesDirs: [] },
```

**这是本项目最大的反直觉约定。** Nuxt 默认自动导入组件与工具，这里全部关闭。组件、工具、composable、store 必须显式 `import`，否则不会报错、只会静默拿到 `undefined`。

`unplugin-vue-components` 只负责 Element Plus（`directoryAsNamespace: true`），但生成的 `components.d.ts`（57 KB）实际收录了全部 235 个项目组件（如 `CommonAccountFormFooter`、`ViewsAdminComponentMainAppOptionBase`）；该文件**不含任何 `El*` 条目**——Element Plus 组件在 `<script setup>` 里显式导入。

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

`src/api/<域>/<动作>.ts`，动作名为 `create` / `update` / `view` / `list` / `delete` / `insert` / `deleteItem` / `viewItem` / `getRoles` 等。域：`post`(29) `user`(25) `setting`(19) `video`(16) `membership`(13) `upload`(12) `order`(10) `billingCenter`(10) `postTag`(10) `coupon`(9) `comment`(9) `notification`(9) `dashboard` `pay` `permissionRole` `captcha` `link` `loginLog` `accountKey` `postCategory` `helper`。公用类型在 `src/api/common.ts`。

### 5.4 自研封装层 `src/pkg/`

不是第三方 fork，是本项目的封装：

- `pkg/codemirror/` — 编辑器装配，含**自建 Markdown lint 引擎** `extension/mdlint/`（`rule/001~010.ts` 十条规则 + `worker.ts` + `workerManager.ts`，每条规则配套 `__test__/` 用例）、`extension/completion/`（emoji / mention）、`extension/theme/`（github / vue / tokyonight / md 四套明暗主题）
- `pkg/marked/` — `new-marked.ts` + 九个扩展（emoji / footnote / highlight / katex / mark / sub / sup / todo-list / renderer）
- `pkg/highlight.js/` — 高亮装配 + `theme-switcher.ts`
- `pkg/hls/` — HLS 播放装配

## 6. 请求层

统一入口 `src/api/request/ofetch.ts`。迁移时用 ofetch 替换了 axios，但**刻意保留 axios 风格的调用签名与响应形状**，使 200+ 个 api 模块零改动：

```ts
request({ url, method, data, params, headers, timeout, onUploadProgress })
// => { data, status, statusText, headers, config }
```

### 6.1 SSR / CSR baseURL 三态（`request/base.ts`）

```ts
export function resolveApiBase(): string {
    if (typeof window !== "undefined") return ""                  // 浏览器：同源相对路径 /api
    const apiBase = tryUseNuxtApp()?.$config?.apiBase              // SSR：runtimeConfig.apiBase
    if (typeof apiBase === "string" && apiBase) return apiBase
    return process.env.NUXT_API_BASE || ""                         // 非 Nuxt 运行时（vitest）回退
}
```

- SSR 直连后端（`NUXT_API_BASE`，默认 `http://10.10.2.222:5426`）
- 浏览器走同源 `/api`：dev 由 `nitro.devProxy` 转发，preview / 生产由 `routeRules["/api/**"].proxy` 转发
- 绝对地址（`^https?://`）不拼接 baseURL

### 6.2 token 仅客户端注入

`buildHeaders()` 在 `typeof window === "undefined"` 时直接返回，**SSR 不携带用户 token，公开接口无鉴权直出**。客户端读 `useUserStore().accessToken` 注入 `Authorization: Bearer`。

### 6.3 上传进度走 XHR

fetch / ofetch 无法监听上传进度：浏览器端且调用方传入 `onUploadProgress` 时，改走 `requestWithXhrProgress()`（XHR），响应再塑形回同一结构。FormData 的 `Content-Type` 交浏览器自动生成（显式设置会丢失 multipart boundary，导致分片上传失败）。

### 6.4 重试策略

GET 等幂请求由 ofetch 默认重试覆盖；写方法（`POST`/`PUT`/`PATCH`/`DELETE`）默认不重试，仅对"无响应"的网络错误补一次；有响应（4xx/5xx）不重试，避免服务端已处理但响应丢失时重复提交。

### 6.5 其他

`request/` 下还有 `ofetchHandlers.ts`（token 刷新重放、异地登录提示仅弹一次、setup 状态一次性检查）、`refreshTokenManager.ts`（并发刷新防抖）、`tabSyncManager.ts`（BroadcastChannel + localStorage 多标签页同步）、`routerGroup.ts`。

## 7. SSR / CSR 边界与数据获取

### 7.1 routeRules 明细

| 规则 | 值 | 说明 |
| --- | --- | --- |
| `/admin/**` `/s/**` `/md` `/user-info` `/checkout` `/setup` | `ssr: false` | 纯 CSR |
| `/` | `{}` | SSR，**刻意取消 swr**：后台 app-option 保存的 SEO（head/title/关键字）需下次请求即刻生效，swr 窗口会造成最长 60s 旧 SEO 残留 |
| `/category/**` `/tag/**` | `swr: 300` | SSR + ISR |
| `/p/**` | `swr: 3600` | SSR + ISR |
| `/sitemap.xml` `/sitemap/**` | `proxy` | 反代到后端，sitemap 由后端生成 |
| `/api/**` | `proxy` | dev/preview/生产三态一致转发 |

此外 `/login` `/register` `/register-admin` `/reset-password` `/unsubscribe` `/social/[...callback]` 未关 SSR 但模板整体包 `ClientOnly`，实际按 CSR 行为。

### 7.2 公开页取数模板

统一用 `useAsyncData`（**不是** `useFetch`，也不是裸 `$fetch`），分两层：站点配置由 `useSiteOptions()` 共享同一 asyncData key（布局与页面自动去重），页面正文单独一个 key。

```ts
await useSiteOptions()
const { data: detailData, pending } = await useAsyncData<PostDetailSsrPayload>(
    `post-detail-${postId.value}`,
    async () => { /* viewPostByIDAPI({ post_id: postId.value }) */ },
    { watch: [postId] },
)
usePostSeo(() => detailMeta.value)
if (!pending.value && detailMeta.value === null) throw createError({ statusCode: 404, fatal: true })
```

列表类页面（首页 / 分类 / 标签 / 归档）走 `PostListView`，**列表数据由客户端 hooks 拉取**，SSR 只直出站壳与 SEO；登录态用户经 `data-list-pending` 标记 + 骨架屏避免重排抖动，匿名访问直接展示 SSR 列表供 SEO。

`/user/:username` 是"SSR 只做存在性校验"模式：`if (!pending.value && profile.value == null) throw createError({ statusCode: 404, fatal: true })`，视图包 `<ClientOnly>`。

**反面清单**：公开页里不要用 `onMounted` 取首屏数据、不要在组件或 composable 里直接 `$fetch`（这一条已审计通过，勿破坏）。

### 7.3 payload 瘦身与水合禁忌

三件套：

1. `experimental.payloadExtraction: true` — payload 抽离为独立 `/_payload.json`
2. `plugins/payload-hygiene.ts` — 在 `app:rendered` 剔除 payload 中的 `pinia.user` / `pinia.status`，`options.navList` 置空
3. `plugins/init-stores.client.ts` — `onNuxtReady` 后才初始化 stores

**`breadcrumb` 与 `device` 两个 store 必须保留在 payload 中，否则 hydration mismatch。**

## 8. 认证与权限

RBAC 模型，核心在 `src/stores/permissionRole.ts`：

- `PermissionNames` 枚举定义权限点：`LoginAdmin`、`ViewDashboard`、`AddPost`/`EditPost`/`DeletePost`/`ViewPost`、`AddMedia`/`EditMedia`/`DeleteMedia`/`ViewMedia`、`AddCategory`…、`AddLink`…、`AddAvatar`、`PermissionRole`、`AddMediaByPost` 等几十项
- 配套接口：`getPermissionsAPI` / `hasPermissionAPI` / `getRolesAPI` / `getMembershipRolesAPI`
- 指令 `v-permission`（无权限移除元素），由 `plugins/directives.client.ts` 注册
- `PostDetailEditCacheScope`（`anonymous` / `authenticated`）区分两种登录态的本地权限缓存，避免互相污染
- **SSR 守卫**：服务端无 `localStorage` 时替换为 no-op 替身对象

Token 流程：登录 → `userStore.setAccessToken()` → `tabSyncManager` 广播到其他标签页 → 请求层客户端注入 → 401 时 `refreshTokenManager` 防抖刷新并重放挂起请求 → 异地登录（`ResponseCode.UserLoggedInElsewhere`）只提示一次 → 登出 `tokenClearByLogout` 广播清除。

`src/dev.ts` 的 `devRun()` 在开发环境校验 `iconMap` 键与权限枚举名一致性，由 `plugins/dev.client.ts` 在 `import.meta.dev` 时调用。

## 9. 路由与中间件

### 9.1 路由清单（28 个页面文件）

| 路由 | 文件 | 渲染 |
| --- | --- | --- |
| `/` | `index.vue` | SSR |
| `/category/:slug` `/tag/:slug` | `category/[slug].vue` `tag/[slug].vue` | SSR + swr 300 |
| `/p/:id` | `p/[id].vue` | SSR + swr 3600 |
| `/page/:customPath` | `page/[customPath].vue` | SSR（先 slug→id 再取详情） |
| `/year/:year`、`/year/:year/month/:month` | `year/` 下两个文件 | SSR |
| `/link-list` | `link-list.vue` | SSR，`layout: false` 自组合 header/footer |
| `/not-found`、`/user/:username` | `not-found.vue`、`user/[username].vue` | SSR，用 `layout: "bare-shell"` |
| `/s/:keyword` | `s/[keyword].vue` | 纯 CSR |
| `/md` `/user-info` `/checkout` `/setup` | 同名 `.vue` | 纯 CSR |
| `/login` `/register` `/register-admin` `/reset-password` `/unsubscribe` `/social/[...callback]` | 同名 `.vue` | 模板包 `ClientOnly` |
| `/admin/**` | `admin.vue` + `admin/[...slug].vue` | 纯 CSR |
| `/test` | `test.vue` | 迁移自 SPA 的极简演示页 |
| `/__test-404` `/__test-500` `/__test-503` | `__test-*.vue` | 错误渲染探针：`layout: false` + `throw createError({ status })` |
| `/[...slug]` | `[...slug].vue` | 全站 catch-all 兜底，`throw createError({ statusCode: 404, fatal: true })`，保证返回真 404 而非 200 |

### 9.2 admin 动态组件映射

`pages/admin.vue`（父，`definePageMeta({ name: "admin", layout: false })`）渲染 AdminHeader / AdminAside 壳层，内部条件渲染 `<NuxtPage v-if="hasPermissionContent" />`，并负责 `LoginAdmin` 权限与 404 兜底。

子路由 `pages/admin/[...slug].vue` 用 `adminMenuItemMapWithIndexMap[route.path]` 反查菜单 key → `toKebabCase` → `import.meta.glob` 匹配 `components/views/admin/component/main/<kebab>/index.vue`，并用 `asyncComponentCache` 缓存组件身份，避免 query 变化时重挂载。

### 9.3 中间件

| 文件 | 作用 |
| --- | --- |
| `admin.global.ts` | `/admin` → `/admin/dashboard`；未知子路径 → `/not-found`；未登录 → `/login?redirect=` |
| `auth.global.ts` | 保护 `/user-info`、`/checkout` |
| `legacy.global.ts` | 老链接软导航 301：`/?post_id=` → `/p/:id`、`/:username` → `/user/:username` |
| `setup.ts` | 已初始化时访问 `/setup` → `/not-found` |

`nuxt.config.ts` 的 `hooks["pages:extend"]` 把 `year/[year]/month/[month]` 从 `year/[year]` 的 children 中提升为平级路由，否则月归档页会挂载父级页面组件、点击年面包屑后不重挂载。

`src/router.options.ts` 只覆写 `scrollBehavior`：hash 元素不存在时返回 `false`（规避 VUE_ROUTER_R0042），hash 滚动一律 `smooth`。

## 10. 模块与插件清单

模块（`nuxt.config.ts` 的 `modules`）：

| 模块 | 作用 |
| --- | --- |
| `@pinia/nuxt` | 状态管理，`storesDirs: []` |
| `@nuxt/fonts` | 接管本地字体；禁用全部远程 provider；两个自托管字体 `JBMonoWOFF2` / `SmileySans`；`preload: false` |
| `@nuxt/scripts` | 接管统计脚本（GA 走 registry，百度走通用 `useScript`） |
| `@nuxt/image` | 文章缩略图 png→webp q80；本项目 `components: false`，用 `useImage()` composable 构建 `/_ipx` 地址 |
| `@/modules/set-env-version` | 启动时 `git describe --tags --abbrev=0` 写入 `public/VERSION` |

**`set-env-version` 只写静态资源 `public/VERSION` 供外部探活，不注入 `app.config` / `runtimeConfig` / 客户端产物**（安全决策：版本信息最小暴露）。`src/version.ts` 另读 `package.json` 生成控制台横幅，模块级守卫保证全生命周期只打印一次。

> 坑：`@nuxt/image` 域名白名单按 host **含端口**匹配，缩略图绝对 URL 携带 7364 端口，`image.domains` 需同时放行 `host` 与 `host:7364` 两种形态。

插件（`src/plugins/`）：

| 文件 | 作用 |
| --- | --- |
| `element-injection.ts` | 全局 provide Element Plus 的 ID / ZIndex（覆盖 `error.vue` 路径） |
| `init-stores.client.ts` | `onNuxtReady` 后初始化 stores，避免 hydration mismatch |
| `payload-hygiene.ts` | `app:rendered` 剔除 payload 敏感字段 |
| `theme.client.ts` | 首帧应用 localStorage 主题预设，避免闪烁 |
| `dev.client.ts` | 开发环境调用 `devRun()` |
| `directives.ts` | 双端：`v-stable-html` + 全局组件 `j-icon` |
| `directives.client.ts` | 仅客户端：`v-single-dbl-click` + `v-permission` |

SSR 适配两个必留配置：`nitro.externals.inline: ["element-plus"]` 与 `vite.ssr.noExternal: ["element-plus"]`（resolver 注入的 theme-chalk CSS 副作用导入在 Node 原生 ESM 下会崩）；`nitro.alias["vue3-emoji-picker"]` 指向 `src/server-stubs/emoji-picker.ts`（该包顶层初始化 IndexedDB）。

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

当前仓库统一格式：分隔符 `/*`（不是 `/**`），字段**无 `@` 前缀**，字段名左对齐到 12 字符宽后接 `: `，路径前缀为 `blog-client-nuxt\`（**不是** `\blog-client\`）。

```ts
/*
 * FilePath    : blog-client-nuxt\src\plugins\directives.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 双端全局指令/组件注册 (阶段 0)
 */
```

三段判定：

1. **新建文件** — 一律用上述模板。`Copyright` 年份新文件写 2026。
2. **修改已有文件** — 保持该文件现有头注释格式不动，**不要顺手改写**（会造成无关 diff）；仅当文件体改动时同步更新 `Description`。
3. **批量转换** — 属独立任务，需用户明确指令，不得混在功能改动里执行。转换时路径前缀写 `blog-client-nuxt\`。

已知未转换残留（19 个文件，均为旧 `@FilePath` 格式，非阻塞）：

- 根目录 3 个：`tsconfig.json`、`tsconfig.nuxt.json`、`tsconfig.vitest.json`
- `src/types/` 6 个 `.d.ts`：clipboard / fake-progress / global / marked-custom-heading-id / table-extension / vue-router
- `src/pkg/hls/hls.d.ts`
- 样式 8 个：`src/assets/scss/` 下 `main.scss`、`mixin.scss`、`preview.scss`、`highlight.js.jpz.scss`、`platform/_phone.scss`、`platform/_pad.scss`、`platform/_pc.scss`，以及 `src/theme/schemes/index.scss`
- 文档 1 个：`src/assets/example/markdown1.md`

其中 `assets/` 部分属 oxfmt `ignorePatterns` 排除 `assets/` 的正常结果，不计入待办。

### 12.2 格式化（oxfmt，配置在 `.oxfmtrc.json`）

`semi: false`（不写分号）、`tabWidth: 4`（4 空格）、`useTabs: false`、`singleQuote: false`（双引号）、`printWidth: 160`、`trailingComma: "all"`、`bracketSpacing: true`、`arrowParens: "always"`。

`pnpm fmt` 只写 `src/`；`ignorePatterns` 排除 `dist/`、`node_modules/`、`coverage/`、`.prettierignore`、`assets/`、`.nuxt/`、`.output/`。oxlint 与 oxfmt 无联动，`lint:fix` 只跑 oxlint。

### 12.3 Lint（`oxlint.config.ts`）

插件 `["unicorn", "typescript", "oxc", "vue", "eslint"]`；分组 `correctness` / `suspicious` / `perf` 均为 `warn`，`pedantic` 为 `off`。

关键规则：`eslint/no-unused-vars: warn`、`no-console: off`、`no-debugger: error`、`eqeqeq: error`、`no-var: error`、`no-empty: warn`、`no-constant-condition: error`、`no-fallthrough: error`、`no-unreachable: error`、`use-isnan: error`、`valid-typeof: error`、`no-shadow: off`、`@typescript-eslint/no-unused-vars: warn`、`no-underscore-dangle: ["warn", { allow: ["_data"] }]`（ofetch 的 `_data` 是官方 API）。

`ignorePatterns` 含 `src/components/common/icons/assets/`。

### 12.4 TypeScript 两个刻意关闭的严格项

`tsconfig.nuxt.json`：

```jsonc
"noUncheckedIndexedAccess": false,        // 对齐旧 SPA：迁移代码大量按索引访问数组/对象且无 undefined 防御
"vueCompilerOptions": { "strictTemplates": false },  // 避免 el-tooltip placement 等模板字面量大面积 TS2322
```

**不要"顺手"打开这两项**，会引发成百上千处报错。`tsconfig.json` 只有一行 `extends: "./tsconfig.nuxt.json"`（无 project references）。

`exclude` 掉全部 `*.test.ts` / `__tests__`，**测试文件不参与 `pnpm type-check`**；测试文件的类型感知由 `tsconfig.vitest.json` 在 IDE 侧提供。

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

1. **`environmentOptions` 的键名必须是 `happyDOM`（大写 DOM）**，写成 `happyDom` 会被 vitest **静默忽略**，配置不生效。当前开了 `settings.handleDisabledFileLoadingAsSuccess: true`（happy-dom 对禁用加载的外链 `<script>` 直接派发 load 事件，从源头不抛 `DOMException [NotSupportedError]`）。
2. **不要重复挂 `@vitejs/plugin-vue`**——`defineVitestConfig` 的 Nuxt vite 链已含 vue 插件，双插件叠加会对带 `[...]` 的路由文件产生空 SFC 解析错误。
3. **`Components` 插件必须 `dirs: []`**，与主应用 `components: false` 哲学一致；默认扫描会跨目录撞名（Edit/Add/View/Header 等 flat 命名）产生大量命名冲突告警。

其他：`hookTimeout: 120000`（`setupNuxt` 首启拉起完整应用超过默认 10s）；`environmentMatchGlobs: [["**/*.nuxt.test.ts", "nuxt"]]`，目前仅 `src/theme/presets/index.nuxt.test.ts` 走真实 Nuxt 运行时；`server.deps.inline: ["element-plus"]`；`exclude` 含 `**/icons/**`、`**/vue3-emoji-picker/**`。

`vitest.setup.ts` 集中放置全局 `vi.mock(...)`（如 `vue3-emoji-picker`）与 console 精准过滤白名单（KaTeX quirks 告警、vim 回退路径 warn、`initStores 执行异常` 404 warn、`DOMException` 实例/字符串双形态、剪贴板成功 log、统计脚本加载 info、`<Suspense>` 实验特性 info）。新增测试优先复用该文件。

测试文件位置：`src/**/__tests__/**`、`src/**/*.test.ts`、`src/**/__test__/**`（如 `src/pkg/codemirror/extension/mdlint/rule/__test__/007.test.ts`）。

终态指标：**77 个测试文件 / 603 个用例全绿，stdout 0 / stderr 0 / 冲突 0 / Warning 0 / DOMException 0**。新增或修改测试后应保持该指标，不得为求"全绿"而放宽断言或扩宽过滤白名单。


## 14. Agent 执行准则

改代码后按序验证：

1. `pnpm lint`（改动文件）+ `pnpm type-check`（全量零报错）
2. `pnpm test`（全量，保持全绿 + stdout/stderr 双零）
3. 涉及路由 / 构建配置时补 `pnpm build`
4. 起 `pnpm dev`（7364）做浏览器验收：无 hydration mismatch、无 Vue 警告、无未捕获异常
5. 停止 dev server，交用户 review

其他：

- 新增 / 修复尽量补齐同目录 `*.test.ts` 或 `__tests__` 用例，复用 `vitest.setup.ts` 的全局 mock
- 不提交产物：`dist/`、`node_modules/`、`coverage/`、`.nuxt/`、`.output/` 保持忽略
- 不自行 commit / push

-- End of AGENTS.md --
