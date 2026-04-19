/**
 * FilePath    : blog-client\src\customElements\parseHtml.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : html 解析为内容片段
 */

import { type PayKeyProps } from "@/components/common/pay-key"
import { type PlayerState } from "@/components/player"
import { getLoginViewState, type LoginViewState } from "@/customElementsMount/LoginView"
import { getPayKeyState } from "@/customElementsMount/PayKey"
import { getPowerBIState, type PowerBIState } from "@/customElementsMount/PowerBI"
import { getWechatCaptchaState, type WechatCaptchaState } from "@/customElementsMount/WechatCaptcha"
import { getVideoPlayerState } from "@/customElementsMount/VideoPlayer"

import { Names } from "./registerCustomElements"

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

// 由于 marked 解析时会自动给自定义元素外层包裹 <p> 标签; 预处理 HTML, 剥离包裹自定义元素的 <p> 标签
function preprocessHtml(html: string): string {
    const names = Object.values(Names).join("|")
    // 匹配：<p>\s*(<xxx ...>...</xxx> 或 <xxx .../>)\s*</p>
    const regex = new RegExp(`<p\\b[^>]*>\\s*(<(${names})\\b[^>]*>(?:[\\s\\S]*?)<\\/\\2>|<(${names})\\b[^>]*\\/?>)\\s*<\\/p>`, "gi")
    return html.replace(regex, "$1") // 只保留内部的自定义元素
}

// 解析 HTML 字符串为 HTMLElement
export function parseHtml(html: string): HTMLElement {
    // 解析 HTML
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    return doc.body
}

/**
 * @description: 解析 HTML 字符串为内容片段数组, 并按上下文为视频节点补齐播放器状态。
 * @param html HTML 字符串。
 * @param postId 当前文章 ID。
 * @param isAdminVideo 是否为管理员视频预览场景。
 * @returns 返回解析后的内容片段数组。
 */
export function parseHtmlToContentParts(html: string, postId: string, isAdminVideo: boolean = false): ContentPart[] {
    // 先预处理
    const cleanedHtml = preprocessHtml(html)

    // 解析 HTML
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
