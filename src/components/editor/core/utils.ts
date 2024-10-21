/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-19 14:00:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-21 15:49:56
 * @FilePath     : \blog-client\src\components\editor\core\utils.ts
 * @Description  : 编辑器工具函数
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { EditorState, Heading, MarkdownHeadingLine } from "./types"

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
