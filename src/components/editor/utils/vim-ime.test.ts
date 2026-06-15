/**
 * FilePath    : blog-client\src\components\editor\utils\vim-ime.test.ts
 * Author      : GitHub Copilot
 * Description : vim-ime 工具函数单元测试
 */

import { afterEach, describe, expect, it, vi } from "vitest"

import { buildVimImeEndpoint, notifyVimModeChange, resolveVimModeName, syncVimModeWithIme } from "./vim-ime"

afterEach(() => {
    vi.restoreAllMocks()
})

describe("resolveVimModeName", () => {
    it("已知 Vim 模式会被原样保留", () => {
        expect(resolveVimModeName({ mode: "insert" })).toBe("insert")
        expect(resolveVimModeName({ mode: "visual", subMode: "linewise" })).toBe("visual")
        expect(resolveVimModeName({ mode: "replace" })).toBe("replace")
    })

    it("未知模式会回退到 normal", () => {
        expect(resolveVimModeName({ mode: "unexpected" })).toBe("normal")
        expect(resolveVimModeName(void 0)).toBe("normal")
    })
})

describe("buildVimImeEndpoint", () => {
    it("会构建本地输入法服务地址", () => {
        expect(buildVimImeEndpoint(8765)).toBe("http://127.0.0.1:8765/ime")
    })
})

describe("notifyVimModeChange", () => {
    it("模式未变化时不会发起请求", async () => {
        const fetchMock = vi.fn()
        vi.stubGlobal("fetch", fetchMock)

        await notifyVimModeChange({ modeBefore: "normal", modeAfter: "normal", port: 8765 })

        expect(fetchMock).not.toHaveBeenCalled()
    })

    it("强制同步当前模式时, 即使模式未变化也会发起请求", async () => {
        const fetchMock = vi.fn(async () => new Response(null, { status: 200 }))
        vi.stubGlobal("fetch", fetchMock)

        await syncVimModeWithIme("normal", 9765)

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock).toHaveBeenCalledWith(
            "http://127.0.0.1:9765/ime",
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({
                    "mode-before": "normal",
                    "mode-after": "normal",
                }),
            }),
        )
    })

    it("模式变化时会以 JSON 请求调用本地服务", async () => {
        const fetchMock = vi.fn(async () => new Response(null, { status: 200 }))
        vi.stubGlobal("fetch", fetchMock)

        await notifyVimModeChange({ modeBefore: "normal", modeAfter: "insert", port: 18765 })

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(fetchMock).toHaveBeenCalledWith(
            "http://127.0.0.1:18765/ime",
            expect.objectContaining({
                method: "POST",
                keepalive: true,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    "mode-before": "normal",
                    "mode-after": "insert",
                }),
            }),
        )
    })

    it("服务不存在时只在首次失败后告警, 并忽略同端口后续请求", async () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined)
        const fetchMock = vi.fn(async () => {
            throw new TypeError("Failed to fetch")
        })
        vi.stubGlobal("fetch", fetchMock)

        await notifyVimModeChange({ modeBefore: "normal", modeAfter: "insert", port: 28765 })
        await notifyVimModeChange({ modeBefore: "insert", modeAfter: "normal", port: 28765 })

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(warnSpy).toHaveBeenCalledTimes(1)
    })

    it("不同端口会重新尝试请求, 不复用旧端口的不可用缓存", async () => {
        const fetchMock = vi
            .fn()
            .mockRejectedValueOnce(new TypeError("Failed to fetch"))
            .mockResolvedValueOnce(new Response(null, { status: 200 }))
        vi.stubGlobal("fetch", fetchMock)

        await notifyVimModeChange({ modeBefore: "normal", modeAfter: "insert", port: 38765 })
        await notifyVimModeChange({ modeBefore: "normal", modeAfter: "insert", port: 38766 })

        expect(fetchMock).toHaveBeenCalledTimes(2)
    })

    it("服务返回任意 2xx 时都视为成功, 不依赖 204 特例", async () => {
        const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined)
        const fetchMock = vi.fn(async () => new Response(null, { status: 202 }))
        vi.stubGlobal("fetch", fetchMock)

        await notifyVimModeChange({ modeBefore: "visual", modeAfter: "cmd", port: 48765 })

        expect(fetchMock).toHaveBeenCalledTimes(1)
        expect(warnSpy).not.toHaveBeenCalled()
    })
})
