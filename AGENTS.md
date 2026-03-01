# AGENTS.md

> 说明：本文件将提供给自动化/Agent 编码助手使用。内容以“可执行命令 + 可验证约定”为主；命令/配置均来自仓库现有文件(package.json / vitest.config.ts / oxlint.config.ts / .prettierrc.js / tsconfig\*.json 等)。

## 0. 初始化信息

- 项目：`blog-client`(Vue 3 + TypeScript，ESM：`package.json#type=module`)
- 包管理：`pnpm`(以 `pnpm run ...` 为准)
- 构建：Vite(`vite.config.ts`)
- 类型检查：`vue-tsc`(`pnpm run type-check`)
- Lint：`oxlint`(`pnpm run lint`)
- 格式化：Prettier(`pnpm run format`，仅写入 `src/`)
- 测试：Vitest(`pnpm run test` / `pnpm run testOnline`)，环境 `jsdom`，全局 setup：`vitest.setup.ts`
- 规则文件：未发现 `.cursor/`、`.cursorrules`、`.github/copilot-instructions.md`、`.editorconfig`、`CONTRIBUTING*`

## 1. 常用命令(以 package.json scripts 为准)

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

# prettier --write src/
pnpm format

# 单次运行(CI 风格)
pnpm test

# 在线/监视模式
pnpm testOnline
```

补充：`.prettierignore` 会忽略 `dist/`、`node_modules/`、`coverage/`、`assets/` 等。

## 2. 运行单个测试(重点)

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

## 3. 测试环境与全局 mock

- `vitest.config.ts`：`environment: "jsdom"`，并通过 `setupFiles` 引入 `vitest.setup.ts`
- `vitest.setup.ts`：集中放置全局 `vi.mock(...)`(如 `vue3-emoji-picker`、`@/router/router.ts` 等)；新增测试时尽量复用/补充到该文件

## 4. 代码风格与约定(以现有配置为准)

### 4.1 Prettier(`.prettierrc.js`)

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

## 5. Cursor / Copilot / 其他规则文件清单

已确认不存在：`.cursor/rules/**`、`.cursorrules`、`.github/copilot-instructions.md`、`.editorconfig`。若未来新增，请在此补充路径与摘要。

## 6. Agent 执行准则(给自动化编码助手)

- 改代码后至少跑：`pnpm run lint` +(相关)`pnpm run test`；涉及 TS 类型/对外 API 变更再跑 `pnpm run type-check`
- 新增/修复：尽量补齐同目录 `*.test.ts` 或 `__tests__` 用例，并复用 `vitest.setup.ts` 的全局 mock
- 不要提交/生成产物：`dist/`、`node_modules/`、`coverage/` 等保持忽略

-- End of AGENTS.md --
