/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-19 14:00:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-26 00:00:08
 * @FilePath     : \blog-client\src\components\editor\core\utils.ts
 * @Description  : 编辑器工具函数
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { EditorState, Heading, MarkdownHeadingLine } from "./types"
import createMarked from "@/pkg/marked/new-marked"
import DOMPurify from "dompurify"
import html2canvas from "html2canvas"
import { ShowMsgTip } from "@/utils/message"
import { HasParentByClass } from "@/utils/getParentByClass"
import { CustomElementVideoPlayer, CustomElementAttributes } from "../preview"

/**
 * @description : 创建空值编辑器信息
 * @return      : 空值编辑器信息
 */
export function createEmptyEditorState(): EditorState {
    return {
        tocMarkdown: [], // markdown 目录内容
        tocHtml: [], // html 目录内容
        tocShow: false, // 是否显示目录
        editor: "", // 编辑器内容
        editorShow: true, // 是否显示编辑器
        preview: "", // 预览内容
        previewShow: true, // 是否显示预览
        imgUrls: [], // 图片链接数组
        isShowElImageViewer: false, // 是否显示图片预览组件
        scrollHideViewStr: "", // 滚动条隐藏的编辑器 markdown 字符串
        isAsyncScroll: true, // 是否异步滚动
        isFullScreen: false, // 是否全屏
        isShowEmojiPicker: false, // 是否显示 emoji picker
        isShowPreviewWechat: false, // 是否显示微信预览
        isShortcutKey: true, // 默认开启快捷键
        width: 1200, // 编辑器宽度
        isUserScrollPreview: true, // 用户是否滚动预览
        headingShowCurrentIndex: 0, // 目录显示当前索引
    }
}

// 使用闭包缓存正则表达式
interface RegexCache {
    hTagRegex: RegExp // 匹配 h 标签
    hTagStartRegex: RegExp // 匹配 h 标
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
const updateAttributeNames = (
    tarAttributeNames: Array<string>,
    srcAttributeNamesList: Array<Array<string>>,
) => {
    // /id|class/ DOMPurify 允许的 自定义元素的属性名
    for (let i = 0; i < srcAttributeNamesList.length; i++) {
        const srcAttributeNames = srcAttributeNamesList[i]
        for (let j = 0; j < srcAttributeNames.length; j++) {
            tarAttributeNames.push(srcAttributeNames[j]) // 添加属性名
        }
    }

    return tarAttributeNames
}

/**
 * @description: 使用闭包创建正则表达式缓存
 * @return {Object} 正则表达式缓存
 */
export const createRegexCache = (): RegexCache => {
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
        const videoPlayer = new CustomElementVideoPlayer()
        console.log("videoPlayer.tagName", videoPlayer.tagName.toLocaleLowerCase())
        return new RegExp(`^${videoPlayer.tagName.toLocaleLowerCase()}|^video-test`) // 动态生成正则表达式  DOMPurify 允许的 自定义元素的标签名
    }

    const getCustomElementHeadingAttributeNameRegex = () => {
        // /id|class/ // DOMPurify 允许的 自定义元素的属性名
        const attributeNames: string[] = [] // 属性名数组

        updateAttributeNames(attributeNames, [CustomElementAttributes])

        return new RegExp(`${attributeNames.join("|")}`)
    }

