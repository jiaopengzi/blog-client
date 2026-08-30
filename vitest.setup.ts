/*
 * FilePath    : blog-client-nuxt\vitest.setup.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : vitest 全局 setup(照搬原项目, 后续阶段按需补充 mock)
 */

import { vi } from "vitest"

// happy-dom 无 doctype(quirks mode), KaTeX 渲染器初始化的探测性告警与被测逻辑无关, 精准静音
// (仅过滤这一条消息, 其它 console.warn 照常透出)
const originalConsoleWarn = console.warn.bind(console)
console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("KaTeX doesn't work in quirks mode")) {
        return
    }

    // nuxt 环境灰度测试(vitest-environment-nuxt)启动时无 API 后端, initStores 的兜底告警
    // 是"已捕获且不影响渲染"的预期噪音; 真实接口回归由浏览器验收承担
    if (typeof args[0] === "string" && args[0].includes("initStores 执行异常")) {
        return
    }

    originalConsoleWarn(...args)
}

// happy-dom 对外链 <script> 的原生加载是禁用的(vitest 默认设置), 插入带 src 的脚本节点会
// 向 stderr 打印 NotSupportedError; 各用例已自行 mock load 事件或断言 DOM 形态,
// 该打印属环境实现细节, 精准静音. 注意 happy-dom 的 VirtualConsole 会把异常格式化为
// "DOMException [NotSupportedError]: ..." 字符串再调 console.error, 实例与字符串两种形态都要拦
const originalConsoleError = console.error.bind(console)
const isDisabledScriptLoadingNoise = (value: unknown): boolean => {
    if (value instanceof DOMException) {
        return String(value.message).includes("JavaScript file loading is disabled")
    }

    return typeof value === "string" && value.includes("JavaScript file loading is disabled")
}
console.error = (...args: unknown[]) => {
    if (args.length === 1 && isDisabledScriptLoadingNoise(args[0])) {
        return
    }

    originalConsoleError(...args)
}

// 以下三条为"预期路径的成功日志/框架提示"(非诊断信息), 测试输出精准静音:
// - "Text has been copied using navigator.clipboard!": vim 剪贴板桥接成功时的 info(用例已断言行为)
// - "加载统计脚本: 成功": 统计脚本加载成功的 info(用例走 mock load 路径)
// - "<Suspense> is an experimental feature": Vue dev 构建对 Suspense 的 console.info 提示,
//   vitest-environment-nuxt 启动 NuxtRoot 必现, 与被测逻辑无关
const EXPECTED_INFO_NOISE = ["Text has been copied using navigator.clipboard!", "加载统计脚本: 成功", "<Suspense> is an experimental feature"]
const originalConsoleInfo = console.info.bind(console)
console.info = (...args: unknown[]) => {
    if (typeof args[0] === "string" && EXPECTED_INFO_NOISE.some((noise) => args[0]!.startsWith(noise))) {
        return
    }

    originalConsoleInfo(...args)
}

// 剪贴板成功的提示走的是 console.log(copy-text.ts), 与上面 console.info 的过滤同语义
const originalConsoleLog = console.log.bind(console)
console.log = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0]!.startsWith("Text has been copied using navigator.clipboard!")) {
        return
    }

    originalConsoleLog(...args)
}

// 统一 mock 一些无法处理的模块
vi.mock("vue3-emoji-picker", () => ({}))
vi.mock("src/components/common/icons/assets/iconfont.js", () => ({}))
vi.mock("@/components/common/icons/assets/iconfont.js", () => ({}))
vi.mock("@/router/routeAdmin.ts", () => ({}))
vi.mock("src/router/routeAdmin.ts", () => ({}))
vi.mock("@/router/routes.ts", () => ({}))
vi.mock("src/router/routes.ts", () => ({}))
vi.mock("@/router/router.ts", () => ({}))
vi.mock("src/router/router.ts", () => ({}))
vi.mock("@/components/editor/components/toolbar/components/pay/types.ts", () => ({}))
vi.mock("src/components/editor/components/toolbar/components/pay/types.ts", () => ({}))
