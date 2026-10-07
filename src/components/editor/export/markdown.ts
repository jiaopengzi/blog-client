/*
 * FilePath    : blog-client\src\components\editor\export\markdown.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Markdown 原文导出, 保护公式与 HTML 原始文本, 按源码位置一次拼接内嵌图片.
 */

import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { Lexer, type TokenizerExtension } from "marked"
import markedKatex from "marked-katex-extension"
import { parse } from "node-html-parser"

import { getLocalImageBlob } from "@/utils/mdLocalImage"

// 图片有 100 MB 总量上限, 顺序读取避免并发产生多份二进制峰值.
/* oxlint-disable eslint/no-await-in-loop */

const LOCAL_SOURCE = /^md-img:([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/i

// 复用渲染器同一依赖的公式 tokenizer, 不复制 KaTeX 分隔符正则或执行公式渲染.
const katexTokenizers = markedKatex().extensions!.filter((extension): extension is TokenizerExtension => "tokenizer" in extension)
const katexLexer = new Lexer()
/**
 * createExportParser 在编辑器语法上增加公式保护, 用完整输入识别跨空行的块公式.
 * @param source - 已归一为 LF 的源码, 用于依赖 tokenizer 的前瞻匹配.
 * @returns 保留所有源码坐标的 Markdown 解析器.
 */
function createExportParser(source: string) {
    return markdown({
        base: markdownLanguage,
        extensions: {
            defineNodes: ["ExportMath"],
            parseBlock: [
                {
                    name: "ExportBlockMath",
                    before: "LinkReference",
                    /** 先确认公式完整闭合再消费行, 避免未闭合美元文本隐藏后续图片. */
                    parse(context, line) {
                        if (line.next !== 36) return false
                        const start = context.lineStart + line.pos
                        const tokenizer = katexTokenizers.find((extension) => extension.level === "block")!
                        let candidate = source.slice(start)
                        const quoteDepth = line.text.slice(0, line.pos).match(/>/g)?.length ?? 0
                        const lineEnds = new Map<number, number>()
                        if (quoteDepth > 0) {
                            // 引用标记属于容器而非公式; 去除每行相同层数的 > 后匹配, 再映射回原文行尾.
                            const parts: string[] = []
                            let rawOffset = start
                            let normalizedLength = 0
                            for (const [index, rawLine] of candidate.split("\n").entries()) {
                                let content = rawLine
                                let depth = 0
                                if (index > 0) {
                                    while (depth < quoteDepth && /^ {0,3}>[ \t]?/.test(content)) {
                                        content = content.replace(/^ {0,3}>[ \t]?/, "")
                                        depth++
                                    }
                                    if (depth !== quoteDepth) break
                                }
                                rawOffset += rawLine.length
                                const newline = source[rawOffset] === "\n" ? "\n" : ""
                                parts.push(content + newline)
                                normalizedLength += content.length + newline.length
                                rawOffset += newline.length
                                lineEnds.set(normalizedLength, rawOffset)
                            }
                            candidate = parts.join("")
                        }
                        const token = tokenizer.tokenizer.call({ lexer: katexLexer }, candidate, [])
                        if (!token) return false
                        const end = quoteDepth > 0 ? lineEnds.get(token.raw.length) : start + token.raw.length
                        if (end === undefined) return false
                        while (context.lineStart < end && context.nextLine()) {
                            /* 由匹配范围决定消费行数. */
                        }
                        context.addElement(context.elt("ExportMath", start, end))
                        return true
                    },
                },
            ],
            parseInline: [
                {
                    name: "ExportMath",
                    /** 公式整体作为不透明节点, 其中类似图片的文本保持原文. */
                    parse(context, next, position) {
                        if (next !== 36) return -1
                        // 与 marked-katex-extension 默认标准模式的 start 边界一致.
                        if (position > context.offset && context.char(position - 1) !== 32 && context.char(position - 1) !== 10) return -1
                        const source = context.slice(position, context.end)
                        for (const extension of katexTokenizers) {
                            const token = extension.tokenizer.call({ lexer: katexLexer }, source, [])
                            if (token) return context.addElement(context.elt("ExportMath", position, position + token.raw.length))
                        }
                        return -1
                    },
                },
            ],
        },
    }).language.parser
}

/** 图片目的地址在未改写源码中的位置, 可在读取图片后复用而无需再次解析. */
interface LocalImageReference {
    id: string
    start: number
    end: number
}

/**
 * normalizeExportTitle 生成跨平台可用的文件名, 防止路径穿越及 Windows 保留名称.
 * @param title - 文档标题, 不包含导出扩展名.
 * @returns 安全文件名, 空标题回退为文档.
 */
export function normalizeExportTitle(title: string): string {
    let name = title
        // oxlint-disable-next-line eslint/no-control-regex -- 文件名必须去除控制字符.
        .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "_")
        .trim()
        .replace(/[. ]+$/g, "")
    // Linux/macOS 常见文件系统按 UTF-8 字节限制名称, 按字符截断会让中文/emoji 超长或截断代理对.
    const encoder = new TextEncoder()
    let bytes = 0
    name = Array.from(name)
        .filter((character) => (bytes += encoder.encode(character).length) <= 240)
        .join("")
        .replace(/[. ]+$/g, "")
    if (!name || /^\.+$/.test(name)) name = "文档"
    if (/^(con|prn|aux|nul|com[1-9¹²³]|lpt[1-9¹²³])(?:\.|$)/i.test(name)) name = `_${name}`
    return name
}

/**
 * findLocalImageReferences 通过编辑器语法树的源码位置定位图片, 排除代码、转义文本与 HTML 注释.
 * @param markdown - 编辑器当前源码.
 * @returns 引用 id 与对应源码范围, 引用式图片定位到定义行.
 */
export function findLocalImageReferences(markdown: string): LocalImageReference[] {
    if (!/md-img:/i.test(markdown)) return []
    // 解析器以 LF 分行; 建立偏移映射后恢复原坐标, 同时保留 Windows CRLF 与旧式 CR 换行.
    if (markdown.includes("\r")) {
        const offsets: number[] = []
        let normalized = ""
        for (let index = 0; index < markdown.length; index++) {
            offsets.push(index)
            if (markdown[index] === "\r") {
                normalized += "\n"
                if (markdown[index + 1] === "\n") index++
            } else normalized += markdown[index]
        }
        offsets.push(markdown.length)
        return findLocalImageReferences(normalized).map((reference) => ({ id: reference.id, start: offsets[reference.start], end: offsets[reference.end] }))
    }
    const result = new Map<number, LocalImageReference>()
    const labels = new Set<string>()
    const definitions = new Map<string, { from: number; to: number }>()
    let rawTextEnd = 0

    /** 记录真实目的地址, 只去除语法上的尖括号, 不改变原文其它位置. */
    function addDestination(from: number, to: number): void {
        if (markdown[from] === "<" && markdown[to - 1] === ">") {
            from++
            to--
        }
        const match = markdown.slice(from, to).match(LOCAL_SOURCE)
        if (match) result.set(from, { id: match[1].toLowerCase(), start: from, end: to })
    }

    createExportParser(markdown)
        .parse(markdown)
        .iterate({
            enter(node) {
                // 段落可能从原始文本内部开始并跨过结束标签, 仍需遍历其后半段的真实图片.
                if (node.from < rawTextEnd && node.to <= rawTextEnd) return false
                if (node.name === "Image") {
                    const destination = node.node.getChild("URL")
                    if (destination) addDestination(destination.from, destination.to)
                    else {
                        const label = node.node.getChild("LinkLabel")
                        const marks = node.node.getChildren("LinkMark")
                        // 全引用、折叠引用和快捷引用都按标签关联定义, 不按相同图片 id 修改无关定义.
                        const text =
                            label && label.to - label.from > 2 ? markdown.slice(label.from + 1, label.to - 1) : markdown.slice(node.from + 2, marks[1].from)
                        labels.add(normalizeReferenceLabel(text))
                    }
                }
                if (node.name === "LinkReference") {
                    const label = node.node.getChild("LinkLabel")
                    const destination = node.node.getChild("URL")
                    if (label && destination) {
                        const key = normalizeReferenceLabel(markdown.slice(label.from + 1, label.to - 1))
                        // CommonMark 中重复定义以第一条为准, 未被图片使用的普通链接保持原文.
                        if (!definitions.has(key)) definitions.set(key, destination)
                    }
                }
                if (node.name === "HTMLTag" || node.name === "HTMLBlock") {
                    const html = markdown.slice(node.from, node.to)
                    // 行内 HTMLTag 是单独的标签节点; 保护跨节点/段落的原始文本, 直到浏览器识别的结束标签.
                    const rawTextTag = node.name === "HTMLTag" && html.match(/^<(script|style|textarea|title)\b/i)
                    if (rawTextTag) {
                        const closingTag = new RegExp(`</${rawTextTag[1]}(?=[\\s/>])[^>]*>`, "gi")
                        closingTag.lastIndex = node.to
                        const closing = closingTag.exec(markdown)
                        rawTextEnd = closing ? closing.index + closing[0].length : markdown.length
                        return false
                    }
                    const root = parse(html, { blockTextElements: { script: true, style: true, pre: true, textarea: true, title: true } })
                    for (const img of root.querySelectorAll("img")) {
                        const tag = html.slice(img.range[0], img.range[1])
                        // 逐属性匹配防止 data-src、alt 中的 src 字样与引号内的 > 被当作真正的图片地址.
                        const attributes = /([^\s=<>/]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g
                        attributes.lastIndex = tag.match(/^<img\b/i)?.[0].length ?? tag.length
                        let attribute: RegExpExecArray | null
                        while ((attribute = attributes.exec(tag))) {
                            if (attribute[1].toLowerCase() !== "src") continue
                            const value = attribute[2] ?? attribute[3] ?? attribute[4] ?? ""
                            const offset = attribute[0].indexOf("=") + 1
                            const valueOffset = attribute[0].slice(offset).search(/[^\s"']/)
                            if (valueOffset >= 0) {
                                const start = node.from + img.range[0] + attribute.index + offset + valueOffset
                                addDestination(start, start + value.length)
                            }
                            break
                        }
                    }
                    return false
                }
            },
        })
    for (const label of labels) {
        const destination = definitions.get(label)
        if (destination) addDestination(destination.from, destination.to)
    }
    // oxlint-disable-next-line unicorn/no-array-sort -- 数组刚创建, 原位排序兼容尚无 toSorted 的浏览器.
    return Array.from(result.values()).sort((a, b) => a.start - b.start)
}

/** 将引用标签按 CommonMark 的空白折叠与大小写规则归一, 返回用于关联定义的键. */
function normalizeReferenceLabel(label: string): string {
    return label.trim().replace(/\s+/g, " ").toUpperCase()
}

/**
 * replaceLocalImageReferences 按源码范围一次拼接引用, 保留其余文本与图片标题.
 * @param markdown - Markdown 源码.
 * @param replacements - 图片 id 到目标地址的映射.
 * @returns 改写后的 Markdown.
 */
export function replaceLocalImageReferences(markdown: string, replacements: Map<string, string>): string {
    return replaceReferences(markdown, replacements, findLocalImageReferences(markdown))
}

/**
 * replaceReferences 复用已有源码坐标, 避免每张图片都复制此前嵌入的大段 data URL.
 * @param markdown - 尚未改写的原文.
 * @param replacements - 图片 id 与目标地址映射.
 * @param references - 按起始位置递增的引用.
 * @returns 仅替换存在目标地址的图片引用后的完整原文.
 */
function replaceReferences(markdown: string, replacements: Map<string, string>, references: LocalImageReference[]): string {
    const parts: string[] = []
    let cursor = 0
    for (const reference of references) {
        const target = replacements.get(reference.id)
        if (!target) continue
        parts.push(markdown.slice(cursor, reference.start), target)
        cursor = reference.end
    }
    parts.push(markdown.slice(cursor))
    return parts.join("")
}

/**
 * buildMarkdownExport 构建内嵌本地图片的单文件 Markdown; 原文与 IndexedDB 均不修改.
 * @param markdown - 当前完整源码.
 * @param title - 文档标题.
 * @returns 内嵌图片的正文 Blob 与文件名; 图片缺失或读取失败时拒绝导出.
 */
export async function buildMarkdownExport(markdown: string, title: string): Promise<MarkdownExport> {
    const name = normalizeExportTitle(title)
    const references = findLocalImageReferences(markdown)
    const ids = [...new Set(references.map((reference) => reference.id))]
    const replacements = new Map<string, string>()
    for (const id of ids) {
        const blob = await getLocalImageBlob(id)
        // 直接下载单文件无需目录授权, 避免受保护文件夹限制; 重复引用只读取一次 IndexedDB.
        replacements.set(id, await readImageDataUrl(blob))
    }
    return {
        blob: new Blob([replaceReferences(markdown, replacements, references)], { type: "text/markdown;charset=utf-8" }),
        filename: `${name}.md`,
    }
}

/**
 * readImageDataUrl 将本地图片编码进 Markdown, 不依赖会话内的 blob URL.
 * @param blob - IndexedDB 中的完整图片二进制.
 * @returns data URL; 编码失败或读取中止时拒绝导出.
 */
function readImageDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.addEventListener("load", () => resolve(String(reader.result)))
        reader.addEventListener("error", () => reject(reader.error ?? new Error("本地图片读取失败")))
        reader.addEventListener("abort", () => reject(new Error("本地图片读取已中止")))
        reader.readAsDataURL(blob)
    })
}

/** 本地图片随正文内嵌, 下载结果不依赖额外文件. */
export interface MarkdownExport {
    blob: Blob
    filename: string
}
