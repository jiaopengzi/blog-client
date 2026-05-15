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

const WECHAT_LIST_PADDING_LEFT_CLASS = "list-paddingleft-1"
const WECHAT_UNORDERED_LIST_STYLE_TYPES = ["disc", "circle", "square"] as const
const TASK_LIST_COPY_ICON_GAP = 0.5

const DEFAULT_COPY_LIST_STYLE = {
    paragraphIndent: 2,
    textOffset: 1.28,
    taskListIconWidth: 1,
} as const

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

        // 将列表 marker 与 task list 图标实体化到真实 DOM, 避免微信编辑器无法解析伪元素与 counter.
        materializeListMarkersForCopy(clonedElement)

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

/**
 * @description: 将列表 marker 与 task list 图标转换为真实 DOM, 便于复制到微信后继续保留版式.
 * @param container 已完成样式内联的复制容器.
 * @return void.
 */
export function materializeListMarkersForCopy(container: HTMLElement): void {
    const styleConfig = getCopyListStyleConfig(container)
    const lists = Array.from(container.querySelectorAll("ol, ul")).filter(
        (list): list is HTMLOListElement | HTMLUListElement => list instanceof HTMLOListElement || list instanceof HTMLUListElement,
    )

    lists.forEach((list) => {
        const directListItems = Array.from(list.children).filter((item): item is HTMLLIElement => item instanceof HTMLLIElement)

        if (directListItems.some((listItem) => listItem.classList.contains("task-list-item"))) {
            normalizeTaskListForCopy(list, styleConfig)
            return
        }

        normalizeRegularListForCopy(list)
    })
}

/**
 * @description: 读取复制列表布局所需的 CSS 变量, 缺失时回退到默认值.
 * @param container 当前复制容器.
 * @return 列表复制样式配置.
 */
export function getCopyListStyleConfig(container: HTMLElement): {
    paragraphIndent: number
    textOffset: number
    taskListIconWidth: number
} {
    const computedStyle = getComputedStyle(container)

    return {
        paragraphIndent: parseCopyListStyleNumber(computedStyle.getPropertyValue("--preview-paragraph-indent"), DEFAULT_COPY_LIST_STYLE.paragraphIndent),
        textOffset: parseCopyListStyleNumber(computedStyle.getPropertyValue("--preview-list-text-offset"), DEFAULT_COPY_LIST_STYLE.textOffset),
        taskListIconWidth: parseCopyListStyleNumber(
            computedStyle.getPropertyValue("--preview-task-list-icon-width"),
            DEFAULT_COPY_LIST_STYLE.taskListIconWidth,
        ),
    }
}

/**
 * @description: 将 CSS 变量中的数字解析为 em 单位值, 失败时返回回退值.
 * @param rawValue 原始 CSS 变量字符串.
 * @param fallback 解析失败时的回退值.
 * @return 解析后的数字.
 */
export function parseCopyListStyleNumber(rawValue: string, fallback: number): number {
    const parsedValue = Number.parseFloat(rawValue)
    return Number.isFinite(parsedValue) ? parsedValue : fallback
}

/**
 * @description: 将普通有序/无序列表恢复为微信可识别的原生列表结构.
 * @param list 当前列表元素.
 * @return void.
 */
export function normalizeRegularListForCopy(list: HTMLOListElement | HTMLUListElement): void {
    const listStyleType = list instanceof HTMLOListElement ? "decimal" : getWechatUnorderedListStyleType(getListNestingDepth(list))
    const directListItems = Array.from(list.children).filter((item): item is HTMLLIElement => item instanceof HTMLLIElement)

    list.classList.add(WECHAT_LIST_PADDING_LEFT_CLASS)
    list.style.removeProperty("list-style")
    list.style.listStyleType = listStyleType
    list.style.listStylePosition = "outside"
    list.style.position = "static"
    list.style.paddingLeft = ""
    list.style.overflowWrap = "normal"
    list.style.removeProperty("counter-reset")

    directListItems.forEach((listItem) => {
        listItem.style.position = "static"
        listItem.style.paddingLeft = "0"
        listItem.style.listStyleType = "inherit"
        listItem.style.display = "list-item"
        listItem.style.marginLeft = "0"
        removeInlineListMarkers(listItem)
        normalizeRegularListItemContentForCopy(listItem)
        hoistNestedListsAfterListItemForWechat(list, listItem)
    })
}

