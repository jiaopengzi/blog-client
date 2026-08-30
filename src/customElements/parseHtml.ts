/*
 * FilePath    : blog-client-nuxt\src\customElements\parseHtml.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : html 解析为内容片段 (同构实现: 客户端 DOMParser / 服务端 node-html-parser)
 */

import { parse as parseHtmlWithNodeParser } from "node-html-parser"
import type { HTMLElement as ParsedHTMLElement, Node as ParsedNode } from "node-html-parser"

import { type PayKeyProps } from "@/components/common/pay-key"
import { type PlayerState } from "@/components/player"
import { getLoginViewState, type LoginViewState } from "@/customElementsMount/LoginView"
import { getPayKeyState } from "@/customElementsMount/PayKey"
import { getPowerBIState, type PowerBIState } from "@/customElementsMount/PowerBI"
import { getWechatCaptchaState, type WechatCaptchaState } from "@/customElementsMount/WechatCaptcha"
import { getVideoPlayerState } from "@/customElementsMount/VideoPlayer"

import { Names } from "./constants"

// 内容片段类型
export type Content = PlayerState | PayKeyProps | PowerBIState | WechatCaptchaState | LoginViewState | string

// 内容片段类型
export type ContentPart = { type: "html"; content: string; hasMaterial?: boolean } | { type: Names; content: Content; hasMaterial?: boolean }

// 检查标签名是否为自定义元素名
function isCustomElement(tagName: string): tagName is Names {
    return (Object.values(Names) as string[]).includes(tagName)
}

// 序列化节点为 HTML 字符串
function serializeNode(node: Node): string {
    if (node.nodeType === Node.ELEMENT_NODE) {
        return (node as HTMLElement).outerHTML
    } else if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent || ""
    }
    return ""
}

/**
 * @description: 转义代码块中的自定义元素标签, 避免 DOMParser 将其识别为真实节点
 * @param html 原始 HTML 字符串
 * @returns 返回仅在 <code> 和 <pre> 内转义了自定义元素标签的 HTML 字符串
 */
function escapeCustomElementsInCode(html: string): string {
    const customElementNames = Object.values(Names)

    if (customElementNames.length === 0) {
        return html
    }

    const codeBlockRegex = /<pre\b[^>]*>[\s\S]*?<\/pre>|<code\b[^>]*>[\s\S]*?<\/code>/gi
    const customElementTagRegex = new RegExp(`<\\/?(?:${customElementNames.join("|")})\\b[^>]*>`, "gi")

    return html.replace(codeBlockRegex, (block) => {
        const startTagMatch = block.match(/^<(pre|code)\b[^>]*>/i)
        const endTagMatch = block.match(/<\/(pre|code)>$/i)

        if (!startTagMatch || !endTagMatch) {
            return block
        }

        const startTag = startTagMatch[0]
        const endTag = endTagMatch[0]
        const innerContent = block.slice(startTag.length, block.length - endTag.length)
        const escapedContent = innerContent.replace(customElementTagRegex, (tag) => tag.replaceAll("<", "&lt;").replaceAll(">", "&gt;"))

        return `${startTag}${escapedContent}${endTag}`
    })
}

// 由于 marked 解析时会自动给自定义元素外层包裹 <p> 标签; 预处理 HTML, 剥离包裹自定义元素的 <p> 标签
function preprocessHtml(html: string): string {
    const names = Object.values(Names).join("|")
    // 匹配: <p>\s*(<xxx ...>...</xxx> 或 <xxx .../>)\s*</p>
    const regex = new RegExp(`<p\\b[^>]*>\\s*(<(${names})\\b[^>]*>(?:[\\s\\S]*?)<\\/\\2>|<(${names})\\b[^>]*\\/?>)\\s*<\\/p>`, "gi")
    return html.replace(regex, "$1") // 只保留内部的自定义元素
}

/**
 * @description: 判断当前 HTML 是否仍然包含真实自定义元素标签, 用于决定是否可以跳过整棵 DOMParser 拆分
 * @param html 预处理后的 HTML 字符串
 * @returns {boolean} 是否包含真实自定义元素标签
 */
function hasCustomElementMarkup(html: string): boolean {
    const names = Object.values(Names)

    if (names.length === 0) {
        return false
    }

    const regex = new RegExp(`<(?:${names.join("|")})\\b`, "i")
    return regex.test(html)
}

// 解析 HTML 字符串为 HTMLElement
export function parseHtml(html: string): HTMLElement {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    return doc.body
}

/**
 * @description: 客户端解析路径 (DOMParser, 与旧 SPA 实现一致)
 * 逻辑从原 parseHtmlToContentParts 等价移植: 遍历 body 顶层子节点, 在自定义元素边界拆分片段,
 * 并按上下文为自定义元素节点补齐组件状态
 * @param cleanedHtml 已完成转义与 <p> 剥离的 HTML 字符串
 * @param postId 当前文章 ID
 * @param isAdminVideo 是否为管理员视频预览场景
 * @returns 返回解析后的内容片段数组
 */
