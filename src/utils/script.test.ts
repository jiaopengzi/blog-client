/*
 * FilePath    : blog-client-nuxt\src\utils\script.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 脚本加载器的单元测试
 */

import { afterEach, describe, expect, it, vi } from "vitest"

import { loadScriptFromString } from "./script"

describe("loadScriptFromString", () => {
    afterEach(() => {
        document.body.innerHTML = ""
        vi.restoreAllMocks()
    })

    it("为新插入的脚本附加自定义标记属性", async () => {
        const originalAppendChild = document.body.appendChild.bind(document.body)

        // happy-dom 适配: 外链 script 走原生插入会触发 "JavaScript file loading is disabled"
        // 的 error 事件(jsdom 不做加载尝试), 与 mock 的 load 竞速导致误判失败——
        // 插入前剥离 src 阻断 happy-dom 的加载尝试(标记属性保留, 计数断言不受影响),
        // 再由 mock 派发 load
        vi.spyOn(document.body, "appendChild").mockImplementation(((node: Node) => {
            if (node instanceof HTMLScriptElement && node.src) {
                node.removeAttribute("src")
                const result = originalAppendChild(node)
                queueMicrotask(() => {
                    node.dispatchEvent(new Event("load"))
                })
                return result
            }

            return originalAppendChild(node)
        }) as typeof document.body.appendChild)

        const ok = await loadScriptFromString(
            '<script async src="https://example.com/analytics.js"></script><script>window.__footerStatisticsLoaded = true;</script>',
            {
                scriptAttributes: {
                    "data-footer-statistics-script": "true",
                },
            },
        )

        expect(ok).toBe(true)
        expect(document.querySelectorAll('script[data-footer-statistics-script="true"]')).toHaveLength(2)
    })

    it("遇到已存在的外链脚本时不会重复插入", async () => {
        const existedScript = document.createElement("script")
        existedScript.src = "https://example.com/analytics.js"
        document.body.appendChild(existedScript)

        const ok = await loadScriptFromString('<script src="https://example.com/analytics.js"></script>')

        expect(ok).toBe(true)
        expect(document.querySelectorAll('script[src="https://example.com/analytics.js"]')).toHaveLength(1)
    })
})
