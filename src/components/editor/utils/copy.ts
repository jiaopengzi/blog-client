/**
 * FilePath    : blog-client\src\components\editor\utils\copy.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 复制流水线与 KaTeX 图片捕获
 */

import { snapdom } from "@zumer/snapdom"

import { copyHtml } from "@/utils/clipboard"
import { escapeWhitespaceInHtmlContent } from "@/utils/escape"
import { HasParentByClass } from "@/utils/getParentByClass"
import { MessageUtil } from "@/utils/message"
import { htmlTagReplace } from "@/utils/tagReplace"

import { applyInlineStylesInBatches, getCssStyleRules, getSortedStyleSheets } from "./css-inline"
import type { KatexCaptureContext, KatexImageCacheEntry } from "../types"

// katex 锚点上下内边距配置(单位: px, 根据实际情况调整, 主要是为了避免部分字形被 snapdom 裁掉)
export const KATEX_CAPTURE_PADDING = {
    inline: {
        top: 6,
        bottom: 6,
    },
    display: {
        top: 8,
        bottom: 8,
    },
} as const

// 拷贝流水线每 yield 的间隔时间
export const COPY_PIPELINE_YIELD_INTERVAL = 20

// katex 图片缓存，键为公式的 HTML 内容和截图尺寸的 JSON 字符串，值为包含图片 src 和尺寸信息的对象
export const katexImageCache = new Map<string, KatexImageCacheEntry>()

/**
 * @description: 将 katex 公式转成图片 为了微信预览
 * @param container 预览容器
 * @param className katex 公式根节点的类名
 */
export async function katexToImage(container: HTMLElement, className: string = "katex"): Promise<void> {
    const katexElements = getKatexElements(container, className)

    await waitForDocumentFontsReady()

    await katexElements.reduce<Promise<void>>((previousTask, katex, index) => {
        return previousTask.then(async () => {
            if (index > 0 && index % COPY_PIPELINE_YIELD_INTERVAL === 0) {
                await waitForNextRenderFrame()
            }

            const captureContext = createKatexCaptureContext(katex)

            try {
                const cacheKey = getKatexImageCacheKey(katex, captureContext)
                const cachedImage = katexImageCache.get(cacheKey)
                const img = cachedImage ? createKatexImageFromCache(cachedImage) : await createKatexImageFromCapture(captureContext)

                if (!cachedImage) {
                    cacheKatexImage(cacheKey, img, captureContext)
                }

                applyKatexImageStyle(img, captureContext)
                katex.parentNode?.replaceChild(img, katex)
            } finally {
                captureContext.wrapper.remove()
            }
        })
    }, Promise.resolve())
}

/**
 * @description: 等待当前文档字体资源进入稳定状态, 降低批量公式截图时的排版抖动.
 * @return void.
 */
export async function waitForDocumentFontsReady(): Promise<void> {
    if (typeof document === "undefined" || !("fonts" in document)) {
        return
    }

    await document.fonts.ready
}

/**
 * @description: 等待下一帧渲染时机, 用于在批量复制流程中主动让出主线程.
 * @return 下一帧到来后结束的 Promise.
 */
export function waitForNextRenderFrame(): Promise<void> {
    return new Promise((resolve) => {
        if (typeof window !== "undefined" && "requestAnimationFrame" in window) {
            window.requestAnimationFrame(() => resolve())
            return
        }

        setTimeout(resolve, 0)
    })
}

/**
 * @description: 获取容器中的所有 KaTeX 根节点.
 * @param container 预览容器.
 * @param className KaTeX 根节点类名.
 * @return KaTeX 根节点数组.
 */
export function getKatexElements(container: HTMLElement, className: string): HTMLElement[] {
    return Array.from(container.getElementsByClassName(className)).filter((element): element is HTMLElement => element instanceof HTMLElement)
}

/**
 * @description: 构建 KaTeX 截图所需的离屏包裹容器, 并计算最终截图尺寸.
 * @param katex KaTeX 根节点.
 * @return 截图上下文.
 */
