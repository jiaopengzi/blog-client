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
import { getActiveImageCaptionFormat } from "@/pkg/marked/extension/renderer"
import createMarked from "@/pkg/marked/new-marked"
import { copyHtml } from "@/utils/clipboard"
import { escapeWhitespaceInHtmlContent } from "@/utils/escape"
import { HasParentByClass } from "@/utils/getParentByClass"
import { extractImageUrlsFromHtml } from "@/utils/img"
import { MessageUtil } from "@/utils/message"
import { htmlTagReplace } from "@/utils/tagReplace"

import { CommandsKey } from "./command"
import { defaultCommandKeys } from "./command"
import type { Heading } from "./components/toc"
import type {
    EditorState,
    EditorStateOptions,
    FilteredStyles,
    InlineStyleApplyContext,
    KatexCaptureContext,
    KatexImageCacheEntry,
    MarkdownHeadingLine,
    RegexCache,
} from "./types"

type MarkdownRenderResult = {
    html: string
    tocHtml: Heading[]
    imgUrls: string[]
}

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
        vimMappings: [], // Vim 用户快捷键映射
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

// 拷贝流水线每 yield 的间隔时间
const COPY_PIPELINE_YIELD_INTERVAL = 20

// katex 图片缓存，键为公式的 HTML 内容和截图尺寸的 JSON 字符串，值为包含图片 src 和尺寸信息的对象
const katexImageCache = new Map<string, KatexImageCacheEntry>()
const MARKDOWN_RENDER_CACHE_LIMIT = 20
const markdownRenderCache = new Map<string, MarkdownRenderResult>()
const markdownSanitizeConfig: Config = {
    CUSTOM_ELEMENT_HANDLING: {
        tagNameCheck: (tagName) => !!tagName.match(regexCache.customElementHeadingTagNameRegex),
        attributeNameCheck: (attr) => !!attr.match(regexCache.customElementHeadingAttributeNameRegex),
        allowCustomizedBuiltInElements: true,
    },
}

/**
 * getCachedValue 从 LRU Map 中读取缓存, 并刷新当前项的最近使用顺序.
 * @param cache 缓存 Map.
 * @param key 缓存 key.
 * @returns 命中的缓存值, 未命中时返回 undefined.
 */
function getCachedValue<T>(cache: Map<string, T>, key: string): T | undefined {
    const cachedValue = cache.get(key)
    if (cachedValue === undefined) {
        return undefined
    }

    cache.delete(key)
    cache.set(key, cachedValue)
    return cachedValue
}

/**
 * setCachedValue 将结果写入 LRU Map, 并按上限回收最旧缓存.
 * @param cache 缓存 Map.
 * @param key 缓存 key.
 * @param value 缓存值.
 * @param limit 缓存上限.
 */
function setCachedValue<T>(cache: Map<string, T>, key: string, value: T, limit: number): void {
    if (cache.has(key)) {
        cache.delete(key)
    }

    cache.set(key, value)

    while (cache.size > limit) {
        const oldestKey = cache.keys().next().value
        if (!oldestKey) {
            break
        }
        cache.delete(oldestKey)
    }
}

/**
 * cloneMarkdownRenderResult 克隆缓存中的 Markdown 渲染结果, 避免外部修改缓存对象.
 * @param result 原始渲染结果.
 * @returns 克隆后的渲染结果.
 */
function cloneMarkdownRenderResult(result: MarkdownRenderResult): MarkdownRenderResult {
    return {
        html: result.html,
        tocHtml: result.tocHtml.map((heading) => ({ ...heading })),
        imgUrls: [...result.imgUrls],
    }
}

/**
 * getMarkdownRenderVariantKey 获取当前 Markdown 渲染环境的变体键。
 * 当前用于区分会影响最终 HTML 输出的图注格式, 避免不同模式错误复用同一份缓存。
 * @returns 当前渲染环境对应的变体键。
 */
function getMarkdownRenderVariantKey(): string {
    return `image-caption:${getActiveImageCaptionFormat()}`
}

/**
 * getMarkdownRenderCacheKey 为 Markdown 渲染结果生成缓存 key.
 * @param markdownSrc Markdown 原文.
 * @param isRemoveFirstH1 是否移除首个 H1.
 * @returns 当前输入对应的缓存 key.
 */
