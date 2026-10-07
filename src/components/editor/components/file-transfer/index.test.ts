/*
 * FilePath    : blog-client\src\components\editor\components\file-transfer\index.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 图标与短文字文件子菜单、跨平台编码读取、异步覆盖保护与导出恢复回归测试
 */

import { flushPromises, mount } from "@vue/test-utils"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { IconKeys } from "@/components/common/icons"

import EditorFileTransfer from "./index.vue"

const mocks = vi.hoisted(() => ({
    confirm: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
    success: vi.fn(),
    buildMarkdownExport: vi.fn(),
    downloadExport: vi.fn(),
}))

vi.mock("element-plus", async (importOriginal) => ({
    ...(await importOriginal<typeof import("element-plus")>()),
    ElMessageBox: { confirm: mocks.confirm },
    ElMessage: { warning: mocks.warning, error: mocks.error, success: mocks.success },
}))
vi.mock("../../export", () => ({
    buildMarkdownExport: mocks.buildMarkdownExport,
    downloadExport: mocks.downloadExport,
    normalizeExportTitle: (title: string) => title,
}))
vi.mock("../../utils/markdown", () => ({ getFirstLevelOneMarkdownHeadingText: () => "测试文档" }))

/** 创建工具栏组件, 简化下拉浮层以聚焦文件读取与下载交互. */
function createWrapper(markdown = "旧内容") {
    return mount(EditorFileTransfer, {
        props: { markdown },
        global: {
            stubs: {
                ElDropdown: { name: "ElDropdown", template: "<div><slot /><slot name='dropdown' /></div>" },
                ElDropdownMenu: { template: "<div><slot /></div>" },
                ElDropdownItem: { template: "<div><slot /></div>" },
                ElTooltip: { template: "<div><slot /></div>" },
                JIcon: { name: "JIcon", props: ["name"], template: "<span />" },
            },
        },
    })
}

/** 为文件输入框提供受控读取行为, 包含真实失败和延迟场景. */
async function selectFile(wrapper: ReturnType<typeof createWrapper>, name: string, text: () => Promise<string>) {
    const input = wrapper.get("input")
    Object.defineProperty(input.element, "files", {
        configurable: true,
        value: [{ name, arrayBuffer: async () => new TextEncoder().encode(await text()).buffer }],
    })
    await input.trigger("change")
    await flushPromises()
}

/** 从下拉菜单发送导出命令, 等待异步模块加载完成. */
async function command(wrapper: ReturnType<typeof createWrapper>, value: string) {
    wrapper.getComponent({ name: "ElDropdown" }).vm.$emit("command", value)
    await flushPromises()
}

/** 创建由测试控制完成时机的承诺, 用于复现读取或导出期间的编辑与卸载. */
function deferred<T>() {
    let resolve!: (value: T) => void
    let reject!: (reason: unknown) => void
    const promise = new Promise<T>((resolvePromise, rejectPromise) => {
        resolve = resolvePromise
        reject = rejectPromise
    })
    return { promise, resolve, reject }
}

beforeEach(() => {
    vi.clearAllMocks()
    mocks.confirm.mockResolvedValue("confirm")
    mocks.buildMarkdownExport.mockResolvedValue({ blob: new Blob(["旧内容"]), filename: "测试文档.md" })
})

afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.useRealTimers()
})