export function createKatexCaptureContext(katex: HTMLElement): KatexCaptureContext {
    const capturePadding = getKatexCapturePadding(HasParentByClass(katex, "katex-display"))

    /**
     * KaTeX 的部分字形会在视觉上超出元素本身的高度.
     * 直接按原节点尺寸截图时, snapdom 会把这些超出的部分裁掉.
     * 这里通过临时包裹容器补一层上下安全边距, 再对包裹容器截图.
     */
    const wrapper = document.createElement("div")
    const captureClone = katex.cloneNode(true) as HTMLElement

    applyKatexCaptureContextStyle(katex, wrapper, captureClone)

    wrapper.style.position = "fixed"
    wrapper.style.left = "-99999px"
    wrapper.style.top = "0"
    wrapper.style.display = "inline-block"
    wrapper.style.boxSizing = "content-box"
    wrapper.style.paddingTop = `${capturePadding.top}px`
    wrapper.style.paddingBottom = `${capturePadding.bottom}px`
    wrapper.style.margin = "0"
    wrapper.style.border = "0"
    wrapper.style.background = "transparent"
    wrapper.style.overflow = "visible"
    wrapper.style.pointerEvents = "none"

    captureClone.style.margin = "0"
    captureClone.style.overflow = "visible"
    wrapper.appendChild(captureClone)
    document.body.appendChild(wrapper)

    const captureRect = wrapper.getBoundingClientRect()

    return {
        wrapper,
        width: Math.max(1, Math.ceil(captureRect.width)),
        height: Math.max(1, Math.ceil(captureRect.height)),
    }
}

/**
 * @description: 将原始 KaTeX 根节点的关键计算样式冻结到离屏截图上下文中, 避免脱离预览容器后布局失真.
 * @param katex 原始 KaTeX 根节点.
 * @param wrapper 离屏截图包裹容器.
 * @param captureClone 用于截图的 KaTeX 克隆节点.
 * @return void.
 */
export function applyKatexCaptureContextStyle(katex: HTMLElement, wrapper: HTMLDivElement, captureClone: HTMLElement): void {
    const computedStyle = getComputedStyle(katex)
    const inheritedProperties = ["font-size", "line-height", "font-family", "font-weight", "font-style", "letter-spacing", "color"]

    inheritedProperties.forEach((property) => {
        const value = computedStyle.getPropertyValue(property)
        if (!value) {
            return
        }

        wrapper.style.setProperty(property, value)
        captureClone.style.setProperty(property, value)
    })
}

/**
 * @description: 基于离屏截图上下文生成 KaTeX 图片.
 * @param captureContext KaTeX 截图上下文.
 * @return 截图生成的图片元素.
 */
export async function createKatexImageFromCapture(captureContext: KatexCaptureContext): Promise<HTMLImageElement> {
    const snap = await snapdom(captureContext.wrapper, {
        embedFonts: true,
    })

    return snap.toPng({
        scale: 3,
        backgroundColor: "#ffffff00",
        width: captureContext.width,
        height: captureContext.height,
    })
}

/**
 * @description: 应用 KaTeX 截图图片的展示样式.
 * @param img 截图得到的图片元素.
 * @param captureContext KaTeX 截图上下文.
 * @return void.
 */
export function applyKatexImageStyle(img: HTMLImageElement, captureContext: KatexCaptureContext): void {
    img.style.width = `${captureContext.width}px`
    img.style.height = `${captureContext.height}px`
    img.style.display = "inline-block"
    img.style.verticalAlign = "bottom"
    img.style.objectFit = "contain"
    img.style.margin = "0"
    img.style.padding = "0"
}

/**
 * @description: 生成 KaTeX 图片缓存键, 复用相同公式与尺寸的截图结果.
 * @param katex KaTeX 根节点.
 * @param captureContext 当前截图上下文.
 * @return 缓存键字符串.
 */
export function getKatexImageCacheKey(katex: HTMLElement, captureContext: KatexCaptureContext): string {
    // 使用公式 DOM 片段和最终截图尺寸作为缓存键, 避免同一公式在重复预生成时反复截图.
    return JSON.stringify({
        html: katex.innerHTML,
        className: katex.className,
        width: captureContext.width,
        height: captureContext.height,
    })
}