function parsePartsWithDomParser(cleanedHtml: string, postId: string, isAdminVideo: boolean = false): ContentPart[] {
    const body = parseHtml(cleanedHtml)

    // 遍历子节点, 分割为内容片段
    const parts: ContentPart[] = []
    const buffer: Node[] = []

    for (const child of Array.from(body.childNodes)) {
        const tagName = (child as Element).tagName?.toLowerCase()

        if (child.nodeType === Node.ELEMENT_NODE && isCustomElement(tagName)) {
            // flush buffer
            if (buffer.length > 0) {
                const htmlStr = buffer.map(serializeNode).join("")
                if (htmlStr.trim() !== "") {
                    parts.push({ type: "html", content: htmlStr })
                }
                buffer.length = 0
            }

            if (tagName === Names.VideoPlayer) {
                const content = getVideoPlayerState(child as HTMLElement, postId, isAdminVideo).state
                parts.push({ type: tagName as Names, content })
                continue
            }

            if (tagName === Names.PayKey) {
                const content = getPayKeyState(child as HTMLElement).state
                parts.push({ type: tagName as Names, content })
                continue
            }
            if (tagName === Names.PayDownload || tagName === Names.PayRead || tagName === Names.PayVideo) {
                const content = (child as HTMLElement).innerHTML
                const hasMaterial = tagName === Names.PayVideo && (child as HTMLElement).hasAttribute("has-material")
                parts.push({ type: tagName as Names, content, ...(hasMaterial ? { hasMaterial: true } : {}) })
                continue
            }

            if (tagName === Names.PowerBi) {
                const state = getPowerBIState(child as HTMLElement)
                parts.push({ type: tagName as Names, content: state })
                continue
            }

            if (tagName === Names.WechatCaptcha) {
                const state = getWechatCaptchaState(child as HTMLElement)
                parts.push({ type: tagName as Names, content: state })
                continue
            }

            if (tagName === Names.LoginView) {
                const state = getLoginViewState(child as HTMLElement)
                parts.push({ type: tagName as Names, content: state })
                continue
            }

            parts.push({
                type: tagName as Names,
                content: (child as HTMLElement).outerHTML,
            })
        } else {
            buffer.push(child)
        }
    }

    // 如果 buffer 有剩余, 则作为普通 HTML 片段加入
    if (buffer.length > 0) {
        const htmlStr = buffer.map(serializeNode).join("")
        if (htmlStr.trim() !== "") {
            parts.push({ type: "html", content: htmlStr })
        }
    }

    return parts
}

/**
 * @description: 服务端解析路径 (node-html-parser, SSR 无 DOMParser 时使用)
 * 目标是与客户端产出完全一致的"片段结构" (html 片段与自定义元素片段的顺序、个数),
 * 保证 hydration 的 v-for 节点序列一致; 自定义元素片段在模板中统一由 ClientOnly 渲染,
 * 其真实组件状态由客户端水合后经 DOMParser 路径重新解析, 因此此处仅放置占位值
 * html 片段按节点 range 从源字符串切片, 与输入逐字节一致
 * @param cleanedHtml 已完成转义与 <p> 剥离的 HTML 字符串
 * @returns 返回与客户端路径结构一致的解析后的内容片段数组
 */
function parsePartsWithNodeParser(cleanedHtml: string): ContentPart[] {
    const root = parseHtmlWithNodeParser(cleanedHtml)

    const parts: ContentPart[] = []
    let bufferStart = -1 // html 缓冲区在源字符串中的起始下标
    let bufferEnd = -1 // html 缓冲区在源字符串中的结束下标(不含)

    // 将当前缓冲的源字符串区间输出为 html 片段
    const flushBuffer = () => {
        if (bufferStart < 0) {
            return
        }

        const htmlStr = cleanedHtml.slice(bufferStart, bufferEnd)
        if (htmlStr.trim() !== "") {
            parts.push({ type: "html", content: htmlStr })
        }
        bufferStart = -1
        bufferEnd = -1
    }

    for (const child of root.childNodes as ParsedNode[]) {
        const isElementNode = child.nodeType === 1
        const tagName = (child.rawTagName || "").toLowerCase()

        if (isElementNode && isCustomElement(tagName)) {
            flushBuffer()

            const hasMaterial = tagName === Names.PayVideo && (child as ParsedHTMLElement).hasAttribute("has-material")
            // SSR 占位值: 自定义元素片段仅用于结构对齐, 客户端水合后重新解析真实状态
            parts.push({ type: tagName as Names, content: "", ...(hasMaterial ? { hasMaterial: true } : {}) })
            continue
        }

        // 普通节点(元素/文本/注释)进入 html 缓冲区, 与客户端 DOMParser 的 buffer 语义一致
        const [start, end] = child.range
        if (start === undefined || end === undefined) {
            continue
        }

        if (bufferStart < 0) {
            bufferStart = start
        }
        bufferEnd = end
    }

    flushBuffer()

    return parts
}

/**
 * @description: 解析 HTML 字符串为内容片段数组, 并按上下文为视频节点补齐播放器状态
 * 双端同构: 客户端走 DOMParser 路径 (与旧 SPA 一致), 服务端走 node-html-parser 路径
 * (仅保证片段结构与客户端一致, 供 SSR 直出正文与 hydration 对齐)
 * @param html HTML 字符串
 * @param postId 当前文章 ID
 * @param isAdminVideo 是否为管理员视频预览场景
 * @returns 返回解析后的内容片段数组
 */
export function parseHtmlToContentParts(html: string, postId: string, isAdminVideo: boolean = false): ContentPart[] {
    // 先转义代码块中的自定义元素, 再预处理
    const escapedHtml = escapeCustomElementsInCode(html)
    const cleanedHtml = preprocessHtml(escapedHtml)

    // 不含真实自定义元素时直接返回单段 html, 避免无收益的整棵 DOMParser 解析
    if (!hasCustomElementMarkup(cleanedHtml)) {
        return cleanedHtml.trim() === "" ? [] : [{ type: "html", content: cleanedHtml }]
    }

    // SSR 无 DOMParser: 走服务端同构路径, 片段结构与客户端一致(自定义元素在模板中由 ClientOnly 渲染)
    if (typeof DOMParser === "undefined") {
        return parsePartsWithNodeParser(cleanedHtml)
    }

    return parsePartsWithDomParser(cleanedHtml, postId, isAdminVideo)
}
