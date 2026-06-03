# AGENTS.md

> 说明：本文件将提供给自动化/Agent 编码助手使用。内容以“可执行命令 + 可验证约定”为主；命令/配置均来自仓库现有文件(package.json / vitest.config.ts / oxlint.config.ts / .oxfmtrc.json / tsconfig\*.json 等)。

## 0. 初始化信息

- 项目：`blog-client`(Vue 3 + TypeScript，ESM：`package.json#type=module`)
- 包管理：`pnpm`(以 `pnpm run ...` 为准)
- 构建：Vite(`vite.config.ts`)
- 类型检查：`vue-tsc`(`pnpm run type-check`)
- Lint：`oxlint`(`pnpm run lint`)
- 格式化：oxfmt(`pnpm run fmt`，仅写入 `src/`)
- 测试：Vitest(`pnpm run test` / `pnpm run testOnline`)，环境 `jsdom`，全局 setup：`vitest.setup.ts`
- 规则文件：未发现 `.cursor/`、`.cursorrules`、`.github/copilot-instructions.md`、`.editorconfig`、`CONTRIBUTING*`

## 1. 架构概览

项目采用 Vue 3 + TypeScript + Pinia + Vue Router 架构：

```
main.ts (app bootstrap)
├── Pinia (状态管理)
├── Vue Router (路由 + 中间件链)
├── 全局指令 (v-stable-html)
├── 全局样式 (SCSS)
└── 根组件 (App.vue)
    └── router-view
        ├── views/ (页面组件)
        ├── components/ (共享组件)
        │   ├── editor/ (编辑器组件 + CodeMirror)
        │   ├── player/ (视频播放器)
        │   └── common/ (通用UI组件)
        └── pkg/ (内置包: codemirror扩展, markdown, hls)
```

启动流程: `main.ts` → `createApp()` → `usePinia()` → `useRouter()` → 注册指令 → 挂载
Store 初始化: 首次路由跳转时 → `initStores()` (`src/stores/init.ts`) → 加载 options, permissionRole, device → 恢复用户信息

## 2. 目录结构

- `src/` — 主源码目录
  - `api/` — API 请求模块 (按领域分组: user/, post/, upload/, billingCenter/, captcha/ 等)
    - `request/` — Axios 封装 (拦截器, token刷新, 多Tab同步)
    - `response/` — 响应类型与状态码
  - `router/` — 路由定义
    - `router.ts` — 路由创建 + beforeEach 中间件链
    - `routes.ts` — 顶层路由 (懒加载)
    - `routeUser.ts` / `routeAdmin.ts` / `routeNavigation.ts` — 子路由模块
    - `middleware/` — 路由中间件 (auth, editor, checkout, postSlug 等)
  - `stores/` — Pinia 状态管理 (user, options, permissionRole, device, init)
  - `components/` — 共享组件
    - `editor/` — 编辑器 (状态管理, CodeMirror 扩展, hooks)
    - `player/` — 视频播放器 (HLS, 字幕, 进度, 全屏 hooks)
    - `common/` — 通用组件 (login-view, post-detail, payment 等)
  - `views/` — 页面组件 (home, admin, login, checkout, user-info 等)
    - 每个 view 可有 `component/` 子目录存放视图专属组件
  - `customElements/` — 自定义元素辅助
  - `customElementsMount/` — 独立 createApp 挂载的组件 (LoginView, PayContent 等)
  - `pkg/` — 内置包 (codemirror Markdown 扩展, HLS 辅助)
  - `assets/scss/` — 全局样式与主题

## 3. 认证流程

### 登录

1. 调用 `api/user/login.ts` POST 登录凭证
2. 成功后 `userStore.setAccessToken(access_token)` 存储 token
3. token 通过 `tabSyncManager` 广播到同域其他标签页
4. 中间件 `auth.ts` 检测 `requiresAuth` 路由, 未登录跳转登录页

### Token 刷新

1. Axios 请求拦截器 (`api/request/axios.ts`) 自动附加 `Authorization: Bearer <token>`
2. 响应拦截器检测到需刷新 → 调用 `api/user/accessTokenRefresh.ts` (使用独立 axios 实例, 无拦截器)
3. 刷新成功 → `userStore.setAccessToken(newToken)` → 重放挂起的请求队列
4. `refreshTokenManager` 管理请求订阅者 (防止并发刷新)

