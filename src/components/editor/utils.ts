/*
 * FilePath    : blog-client\src\components\editor\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 编辑器工具函数
 */

import { snapdom } from "@zumer/snapdom"
import DOMPurify, { type Config } from "dompurify"

// import html2canvas from "html2canvas"
import { CustomElementAttributes, Names } from "@/customElements"
import createMarked from "@/pkg/marked/new-marked"
import { copyHtml } from "@/utils/clipboard"
import { escapeWhitespaceInHtmlContent } from "@/utils/escape"
import { HasParentByClass } from "@/utils/getParentByClass"
import { MessageUtil } from "@/utils/message"
import { htmlTagReplace } from "@/utils/tagReplace"

import { CommandsKey } from "./command"
import { defaultCommandKeys } from "./command"
import type { Heading } from "./components/toc"
import type { EditorState, EditorStateOptions, MarkdownHeadingLine } from "./types"

/**
 * @description : 创建默认的编辑器状态
 * @return      : 空值编辑器信息
 */
export function createDefaultEditorState(options: EditorStateOptions = {}): EditorState {
    const defaultState: EditorState = {
        tocMarkdown: [], // markdown 目录内容
        tocHtml: [], // html 目录内容
        tocShow: false, // 是否显示目录

        editorContent: "", // 编辑器内容
        initDocIsEmpty: true, // 初始内容是否为空, 默认为 true 即默认为空
        editorShow: true, // 是否显示编辑器
        scrollHideViewStr: "", // 滚动条隐藏的编辑器 markdown 字符串
        isSyncScroll: false, // 是否同步滚动
        isUserScrollCmEditor: true, // 是否用户滚动编辑器
        isFullScreen: false, // 是否全屏
        isShowEmojiPicker: false, // 是否显示 emoji picker
        isShortcutKey: true, // 默认开启快捷键
        headingShowCurrentIndex: 0, // 目录显示当前索引
        scrollStatus: void 0, // 滚动条状态 start 开始 end 结束
        mouseStatus: void 0, // 鼠标状态 cmEditor 编辑器 preview 预览
        cmCommand: { commandName: "" as CommandsKey, time: new Date() }, // 命令
        vimMode: false, // 是否开启 vim 模式
        mentions: [], // @ 提及补全
        commandKeys: defaultCommandKeys.postPc, // 默认使用 postPc 模式的快捷键
        mode: "post", // 默认模式为文章模式

        // preview 相关内容
        previewShow: true, // 是否显示预览
        html: "", // html 内容
        imgUrls: [], // 图片地址 list
        isShowElImageViewer: false, // 是否显示图片预览
        width: "1200", // 宽度
        height: "600", // 高度
        isShowPreviewWechat: false, // 是否显示微信预览
        isUserScrollPreview: true, // 是否用户滚动预览
        isRemoveFirstH1: false, // 是否移除第一个 H1 标签
        viewCommand: { commandName: "" as CommandsKey, time: new Date() }, // 命令
    }
    return { ...defaultState, ...options }
}

// 使用闭包缓存正则表达式
interface RegexCache {
    h1TagRegex: RegExp // 匹配 h1 标签
    hTagRegex: RegExp // 匹配 h 标签
    hTagStartRegex: RegExp // 匹配 h 标签的开始
    hTagLevelRegex: RegExp // 匹配 h 标签的等级
    hTagAnchorRegex: RegExp // 匹配 h 标签的锚点
    htmlTagRegex: RegExp // 匹配所有 HTML 标签
    markdownHeadingRegex: RegExp // 匹配 markdown 标题
    nonAlphaNumericRegex: RegExp // 匹配非中文、字母、数字的字符
    multipleDashRegex: RegExp // 匹配多个连续的 -
    leadingTrailingDashRegex: RegExp // 匹配首尾的 -
    customElementHeadingTagNameRegex: RegExp // DOMPurify 允许的 自定义元素的标签名
    customElementHeadingAttributeNameRegex: RegExp // DOMPurify 允许的 自定义元素的属性名
    utf8BomRegex: RegExp // 匹配 utf-8 bom 头
    windowsNewLineRegex: RegExp // 匹配 windows 换行符
    copyButtonRegex: RegExp // 匹配所有 class 中有 copy-button 的按钮元素
    detailsTagRegex: RegExp // 匹配 details 标签
    detailsTagToRemoveRegex: RegExp // 需要去掉 details 标签
    htmlNamedEntityRegex: RegExp // 匹配 HTML 命名实体（如 &lt; &gt; &amp; 等）
    htmlDecimalEntityRegex: RegExp // 匹配 HTML 十进制数字实体（如 &#39; 等）
    htmlHexEntityRegex: RegExp // 匹配 HTML 十六进制数字实体（如 &#x27; 等）
}

/**
 * @description: 更新属性名数组
 * @param tarAttributeNames 目标元素的属性名数组
 * @param srcAttributeNamesList 源元素的属性名数组列表
 * @return  更新后目标元素的属性名数组
 */
const updateAttributeNames = (tarAttributeNames: Array<string>, srcAttributeNamesList: Array<Array<string>>) => {
    // /id|class/ DOMPurify 允许的 自定义元素的属性名
    for (let i = 0; i < srcAttributeNamesList.length; i++) {
        const srcAttributeNames = srcAttributeNamesList[i]!
        for (let j = 0; j < srcAttributeNames.length; j++) {
            tarAttributeNames.push(srcAttributeNames[j]!) // 添加属性名
        }
    }

    return tarAttributeNames
}

/**
 * @description: 使用闭包创建正则表达式缓存
 * @return {Object} 正则表达式缓存
 */