/**
 * @description: 根据缓存的截图结果恢复图片节点.
 * @param cacheEntry 已缓存的 KaTeX 图片信息.
 * @return 可直接替换公式节点的图片元素.
 */
export function createKatexImageFromCache(cacheEntry: KatexImageCacheEntry): HTMLImageElement {
    const img = document.createElement("img")
    img.src = cacheEntry.src
    img.width = cacheEntry.width
    img.height = cacheEntry.height
    return img
}

/**
 * @description: 缓存 KaTeX 图片结果, 供后续复制预生成复用.
 * @param cacheKey 当前公式的缓存键.
 * @param img 已生成的图片节点.
 * @param captureContext 当前截图上下文.
 * @return void.
 */
export function cacheKatexImage(cacheKey: string, img: HTMLImageElement, captureContext: KatexCaptureContext): void {
    if (!img.src) {
        return
    }

    katexImageCache.set(cacheKey, {
        src: img.src,
        width: captureContext.width,
        height: captureContext.height,
    })
}

/**
 * @description: 获取 KaTeX 截图时使用的上下安全边距配置.
 * @param isKatexDisplay 是否为行间公式.
 * @return 上下安全边距.
 */
export function getKatexCapturePadding(isKatexDisplay: boolean): { top: number; bottom: number } {
    return isKatexDisplay ? KATEX_CAPTURE_PADDING.display : KATEX_CAPTURE_PADDING.inline
}

/**
 * @description: 重置行间公式的字号缩放, 便于重新测量实际宽度.
 * @param formulaElement KaTeX 行间公式元素.
 * @return void.
 */
export function resetDisplayKatexFontSize(formulaElement: HTMLElement): void {
    formulaElement.style.removeProperty("font-size")
}

/**
 * @description: 按父容器宽度缩放超长行间公式, 避免在任意窄容器中被截断.
 * 参考:https://kexue.fm/archives/10474
 * @param container 预览容器.
 * @return void.
 */
export function scaleDisplayKatexByFontSize(container: HTMLElement): void {
    const formulaElements = container.querySelectorAll(".katex-display > .katex")

    formulaElements.forEach((formulaElement) => {
        if (!(formulaElement instanceof HTMLElement)) return

        resetDisplayKatexFontSize(formulaElement)

        const displayElement = formulaElement.parentElement
        const parentWidth = displayElement?.parentElement?.clientWidth || displayElement?.clientWidth || 0
        const formulaWidth = formulaElement.offsetWidth

        if (!parentWidth || !formulaWidth || formulaWidth <= parentWidth) {
            return
        }

        const fontSizePercent = Number(((parentWidth * 100) / formulaWidth).toFixed(2))
        formulaElement.style.setProperty("font-size", `${fontSizePercent}%`)
    })
}

/**
 * @description: 创建承载克隆节点的离屏临时容器, 用于应用样式与执行截图转换.
 * @param clonedElement 克隆后的预览节点.
 * @return 离屏临时容器.
 */
export function createDetachedCopyContainer(clonedElement: HTMLElement): HTMLDivElement {
    const container = document.createElement("div")

    container.style.position = "fixed"
    container.style.left = "-99999px"
    container.style.top = "0"
    container.style.opacity = "0"
    container.style.pointerEvents = "none"
    container.style.overflow = "hidden"
    container.appendChild(clonedElement)
    document.body.appendChild(container)

    return container
}

/**
 * @description: 判断当前页面是否为浏览器认可的本地可信访问地址.
 * @param hostname 当前页面主机名.
 * @return 是否为 localhost 或本地回环地址.
 */
export function isTrustedLocalHost(hostname: string): boolean {
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
}

/**
 * @description: 根据复制失败原因生成更友好的提示文案.
 * @param err 复制流程抛出的错误.
 * @return 面向用户的错误提示.
 */
