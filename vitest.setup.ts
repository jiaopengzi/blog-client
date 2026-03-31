/**
 * FilePath    : blog-client\vitest.setup.ts
 * Description : vitest 全局配置文件
 */

import { vi } from "vitest"

// 统一 mock 一些无法处理的模块
vi.mock("vue3-emoji-picker", () => ({}))
vi.mock("src/components/common/icons/assets/iconfont.js", () => ({}))
vi.mock("@/components/common/icons/assets/iconfont.js", () => ({}))
vi.mock("@/views/admin/component/aside/utils.ts", () => ({}))
vi.mock("src/views/admin/component/aside/utils.ts", () => ({}))
vi.mock("@/router/routeAdmin.ts", () => ({}))
vi.mock("src/router/routeAdmin.ts", () => ({}))
vi.mock("@/router/routes.ts", () => ({}))
vi.mock("src/router/routes.ts", () => ({}))
vi.mock("@/router/router.ts", () => ({}))
vi.mock("src/router/router.ts", () => ({}))
vi.mock("@/components/editor/components/toolbar/components/pay/types.ts", () => ({}))
vi.mock("src/components/editor/components/toolbar/components/pay/types.ts", () => ({}))