/**
 * @description: 将 task list 归一化为微信可接受的“内联 svg + 正文”结构.
 * @param list 当前 task list 所在的列表元素.
 * @param styleConfig 列表复制样式配置.
 * @return void.
 */
export function normalizeTaskListForCopy(
    list: HTMLOListElement | HTMLUListElement,
    styleConfig: { paragraphIndent: number; textOffset: number; taskListIconWidth: number },
): void {
    const directListItems = Array.from(list.children).filter((item): item is HTMLLIElement => item instanceof HTMLLIElement)

    list.style.removeProperty("list-style")
    list.style.listStyleType = "none"
    list.style.position = "static"

    directListItems.forEach((listItem) => {
        const iconElement = listItem.querySelector(":scope > .task-list-icon")
        if (!(iconElement instanceof SVGElement)) {
            return
        }

        removeInlineListMarkers(listItem)

        listItem.style.listStyleType = "none"
        listItem.style.display = "flex"
        listItem.style.alignItems = "center"
        listItem.style.position = "static"
        listItem.style.paddingLeft = "0"
        listItem.style.marginLeft = `${getTaskListCopyMarginLeft(styleConfig)}em`
        listItem.style.wordBreak = "break-all"

        iconElement.style.position = "static"
        iconElement.style.display = "inline-block"
        iconElement.style.width = `${styleConfig.taskListIconWidth}em`
        iconElement.style.height = `${styleConfig.taskListIconWidth}em`
        iconElement.style.transform = "none"
        iconElement.style.verticalAlign = "middle"
        iconElement.style.marginRight = `${TASK_LIST_COPY_ICON_GAP}em`
    })
}

/**
 * @description: 计算复制到微信时 task list 的左侧补偿量.
 * 关闭首行缩进后, 顶层列表 padding-left 会变成 0.
 * 如果这里仍然固定左移一个图标宽度, svg 会被离屏复制容器裁掉, 导致粘贴到微信后 marker 消失.
 * @param styleConfig 列表复制样式配置.
 * @return 需要写入 margin-left 的 em 数值.
 */
export function getTaskListCopyMarginLeft(styleConfig: { paragraphIndent: number; textOffset: number; taskListIconWidth: number }): number {
    const taskListVisualWidth = styleConfig.taskListIconWidth + TASK_LIST_COPY_ICON_GAP

    return -Math.min(styleConfig.paragraphIndent, taskListVisualWidth)
}

/**
 * @description: 移除列表项中先前可能插入的复制 marker, 保证列表归一化逻辑幂等.
 * @param listItem 当前列表项.
 * @return void.
 */
export function removeInlineListMarkers(listItem: HTMLLIElement): void {
    const inlineMarkers = listItem.querySelectorAll(":scope > .jpz-copy-list-marker, :scope > p > .jpz-copy-list-marker")
    inlineMarkers.forEach((markerElement) => markerElement.remove())
}

/**
 * @description: 将普通列表项的正文内容包装为更接近微信编辑器原生粘贴结构的 section/span 组合.
 * 这样可以把正文块和后续嵌套列表明确拆开, 避免微信把第 3 层列表误判为与第 2 层同级.
 * @param listItem 当前列表项.
 * @return void.
 */
export function normalizeRegularListItemContentForCopy(listItem: HTMLLIElement): void {
    const directChildren = Array.from(listItem.childNodes)
    let contentGroup: ChildNode[] = []

    const flushContentGroup = (referenceNode?: ChildNode | null) => {
        if (contentGroup.length === 0) {
            return
        }

        const sectionElement = createWechatListContentSection()
        const leafSpan = createWechatListLeafSpan()
        sectionElement.appendChild(leafSpan)

        contentGroup.forEach((childNode) => {
            if (childNode instanceof HTMLParagraphElement) {
                while (childNode.firstChild) {
                    leafSpan.appendChild(childNode.firstChild)
                }
                childNode.remove()
                return
            }

            leafSpan.appendChild(childNode)
        })

        listItem.insertBefore(sectionElement, referenceNode ?? null)
        contentGroup = []
    }

    directChildren.forEach((childNode) => {
        if (childNode instanceof HTMLOListElement || childNode instanceof HTMLUListElement) {
            flushContentGroup(childNode)
            return
        }

        if (childNode.nodeType === Node.TEXT_NODE && !childNode.textContent?.trim()) {
            childNode.remove()
            return
        }

        if (childNode instanceof HTMLElement && childNode.tagName === "SECTION") {
            flushContentGroup(childNode)
            normalizeWechatListSectionLeaf(childNode)
            return
        }

        contentGroup.push(childNode)
    })

    flushContentGroup()
}

