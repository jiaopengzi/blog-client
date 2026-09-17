/**
 * FilePath    : blog-client\src\pkg\mermaid\__tests__\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : mermaid 装配层渲染逻辑测试 (260917-01, mermaid 模块以 mock 替身注入)
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

// mermaid 真实包体积大且依赖完整 DOM 测量, 单测用替身验证装配层自身的调度与状态机
const { initializeMock, renderMock } = vi.hoisted(() => {
    return {
        initializeMock: vi.fn(),
        renderMock: vi.fn(),
    }
})

vi.mock("mermaid", () => {
    return {
        default: {
            initialize: initializeMock,
            render: renderMock,
        },
    }
})

import { activeThemePresetState } from "@/theme/useTheme"

import { getMermaidThemeByScheme, renderMermaidInContainer } from "../index"

const createMermaidContainerHtml = (source: string): string => {
    // 与 renderer.constructMermaidContainer 输出保持一致 (含源码复制按钮)
    return `<section class="jpz-mermaid-container" data-mermaid-status="pending"><button type="button" class="copy-button jpz-mermaid-copy-button">MERMAID</button><pre class="jpz-mermaid-source">${source}</pre></section>`
}

describe("getMermaidThemeByScheme - 主题映射", () => {
    it("light 映射 default, dark 映射 dark", () => {
        expect(getMermaidThemeByScheme("light")).toBe("default")
        expect(getMermaidThemeByScheme("dark")).toBe("dark")
    })
})

describe("renderMermaidInContainer - 容器渲染", () => {
    beforeEach(() => {
        renderMock.mockReset()
        initializeMock.mockReset()
    })

    afterEach(() => {
        // 主题预设状态恢复默认, 避免影响后续用例的 initialize 断言
        activeThemePresetState.value = "light"
        document.body.innerHTML = ""
    })

    it("pending 容器渲染成功后注入 SVG 并标记 rendered", async () => {
        renderMock.mockResolvedValue({ svg: '<svg viewBox="0 0 100 50"><rect></rect></svg>' })

        const root = document.createElement("div")
        root.innerHTML = createMermaidContainerHtml("flowchart LR\n    A --&gt; B")
        document.body.appendChild(root)

        await renderMermaidInContainer(root)

        const container = root.querySelector<HTMLElement>(".jpz-mermaid-container")!
        expect(container.dataset.mermaidStatus).toBe("rendered")
        expect(container.querySelector(".jpz-mermaid-svg svg")).not.toBeNull()
        // pre.textContent 已由浏览器解码回源码实体
        expect(renderMock).toHaveBeenCalledWith(expect.stringMatching(/^jpz-mermaid-svg-\d+$/), "flowchart LR\n    A --> B")
        // 初始化参数: 安全级别 strict 且不自动启动
        expect(initializeMock).toHaveBeenCalledWith(expect.objectContaining({ startOnLoad: false, securityLevel: "strict", theme: "default" }))
    })

    it("渲染失败进入 error 状态并展示源码降级", async () => {
        // 装配层错误路径会 console.error, 本地静默避免污染测试输出
        const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {})
        renderMock.mockRejectedValue(new Error("Parse error"))

        const root = document.createElement("div")
        root.innerHTML = createMermaidContainerHtml("flowchart LR\n    A[未闭合 -->")
        document.body.appendChild(root)

        await renderMermaidInContainer(root)

        const container = root.querySelector<HTMLElement>(".jpz-mermaid-container")!
        expect(container.dataset.mermaidStatus).toBe("error")
        const errorElement = container.querySelector<HTMLElement>(".jpz-mermaid-error")
        expect(errorElement?.textContent).toContain("mermaid 图表渲染失败")
        expect(errorElement?.textContent).toContain("Parse error")

        consoleErrorSpy.mockRestore()
    })

    it("源码为空时标记 empty 且不调用 render", async () => {
        const root = document.createElement("div")
        root.innerHTML = createMermaidContainerHtml("  \n")
        document.body.appendChild(root)

        await renderMermaidInContainer(root)

        const container = root.querySelector<HTMLElement>(".jpz-mermaid-container")!
        expect(container.dataset.mermaidStatus).toBe("empty")
        expect(renderMock).not.toHaveBeenCalled()
    })

    it("已 rendered 容器默认跳过, force 时强制重渲染", async () => {
        renderMock.mockResolvedValue({ svg: "<svg></svg>" })

        const root = document.createElement("div")
        root.innerHTML = createMermaidContainerHtml("flowchart TD\n    A --> B")
        document.body.appendChild(root)

        await renderMermaidInContainer(root)
        expect(renderMock).toHaveBeenCalledTimes(1)

        await renderMermaidInContainer(root)
        expect(renderMock).toHaveBeenCalledTimes(1)

        await renderMermaidInContainer(root, { force: true })
        expect(renderMock).toHaveBeenCalledTimes(2)
    })

    it("暗色 scheme 下以 dark 主题初始化", async () => {
        renderMock.mockResolvedValue({ svg: "<svg></svg>" })
        activeThemePresetState.value = "dark"

        const root = document.createElement("div")
        root.innerHTML = createMermaidContainerHtml("flowchart TD\n    A --> B")
        document.body.appendChild(root)

        await renderMermaidInContainer(root)

        expect(initializeMock).toHaveBeenCalledWith(expect.objectContaining({ theme: "dark", darkMode: true }))
    })

    it("同一主题重复渲染不重复 initialize, 主题变化后重新 initialize", async () => {
        renderMock.mockResolvedValue({ svg: "<svg></svg>" })

        const root = document.createElement("div")
        root.innerHTML = createMermaidContainerHtml("flowchart TD\n    A --> B")
        document.body.appendChild(root)

        await renderMermaidInContainer(root)
        await renderMermaidInContainer(root, { force: true })
        expect(initializeMock).toHaveBeenCalledTimes(1)

        activeThemePresetState.value = "github-dark"
        await renderMermaidInContainer(root, { force: true })
        expect(initializeMock).toHaveBeenCalledTimes(2)
        expect(initializeMock).toHaveBeenLastCalledWith(expect.objectContaining({ theme: "dark" }))
    })

    it("无 mermaid 容器时零调用", async () => {
        const root = document.createElement("div")
        root.innerHTML = "<p>普通内容</p>"

        await renderMermaidInContainer(root)

        expect(renderMock).not.toHaveBeenCalled()
    })
})