### 多标签页同步

- `api/request/tabSyncManager.ts` 实现跨标签页 token 同步
- 使用 BroadcastChannel + localStorage 事件

### 登出

1. 调用 `api/user/logout.ts`
2. `tokenClearByLogout` 清除 token → 广播清除事件 → 路由跳转

## 4. 路由中间件

`router.beforeEach` 按序执行中间件链 (`src/router/middleware/`):

| 中间件 | 文件 | 用途 |
|--------|------|------|
| auth | `auth.ts` | 认证检查, 未登录重定向, 已登录访问登录页重定向, 邮箱未绑定提示 |
| editor | `editor.ts` | 编辑器页面守卫 |
| checkout | `checkout.ts` | 支付页面守卫 |
| postSlug | `postSlug.ts` | 文章别名路由处理 |
| setup | `setup.ts` | 系统初始化状态检查 |

路由元信息 `meta.requiresAuth` 标注需认证页面。

## 5. 常用命令(以 package.json scripts 为准)

```bash
pnpm install

# 开发：node ./scripts/set-env-version.js && node ./scripts/open-document.js && vite
pnpm dev

# 预览：node ./scripts/open-document.js && vite preview
pnpm preview

# 完整构建：并行执行 type-check 与 build-only(npm-run-all 的 run-p)
pnpm build

# 仅构建：node ./scripts/set-env-version.js && vite build && node ./scripts/dns-prefetch.js
pnpm build-only

# vue-tsc --noEmit -p tsconfig.app.json --composite false
pnpm type-check

pnpm lint
pnpm lint:fix

# oxfmt --write src/
pnpm fmt

# 单次运行(CI 风格)
pnpm test

# 在线/监视模式
pnpm testOnline
```

补充：`.oxfmtrc.json` 的 `ignorePatterns` 会忽略 `dist/`、`node_modules/`、`coverage/`、`assets/` 等。

## 6. 运行单个测试(重点)

运行单个测试文件：

```bash
pnpm exec vitest run src/utils/dateTime.test.ts
pnpm exec vitest run src/components/common/date-range-shortcuts/__tests__/index.test.ts
```

按测试用例名运行(`-t` 为匹配模式，支持子串/正则)：

```bash
pnpm exec vitest -t "渲染 7 个默认快捷按钮"
pnpm run test -- -t "格式化日期包含年月日时分秒和时区偏移"
```

测试文件常见位置(仓库已存在)：

- `src/**/__tests__/**`(例：`src/components/common/date-range-shortcuts/__tests__/index.test.ts`)
- `src/**/*.test.ts`(例：`src/utils/dateTime.test.ts`)
- `src/**/__test__/**`(例：`src/pkg/codemirror/extension/mdlint/rule/__test__/007.test.ts`)

## 7. 测试环境与全局 mock

- `vitest.config.ts`：`environment: "jsdom"`，并通过 `setupFiles` 引入 `vitest.setup.ts`
- `vitest.setup.ts`：集中放置全局 `vi.mock(...)`(如 `vue3-emoji-picker`、`@/router/router.ts` 等)；新增测试时尽量复用/补充到该文件

### 测试文件常见位置

- `src/**/__tests__/**` (如 `src/components/common/date-range-shortcuts/__tests__/`)
- `src/**/*.test.ts` (如 `src/utils/dateTime.test.ts`)
- `src/pkg/codemirror/extension/mdlint/rule/__test__/**`
- 全局 setup: `vitest.setup.ts` (集中放置 `vi.mock(...)`)

## 8. 代码风格与约定(以现有配置为准)

### 4.1 oxfmt(`.oxfmtrc.json`)

- `semi: false`(不写分号)
- `tabWidth: 4`、`useTabs: false`(4 空格缩进)
- `singleQuote: false`(使用双引号)
- `printWidth: 160`、`trailingComma: "all"`、`arrowParens: "always"`

### 4.2 TypeScript / Types

- 路径别名：`@/* -> ./src/*`(见 `tsconfig.app.json`)，示例：`import { formatLocalISO } from "@/utils/dateTime"`
- 导出 API(对外函数/组件/类型)尽量显式标注类型，避免隐式 any
- 测试 tsconfig：`tsconfig.vitest.json`(`types: ["node", "jsdom"]`)

### 4.3 Import 顺序(建议)