/**
 * @description: 创建微信列表正文使用的 section 容器.
 * @return section 节点.
 */
export function createWechatListContentSection(): HTMLElement {
    const sectionElement = document.createElement("section")
    sectionElement.style.margin = "0"
    sectionElement.style.padding = "0"
    return sectionElement
}

/**
 * @description: 创建微信列表正文使用的 leaf span 节点.
 * @return span 节点.
 */
export function createWechatListLeafSpan(): HTMLSpanElement {
    const spanElement = document.createElement("span")
    spanElement.setAttribute("leaf", "")
    return spanElement
}

/**
 * @description: 规范已有 section 节点内部的正文结构, 确保微信粘贴时正文内容稳定落在 leaf span 中.
 * @param sectionElement 当前列表项中的 section 节点.
 * @return void.
 */
export function normalizeWechatListSectionLeaf(sectionElement: HTMLElement): void {
    if (sectionElement.querySelector(":scope > span[leaf]")) {
        return
    }

    const leafSpan = createWechatListLeafSpan()
    while (sectionElement.firstChild) {
        leafSpan.appendChild(sectionElement.firstChild)
    }
    sectionElement.appendChild(leafSpan)
}

/**
 * @description: 将普通列表项中的直接子列表提升为父列表中的紧邻兄弟节点, 贴近微信编辑器原生列表结构.
 * 这样更深层的嵌套列表会继续挂在上一层列表内部, 避免微信粘贴时把第 3 层列表挪到第 2 层正文前面.
 * @param parentList 当前列表项所属的父列表.
 * @param listItem 当前列表项.
 * @return void.
 */
export function hoistNestedListsAfterListItemForWechat(parentList: HTMLOListElement | HTMLUListElement, listItem: HTMLLIElement): void {
    const nestedLists = Array.from(listItem.children).filter(
        (child): child is HTMLOListElement | HTMLUListElement => child instanceof HTMLOListElement || child instanceof HTMLUListElement,
    )

    if (nestedLists.length === 0) {
        return
    }

    let insertionReference = listItem.nextSibling

    nestedLists.forEach((nestedList) => {
        parentList.insertBefore(nestedList, insertionReference)
        insertionReference = nestedList.nextSibling
    })
}

/**
 * @description: 获取列表项中第一个真正参与正文排版的节点, 忽略嵌套列表与空白文本.
 * @param listItem 当前列表项.
 * @return 第一个正文节点, 若不存在则返回 null.
 */
export function getFirstContentNodeInListItem(listItem: HTMLLIElement): ChildNode | null {
    for (const childNode of Array.from(listItem.childNodes)) {
        if (childNode.nodeType === Node.TEXT_NODE && childNode.textContent?.trim()) {
            return childNode
        }

        if (childNode instanceof HTMLElement && childNode.tagName !== "OL" && childNode.tagName !== "UL") {
            return childNode
        }
    }

    return null
}

/**
 * @description: 根据无序列表嵌套深度返回复制到微信时应使用的原生 list-style-type.
 * @param depth 当前无序列表的嵌套深度.
 * @return list-style-type 字符串.
 */
export function getWechatUnorderedListStyleType(depth: number): (typeof WECHAT_UNORDERED_LIST_STYLE_TYPES)[number] {
    if (depth <= 1) {
        return WECHAT_UNORDERED_LIST_STYLE_TYPES[0]
    }

    if (depth === 2) {
        return WECHAT_UNORDERED_LIST_STYLE_TYPES[1]
    }

    return WECHAT_UNORDERED_LIST_STYLE_TYPES[2]
}

/**
 * @description: 计算当前列表在嵌套链路中的深度, 顶层列表深度为 1.
 * @param list 当前列表元素.
 * @return 嵌套深度.
 */
export function getListNestingDepth(list: HTMLOListElement | HTMLUListElement): number {
    let depth = 0
    let currentList: Element | null = list

    while (currentList instanceof HTMLOListElement || currentList instanceof HTMLUListElement) {
        depth += 1
        currentList = currentList.parentElement?.closest("ol, ul") ?? null
    }

    return depth
}