export function getClipboardFriendlyErrorMessage(err: unknown): string {
    const hostname = typeof window !== "undefined" ? window.location.hostname : ""
    const isSecureContextUnavailable = typeof window !== "undefined" && !window.isSecureContext && !isTrustedLocalHost(hostname)

    if (isSecureContextUnavailable) {
        return "复制失败，当前页面不是安全环境。请改用 HTTPS，localhost 或 127.0.0.1 后重试。"
    }

    if (err instanceof DOMException && err.name === "NotAllowedError") {
        return "复制失败，浏览器拦截了剪贴板访问。请允许剪贴板权限后重试。"
    }

    if (err instanceof Error && err.message.includes("Modern clipboard API not supported")) {
        return "复制失败，当前浏览器对富文本复制支持不足。建议更换 Chromium 内核浏览器后重试。"
    }

    return "复制失败，请稍后重试。如仍失败，请改用 HTTPS，localhost 或 127.0.0.1 访问。"
}

/**
 * @description: 复制带有自定义样式的内容(不修改原元素)
 * @param element 要复制的元素
 */
export async function copyWithCustomStyle(element: HTMLElement): Promise<void> {
    try {
        const html = await prepareCopyWithCustomStyle(element)
        await writePreparedHtmlToClipboard(html)
    } catch (err) {
        console.error("无法复制内容", err)
        MessageUtil.error(getClipboardFriendlyErrorMessage(err), 8000)
    }
}

/**
 * @description: 预先生成带有内联样式与 KaTeX 图片的 HTML, 便于缓存复制结果.
 * @param element 要复制的元素.
 * @return 处理后的 HTML 字符串.
 */
export async function prepareCopyWithCustomStyle(element: HTMLElement): Promise<string> {
    // 克隆元素(深拷贝), 保证不修改原元素
    const clonedElement = element.cloneNode(true) as HTMLElement

    // 创建临时容器, 仅用于确保 clonedElement 在 DOM 中以正确应用样式, 但不显示
    const container = createDetachedCopyContainer(clonedElement)

    let html = ""

    try {
        // 将 KaTeX 公式转换为图片, 避免脱离预览容器后样式失真
        await katexToImage(clonedElement)

        // 获取用户样式表
        const cssStyleSheets = getSortedStyleSheets()
        const cssStyleRules = getCssStyleRules(cssStyleSheets)

        // 这里保留逐属性写入, 因为批量 setAttribute("style") 会明显放大最终 HTML 体积.
        await applyInlineStylesInBatches(element, clonedElement, cssStyleRules, waitForNextRenderFrame)

        // 提取 HTML
        html = clonedElement.innerHTML
    } finally {
        // 移除临时容器
        document.body.removeChild(container)
    }

    const normalizedHtml = normalizePreparedCopyHtml(html)

    return normalizedHtml
}

/**
 * @description: 将已准备好的 HTML 写入剪贴板.
 * @param html 已处理完成的 HTML 内容.
 * @return void.
 */
export async function writePreparedHtmlToClipboard(html: string): Promise<void> {
    try {
        const copyResult = await copyHtml(html)

        if (copyResult.method === "execCommand") {
            MessageUtil.warning("内容已复制到剪贴板，当前为兼容复制模式，富文本样式可能受浏览器限制。建议使用 HTTPS, localhost 或 127.0.0.1。", 8000)
            return
        }

        MessageUtil.success("内容已复制到剪贴板")
    } catch (err) {
        console.error("无法复制内容", err)
        MessageUtil.error(getClipboardFriendlyErrorMessage(err), 8000)
    }
}

/**
 * @description: 归一化复制前的 HTML 内容, 兼容微信编辑器对代码块和链接标签的要求.
 * @param html 已准备好的原始 HTML.
 * @return 归一化后的 HTML 字符串.
 */
export function normalizePreparedCopyHtml(html: string): string {
    let normalizedHtml = html

    // html 中 `<pre class="pre-code pre-code_nowrap` 替换为 `<pre class="code-snippet code-snippet_nowrap`
    // 兼容微信微信公众号编辑器代码块和代码片段样式
    normalizedHtml = normalizedHtml.replace(/<pre class="pre-code pre-code_nowrap/g, '<pre class="code-snippet code-snippet_nowrap')
    normalizedHtml = escapeWhitespaceInHtmlContent(normalizedHtml)

    // 将 a 标签替换为 span 标签 防止微信编辑器自动添加链接, 保证样式不变同时不影响内容
    return htmlTagReplace(normalizedHtml, "a", "span")
}