function getMarkdownRenderCacheKey(markdownSrc: string, isRemoveFirstH1: boolean): string {
    return `${Number(isRemoveFirstH1)}:${getMarkdownRenderVariantKey()}:${markdownSrc}`
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
 * getFirstLevelOneMarkdownHeadingText 提取 Markdown 中首个一级标题文本.
 * @param markdownStr Markdown 原文.
 * @returns 首个一级标题文本, 未命中时返回空字符串.
 */
export function getFirstLevelOneMarkdownHeadingText(markdownStr: string): string {
    const { markdownHeadingRegex } = regexCache
    const matches = markdownStr.matchAll(markdownHeadingRegex)

    for (const match of matches) {
        const headingLevelToken = match[1]
        const headingText = match[2]?.trim() ?? ""

        if (headingLevelToken === "#" && headingText) {
            return headingText
        }
    }

    return ""
}

/**
 * getSafeHeadingCurrentIndex 将当前目录高亮索引收敛到合法范围.
 * @param currentIndex 当前高亮索引.
 * @param headingsLength 当前目录长度.
 * @returns 合法索引, 无目录时返回 -1.
 */
export function getSafeHeadingCurrentIndex(currentIndex: number, headingsLength: number): number {
    if (headingsLength <= 0) {
        return -1
    }

    if (currentIndex < 0) {
        return 0
    }

    if (currentIndex >= headingsLength) {
        return headingsLength - 1
    }

    return currentIndex
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
    return renderMarkdownDocument(markdownSrc, isRemoveFirstH1).html
}

/**
 * renderMarkdownDocument 将 Markdown 一次性转换为预览所需的完整渲染产物, 并在相同输入下复用缓存.
 * @param markdownSrc Markdown 字符串.
 * @param isRemoveFirstH1 是否移除第一个 H1 标签.
 * @returns 包含 html, tocHtml 和 imgUrls 的渲染结果.
 */
export function renderMarkdownDocument(markdownSrc: string, isRemoveFirstH1: boolean): MarkdownRenderResult {
    const cacheKey = getMarkdownRenderCacheKey(markdownSrc, isRemoveFirstH1)
    const cachedResult = getCachedValue(markdownRenderCache, cacheKey)

    if (cachedResult) {
        return cloneMarkdownRenderResult(cachedResult)
    }

    const markdownParse = createMarked().parse(markdownSrc).toString()
    const normalizedHtml = htmlHandleUtf8BOM(markdownParse)
    let purifiedHtml = DOMPurify.sanitize(normalizedHtml, markdownSanitizeConfig) as string

    if (isRemoveFirstH1) {
        purifiedHtml = htmlRemoveFirstH1(purifiedHtml)
    }

    const html = generateAllHeadingAnchor(purifiedHtml)
    const result: MarkdownRenderResult = {
        html,
        tocHtml: matchAllHeadingToList(html),
        imgUrls: extractImageUrlsFromHtml(html),
    }

    setCachedValue(markdownRenderCache, cacheKey, result, MARKDOWN_RENDER_CACHE_LIMIT)
    return cloneMarkdownRenderResult(result)
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
async function waitForDocumentFontsReady(): Promise<void> {
    if (typeof document === "undefined" || !("fonts" in document)) {
        return
    }

    await document.fonts.ready
}

/**
 * @description: 等待下一帧渲染时机, 用于在批量复制流程中主动让出主线程.
 * @return 下一帧到来后结束的 Promise.
 */
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

/**
 * @description: 生成 KaTeX 图片缓存键, 复用相同公式与尺寸的截图结果.
 * @param katex KaTeX 根节点.
 * @param captureContext 当前截图上下文.
 * @return 缓存键字符串.
 */
function getKatexImageCacheKey(katex: HTMLElement, captureContext: KatexCaptureContext): string {
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
function createKatexImageFromCache(cacheEntry: KatexImageCacheEntry): HTMLImageElement {
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

/**
 * @description: 获取 CSSStyleRule 列表
 * @param cssStyleSheets 外部样式表列表和索引
 * @return CSSStyleRule 列表
 */
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

/**
 * CSS 简写属性到长写属性的展开映射。
 * 复制链路中 getComputedStyle 对简写属性的返回值不稳定(常为空), 需将简写展开为长写,
 * 循环结束后统一从 computedStyle 读取长写值下发, 避免简写之间的级联覆盖问题。
 * 新增简写类型只需在此添加条目, 无需修改其他函数。
 */
const CSS_SHORTHAND_EXPANSION: Readonly<Record<string, readonly string[]>> = {
    border: [
        "border-top-width", "border-top-style", "border-top-color",
        "border-right-width", "border-right-style", "border-right-color",
        "border-bottom-width", "border-bottom-style", "border-bottom-color",
        "border-left-width", "border-left-style", "border-left-color",
    ],
    "border-top": ["border-top-width", "border-top-style", "border-top-color"],
    "border-right": ["border-right-width", "border-right-style", "border-right-color"],
    "border-bottom": ["border-bottom-width", "border-bottom-style", "border-bottom-color"],
    "border-left": ["border-left-width", "border-left-style", "border-left-color"],
}

/**
 * isHeadingElement 判断元素是否为 h1-h6 标题元素。
 * @param el 待判断的 DOM 元素。
 * @returns 若为标题元素则返回 true, 否则 false。
 */
function isHeadingElement(el: HTMLElement | SVGElement): boolean {
    return el instanceof HTMLElement && /^H[1-6]$/.test(el.tagName)
}

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

// 需要过滤的预设样式值
const WideKeywords: ReadonlySet<string> = new Set(["initial", "inherit", "revert", "revert-layer", "unset"])

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
        if (!WideKeywords.has(value.toLowerCase())) {
            filteredStyles[property] = value
        }
    }

    return filteredStyles
}

/**
 * normalizeBorderWidth 将浏览器缩放导致的分数像素宽度归一化为整数。
 * 只处理 px 单位, 其余单位原样返回。取整后若为 0 则保留原值, 避免丢失有意的细边框。
 * @param width CSS 边框宽度字符串, 如 "1.81818px"。
 * @returns 归一化后的宽度字符串, 如 "2px"。
 */
export function normalizeBorderWidth(width: string): string {
    if (!width.endsWith("px")) return width
    const num = parseFloat(width)
    if (!Number.isFinite(num)) return width
    const rounded = Math.round(num)
    if (rounded <= 0) return width
    return `${rounded}px`
}

/**
 * applyBorderLonghandsFromComputedStyle 从 computedStyle 中提取可见的 border 长写值写入克隆节点。
 * 仅处理 inlineStyleRecord 中存在 border 简写属性的对应边, 避免无边框元素写入多余的 0px none。
 * 对 px 宽度值调用 normalizeBorderWidth 消除浏览器缩放产生的分数像素。
 * @param clonedEl 克隆的目标节点, 用于写入内联样式。
 * @param inlineStyleRecord 匹配 CSS 规则的属性字典, 用于检测存在哪些 border 简写。
 * @param computedStyle 原始节点的计算样式, 作为长写值的唯一数据源。
 */
function applyBorderLonghandsFromComputedStyle(
    clonedEl: HTMLElement | SVGElement,
    inlineStyleRecord: Record<string, string>,
    computedStyle: FilteredStyles,
): void {
    const sideByShorthand: Record<string, "top" | "right" | "bottom" | "left"> = {
        "border-top": "top",
        "border-right": "right",
        "border-bottom": "bottom",
        "border-left": "left",
    }
    const sides = new Set<"top" | "right" | "bottom" | "left">()

    for (const property of Object.keys(inlineStyleRecord)) {
        if (property === "border") {
            sides.add("top").add("right").add("bottom").add("left")
        } else if (sideByShorthand[property]) {
            sides.add(sideByShorthand[property])
        }
    }

    for (const side of sides) {
        const width = computedStyle[`border-${side}-width`] ?? ""
        const style = computedStyle[`border-${side}-style`] ?? ""
        const color = computedStyle[`border-${side}-color`] ?? ""

        const normalizedWidth = normalizeBorderWidth(width)
        const widthNum = parseFloat(normalizedWidth)
        if (!normalizedWidth || !Number.isFinite(widthNum) || widthNum <= 0) continue
        if (!style || style === "none" || style === "hidden") continue

        clonedEl.style.setProperty(`border-${side}-width`, normalizedWidth)
        clonedEl.style.setProperty(`border-${side}-style`, style)
        if (color) {
            clonedEl.style.setProperty(`border-${side}-color`, color)
        }
    }
}

/**
 * applyInlineStylesToElement 将原始元素的计算样式应用为克隆元素的内联样式(两阶段)。
 * Phase 1: 写入非简写属性, 跳过 CSS_SHORTHAND_EXPANSION 中的简写及 heading 的 border longhand,
 *   避免 reset 与特定规则之间的迭代顺序导致级联覆盖错误。
 * Phase 2: 由 applyBorderLonghandsFromComputedStyle 以 computedStyle 为数据源统一下发 border 长写值。
 *   对 heading 额外强制展开 border, 解决 var() 导致 CSSOM 简写为空的问题。
 * @param originalEl 原始元素(用于读取 computedStyle 和判断 heading)。
 * @param clonedEl 克隆元素(用于写入 inline style)。
 * @param matchedRules 克隆元素匹配到的 CSS 规则列表。
 * @param computedStyle 过滤后的计算样式对象。
 * @param applyContext 内联样式应用过程中的缓存上下文。
 */
function applyInlineStylesToElement(
    originalEl: HTMLElement | SVGElement,
    clonedEl: HTMLElement | SVGElement,
    matchedRules: CSSStyleRule[],
    computedStyle: FilteredStyles,
    applyContext: InlineStyleApplyContext,
) {
    if (!computedStyle || Object.keys(computedStyle).length === 0) return

    const isKatex = hasClassName(originalEl, "katex")
    if (isKatex) return

    const isPreCode = hasClassName(originalEl, "pre-code-container")
    const isHeading = isHeadingElement(originalEl)

    const inlineStyleRecord = getInlineStyleRecord(clonedEl, matchedRules, isPreCode, applyContext)

    Object.keys(inlineStyleRecord).forEach((property) => {
        const cssStyleValue = inlineStyleRecord[property]

        if (CSS_SHORTHAND_EXPANSION[property]) {
            return
        }

        if (isHeading && property.startsWith("border-")) {
            return
        }

        if (/^border-(top|right|bottom|left)-width$/.test(property)) {
            clonedEl.style.setProperty(property, cssStyleValue)
            return
        }

        const computedStyleValue = computedStyle[property]

        if (!cssStyleValue || !computedStyleValue) return

        const notUseComputedStyleValues = [
            "auto", "100%", "100vw", "100vh", "normal", "none",
        ]

        if (cssStyleValue !== computedStyleValue && !notUseComputedStyleValues.includes(cssStyleValue)) {
            clonedEl.style.setProperty(property, computedStyleValue)
        } else {
            clonedEl.style.setProperty(property, cssStyleValue)
        }
    })

    applyBorderLonghandsFromComputedStyle(clonedEl, inlineStyleRecord, computedStyle)

    if (isHeading) {
        applyBorderLonghandsFromComputedStyle(clonedEl, { border: "" }, computedStyle)
    }

    if (WechatCssAllWhiteList.length > 0) {
        WechatCssAllWhiteList.forEach((property) => {
            const cssStyleValue = computedStyle[property]
            if (cssStyleValue) {
                clonedEl.style.setProperty(property, cssStyleValue)
            }
        })
    }
}

/**
 * @description: 获取节点签名对应的内联样式字典, 命中缓存时避免重复展开样式规则.
 * @param element 当前克隆节点.
 * @param matchedRules 已匹配到的样式规则列表.
 * @param isPreCode 是否为代码块容器.
 * @param applyContext 内联样式应用过程中的缓存上下文.
 * @return 内联样式属性字典.
 */
function getInlineStyleRecord(
    element: HTMLElement | SVGElement,
    matchedRules: CSSStyleRule[],
    isPreCode: boolean,
    applyContext: InlineStyleApplyContext,
): Record<string, string> {
    // 同类节点会重复命中相同样式签名, 这里缓存展开后的属性字典, 降低批量复制时的规则遍历成本.
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

                // 含 var() 的简写属性(如 border-bottom: 2px solid var(--xxx))在 CSSOM 中 getPropertyValue 返回空,
                // 但仍需保留其键名, 以便 applyBorderLonghandsFromComputedStyle 从 computedStyle 展开长写值。
                if (!cssStyleValue) {
                    if (CSS_SHORTHAND_EXPANSION[property]) {
                        inlineStyleRecord[property] = ""
                    }
                    continue
                }

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

/**
 * @description: 获取当前节点匹配到的样式规则, 并按节点签名缓存结果.
 * @param element 当前节点.
 * @param cssStyleRules 可用的样式规则列表.
 * @param applyContext 内联样式应用过程中的缓存上下文.
 * @return 当前节点命中的样式规则数组.
 */
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

/**
 * @description: 收集当前节点真正需要读取的计算样式属性, 避免全量遍历 computedStyle.
 * @param element 当前节点.
 * @param matchedRules 当前节点命中的样式规则.
 * @param applyContext 内联样式应用过程中的缓存上下文.
 * @return 需要读取的属性名列表.
 */
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

            // 将简写属性展开为对应长写, 确保 filterInvalidComputedStyles 通过 getComputedStyle 读到长写值。
            const longhands = CSS_SHORTHAND_EXPANSION[property]
            if (longhands) {
                longhands.forEach((longhand) => propertySet.add(longhand))
            }
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
    applyContext.computedPropertyCache.set(cacheKey, relevantProperties)
    return relevantProperties
}

/**
 * @description: 为节点生成样式缓存签名, 用于复用规则匹配和属性展开结果.
 * @param element 当前节点.
 * @return 节点签名字符串.
 */
function getInlineStyleRuleCacheKey(element: HTMLElement | SVGElement): string {
    // 复制链路里的缓存以标签名、id 和稳定排序后的 class 组合作为签名, 兼顾命中率与实现复杂度.
    // oxlint-disable-next-line unicorn/no-array-sort
    const classNames = "classList" in element && element.classList instanceof DOMTokenList ? Array.from(element.classList).sort().join(".") : ""
    const tagName = "tagName" in element ? element.tagName.toLowerCase() : ""
    const id = "id" in element ? element.id : ""

    return `${tagName}#${id}.${classNames}`
}

/**
 * @description: 分批处理待复制节点队列, 在批次间让出一帧以减轻长任务阻塞.
 * @param queue 待处理的原始节点与克隆节点配对队列.
 * @param cssStyleRules 已展开的样式规则列表.
 * @param applyContext 内联样式应用过程中的缓存上下文.
 * @return void.
 */
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

        // 在原始节点上做 CSS 选择器匹配, 而非克隆节点。
        // 克隆节点在离屏容器中丢失了 #preview 等祖先上下文, 导致后代选择器(如 #preview h1)匹配失败。
        const matchedRules = getMatchedCssStyleRules(originalEl, cssStyleRules, applyContext)
        const relevantProperties = getRelevantComputedStyleProperties(originalEl, matchedRules, applyContext)
        const computedStyle = filterInvalidComputedStyles(originalEl, relevantProperties)

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

/**
 * @description: 对整棵克隆树分批应用内联样式, 保留复制链路所需的缓存复用能力.
 * @param originalRoot 原始预览根节点.
 * @param clonedRoot 克隆后的预览根节点.
 * @param cssStyleRules 已展开的样式规则列表.
 * @return void.
 */
async function applyInlineStylesInBatches(
    originalRoot: HTMLElement | SVGElement,
    clonedRoot: HTMLElement | SVGElement,
    cssStyleRules: CSSStyleRule[],
): Promise<void> {
    const queue: Array<{ originalEl: HTMLElement | SVGElement; clonedEl: HTMLElement | SVGElement }> = [{ originalEl: originalRoot, clonedEl: clonedRoot }]
    const applyContext: InlineStyleApplyContext = {
        matchedRuleCache: new Map<string, CSSStyleRule[]>(),
        computedPropertyCache: new Map<string, string[]>(),
        inlineStyleRecordCache: new Map<string, Record<string, string>>(),
    }

    // 分批处理并在批次间让出一帧, 避免大文档复制时长时间阻塞主线程.
    await processInlineStyleQueue(queue, cssStyleRules, applyContext)
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
        await applyInlineStylesInBatches(element, clonedElement, cssStyleRules)

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
function normalizePreparedCopyHtml(html: string): string {
    let normalizedHtml = html

    // html 中 `<pre class="pre-code pre-code_nowrap` 替换为 `<pre class="code-snippet code-snippet_nowrap`
    // 兼容微信微信公众号编辑器代码块和代码片段样式
    normalizedHtml = normalizedHtml.replace(/<pre class="pre-code pre-code_nowrap/g, '<pre class="code-snippet code-snippet_nowrap')
    normalizedHtml = escapeWhitespaceInHtmlContent(normalizedHtml)

    // 将 a 标签替换为 span 标签 防止微信编辑器自动添加链接, 保证样式不变同时不影响内容
    return htmlTagReplace(normalizedHtml, "a", "span")
}