export const createRegexCache = (): RegexCache => {
    const h1TagRegex = /<h1.*?>.*?<\/h1>/ // 匹配 h1 标签 注意需要 g 全局匹配
    const hTagRegex = /<h\d.*?>.*?<\/h\d>/g // 匹配 h 标签 注意需要 g 全局匹配
    const hTagStartRegex = /<h(\d)/ // 匹配 h 标签的开始
    const hTagLevelRegex = /<h(\d).*?>/ // 匹配 h 标签的等级
    const hTagAnchorRegex = /id="(.*)"/ // 匹配 h 标签的锚点
    const htmlTagRegex = /<.*?>/g // 匹配所有 HTML 标签
    const markdownHeadingRegex = /^\s{0,3}(#{1,6})\s+(.*)(?:\n+|$)/gm // 匹配 markdown 标题
    const nonAlphaNumericRegex = /[^a-zA-Z0-9\u4e00-\u9fa5]/g // 匹配非中文、字母、数字的字符
    const multipleDashRegex = /-{2,}/g // 匹配多个连续的 -
    const leadingTrailingDashRegex = /^-|-$/g // 匹配首尾的 -

    const getCustomElementHeadingTagNameRegex = () => {
        // 根据 Names 动态生成正则表达式
        const tagNames = Object.values(Names) // 获取所有标签名
        if (tagNames.length === 0) return /^$/ // 如果没有标签名则返回一个匹配不到任何内容的正则表达式
        return new RegExp(`^(${tagNames.join("|")})$`) // 动态生成正则表达式  DOMPurify 允许的 自定义元素的标签名

        // return new RegExp(`^video-|^pay-`) // 动态生成正则表达式  DOMPurify 允许的 自定义元素的标签名
    }

    const getCustomElementHeadingAttributeNameRegex = () => {
        // /id|class/ // DOMPurify 允许的 自定义元素的属性名
        const attributeNames: string[] = [] // 属性名数组

        updateAttributeNames(attributeNames, [CustomElementAttributes])

        return new RegExp(`${attributeNames.join("|")}`)
    }

    const utf8BomRegex = /^\uFEFF/ // 匹配 utf-8 bom 头
    const windowsNewLineRegex = /\r\n/g // 匹配 windows 换行符

    // <button type="button" class="copy-button"> CSS</button>
    // 匹配所有 class 中有 copy-button 的按钮元素, gi 表示全局匹配且不区分大小写
    const copyButtonRegex = /<button[^>]*\bcopy-button\b[^>]*>.*?<\/button>/gi

    // 匹配 details 标签
    const detailsTagRegex = /<details[\s\S]*?<\/details>/gi
    // 需要去掉 details 标签
    const detailsTagToRemoveRegex = /<\/?details[^>]*>/g
    // 匹配 HTML 命名实体（如 &lt; &gt; &amp; &quot; &apos; 等）
    const htmlNamedEntityRegex = /&(?:amp|lt|gt|quot|apos|#39|#x27|#x2F);/g
    // 匹配 HTML 十进制数字实体（如 &#39; &#160; 等）
    const htmlDecimalEntityRegex = /&#(\d+);/g
    // 匹配 HTML 十六进制数字实体（如 &#x27; &#x2F; 等）
    const htmlHexEntityRegex = /&#x([\da-fA-F]+);/g
    return {
        h1TagRegex,
        hTagRegex,
        hTagStartRegex,
        hTagLevelRegex,
        hTagAnchorRegex,
        htmlTagRegex,
        markdownHeadingRegex,
        nonAlphaNumericRegex,
        multipleDashRegex,
        leadingTrailingDashRegex,
        customElementHeadingTagNameRegex: getCustomElementHeadingTagNameRegex(),
        customElementHeadingAttributeNameRegex: getCustomElementHeadingAttributeNameRegex(),
        utf8BomRegex,
        windowsNewLineRegex,
        copyButtonRegex,
        detailsTagRegex,
        detailsTagToRemoveRegex,
        htmlNamedEntityRegex,
        htmlDecimalEntityRegex,
        htmlHexEntityRegex,
    }
}

// 正则表达式缓存
const regexCache = createRegexCache()

// katex 锚点上下内边距配置(单位: px, 根据实际情况调整, 主要是为了避免部分字形被 snapdom 裁掉)
const KATEX_CAPTURE_PADDING = {
    inline: {
        top: 6,
        bottom: 6,
    },
    display: {
        top: 8,
        bottom: 8,
    },
} as const

const COPY_PIPELINE_YIELD_INTERVAL = 20
const COPY_PROFILE_PREFIX = "[copy-profile]"

interface CopyProfileMark {
    label: string
    durationMs: number
}

interface CopyProfileSession {
    id: string
    source: string
    start: number
    marks: CopyProfileMark[]
}

interface KatexImageCacheEntry {
    src: string
    width: number
    height: number
}

interface KatexToImageMetrics {
    totalCount: number
    cacheHitCount: number
}

interface KatexCaptureContext {
    wrapper: HTMLDivElement
    width: number
    height: number
}

const katexImageCache = new Map<string, KatexImageCacheEntry>()

// katex 截图上下文接口
interface KatexCaptureContext {
    wrapper: HTMLDivElement // 锚点容器
    width: number // 锚点宽度
    height: number // 锚点高度
}

/**
 * @description: 标题锚点生成器
 * @return {String} 生成的锚点
 */
export const anchorGenerator = (text: string | undefined): string => {
    if (!text) return ""
    const { nonAlphaNumericRegex, multipleDashRegex, leadingTrailingDashRegex } = createRegexCache()
    return text
        .replace(nonAlphaNumericRegex, "-") // 替换非中文、字母、数字的字符
        .replace(multipleDashRegex, "-") // 替换多个连续的 -
        .replace(leadingTrailingDashRegex, "") // 去除首尾的 -
        .toLowerCase() // 转为小写
}

/**
 * @description: 标题锚点生成器包含索引
 * @param text 标题内容
 * @param index 索引
 * @return {String} 生成的锚点
 */
export const anchorGeneratorWithIndex = (text: string | undefined, index: number | undefined): string => {
    if (!text || index === void 0) return ""
    // 为了不然锚点中出现数字开头的情况, 将索引index简写为 idx
    return `idx${index.toString()}-${anchorGenerator(text)}`
}

/**
 * @description: 从 markdown 字符串中获取所有标题行号
 * @param markdownStr 源字符串
 * @return       标题,行号数组
 */
export function getMarkdownHeadingLines(markdownStr: string): MarkdownHeadingLine[] {
    const { markdownHeadingRegex } = regexCache
    const lines = markdownStr.split("\n")
    const targetLines: MarkdownHeadingLine[] = []
    let headingIndex = 0 // 标题索引

    for (let i = 0; i < lines.length; i++) {
        const matchArray = lines[i]!.match(markdownHeadingRegex)

        if (matchArray) {
            targetLines.push({
                index: headingIndex++,
                markdownHeading: lines[i]!,
                markdownLineNumber: i + 1,
            })
        }
    }

    return targetLines
}

/**
 * @description: 为 html 中的所有 h 标签生成锚点
 * @param html
 * @return {String} 生成锚点和 href 的后 html 字符串
 */
export function generateAllHeadingAnchor(html: string): string {
    const { hTagRegex, hTagStartRegex, htmlTagRegex, hTagAnchorRegex } = regexCache
    let headingIndex = 0 // 标题索引

    // 使用 replace 的回调函数处理每个匹配的标题
    return html.replace(hTagRegex, (match) => {
        // 判断是否已经有锚点, 如果已经有锚点, 则不进行处理
        const existingAnchor = match.match(hTagAnchorRegex)
        if (existingAnchor) {
            return match
        }

        const text = match.replace(htmlTagRegex, "") // h 标签的文本
        const anchor = anchorGeneratorWithIndex(text, headingIndex++) // h 标签的锚点,标题+索引
        const anchorAndHref = `id="${anchor}"` // 锚点

        // 向 h 标签中添加锚点
        // $1 是正则表达式替换中的占位符, 用于插入第一个捕获组的内容。
        // 在当前的代码中, 它的作用是将正则表达式中捕获的 h 标签的数字(如 1, 2, 3) 动态插入到替换结果中。
        return match.replace(hTagStartRegex, `<h$1 ${anchorAndHref}`)
    })
}

// HTML 命名实体映射表(模块级缓存，避免每次调用时重复创建)
const HTML_ENTITY_MAP: Record<string, string> = {
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&quot;": '"',
    "&#39;": "'",
    "&#x27;": "'",
    "&#x2F;": "/",
    "&apos;": "'",
}
/**
 * @description : 解码 HTML 实体字符（如 &lt; &gt; &amp; &quot; &#39; 及数字实体）
 * @param str                  : 包含 HTML 实体的字符串
 * @param htmlNamedEntityRegex : 匹配 HTML 命名实体的正则表达式（来自 regexCache，避免重复创建）
 * @param htmlDecimalEntityRegex : 匹配 HTML 十进制数字实体的正则表达式（来自 regexCache，避免重复创建）
 * @param htmlHexEntityRegex   : 匹配 HTML 十六进制数字实体的正则表达式（来自 regexCache，避免重复创建）
 * @return                     : 解码后的字符串
 */
function decodeHtmlEntities(str: string, htmlNamedEntityRegex: RegExp, htmlDecimalEntityRegex: RegExp, htmlHexEntityRegex: RegExp): string {
    return str
        .replace(htmlNamedEntityRegex, (entity) => HTML_ENTITY_MAP[entity] ?? entity)
        .replace(htmlDecimalEntityRegex, (_, dec) => String.fromCharCode(Number(dec)))
        .replace(htmlHexEntityRegex, (_, hex) => String.fromCharCode(parseInt(hex, 16)))
}

/**
 * @description : 通过正则表达式匹配 html 中所有的 h 标签 并转换为 HeadingType 数组
 * @param html  : html 字符串
 * @return      : 匹配到的 h 标签数组
 */
export function matchAllHeadingToList(html: string): Heading[] {
    const { hTagRegex, hTagLevelRegex, hTagAnchorRegex, htmlTagRegex, htmlNamedEntityRegex, htmlDecimalEntityRegex, htmlHexEntityRegex } = regexCache
    const matches = html.match(hTagRegex) || [] // 匹配到的 h 标签数组
    const headingList: Heading[] = [] // h 标签数组
    let headingIndex = 0 // 标题索引

    matches.forEach((item) => {
        // 遍历匹配到的 h 标签数组
        const level = Number(item.match(hTagLevelRegex)?.[1]) || 1 // h 标签的等级
        const text = decodeHtmlEntities(item.replace(htmlTagRegex, ""), htmlNamedEntityRegex, htmlDecimalEntityRegex, htmlHexEntityRegex) // h 标签的文本（解码 HTML 实体）
        const anchor = item.match(hTagAnchorRegex)?.[1] || "" // h 标签的锚点
        headingList.push({
            index: headingIndex++,
            level,
            text,
            anchor,
        })
    })

    return headingList
}

/**
 * @description: 通过 markdown 字符串生成 html 字符串
 * @param markdownSrc markdown 字符串
 * @param isRemoveFirstH1 是否移除第一个 H1 标签
 * @return {String} html 字符串
 */
export function markdownToHtml(markdownSrc: string, isRemoveFirstH1: boolean): string {
    const markdownParse = createMarked().parse(markdownSrc).toString() // markdown 转 html
    const htmlHandleUtf8 = htmlHandleUtf8BOM(markdownParse) // 处理 utf-8 编码问题

    // 配置 DOMPurify 参考: https://www.npmjs.com/package/dompurify
    DOMPurify.setConfig({
        CUSTOM_ELEMENT_HANDLING: {
            tagNameCheck: (tagName) => !!tagName.match(regexCache.customElementHeadingTagNameRegex),
            attributeNameCheck: (attr) => !!attr.match(regexCache.customElementHeadingAttributeNameRegex),
            allowCustomizedBuiltInElements: true, // 允许自定义内置函数
        },
    } as Config)

    // 过滤 html, 防止 xss 攻击
    let purifyHtml = DOMPurify.sanitize(htmlHandleUtf8)

    if (isRemoveFirstH1) {
        // 移除第一个 h1 标签
        purifyHtml = htmlRemoveFirstH1(purifyHtml)
    }

    // 生成锚点
    return generateAllHeadingAnchor(purifyHtml)
}

/**
 * @description:  处理 utf-8 编码问题
 * @param htmlSrc html 源码
 * @return 替换后的 html 源码
 */
export function htmlHandleUtf8BOM(htmlSrc: string) {
    // 处理 utf-8 编码问题
    return htmlSrc.replace(regexCache.utf8BomRegex, "").replace(regexCache.windowsNewLineRegex, "\n") // 去除 BOM 头 和 windows 换行符
}

/**
 * @description: 匹配所有 class 中有 copy-button 的按钮元素 替换掉
 * @param htmlSrc html 源码
 * @return  替换后的 html 源码
 */
export function htmlHandleCopyBtns(htmlSrc: string) {
    // 匹配所有 class 中有 copy-button 的按钮元素 替换为空
    return htmlSrc.replace(regexCache.copyButtonRegex, "")
}

/**
 * @description: 将 details 标签去掉直接内容保留
 * @param htmlSrc html 源码
 * @return 替换后的 html 源码
 */
export function htmlHandleDetailsTag(htmlSrc: string) {
    return htmlSrc.replace(regexCache.detailsTagRegex, (match) => {
        // 去掉 details 标签
        return match.replace(regexCache.detailsTagToRemoveRegex, "")
    })
}

/**
 * @description: 将 katex 公式转成图片 为了微信预览
 * @param container 预览容器
 * @param className katex 公式根节点的类名
 */
export async function katexToImage(container: HTMLElement, className: string = "katex"): Promise<KatexToImageMetrics> {
    const katexElements = getKatexElements(container, className)
    const metrics: KatexToImageMetrics = {
        totalCount: katexElements.length,
        cacheHitCount: 0,
    }

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

                if (cachedImage) {
                    metrics.cacheHitCount += 1
                } else {
                    cacheKatexImage(cacheKey, img, captureContext)
                }

                applyKatexImageStyle(img, captureContext)
                katex.parentNode?.replaceChild(img, katex)
            } finally {
                captureContext.wrapper.remove()
            }
        })
    }, Promise.resolve())

    return metrics
}