describe("文件导入导出", () => {
    it("ImportExport 入口保留图标, 子菜单显示 Markdown 图标与导入导出短文字, 导入打开文件选择器", async () => {
        const wrapper = createWrapper()
        expect(wrapper.findAll("button")).toHaveLength(1)
        expect(wrapper.get("button").attributes("aria-label")).toBe("导入和导出")
        expect(wrapper.findAllComponents({ name: "JIcon" }).map((icon) => icon.props("name"))).toEqual([
            IconKeys.ImportExport,
            IconKeys.Markdown,
            IconKeys.Markdown,
        ])
        expect(wrapper.findAll("[command]").map((item) => item.text())).toEqual(["导入", "导出"])
        const click = vi.spyOn(wrapper.get("input").element, "click")
        await command(wrapper, "import")
        expect(click).toHaveBeenCalledOnce()
        expect(mocks.buildMarkdownExport).not.toHaveBeenCalled()
        wrapper.unmount()
    })

    it("内嵌图片 Markdown 直接下载, 即使目录授权会失败也不打开目录选择器", async () => {
        const picker = vi.fn().mockRejectedValue(new DOMException("系统文件", "SecurityError"))
        vi.stubGlobal("showDirectoryPicker", picker)
        const source = "![图](md-img:11111111-1111-1111-1111-111111111111)"
        const wrapper = createWrapper(source)
        await command(wrapper, "markdown")
        expect(picker).not.toHaveBeenCalled()
        expect(mocks.buildMarkdownExport).toHaveBeenCalledWith(source, "测试文档")
        expect(mocks.downloadExport).toHaveBeenCalledOnce()
        expect(mocks.error).not.toHaveBeenCalled()
        wrapper.unmount()
    })

    it("代码示例中的本地图片不要求目录权限", async () => {
        const picker = vi.fn()
        vi.stubGlobal("showDirectoryPicker", picker)
        const wrapper = createWrapper("`![](md-img:11111111-1111-1111-1111-111111111111)`")
        await command(wrapper, "markdown")
        expect(picker).not.toHaveBeenCalled()
        expect(mocks.downloadExport).toHaveBeenCalledOnce()
        wrapper.unmount()
    })
    it("拒绝非 Markdown 文件而不读取或修改正文", async () => {
        const wrapper = createWrapper()
        const read = vi.fn().mockResolvedValue("错误文件")
        await selectFile(wrapper, "document.html", read)
        expect(read).not.toHaveBeenCalled()
        expect(mocks.warning).toHaveBeenCalledOnce()
        expect(wrapper.emitted("import")).toBeUndefined()
        wrapper.unmount()
    })

    it("读取成功后确认覆盖并去除 UTF-8 BOM", async () => {
        const wrapper = createWrapper()
        await selectFile(wrapper, "document.MARKDOWN", async () => "\uFEFF# 新内容")
        expect(mocks.confirm).toHaveBeenCalledOnce()
        expect(wrapper.emitted("import")).toEqual([["# 新内容"]])
        wrapper.unmount()
    })

    it.each(["", "text/plain", "text/markdown", "application/octet-stream"])("按扩展名接受 MIME 为 %s 的 UTF-8 文件, 保留换行与原文", async (type) => {
        const source = "# 中文 😀\r\n\r\n正文  \r\n![图](https://example.com/a.png)\r\n"
        const wrapper = createWrapper("")
        const input = wrapper.get("input")
        Object.defineProperty(input.element, "files", { value: [new File([source], "中文文档.MD", { type })] })
        await input.trigger("change")
        await flushPromises()
        expect(wrapper.emitted("import")).toEqual([[source]])
        expect(mocks.error).not.toHaveBeenCalled()
        wrapper.unmount()
    })

    it.each([
        ["UTF-8 BOM", [0xef, 0xbb, 0xbf, 0x23, 0x20, 0xe4, 0xb8, 0xad, 0x0d, 0x0a]],
        ["UTF-16LE BOM", [0xff, 0xfe, 0x23, 0, 0x20, 0, 0x2d, 0x4e, 0x0d, 0, 0x0a, 0]],
        ["UTF-16BE BOM", [0xfe, 0xff, 0, 0x23, 0, 0x20, 0x4e, 0x2d, 0, 0x0d, 0, 0x0a]],
    ] as const)("导入 %s 文件去除 BOM 并正确保留中文与 CRLF", async (_encoding, bytes) => {
        const wrapper = createWrapper("")
        const input = wrapper.get("input")
        Object.defineProperty(input.element, "files", { value: [new File([new Uint8Array(bytes)], "中文.md")] })
        await input.trigger("change")
        await flushPromises()
        expect(wrapper.emitted("import")).toEqual([["# 中\r\n"]])
        expect(mocks.error).not.toHaveBeenCalled()
        wrapper.unmount()
    })

    it.each([
        ["非法 UTF-8", [0xff, 0x23]],
        ["UTF-8 截断字符", [0xe4, 0xb8]],
        ["UTF-16LE 奇数字节", [0xff, 0xfe, 0x23]],
        ["UTF-16BE 非法代理项", [0xfe, 0xff, 0xd8, 0, 0, 0x23]],
    ] as const)("拒绝 %s 且不弹覆盖确认, 恢复忙态允许重试", async (_encoding, bytes) => {
        const wrapper = createWrapper()
        const input = wrapper.get("input")
        Object.defineProperty(input.element, "files", { configurable: true, value: [new File([new Uint8Array(bytes)], "非法编码.md")] })
        await input.trigger("change")
        await flushPromises()
        expect(wrapper.emitted("import")).toBeUndefined()
        expect(mocks.confirm).not.toHaveBeenCalled()
        expect(mocks.error).toHaveBeenCalledWith("文件编码无效，请使用 UTF-8 或带 BOM 的 UTF-16 文件，当前内容未修改")
        expect(wrapper.get("button").attributes("disabled")).toBeUndefined()
        await selectFile(wrapper, "重试.md", async () => "有效内容")
        expect(wrapper.emitted("import")).toEqual([["有效内容"]])
        wrapper.unmount()
    })

    it("重选同一个文件仍可导入, 每次读取前清空文件选择器", async () => {
        const wrapper = createWrapper("")
        const input = wrapper.get("input").element
        Object.defineProperty(input, "value", { configurable: true, writable: true, value: "C:\\fakepath\\same.md" })
        const read = vi.fn().mockResolvedValue("# 原文")
        await selectFile(wrapper, "same.md", read)
        expect(input.value).toBe("")
        input.value = "C:\\fakepath\\same.md"
        await selectFile(wrapper, "same.md", read)
        expect(input.value).toBe("")
        expect(read).toHaveBeenCalledTimes(2)
        expect(wrapper.emitted("import")).toEqual([["# 原文"], ["# 原文"]])
        wrapper.unmount()
    })

    it("取消文件选择不进入忙态, 后续仍可正常导入", async () => {
        const wrapper = createWrapper("")
        const input = wrapper.get("input")
        Object.defineProperty(input.element, "files", { configurable: true, value: [] })
        await input.trigger("change")
        expect(wrapper.get("button").attributes("disabled")).toBeUndefined()
        expect(mocks.confirm).not.toHaveBeenCalled()
        expect(wrapper.emitted("import")).toBeUndefined()
        await selectFile(wrapper, "document.md", async () => "新内容")
        expect(wrapper.emitted("import")).toEqual([["新内容"]])
        wrapper.unmount()
    })

    it("读取文件期间继续编辑时中止导入, 不再弹覆盖确认", async () => {
        const wrapper = createWrapper("")
        const read = deferred<string>()
        await selectFile(wrapper, "document.md", () => read.promise)
        await wrapper.setProps({ markdown: "读取期间刚写的内容" })
        read.resolve("导入正文")
        await flushPromises()
        expect(wrapper.emitted("import")).toBeUndefined()
        expect(mocks.confirm).not.toHaveBeenCalled()
        expect(mocks.warning).toHaveBeenCalledWith("当前内容已发生变化，请重新导入")
        expect(wrapper.get("button").attributes("disabled")).toBeUndefined()
        wrapper.unmount()
    })

    it("读取期间阻止再次选择文件和导出, 完成后恢复菜单", async () => {
        const wrapper = createWrapper("")
        const read = deferred<string>()
        const secondRead = vi.fn().mockResolvedValue("第二份正文")
        const click = vi.spyOn(wrapper.get("input").element, "click")
        await selectFile(wrapper, "first.md", () => read.promise)
        await selectFile(wrapper, "second.md", secondRead)
        await command(wrapper, "import")
        await command(wrapper, "markdown")
        expect(secondRead).not.toHaveBeenCalled()
        expect(click).not.toHaveBeenCalled()
        expect(mocks.buildMarkdownExport).not.toHaveBeenCalled()
        read.resolve("第一份正文")
        await flushPromises()
        expect(wrapper.emitted("import")).toEqual([["第一份正文"]])
        expect(wrapper.get("button").attributes("disabled")).toBeUndefined()
        wrapper.unmount()
    })

    it.each(["success", "failure"])("卸载后文件读取 %s 不再覆盖或弹提示", async (result) => {
        const wrapper = createWrapper()
        const read = deferred<string>()
        await selectFile(wrapper, "document.md", () => read.promise)
        wrapper.unmount()
        if (result === "success") read.resolve("新内容")
        else read.reject(new Error("读取失败"))
        await flushPromises()
        expect(wrapper.emitted("import")).toBeUndefined()
        expect(mocks.confirm).not.toHaveBeenCalled()
        expect(mocks.success).not.toHaveBeenCalled()
        expect(mocks.error).not.toHaveBeenCalled()
    })

    it("卸载后完成覆盖确认不再导入或弹成功提示", async () => {
        const wrapper = createWrapper()
        const confirmation = deferred<string>()
        mocks.confirm.mockReturnValueOnce(confirmation.promise)
        await selectFile(wrapper, "document.md", async () => "新内容")
        wrapper.unmount()
        confirmation.resolve("confirm")
        await flushPromises()
        expect(wrapper.emitted("import")).toBeUndefined()
        expect(mocks.success).not.toHaveBeenCalled()
    })

    it("取消覆盖不修改原文, 读取失败不弹覆盖确认", async () => {
        const wrapper = createWrapper()
        mocks.confirm.mockRejectedValueOnce("cancel")
        await selectFile(wrapper, "document.md", async () => "新内容")
        expect(wrapper.emitted("import")).toBeUndefined()
        mocks.confirm.mockClear()
        await selectFile(wrapper, "document.md", async () => {
            throw new Error("读取失败")
        })
        expect(mocks.confirm).not.toHaveBeenCalled()
        expect(mocks.error).toHaveBeenCalledOnce()
        expect(wrapper.emitted("import")).toBeUndefined()
        wrapper.unmount()
    })

    it("空编辑器无需覆盖确认, 允许导入空文件", async () => {
        const wrapper = createWrapper("")
        await selectFile(wrapper, "empty.md", async () => "")
        expect(mocks.confirm).not.toHaveBeenCalled()
        expect(wrapper.emitted("import")).toEqual([[""]])
        wrapper.unmount()
    })

    it("等待确认期间的编辑变化不会被覆盖", async () => {
        const wrapper = createWrapper()
        let accept!: (value: string) => void
        mocks.confirm.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    accept = resolve
                }),
        )
        await selectFile(wrapper, "document.md", async () => "新内容")
        await wrapper.setProps({ markdown: "刚刚修改" })
        accept("confirm")
        await flushPromises()
        expect(wrapper.emitted("import")).toBeUndefined()
        expect(mocks.warning).toHaveBeenCalledOnce()
        wrapper.unmount()
    })

    it("导出忙态阻止重复操作, 完成后恢复", async () => {
        const wrapper = createWrapper()
        let finish!: (value: { blob: Blob; filename: string }) => void
        mocks.buildMarkdownExport.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finish = resolve
                }),
        )
        await command(wrapper, "markdown")
        expect(wrapper.get("button").attributes("disabled")).toBeDefined()
        await command(wrapper, "markdown")
        expect(mocks.buildMarkdownExport).toHaveBeenCalledOnce()
        expect(mocks.downloadExport).not.toHaveBeenCalled()
        finish({ blob: new Blob(["旧内容"]), filename: "测试文档.md" })
        await flushPromises()
        expect(wrapper.get("button").attributes("disabled")).toBeUndefined()
        wrapper.unmount()
    })

    it("离开编辑器后不发起尚未完成的 Markdown 下载", async () => {
        const wrapper = createWrapper()
        let finish!: (value: { blob: Blob; filename: string }) => void
        mocks.buildMarkdownExport.mockImplementationOnce(
            () =>
                new Promise((resolve) => {
                    finish = resolve
                }),
        )
        await command(wrapper, "markdown")
        wrapper.unmount()
        finish({ blob: new Blob(["旧内容"]), filename: "测试文档.md" })
        await flushPromises()
        expect(mocks.downloadExport).not.toHaveBeenCalled()
    })

    it("导出使用点击时的原文快照, 导出期间继续编辑不影响下载内容", async () => {
        const wrapper = createWrapper("# 原文快照")
        const exported = deferred<{ blob: Blob; filename: string }>()
        mocks.buildMarkdownExport.mockReturnValueOnce(exported.promise)
        wrapper.getComponent({ name: "ElDropdown" }).vm.$emit("command", "markdown")
        await wrapper.setProps({ markdown: "# 刚刚更新" })
        await flushPromises()
        expect(mocks.buildMarkdownExport).toHaveBeenCalledWith("# 原文快照", "测试文档")
        const blob = new Blob(["# 原文快照"])
        exported.resolve({ blob, filename: "快照.md" })
        await flushPromises()
        expect(mocks.downloadExport).toHaveBeenCalledWith(blob, "快照.md")
        wrapper.unmount()
    })

    it.each(["build", "download"])("导出在 %s 阶段失败后恢复忙态并可重试", async (stage) => {
        const wrapper = createWrapper()
        const error = new Error("无法导出图片")
        if (stage === "build") mocks.buildMarkdownExport.mockRejectedValueOnce(error)
        else
            mocks.downloadExport.mockImplementationOnce(() => {
                throw error
            })
        await command(wrapper, "markdown")
        expect(mocks.error).toHaveBeenCalledWith(error.message)
        expect(wrapper.get("button").attributes("disabled")).toBeUndefined()
        mocks.downloadExport.mockClear()
        await command(wrapper, "markdown")
        expect(mocks.downloadExport).toHaveBeenCalledOnce()
        wrapper.unmount()
    })
})