    const utf8BomRegex = /^\uFEFF/ // 匹配 utf-8 bom 头
    const windowsNewLineRegex = /\r\n/g // 匹配 windows 换行符
    const copyButtonRegex = /<button\s+class="[^"]*\bcopy-button\b[^"]*">([^<]*)<\/button>/g // 匹配所有 class 中有 copy-button 的按钮元素

    return {
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
export const anchorGeneratorWithIndex = (
    text: string | undefined,
    index: number | undefined,
): string => {
    if (!text || index === undefined) return ""
    return `${anchorGenerator(text)}-${index.toString()}`
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
        const matchArray = lines[i].match(markdownHeadingRegex)

        if (matchArray) {
            targetLines.push({
                index: headingIndex++,
                markdownHeading: lines[i],
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
    const { hTagRegex, hTagStartRegex, htmlTagRegex } = regexCache
    let headingIndex = 0 // 标题索引

    // 使用 replace 的回调函数处理每个匹配的标题
    return html.replace(hTagRegex, (match) => {
        const text = match.replace(htmlTagRegex, "") // h 标签的文本
        const anchor = anchorGeneratorWithIndex(text, headingIndex++) // h 标签的锚点,标题+索引
        const anchorAndHref = `id="${anchor}"` // 锚点
        return match.replace(hTagStartRegex, `<h$1 ${anchorAndHref}`) // 向 h 标签中添加锚点
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
        const level = Number(item.match(hTagLevelRegex)?.[1]) || 0 // h 标签的等级
        const text = item.replace(htmlTagRegex, "") // h 标签的文本
        const anchor = item.match(hTagAnchorRegex)?.[1] // h 标签的锚点
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
 * @return {String} html 字符串
 */
export function markdownToHtml(markdownSrc: string): string {
    const markdownParse = createMarked().parse(markdownSrc).toString() // markdown 转 html
    const htmlHandleUtf8 = htmlHandleUtf8BOM(markdownParse) // 处理 utf-8 编码问题

    // 配置 DOMPurify 参考: https://www.npmjs.com/package/dompurify
    DOMPurify.setConfig({
        CUSTOM_ELEMENT_HANDLING: {
            tagNameCheck: (tagName) => !!tagName.match(regexCache.customElementHeadingTagNameRegex),
            attributeNameCheck: (attr) =>
                !!attr.match(regexCache.customElementHeadingAttributeNameRegex),
            allowCustomizedBuiltInElements: true, // 允许自定义内置函数
        },
    } as DOMPurify.Config)

    const purifyHtml = DOMPurify.sanitize(htmlHandleUtf8) // 过滤 html,防止 xss 攻击
    return generateAllHeadingAnchor(purifyHtml) // 生成锚点
}

/**
 * @description: 设置是否全屏的类名
 * @param baseClass 基础类名
 * @param fullScreenClass 全屏类名
 * @param isContainerItem 是否是容器子项
 * @param isFullScreen 是否全屏
 * @return {Object} 类名对象
 */
export function setIsFullScreenClassName(
    baseClass: string,
    fullScreenClass: string,
    isContainerItem: boolean,
    isFullScreen: boolean,
): object {
    return {
        [baseClass]: !isFullScreen,
        [fullScreenClass]: isFullScreen,
        "md-container-item": isContainerItem && !isFullScreen,
        "md-container-item-fs": isContainerItem && isFullScreen,
    }
}

/**
 * @description:  处理 utf-8 编码问题
 * @param htmlSrc html 源码
 * @return 替换后的 html 源码
 */
export function htmlHandleUtf8BOM(htmlSrc: string) {
    // 处理 utf-8 编码问题
    return htmlSrc
        .replace(regexCache.utf8BomRegex, "")
        .replace(regexCache.windowsNewLineRegex, "\n") // 去除 BOM 头 和 windows 换行符
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
    // 将 div 替换为 section
    return htmlSrc.replace("<div", "<section").replace("</div>", "</section>")
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
            const katex = katexArray[i] as HTMLElement // 当前 katex 公式
            // 判断 katex 是否有父元素 的类名为 katex-display
            const isKatexDisplay = HasParentByClass(katex, "katex-display")

            // 获取 katex 滚动宽度
            const katexScrollWidth = katex.scrollWidth // katex 滚动宽度
            const katexOffsetWidth = katex.offsetWidth * 1 // katex 宽度
            const katexOffsetHeight = katex.offsetHeight * 1.05 // katex 高度

            // 获取 canvas 宽度 如果是行内公式则使用 katex 的宽度 如果是行间公式则使用 katex 的滚动宽度
            const getCanvasWidth = () => (isKatexDisplay ? katexScrollWidth : katexOffsetWidth)

            // 使用 canvas 将 katex 转成图片 scale 为 3 是为了提高图片清晰度
            const canvas = await html2canvas(katex, {
                scale: 3,
                backgroundColor: "#ffffff80",
                logging: false,
                width: getCanvasWidth(),
                height: katexOffsetHeight,
            })
            const imageDataURL = canvas.toDataURL("image/png") // 转成图片的 base64
            const img = document.createElement("img") // 创建 img 元素
            img.src = imageDataURL // 设置图片的 src

            // 根据是否行内公式设置 img 元素的属性
            if (isKatexDisplay) {
                img.style.width = `100%` // 设置图片的宽度
            } else {
                // 需要单独一个添加 不能用 setAttribute 会被覆盖
                img.style.width = `${getCanvasWidth()}px` // 设置图片的宽度
                img.style.display = "inline-block" // 设置 img 元素的 display 为 inline-block 行内显示
                img.style.verticalAlign = "text-top" // 设置 img 元素的 vertical-align 为 text-top 使其与文字对齐
            }

            katex.parentNode?.replaceChild(img, katex) // 替换 katex 公式
        }
    }
}

/**
 * @description: html 处理微信预览
 * @param htmlSrc html 源码
 * @return  替换后的 html 源码
 */
export function htmlHandleWeChat(htmlSrc: string) {
    htmlSrc = htmlHandleCopyBtns(htmlSrc)
    htmlSrc = htmlHandleDivToSection(htmlSrc)
    return htmlSrc
}

/**
 * @description: 获取所有外部样式表并按照它们在 document.styleSheets 中的位置进行排序
 * @return 已排序的外部样式表列表和索引
 */
function getSortedStyleSheets(): [CSSStyleSheet, number][] {
    const styleSheets = Array.from(document.styleSheets).map((styleSheet, index) => [
        styleSheet as CSSStyleSheet,
        index,
    ]) as [CSSStyleSheet, number][]

    // 对样式表按照它们在 document.styleSheets 中的位置进行排序
    return styleSheets.sort((a, b) => a[1] - b[1])
}

/**
 * @description: 指定类名的 span 元素是否应该保留其行内样式
 * @param spanElement span元素
 * @param className 类名
 * @return boolean 是否应该保留其行内样式
 */
export function shouldPreserveInlineStyles(
    element: HTMLElement | SVGElement,
    className: string,
): boolean {
    let currentElement: Element | null = element
    while (currentElement) {
        if (
            currentElement instanceof HTMLSpanElement &&
            currentElement.classList.contains(className)
        ) {
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

                                const cssStyleValue = rule.style.getPropertyValue(property) // 样式表的属性值

                                // 如果属性值不为空且不为默认值 或者 不是 katex 的 span 元素
                                if (cssStyleValue.startsWith("var(--")) {
                                    // 如果值为 CSS 变量，获取计算后的具体值
                                    el.style.setProperty(
                                        property,
                                        getComputedStyle(el).getPropertyValue(property),
                                    )
                                } else {
                                    el.style.setProperty(property, cssStyleValue)
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

/**
 * @description: 复制带有自定义样式的内容
 * @param element 要复制的元素
 */
// export async function copyWithCustomStyle(element: HTMLElement): Promise<void> {
//   try {
//     // 将 katex 公式转成图片
//     await katexToImage(element)
//     // 将外部样式应用为内联样式
//     applyInlineStyles(element)

//     // 获取带有内联样式的 HTML 字符串
//     const html = element.innerHTML
//     // console.log('html', html)

//     if (typeof ClipboardItem !== 'undefined') {
//       // 创建一个包含要复制 HTML 的 blob
//       const contentNoStyle = new Blob([html], { type: 'text/plain' })
//       const contentWithStyle = new Blob([html], { type: 'text/html' })

//       // 使用 clipboardItem 设置格式和数据
//       const clipboardItemInput = new ClipboardItem({
//         'text/plain': contentNoStyle,
//         'text/html': contentWithStyle,
//       })

//       // 写入剪贴板
//       await navigator.clipboard.write([clipboardItemInput])
//       ShowMsgTip(ShowMsgTip.MsgType.success, '内容已复制到剪贴板')
//     } else {
//       ShowMsgTip(ShowMsgTip.MsgType.warning, '请升级你的浏览器以获得更好的复制功能支持')
//     }
//   } catch (err) {
//     console.error('无法复制内容', err)
//     ShowMsgTip(ShowMsgTip.MsgType.error, '无法复制内容')
//   }
// }

export async function copyWithCustomStyle(element: HTMLElement): Promise<void> {
    try {
        // 将 katex 公式转成图片
        await katexToImage(element)
        // 将外部样式应用为内联样式
        applyInlineStyles(element)

        // 获取带有内联样式的 HTML 字符串
        const html = element.innerHTML

        // if (window.location.protocol === 'https:' && typeof ClipboardItem !== 'undefined') {
        if (typeof ClipboardItem !== "undefined") {
            // 创建一个包含要复制 HTML 的 blob
            console.log("新复制api")
            const contentNoStyle = new Blob([html], { type: "text/plain" })
            const contentWithStyle = new Blob([html], { type: "text/html" })

            // 使用 clipboardItem 设置格式和数据
            const clipboardItemInput = new ClipboardItem({
                "text/plain": contentNoStyle,
                "text/html": contentWithStyle,
            })

            // 写入剪贴板
            await navigator.clipboard.write([clipboardItemInput])
            ShowMsgTip(ShowMsgTip.MsgType.success, "内容已复制到剪贴板")
        } else {
            console.log("老复制api")
            const textArea = document.createElement("textarea")
            textArea.style.position = "fixed"
            textArea.style.top = "0"
            textArea.style.left = "0"
            textArea.value = html
            document.body.appendChild(textArea)
            textArea.focus()
            textArea.select()
            try {
                const successful = document.execCommand("copy")
                const msg = successful ? "内容已复制到剪贴板" : "无法复制内容"
                ShowMsgTip(successful ? ShowMsgTip.MsgType.success : ShowMsgTip.MsgType.error, msg)
            } catch (err) {
                console.error("无法复制内容", err)
                ShowMsgTip(ShowMsgTip.MsgType.error, "无法复制内容")
            } finally {
                document.body.removeChild(textArea)
            }
        }
    } catch (err) {
        console.error("无法复制内容", err)
        ShowMsgTip(ShowMsgTip.MsgType.error, "无法复制内容")
    }
}
