import { afterEach, describe, expect, it, vi } from "vitest"

import { loadScriptFromString } from "./script"

describe("loadScriptFromString", () => {
    afterEach(() => {
        document.body.innerHTML = ""
        vi.restoreAllMocks()
    })

    it("为新插入的脚本附加自定义标记属性", async () => {
        const originalAppendChild = document.body.appendChild.bind(document.body)

        vi.spyOn(document.body, "appendChild").mockImplementation(((node: Node) => {
            const result = originalAppendChild(node)

            if (node instanceof HTMLScriptElement && node.src) {
                queueMicrotask(() => {
                    node.dispatchEvent(new Event("load"))
                })
            }

            return result
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