/**
 * @description: 等待当前文档字体资源进入稳定状态, 降低批量公式截图时的排版抖动.
 * @return void.
 */
async function waitForDocumentFontsReady(): Promise<void> {
    if (typeof document === "undefined" || !("fonts" in document)) {
        return
    }

    await document.fonts.ready
}

function getCopyProfileNow(): number {
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
        return performance.now()
    }

    return Date.now()
}

function createCopyProfileSession(source: string): CopyProfileSession {
    return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        source,
        start: getCopyProfileNow(),
        marks: [],
    }
}

function markCopyProfile(session: CopyProfileSession, label: string, startTime: number): void {
    session.marks.push({
        label,
        durationMs: Number((getCopyProfileNow() - startTime).toFixed(2)),
    })
}

function flushCopyProfile(session: CopyProfileSession, status: "success" | "error", extra: Record<string, string | number | boolean> = {}): void {
    const totalDurationMs = Number((getCopyProfileNow() - session.start).toFixed(2))
    const payload = {
        id: session.id,
        source: session.source,
        status,
        totalDurationMs,
        marks: session.marks,
        ...extra,
    }

    console.log(`${COPY_PROFILE_PREFIX} ${JSON.stringify(payload)}`)
}

function waitForNextRenderFrame(): Promise<void> {
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
function getKatexElements(container: HTMLElement, className: string): HTMLElement[] {
    return Array.from(container.getElementsByClassName(className)).filter((element): element is HTMLElement => element instanceof HTMLElement)
}

/**
 * @description: 构建 KaTeX 截图所需的离屏包裹容器, 并计算最终截图尺寸.
 * @param katex KaTeX 根节点.
 * @return 截图上下文.
 */
function createKatexCaptureContext(katex: HTMLElement): KatexCaptureContext {
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
function applyKatexCaptureContextStyle(katex: HTMLElement, wrapper: HTMLDivElement, captureClone: HTMLElement): void {
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
async function createKatexImageFromCapture(captureContext: KatexCaptureContext): Promise<HTMLImageElement> {
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
function applyKatexImageStyle(img: HTMLImageElement, captureContext: KatexCaptureContext): void {
    img.style.width = `${captureContext.width}px`
    img.style.height = `${captureContext.height}px`
    img.style.display = "inline-block"
    img.style.verticalAlign = "bottom"
    img.style.objectFit = "contain"
    img.style.margin = "0"
    img.style.padding = "0"
}

function getKatexImageCacheKey(katex: HTMLElement, captureContext: KatexCaptureContext): string {
    return JSON.stringify({
        html: katex.innerHTML,
        className: katex.className,
        width: captureContext.width,
        height: captureContext.height,
    })
}

function createKatexImageFromCache(cacheEntry: KatexImageCacheEntry): HTMLImageElement {
    const img = document.createElement("img")
    img.src = cacheEntry.src
    img.width = cacheEntry.width
    img.height = cacheEntry.height
    return img
}

function cacheKatexImage(cacheKey: string, img: HTMLImageElement, captureContext: KatexCaptureContext): void {
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
function getKatexCapturePadding(isKatexDisplay: boolean): { top: number; bottom: number } {
    return isKatexDisplay ? KATEX_CAPTURE_PADDING.display : KATEX_CAPTURE_PADDING.inline
}

/**
 * @description: 重置行间公式的字号缩放, 便于重新测量实际宽度.
 * @param formulaElement KaTeX 行间公式元素.
 * @return void.
 */
function resetDisplayKatexFontSize(formulaElement: HTMLElement): void {
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
 * @description: html 处理微信预览
 * @param htmlSrc html 源码
 * @return  替换后的 html 源码
 */
export function htmlHandleWeChat(htmlSrc: string) {
    // 去除 copy 按钮
    htmlSrc = htmlHandleCopyBtns(htmlSrc)

    // 将 div 替换为 section
    htmlSrc = htmlTagReplace(htmlSrc, "div", "section")

    // 处理 details 标签
    htmlSrc = htmlHandleDetailsTag(htmlSrc)

    return htmlSrc
}

/**
 * @description: html 移除第一个 h1 标签
 * @param htmlSrc html 源码
 * @return  移除后的 html 源码
 */
export function htmlRemoveFirstH1(htmlSrc: string) {
    // 移除第一个 h1 标签
    const h1Match = htmlSrc.match(regexCache.h1TagRegex)
    if (h1Match) {
        const h1Tag = h1Match[0] // 获取第一个 h1 标签
        htmlSrc = htmlSrc.replace(h1Tag, "") // 移除第一个 h1 标签
    }
    return htmlSrc
}

/**
 * @description: 获取所有外部样式表并按照它们在 document.styleSheets 中的位置进行排序
 * @return 已排序的外部样式表列表和索引
 */
function getSortedStyleSheets(): [CSSStyleSheet, number][] {
    return Array.from(document.styleSheets)
        .map((sheet, index) => [sheet, index] as [CSSStyleSheet, number])
        .filter(([sheet]) => {
            try {
                return !!sheet.cssRules
            } catch {
                // 跨域或 CSP 阻止访问
                console.warn("无法访问样式表规则, 可能是跨域或 CSP 阻止访问:", sheet)
                return false
            }
        })
}

function getCssStyleRules(cssStyleSheets: [CSSStyleSheet, number][]): CSSStyleRule[] {
    const cssStyleRules: CSSStyleRule[] = []

    cssStyleSheets.forEach(([styleSheet]) => {
        try {
            Array.from(styleSheet.cssRules).forEach((rule: CSSRule) => {
                if (rule instanceof CSSStyleRule) {
                    cssStyleRules.push(rule)
                }
            })
        } catch (error) {
            console.warn("Error accessing rules in stylesheet:", styleSheet, error)
        }
    })

    return cssStyleRules
}

/**
 * @description 检查元素自身或其任意祖先是否包含指定类名
 * @param element 起始元素
 * @param className 要检查的 CSS 类名
 * @returns 若找到匹配元素则返回 true, 否则 false
 */
export function hasClassName(element: HTMLElement | SVGElement, className: string): boolean {
    let current: Element | null = element
    while (current) {
        // 检查当前元素是否包含该类名(兼容 SVGElement 无 classList 的情况)
        if ("classList" in current && current.classList instanceof DOMTokenList && current.classList.contains(className)) {
            return true
        }
        current = current.parentElement
    }
    return false
}

// 判断当前元素或其任意祖先是否为 code 标签
export function isCodeTag(element: HTMLElement | SVGElement): boolean {
    let current: Element | null = element
    while (current) {
        if (current.tagName.toLowerCase() === "code") {
            return true
        }
        current = current.parentElement
    }
    return false
}

/**
 * 微信公众平台编辑器明确不支持或会被过滤的 CSS 属性黑名单
 * 这些属性在内联样式中会被移除或忽略, 即使写在 style 里也无效
 */
const WechatCssBlackList: readonly string[] = [
    // "position",
    "border-image",
    // "font-family",
    // "font-style",
    // "font-variant",
    // "font-kerning",
    // "font-stretch",
    // "font-language-override",
    // "font-language-override",
    // "font-size-adjust",
    // "font-optical-sizing",
]

// 全局白名单(暂时为空)
const WechatCssAllWhiteList: readonly string[] = []

// 代码块容器白名单
const WechatCssPreCodeWhiteList: readonly string[] = ["font-family", "font-size", "line-height", "color", "background-color", "padding", "margin"]

// // 行内代码白名单
// const WechatCsInlineCodeWhiteList: readonly string[] = ["font-family", "font-size", "line-height", "color", "background-color", "padding", "margin"]

/**
 * @description: 检查 CSS 属性和值在是否在微信公众平台编辑器中的黑名单中
 * @param property CSS属性名
 * @param value CSS属性值
 * @returns 若属性在黑名单中则返回 true, 否则 false
 */
function isWechatCssBlackListProperty(property: string, value: string): boolean {
    if (!property || !value) {
        return true
    }

    // 检查属性是否在黑名单中
    if (WechatCssBlackList.length > 0) {
        for (let i = 0; i < WechatCssBlackList.length; i++) {
            // 属性名开头匹配黑名单
            if (property.startsWith(WechatCssBlackList[i]!)) {
                return true
            }
        }
    }

    return false
}

// 自定义的过滤后的样式接口
interface FilteredStyles {
    [key: string]: string
}

interface InlineStyleApplyContext {
    matchedRuleCache: Map<string, CSSStyleRule[]>
    computedPropertyCache: Map<string, string[]>
    inlineStyleRecordCache: Map<string, Record<string, string>>
    processedElementCount: number
    appliedPropertyCount: number
    relevantPropertyCount: number
}

// 需要过滤的预设样式值
const WideKeywords: readonly string[] = ["initial", "inherit", "revert", "revert-layer", "unset"]

/**
 * @description: 过滤计算样式中非用户定义的样式
 * @param el 元素
 * @return 过滤后的样式对象
 */
function filterInvalidComputedStyles(el: HTMLElement | SVGElement, properties?: string[]): FilteredStyles {
    const computedStyle = getComputedStyle(el)

    const filteredStyles: FilteredStyles = {}
    const targetProperties = properties && properties.length > 0 ? properties : Array.from(computedStyle)

    for (let i = 0; i < targetProperties.length; i++) {
        const property = targetProperties[i]
        if (!property) continue
        const value = computedStyle.getPropertyValue(property)

        // 过滤掉非用户定义的样式值
        if (!WideKeywords.includes(value.toLowerCase())) {
            filteredStyles[property] = value
        }
    }

    return filteredStyles
}

/**
 * @description: 递归将原始元素的计算样式应用为克隆元素的内联样式
 * @param originalEl 原始元素(用于读取 computedStyle)
 * @param clonedEl   克隆元素(用于写入 inline style)
 * @param cssStyleSheets 已排序的样式表列表和索引
 * @param computedStyle 过滤后的计算样式对象
 */
function applyInlineStylesToElement(
    originalEl: HTMLElement | SVGElement,
    clonedEl: HTMLElement | SVGElement,
    matchedRules: CSSStyleRule[],
    computedStyle: FilteredStyles,
    applyContext: InlineStyleApplyContext,
) {
    // 如果没有计算样式则直接返回
    if (!computedStyle || Object.keys(computedStyle).length === 0) return

    // 跳过 katex 公式元素
    const isKatex = hasClassName(originalEl, "katex")
    if (isKatex) return

    // 对代码块容器特殊处理, 只保颜色和字体相关样式
    const isPreCode = hasClassName(originalEl, "pre-code-container")

    // // 行内代码即不在代码块容器内的 code 标签
    // const isCode = isCodeTag(originalEl)

    // 收集已经引用内联样式的 record, 后续和计算样式对比使用
    const inlineStyleRecord = getInlineStyleRecord(clonedEl, matchedRules, isPreCode, applyContext)

    // 应用内联样式, 覆盖样式表中的样式
    Object.keys(inlineStyleRecord).forEach((property) => {
        // 收集的内联样式值
        const cssStyleValue = inlineStyleRecord[property]

        // 计算样式表中的样式值
        const computedStyleValue = computedStyle[property]

        if (!cssStyleValue || !computedStyleValue) return

        // 自适应的样式值不使用计算样式覆盖
        const notUseComputedStyleValues = [
            "auto", // 自动
            "100%", // 百分比
            "100vw", // 视口宽度
            "100vh", // 视口高度
            "normal", // 正常
            "none", // 无
        ]

        // 判断是否一致, 不一致则使用计算样式表中的样式值覆盖
        if (cssStyleValue !== computedStyleValue && !notUseComputedStyleValues.includes(cssStyleValue)) {
            clonedEl.style.setProperty(property, computedStyleValue)
        } else {
            clonedEl.style.setProperty(property, cssStyleValue)
        }

        applyContext.appliedPropertyCount += 1
    })

    // 单独添加微信白名单中的属性
    if (WechatCssAllWhiteList.length > 0) {
        WechatCssAllWhiteList.forEach((property) => {
            const cssStyleValue = computedStyle[property]
            if (cssStyleValue) {
                clonedEl.style.setProperty(property, cssStyleValue)
            }
        })
    }
}

function getInlineStyleRecord(
    element: HTMLElement | SVGElement,
    matchedRules: CSSStyleRule[],
    isPreCode: boolean,
    applyContext: InlineStyleApplyContext,
): Record<string, string> {
    const cacheKey = `${getInlineStyleRuleCacheKey(element)}::${isPreCode ? "pre" : "default"}`
    const cachedRecord = applyContext.inlineStyleRecordCache.get(cacheKey)
    if (cachedRecord) {
        return cachedRecord
    }

    const inlineStyleRecord: Record<string, string> = {}

    matchedRules.forEach((rule) => {
        try {
            for (let i = 0; i < rule.style.length; i++) {
                const property = rule.style[i]

                if (!property) continue

                const cssStyleValue = rule.style.getPropertyValue(property)
                if (!cssStyleValue) continue

                if (isWechatCssBlackListProperty(property, cssStyleValue)) {
                    continue
                }

                if (isPreCode && WechatCssPreCodeWhiteList.length > 0 && !WechatCssPreCodeWhiteList.includes(property)) {
                    continue
                }

                inlineStyleRecord[property] = cssStyleValue
            }
        } catch (error) {
            console.warn("Error matching style rule:", rule.selectorText, error)
        }
    })

    applyContext.inlineStyleRecordCache.set(cacheKey, inlineStyleRecord)
    return inlineStyleRecord
}

function getMatchedCssStyleRules(element: HTMLElement | SVGElement, cssStyleRules: CSSStyleRule[], applyContext: InlineStyleApplyContext): CSSStyleRule[] {
    const cacheKey = getInlineStyleRuleCacheKey(element)
    const cachedRules = applyContext.matchedRuleCache.get(cacheKey)
    if (cachedRules) {
        return cachedRules
    }

    const matchedRules = cssStyleRules.filter((rule) => {
        try {
            return element.matches(rule.selectorText)
        } catch (error) {
            console.warn("Error matching style rule:", rule.selectorText, error)
            return false
        }
    })

    applyContext.matchedRuleCache.set(cacheKey, matchedRules)
    return matchedRules
}

function getRelevantComputedStyleProperties(element: HTMLElement | SVGElement, matchedRules: CSSStyleRule[], applyContext: InlineStyleApplyContext): string[] {
    const cacheKey = getInlineStyleRuleCacheKey(element)
    const cachedProperties = applyContext.computedPropertyCache.get(cacheKey)
    if (cachedProperties) {
        return cachedProperties
    }

    const propertySet = new Set<string>()

    matchedRules.forEach((rule) => {
        for (let i = 0; i < rule.style.length; i++) {
            const property = rule.style[i]
            if (!property) {
                continue
            }

            propertySet.add(property)
        }
    })

    WechatCssAllWhiteList.forEach((property) => {
        propertySet.add(property)
    })

    if (hasClassName(element, "pre-code-container")) {
        WechatCssPreCodeWhiteList.forEach((property) => {
            propertySet.add(property)
        })
    }

    const relevantProperties = Array.from(propertySet)
    applyContext.relevantPropertyCount += relevantProperties.length
    applyContext.computedPropertyCache.set(cacheKey, relevantProperties)
    return relevantProperties
}

function getInlineStyleRuleCacheKey(element: HTMLElement | SVGElement): string {
    const classNames = "classList" in element && element.classList instanceof DOMTokenList ? Array.from(element.classList).sort().join(".") : ""
    const tagName = "tagName" in element ? element.tagName.toLowerCase() : ""
    const id = "id" in element ? element.id : ""

    return `${tagName}#${id}.${classNames}`
}

async function processInlineStyleQueue(
    queue: Array<{ originalEl: HTMLElement | SVGElement; clonedEl: HTMLElement | SVGElement }>,
    cssStyleRules: CSSStyleRule[],
    applyContext: InlineStyleApplyContext,
): Promise<void> {
    let processedCount = 0

    while (queue.length > 0 && processedCount < COPY_PIPELINE_YIELD_INTERVAL) {
        const currentPair = queue.shift()
        if (!currentPair) {
            continue
        }

        const { originalEl, clonedEl } = currentPair
        const matchedRules = getMatchedCssStyleRules(clonedEl, cssStyleRules, applyContext)
        const relevantProperties = getRelevantComputedStyleProperties(originalEl, matchedRules, applyContext)
        const computedStyle = filterInvalidComputedStyles(originalEl, relevantProperties)
        applyContext.processedElementCount += 1

        if (!computedStyle || Object.keys(computedStyle).length === 0 || hasClassName(originalEl, "katex")) {
            continue
        }

        applyInlineStylesToElement(originalEl, clonedEl, matchedRules, computedStyle, applyContext)

        const originalChildren = Array.from(originalEl.children)
        const clonedChildren = Array.from(clonedEl.children)

        if (originalChildren.length !== clonedChildren.length) {
            console.warn("Original and cloned element child count mismatch", originalEl, clonedEl)
            continue
        }

        for (let i = 0; i < originalChildren.length; i++) {
            const origChild = originalChildren[i]
            const cloneChild = clonedChildren[i]

            if (
                (origChild instanceof HTMLElement || origChild instanceof SVGElement) &&
                (cloneChild instanceof HTMLElement || cloneChild instanceof SVGElement)
            ) {
                queue.push({ originalEl: origChild, clonedEl: cloneChild })
            }
        }

        processedCount += 1
    }

    if (queue.length === 0) {
        return
    }

    await waitForNextRenderFrame()
    await processInlineStyleQueue(queue, cssStyleRules, applyContext)
}

async function applyInlineStylesInBatches(
    originalRoot: HTMLElement | SVGElement,
    clonedRoot: HTMLElement | SVGElement,
    cssStyleRules: CSSStyleRule[],
): Promise<InlineStyleApplyContext> {
    const queue: Array<{ originalEl: HTMLElement | SVGElement; clonedEl: HTMLElement | SVGElement }> = [{ originalEl: originalRoot, clonedEl: clonedRoot }]
    const applyContext: InlineStyleApplyContext = {
        matchedRuleCache: new Map<string, CSSStyleRule[]>(),
        computedPropertyCache: new Map<string, string[]>(),
        inlineStyleRecordCache: new Map<string, Record<string, string>>(),
        processedElementCount: 0,
        appliedPropertyCount: 0,
        relevantPropertyCount: 0,
    }

    await processInlineStyleQueue(queue, cssStyleRules, applyContext)
    return applyContext
}

/**
 * @description: 创建承载克隆节点的离屏临时容器, 用于应用样式与执行截图转换.
 * @param clonedElement 克隆后的预览节点.
 * @return 离屏临时容器.
 */
function createDetachedCopyContainer(clonedElement: HTMLElement): HTMLDivElement {
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
function isTrustedLocalHost(hostname: string): boolean {
    return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
}

/**
 * @description: 根据复制失败原因生成更友好的提示文案.
 * @param err 复制流程抛出的错误.
 * @return 面向用户的错误提示.
 */
function getClipboardFriendlyErrorMessage(err: unknown): string {
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
export async function copyWithCustomStyle(element: HTMLElement, source: string = "direct-copy"): Promise<void> {
    try {
        const html = await prepareCopyWithCustomStyle(element, source)
        await writePreparedHtmlToClipboard(html, source)
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
export async function prepareCopyWithCustomStyle(element: HTMLElement, source: string = "prepare-only"): Promise<string> {
    const session = createCopyProfileSession(source)

    // 1、克隆元素(深拷贝), 保证不修改原元素
    const cloneStart = getCopyProfileNow()
    const clonedElement = element.cloneNode(true) as HTMLElement
    markCopyProfile(session, "clone-element", cloneStart)

    // 2、创建临时容器, 仅用于确保 clonedElement 在 DOM 中以正确应用样式, 但不显示
    const detachedContainerStart = getCopyProfileNow()
    const container = createDetachedCopyContainer(clonedElement)
    markCopyProfile(session, "attach-detached-container", detachedContainerStart)

    let html = ""
    let katexToImageMetrics: KatexToImageMetrics = {
        totalCount: 0,
        cacheHitCount: 0,
    }
    let inlineStyleMetrics: InlineStyleApplyContext | null = null

    try {
        // 4、将克隆节点中的 katex 转图片, 避免修改原预览内容
        const katexToImageStart = getCopyProfileNow()
        katexToImageMetrics = await katexToImage(clonedElement)
        markCopyProfile(session, "katex-to-image", katexToImageStart)

        // 6、获取用户样式表
        const cssRuleCollectionStart = getCopyProfileNow()
        const cssStyleSheets = getSortedStyleSheets()
        const cssStyleRules = getCssStyleRules(cssStyleSheets)
        markCopyProfile(session, "collect-css-rules", cssRuleCollectionStart)

        // 7、应用内联样式
        const inlineStyleStart = getCopyProfileNow()
        inlineStyleMetrics = await applyInlineStylesInBatches(element, clonedElement, cssStyleRules)
        markCopyProfile(session, "apply-inline-styles", inlineStyleStart)

        // 8、提取 HTML
        const extractHtmlStart = getCopyProfileNow()
        html = clonedElement.innerHTML
        markCopyProfile(session, "extract-html", extractHtmlStart)
    } finally {
        // 9、移除临时容器
        const detachContainerStart = getCopyProfileNow()
        document.body.removeChild(container)
        markCopyProfile(session, "detach-container", detachContainerStart)
    }

    const normalizeHtmlStart = getCopyProfileNow()
    const normalizedHtml = normalizePreparedCopyHtml(html)
    markCopyProfile(session, "normalize-html", normalizeHtmlStart)
    flushCopyProfile(session, "success", {
        htmlLength: normalizedHtml.length,
        katexImageCount: katexToImageMetrics.totalCount,
        katexCacheHitCount: katexToImageMetrics.cacheHitCount,
        inlineProcessedElementCount: inlineStyleMetrics?.processedElementCount ?? 0,
        inlineAppliedPropertyCount: inlineStyleMetrics?.appliedPropertyCount ?? 0,
        inlineRelevantPropertyCount: inlineStyleMetrics?.relevantPropertyCount ?? 0,
        inlineRuleCacheSize: inlineStyleMetrics?.matchedRuleCache.size ?? 0,
        inlineComputedPropertyCacheSize: inlineStyleMetrics?.computedPropertyCache.size ?? 0,
        inlineStyleRecordCacheSize: inlineStyleMetrics?.inlineStyleRecordCache.size ?? 0,
    })

    return normalizedHtml
}

/**
 * @description: 将已准备好的 HTML 写入剪贴板.
 * @param html 已处理完成的 HTML 内容.
 * @return void.
 */
export async function writePreparedHtmlToClipboard(html: string, source: string = "clipboard-write"): Promise<void> {
    const session = createCopyProfileSession(source)

    try {
        const clipboardWriteStart = getCopyProfileNow()
        await copyHtml(html)
        markCopyProfile(session, "clipboard-write", clipboardWriteStart)
        flushCopyProfile(session, "success", {
            htmlLength: html.length,
        })
        MessageUtil.success("内容已复制到剪贴板")
    } catch (err) {
        flushCopyProfile(session, "error", {
            htmlLength: html.length,
        })
        console.error("无法复制内容", err)
        MessageUtil.error(getClipboardFriendlyErrorMessage(err), 8000)
    }
}

function normalizePreparedCopyHtml(html: string): string {
    let normalizedHtml = html

    // html 中 `<pre class="pre-code pre-code_nowrap` 替换为 `<pre class="code-snippet code-snippet_nowrap`
    // 兼容微信微信公众号编辑器代码块和代码片段样式
    normalizedHtml = normalizedHtml.replace(/<pre class="pre-code pre-code_nowrap/g, '<pre class="code-snippet code-snippet_nowrap')
    normalizedHtml = escapeWhitespaceInHtmlContent(normalizedHtml)

    // 将 a 标签替换为 span 标签 防止微信编辑器自动添加链接, 保证样式不变同时不影响内容
    return htmlTagReplace(normalizedHtml, "a", "span")
}
