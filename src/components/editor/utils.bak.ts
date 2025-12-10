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
import { HasParentByClass } from "@/utils/getParentByClass"
import { MessageUtil } from "@/utils/message"

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
    }
}

// 正则表达式缓存
const regexCache = createRegexCache()

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
        // 判断是否已经有锚点, 如果已经有锚点，则不进行处理
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

/**
 * @description : 通过正则表达式匹配 html 中所有的 h 标签 并转换为 HeadingType 数组
 * @param html  : html 字符串
 * @return      : 匹配到的 h 标签数组
 */
export function matchAllHeadingToList(html: string): Heading[] {
    const { hTagRegex, hTagLevelRegex, hTagAnchorRegex, htmlTagRegex } = regexCache
    const matches = html.match(hTagRegex) || [] // 匹配到的 h 标签数组
    const headingList: Heading[] = [] // h 标签数组
    let headingIndex = 0 // 标题索引

    matches.forEach((item) => {
        // 遍历匹配到的 h 标签数组
        const level = Number(item.match(hTagLevelRegex)?.[1]) || 1 // h 标签的等级
        const text = item.replace(htmlTagRegex, "") // h 标签的文本
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
 * @description: 将 div 替换为 section
 * @param htmlSrc html 源码
 * @return  替换后的 html 源码
 */
export function htmlHandleDivToSection(htmlSrc: string) {
    return htmlSrc
        .replace(/<div(\s[^>]*)?>/g, (match, attributes) => {
            // 保留原有的属性，只替换标签名
            return `<section${attributes || ""}>`
        })
        .replace(/<\/div>/g, "</section>")
}

/**
 * @description: 将 katex 公式转成图片 为了微信预览
 * @param container 预览容器
 * @param className katex 公式的类名
 */
export async function katexToImage(container: HTMLElement, className: string = "katex-html") {
    // 获取所有 katex 公式
    const katexArray = Array.from(container.getElementsByClassName(className))
    if (katexArray) {
        // 遍历所有 katex 公式
        for (let i = 0; i < katexArray.length; i++) {
            // 当前 katex 公式
            const katex = katexArray[i] as HTMLElement

            // 判断 katex 是否有父元素 的类名为 katex-display
            const isKatexDisplay = HasParentByClass(katex, "katex-display")

            // 获取 katex 滚动宽度
            const katexScrollWidth = katex.scrollWidth // katex 滚动宽度
            const katexOffsetWidth = katex.offsetWidth * 1 // katex 宽度
            const katexOffsetHeight = katex.offsetHeight * 1 // katex 高度

            // 获取宽度 如果是行内公式则使用 katex 的宽度 如果是行间公式则使用 katex 的滚动宽度
            const getWidth = () => (isKatexDisplay ? katexScrollWidth : katexOffsetWidth)

            // // 使用 canvas 将 katex 转成图片 scale 为 3 是为了提高图片清晰度
            // const canvas = await html2canvas(katex, {
            //     scale: 3,
            //     backgroundColor: "#ffffff80",
            //     logging: false,
            //     width: getWidth(),
            //     height: katexOffsetHeight,
            // })
            // const imageDataURL = canvas.toDataURL("image/png") // 转成图片的 base64
            // const img = document.createElement("img") // 创建 img 元素
            // img.src = imageDataURL // 设置图片的 src

            // // 根据是否行内公式设置 img 元素的属性
            // if (isKatexDisplay) {
            //     img.style.width = `100%` // 设置图片的宽度
            // } else {
            //     // 需要单独一个添加 不能用 setAttribute 会被覆盖
            //     img.style.width = `${getWidth()}px` // 设置图片的宽度
            //     img.style.display = "inline-block" // 设置 img 元素的 display 为 inline-block 行内显示
            //     img.style.verticalAlign = "text-top" // 设置 img 元素的 vertical-align 为 text-top 使其与文字对齐
            // }
            // katex.parentNode?.replaceChild(img, katex) // 替换 katex 公式

            // 使用 snapdom 将 katex 转成图片
            const snap = await snapdom(katex)
            const svg = await snap.toSvg({
                scale: 3,
                backgroundColor: "#ffffff80",
                width: getWidth(),
                height: katexOffsetHeight,
            })

            // 根据是否行内公式设置 svt 元素的属性
            if (isKatexDisplay) {
                svg.style.width = `100%` // 设置图片的宽度
            } else {
                // 需要单独一个添加 不能用 setAttribute 会被覆盖
                svg.style.width = `${getWidth()}px` // 设置图片的宽度
                svg.style.display = "inline-block" // 设置 img 元素的 display 为 inline-block 行内显示
                svg.style.verticalAlign = "text-top" // 设置 img 元素的 vertical-align 为 text-top 使其与文字对齐
            }

            katex.parentNode?.replaceChild(svg, katex) // 替换 katex 公式
        }
    }
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
    htmlSrc = htmlHandleDivToSection(htmlSrc)
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
    const styleSheets = Array.from(document.styleSheets).map((styleSheet, index) => [styleSheet as CSSStyleSheet, index]) as [CSSStyleSheet, number][]

    // 对样式表按照它们在 document.styleSheets 中的位置进行排序
    return styleSheets.sort((a, b) => a[1] - b[1])
}

/**
 * @description: 指定类名的 span 元素是否应该保留其行内样式
 * @param spanElement span元素
 * @param className 类名
 * @return boolean 是否应该保留其行内样式
 */
export function shouldPreserveInlineStyles(element: HTMLElement | SVGElement, className: string): boolean {
    let currentElement: Element | null = element
    while (currentElement) {
        if (currentElement instanceof HTMLSpanElement && currentElement.classList.contains(className)) {
            return true
        }
        currentElement = currentElement.parentElement
    }
    return false
}

/**
 * @description: 递归处理元素将外部样式应用为内联样式
 * @param el 元素
 */
function applyInlineStyles(el: HTMLElement | SVGElement) {
    const cssStyleSheets = getSortedStyleSheets() // 样式表列表
    const isKatex = shouldPreserveInlineStyles(el, "katex") // 是否为 katex 的 span 元素
    if (!isKatex) {
        cssStyleSheets.forEach(([styleSheet]) => {
            try {
                Array.from(styleSheet.cssRules).forEach((rule: CSSRule) => {
                    if (rule instanceof CSSStyleRule) {
                        // 检查选择器是否匹配当前元素
                        if (el.matches(rule.selectorText)) {
                            for (let i = 0; i < rule.style.length; i++) {
                                const property = rule.style[i] // 属性名

                                // 样式表的属性值
                                const cssStyleValue = rule.style.getPropertyValue(property!)

                                // 如果属性值不为空且不为默认值 或者 不是 katex 的 span 元素
                                if (cssStyleValue.startsWith("var(--")) {
                                    // 如果值为 CSS 变量，获取计算后的具体值
                                    el.style.setProperty(property!, getComputedStyle(el).getPropertyValue(property!))
                                } else {
                                    el.style.setProperty(property!, cssStyleValue)
                                }
                            }
                        }
                    }
                })
            } catch (error) {
                console.warn("Error accessing rules in stylesheet:", styleSheet, error)
            }
        })
    }

    // 递归处理子元素
    Array.from(el.children).forEach((child) => {
        if (child instanceof HTMLElement || child instanceof SVGElement) {
            applyInlineStyles(child as HTMLElement | SVGElement)
        }
    })
}

// /**
//  * @description: 复制带有自定义样式的内容
//  * @param element 要复制的元素
//  */
// export async function copyWithCustomStyle(element: HTMLElement): Promise<void> {
//     try {
//         // 将 katex 公式转成图片
//         await katexToImage(element)
//         // 将外部样式应用为内联样式
//         applyInlineStyles(element)

//         // 获取带有内联样式的 HTML 字符串
//         const html = element.innerHTML
//         console.log("============>html", html)

//         // if (window.location.protocol === 'https:' && typeof ClipboardItem !== 'undefined') {
//         if (typeof ClipboardItem !== "undefined") {
//             // 创建一个包含要复制 HTML 的 blob
//             console.log("新复制api")
//             const contentNoStyle = new Blob([html], { type: "text/plain" })
//             const contentWithStyle = new Blob([html], { type: "text/html" })

//             // 使用 clipboardItem 设置格式和数据
//             const clipboardItemInput = new ClipboardItem({
//                 "text/plain": contentNoStyle,
//                 "text/html": contentWithStyle,
//             })

//             // 写入剪贴板
//             await navigator.clipboard.write([clipboardItemInput])
//             MessageUtil.success("内容已复制到剪贴板")
//         } else {
//             console.log("老复制api")
//             const textArea = document.createElement("textarea")
//             textArea.style.position = "fixed"
//             textArea.style.top = "0"
//             textArea.style.left = "0"
//             textArea.value = html
//             document.body.appendChild(textArea)
//             textArea.focus()
//             textArea.select()
//             try {
//                 const successful = document.execCommand("copy")
//                 const msg = successful ? "内容已复制到剪贴板" : "无法复制内容0"
//                 if (successful) {
//                     MessageUtil.success(msg)
//                 } else {
//                     MessageUtil.error(msg)
//                 }
//             } catch (err) {
//                 console.error("无法复制内容1", err)
//                 MessageUtil.error("无法复制内容1")
//             } finally {
//                 document.body.removeChild(textArea)
//             }
//         }
//     } catch (err) {
//         console.error("无法复制内容2", err)
//         MessageUtil.error("无法复制内容2")
//     }
// }

/**
 * @description: 复制带有自定义样式的内容
 * @param element 要复制的元素
 */
export async function copyWithCustomStyle(element: HTMLElement): Promise<void> {
    MessageUtil.success("复制中...")
    try {
        // 将 katex 公式转成图片
        await katexToImage(element)

        // 将外部样式应用为内联样式
        applyInlineStyles(element)

        // 获取带有内联样式的 HTML 字符串
        const html = element.innerHTML
        console.log("============>html", html)

        // 复制 html 到剪贴板
        await copyHtml(html)
        MessageUtil.success("内容已复制到剪贴板")
    } catch (err) {
        console.error("无法复制内容", err)
        MessageUtil.error("无法复制内容")
    }
}
