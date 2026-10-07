/*
 * FilePath    : blog-client\src\components\editor\export\export.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Markdown 导出源码保真、公式与 HTML 原始文本保护、批量图片及跨平台回归测试.
 */

import { afterEach, describe, expect, it, vi } from "vitest"

import { getLocalImageBlob } from "@/utils/mdLocalImage"

import { downloadExport } from "./index"
import { buildMarkdownExport, findLocalImageReferences, normalizeExportTitle, replaceLocalImageReferences } from "./markdown"

vi.mock("@/utils/mdLocalImage", async (importOriginal) => ({ ...(await importOriginal<Record<string, unknown>>()), getLocalImageBlob: vi.fn() }))
const ID = "11111111-1111-1111-1111-111111111111"
const URL = `md-img:${ID}`

afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.useRealTimers()
    vi.mocked(getLocalImageBlob).mockReset()
})

describe("Markdown 文件导出", () => {
    it.each(["> ", "> > "])("引用块 %s 内跨空行公式保留原文, 结束后的真实图片仍嵌入", (prefix) => {
        const formula = ["$$", "", `![公式示例](${URL})`, "", "$$"].map((line) => prefix + line).join("\n")
        const source = `${formula}\n\n![真实图片](${URL})`
        expect(replaceLocalImageReferences(source, new Map([[ID, "embedded"]]))).toBe(`${formula}\n\n![真实图片](embedded)`)
    })
    it.each(["script", "style", "textarea", "title"])("行内 %s 跨节点内容保持原文, 闭合后的真实图片正常导出", (tag) => {
        const protectedSource = `文字 <${tag} data-label=">">'![示例](${URL}) <img src="${URL}">'\n\n<img src="${URL}"></${tag}>`
        const source = `${protectedSource}\n\n![真实](${URL})`
        expect(replaceLocalImageReferences(source, new Map([[ID, "embedded"]]))).toBe(`${protectedSource}\n\n![真实](embedded)`)
    })

    it("未闭合的行内原始文本标签保护剩余原文", async () => {
        const source = `文字 <textarea>\n![示例](${URL})\n\n<img src="${URL}">`
        const result = await buildMarkdownExport(source, "原文")
        expect(await result.blob.text()).toBe(source)
        expect(getLocalImageBlob).not.toHaveBeenCalled()
    })

    it("原始文本跨段落闭合后, 同一段落中的真实图片仍可导出", () => {
        const source = `文字 <textarea>\n\n![示例](${URL})\n\n</textarea> ![真实](${URL})`
        expect(replaceLocalImageReferences(source, new Map([[ID, "embedded"]]))).toBe(`文字 <textarea>\n\n![示例](${URL})\n\n</textarea> ![真实](embedded)`)
    })

    it.each([`$![示例](${URL})$`, `$$\n![示例](${URL})\n$$`, `$$\n第一段\n\n![示例](${URL})\n\n末段\n$$`, `文字 $![示例](${URL})$`])(
        "KaTeX 公式保持原文, 同内容的真实图片仍被内嵌: %s",
        (formula) => {
            const source = `${formula}\n\n![示例](${URL})`
            expect(replaceLocalImageReferences(source, new Map([[ID, "embedded"]]))).toBe(`${formula}\n\n![示例](embedded)`)
        },
    )

    it("转义或缺少结束符的美元文本不隐藏真实图片", () => {
        const source = `\\$![图](${URL})$\n\n$未结束 ![图](${URL})`
        expect(replaceLocalImageReferences(source, new Map([[ID, "embedded"]]))).toBe("\\$![图](embedded)$\n\n$未结束 ![图](embedded)")
    })

    it("未闭合块公式不隐藏后续跨段图片", () => {
        const source = `$$\n文字\n\n![图](${URL})`
        expect(replaceLocalImageReferences(source, new Map([[ID, "embedded"]]))).toBe("$$\n文字\n\n![图](embedded)")
    })

    it("批量图片一次拼接后保留未提供替换项的图片、相邻文本与 Unicode", () => {
        const other = "22222222-2222-2222-2222-222222222222"
        const segment = `中文 ![图](${URL})![未替换](md-img:${other})🚀\r\n`
        const embedded = "data:image/png;base64," + "A".repeat(64 * 1024)
        expect(replaceLocalImageReferences(segment.repeat(200), new Map([[ID, embedded]]))).toBe(segment.replace(URL, embedded).repeat(200))
    })

    it.each(["error", "abort"])("图片 FileReader 触发 %s 时拒绝下载不完整正文", async (event) => {
        vi.mocked(getLocalImageBlob).mockResolvedValue(new Blob(["image"], { type: "image/png" }))
        vi.stubGlobal(
            "FileReader",
            class extends EventTarget {
                /** 模拟底层图片读取失败或系统中止. */
                readAsDataURL() {
                    this.dispatchEvent(new Event(event))
                }
            },
        )
        await expect(buildMarkdownExport(`![](${URL})`, "图片")).rejects.toThrow(event === "abort" ? "本地图片读取已中止" : "本地图片读取失败")
    })

    it.each([false, true])("下载锚点挂载后点击并延迟释放 URL, 点击异常: %s", (failure) => {
        vi.useFakeTimers()
        const create = vi.spyOn(globalThis.URL, "createObjectURL").mockReturnValue("blob:markdown-export")
        const revoke = vi.spyOn(globalThis.URL, "revokeObjectURL").mockImplementation(() => {})
        const anchor = document.createElement("a")
        vi.spyOn(document, "createElement").mockReturnValueOnce(anchor)
        vi.spyOn(anchor, "click").mockImplementation(() => {
            expect(document.body.contains(anchor)).toBe(true)
            expect(anchor.download).toBe("中文.md")
            expect(anchor.href).toBe("blob:markdown-export")
            if (failure) throw new Error("download blocked")
        })
        const blob = new Blob(["# 中文"], { type: "text/markdown;charset=utf-8" })
        if (failure) expect(() => downloadExport(blob, "中文.md")).toThrow("download blocked")
        else downloadExport(blob, "中文.md")
        expect(create).toHaveBeenCalledExactlyOnceWith(blob)
        expect(document.body.contains(anchor)).toBe(false)
        expect(revoke).not.toHaveBeenCalled()
        vi.advanceTimersByTime(30_000)
        expect(revoke).toHaveBeenCalledExactlyOnceWith("blob:markdown-export")
    })

    it.each(["\n", "\r\n", "\r"])("保留 %j 换行与 Unicode, 相对路径和已有 data URL 不访问数据库", async (newline) => {
        const source = ["# 中文 🚀", "![本地](./截图.png)", "![嵌入](data:image/png;base64,YQ==)", "<img src=./a.png>", ""].join(newline)
        const result = await buildMarkdownExport(source, "原文")
        expect(await result.blob.text()).toBe(source)
        expect(result.blob.type).toBe("text/markdown;charset=utf-8")
        expect(getLocalImageBlob).not.toHaveBeenCalled()
    })

    it.each([
        [`\\![图](${URL})\n\n![图](${URL})`, `\\![图](${URL})\n\n![图](embedded)`],
        [`    ![图](${URL})\n\ntext    ![图](${URL})`, `    ![图](${URL})\n\ntext    ![图](embedded)`],
        [`> ![图](\n> ${URL}\n> )`, "> ![图](\n> embedded\n> )"],
        [`- ![图](\n  ${URL}\n  )`, "- ![图](\n  embedded\n  )"],
        [`<!-- <img src="${URL}"> -->\n\n<img src="${URL}">`, `<!-- <img src="${URL}"> -->\n\n<img src="embedded">`],
        [`<img data-src="${URL}" src="https://example.com/a.png">`, `<img data-src="${URL}" src="https://example.com/a.png">`],
        [`<img alt='src="${URL}" >' src='${URL}'>`, `<img alt='src="${URL}" >' src='embedded'>`],
        [`<script><img src="${URL}"></script>\n\n<img src="${URL}">`, `<script><img src="${URL}"></script>\n\n<img src="embedded">`],
        [`![pic][]\n\n[pic]: <${URL}>\n[unused]: ${URL}`, `![pic][]\n\n[pic]: <embedded>\n[unused]: ${URL}`],
        [`![pic]\n\n[pic]: https://example.com/a.png\n[pic]: ${URL}`, `![pic]\n\n[pic]: https://example.com/a.png\n[pic]: ${URL}`],
        [`![PIC]\n\n[pic]: ${URL}\n[pic]: ${URL}`, `![PIC]\n\n[pic]: embedded\n[pic]: ${URL}`],
    ])("只替换实际图片目的地址: %s", (source, expected) => {
        expect(replaceLocalImageReferences(source, new Map([[ID, "embedded"]]))).toBe(expected)
    })

    it.each(["\r\n", "\r"])("多行引用图片在 %j 文件中保留源码坐标", (newline) => {
        const source = ["> ![图](", `> ${URL}`, "> )", ""].join(newline)
        expect(replaceLocalImageReferences(source, new Map([[ID, "embedded"]]))).toBe(source.replace(URL, "embedded"))
    })

    it.each(["CON", "nul.txt", "COM¹", "LPT²", "COM³.log"])("规避 Windows 保留文件名 %s", (title) => {
        expect(normalizeExportTitle(title)).toBe(`_${title}`)
    })

    it.each(["汉".repeat(100), "🚀".repeat(100), "a".repeat(239) + ".extra"])("文件名按 UTF-8 字节限长且不截断 Unicode: %s", (title) => {
        const name = normalizeExportTitle(title)
        expect(new TextEncoder().encode(`${name}.md`).length).toBeLessThanOrEqual(255)
        expect(new TextDecoder("utf-8", { fatal: true }).decode(new TextEncoder().encode(name))).toBe(name)
        expect(name).not.toMatch(/[. ]$/)
    })

    it("内嵌模式导出真实图片字节, 重复引用只读一次且保留 CRLF、标题、外链和代码示例", async () => {
        vi.mocked(getLocalImageBlob).mockResolvedValue(new Blob(["image-content"], { type: "image/png" }))
        const source = `# 中文\r\n![图](${URL} "标题")\r\n![引用][pic]\r\n\r\n[pic]: ${URL}\r\n\r\n\`![](${URL})\`\r\n![外链](https://example.com/a.png)`
        const result = await buildMarkdownExport(source, "ceshi")
        const dataUrl = "data:image/png;base64,aW1hZ2UtY29udGVudA=="
        expect(await result.blob.text()).toBe(source.replace(`${URL} "标题"`, `${dataUrl} "标题"`).replace(`[pic]: ${URL}`, `[pic]: ${dataUrl}`))
        expect(result.filename).toBe("ceshi.md")
        expect(getLocalImageBlob).toHaveBeenCalledExactlyOnceWith(ID)
    })

    it("内嵌模式遇到图片缺失时拒绝生成不完整文件", async () => {
        vi.mocked(getLocalImageBlob).mockRejectedValue(new Error("本地图片不存在"))
        await expect(buildMarkdownExport(`![](${URL})`, "图")).rejects.toThrow("本地图片不存在")
    })

    it("无本地图片时按 UTF-8 原样导出 Markdown", async () => {
        const source = "# 中文\n\n![外链](https://example.com/a.png)\n"
        const result = await buildMarkdownExport(source, "文档")
        expect(result.filename).toBe("文档.md")
        expect(await result.blob.text()).toBe(source)
        expect(getLocalImageBlob).not.toHaveBeenCalled()
    })

    it("重复图片引用内嵌相同数据且只读取一次图片", async () => {
        vi.mocked(getLocalImageBlob).mockResolvedValue(new Blob(["image-content"], { type: "image/png" }))
        const result = await buildMarkdownExport(`![图](${URL})\n![图2](${URL} "标题")`, "ceshi")
        expect(result.filename).toBe("ceshi.md")
        const dataUrl = "data:image/png;base64,aW1hZ2UtY29udGVudA=="
        expect(await result.blob.text()).toBe(`![图](${dataUrl})\n![图2](${dataUrl} "标题")`)
        expect(getLocalImageBlob).toHaveBeenCalledTimes(1)
    })

    it("围栏代码、行内代码与相同 UUID 普通文本不被替换", () => {
        const source = `\`![图](${URL})\`\n\n\`\`\`md\n![图](${URL})\n\`\`\`\n\n${URL}\n\n![图](${URL})`
        expect(replaceLocalImageReferences(source, new Map([[ID, "image.png"]]))).toBe(source.slice(0, -URL.length - 1) + "image.png)")
    })

    it("Windows CRLF 换行保留, 围栏示例不替换", () => {
        const source = `\`\`\`md\r\n![图](${URL})\r\n\`\`\`\r\n\r\n![图](${URL})`
        expect(replaceLocalImageReferences(source, new Map([[ID, "image.png"]]))).toBe(source.slice(0, -URL.length - 1) + "image.png)")
    })

    it.each([`![图][pic]\n\n[pic]: ${URL}`, `![图][pic]\n\n[pic]:\n  ${URL}`, `![图](${URL})`, `<img src=${URL}>`, `<img alt="${URL}" src="${URL}">`])(
        "定位有效图片目的地址: %s",
        (source) => {
            const references = findLocalImageReferences(source)
            expect(references).toHaveLength(1)
            expect(source.slice(references[0].start, references[0].end)).toBe(URL)
            expect(references[0].start).toBe(source.lastIndexOf(URL))
        },
    )

    it("图片 alt 与目的地址相同时只改目的地址", () => {
        expect(replaceLocalImageReferences(`![${URL}](${URL})`, new Map([[ID, "a.png"]]))).toBe(`![${URL}](a.png)`)
    })

    it("代码示例中的本地图片不触发 IndexedDB", async () => {
        const result = await buildMarkdownExport(`\`\`\`md\n![](${URL})\n\`\`\``, "代码")
        expect(result.filename).toBe("代码.md")
        expect(getLocalImageBlob).not.toHaveBeenCalled()
    })

    it("图片丢失时明确拒绝导出", async () => {
        vi.mocked(getLocalImageBlob).mockRejectedValue(new Error("本地图片不存在"))
        await expect(buildMarkdownExport(`![](${URL})`, "图")).rejects.toThrow("本地图片不存在")
    })

    it("文件名消除路径与保留名称, 含空格和括号的标题不影响内嵌图片", async () => {
        expect(normalizeExportTitle("../CON: test?")).toBe(".._CON_ test_")
        expect(normalizeExportTitle("CON")).toBe("_CON")
        expect(normalizeExportTitle("... ")).toBe("文档")
        vi.mocked(getLocalImageBlob).mockResolvedValue(new Blob(["img"], { type: "image/jpeg" }))
        const result = await buildMarkdownExport(`![](${URL})`, "测试 (1)")
        expect(result.filename).toBe("测试 (1).md")
        expect(await result.blob.text()).toBe("![](data:image/jpeg;base64,aW1n)")
    })
})