保持分组清晰并组间空一行：

1. Node 内置模块(如 `node:url`)
2. 第三方依赖(如 `vue` / `element-plus` / `vitest`)
3. 项目内绝对路径(如 `@/utils/...`)
4. 相对路径(`../` 再 `./`)

### 4.4 Vue 约定

- SFC 优先 `<script setup lang="ts">`(不影响既有结构前提下)
- `defineProps` / `defineEmits` 提供显式类型
- 不随意改动 DOM 选择器/类名：测试依赖稳定选择器(例：`.shortcut-item`)

### 4.5 命名约定

- 组件：`PascalCase`(文件名可 kebab-case)
- 文件：优先 kebab-case(跟随同目录既有风格)
- 变量/函数：`camelCase`；类型：`PascalCase`

### 4.6 错误处理与日志

- 不吞异常：避免空 `catch {}`；需要捕获时要处理或重新抛出
- `console` 允许(`no-console: off`)，但避免关键路径噪声输出

### 4.7 Lint(`oxlint.config.ts`)

- 分组：`correctness/suspicious/perf` 均为 `warn`
- 关键规则：`eslint/no-unused-vars: error`、`no-debugger: error`、`eqeqeq: error`、`no-var: error`、`no-empty: warn`

### 4.8 `v-stable-html` 指令(禁止使用 `v-html`)

项目已全局禁用 `v-html`，统一使用自定义指令 `v-stable-html` 替代。该指令在内容更新时保留已加载图片的尺寸，避免重排闪烁。

- **指令定义**：`src/utils/stableHtmlDirective.ts`
- **全局注册**：`src/main.ts` → `app.directive("stable-html", stableHtmlDirective)`

#### 作用域注意事项

`v-stable-html` 仅在注册了该指令的 Vue app 实例中生效。项目存在两种挂载方式：

1. **主 app 树**（`src/main.ts` 创建的 app）— 已全局注册，所有路由页面和组件自动可用。
2. **`customElementsMount/` 独立挂载**（通过 `createApp()` 创建独立 app 实例）— 必须手动注册指令。

当组件同时被主 app 渲染（如 web 预览模式）和独立 `createApp` 挂载（如微信预览模式）时，**两侧都必须注册指令**，否则 `v-stable-html` 在独立 app 中静默失效。

已注册指令的 `customElementsMount` 文件：

- `LoginView.ts`
- `PayContent.ts`
- `WechatCaptcha.ts`

### 独立挂载注意事项

`customElementsMount/` 中的组件使用 `createApp()` 创建独立 Vue app 实例, **必须手动注册指令**:

```ts
import { stableHtmlDirective } from "@/utils/stableHtmlDirective"
const app = createApp({ /* ... */ })
app.directive("stable-html", stableHtmlDirective)
app.mount(el)
```

已注册的文件: LoginView.ts, PayContent.ts, WechatCaptcha.ts

新增使用 `v-stable-html` 的组件如果也在 `customElementsMount/` 中独立挂载，**必须**在对应的 `createApp()` 后追加：

```ts
import { stableHtmlDirective } from "@/utils/stableHtmlDirective"

const app = createApp({ /* ... */ })
app.directive("stable-html", stableHtmlDirective)
app.mount(el)
```

#### 测试中注册

单元测试使用 `@vue/test-utils` 的 `mount` 时，需通过 `global.directives` 注册：

```ts
import { stableHtmlDirective } from "@/utils/stableHtmlDirective"

mount(MyComponent, {
    global: {
        directives: { "stable-html": stableHtmlDirective },
    },
})
```

## 9. Cursor / Copilot / 其他规则文件清单

已确认不存在：`.cursor/rules/**`、`.cursorrules`、`.github/copilot-instructions.md`、`.editorconfig`。若未来新增，请在此补充路径与摘要。

## 10. Agent 执行准则(给自动化编码助手)

- 改代码后至少跑：`pnpm run lint` +(相关)`pnpm run test`；涉及 TS 类型/对外 API 变更再跑 `pnpm run type-check`
- 新增/修复：尽量补齐同目录 `*.test.ts` 或 `__tests__` 用例，并复用 `vitest.setup.ts` 的全局 mock
- 不要提交/生成产物：`dist/`、`node_modules/`、`coverage/` 等保持忽略

-- End of AGENTS.md --
