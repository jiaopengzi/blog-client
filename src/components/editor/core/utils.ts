/**
 * @Author       : jiaopengzi
 * @Date         : 2024-10-19 14:00:38
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-20 19:17:37
 * @FilePath     : \blog-client\src\components\editor\core\utils.ts
 * @Description  : 编辑器工具函数
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { EditorState, HeadingType, MarkdownHeadingLineType } from "./types"

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
    }
}

// 使用闭包缓存正则表达式
interface RegexCache {
    hTagRegex: RegExp // 匹配 h 标签
    hTagLevelRegex: RegExp // 匹配 h 标签的等级
    hTagAnchorRegex: RegExp // 匹配 h 标签的锚点
    htmlTagRegex: RegExp // 匹配所有 HTML 标签
    markdownHeadingRegex: RegExp // 匹配 markdown 标题
}

/**
 * @description: 使用闭包创建正则表达式缓存
 * @return {Object} 正则表达式缓存
 */
const createRegexCache = (): RegexCache => {
    const hTagRegex = /<h\d.*?>.*?<\/h\d>/g // 匹配 h 标签
    const hTagLevelRegex = /<h(\d).*?>/ // 匹配 h 标签的等级
    const hTagAnchorRegex = /id="(.*)"/ // 匹配 h 标签的锚点
    const htmlTagRegex = /<.*?>/g // 匹配所有 HTML 标签
    const markdownHeadingRegex = /^ {0,3}(#{1,6})\s+(.*)(?:\n+|$)/ // 匹配 markdown 标题

    return {
        hTagRegex,
        hTagLevelRegex,
        hTagAnchorRegex,
        htmlTagRegex,
        markdownHeadingRegex,
    }
}

// 正则表达式缓存
const regexCache = createRegexCache()

/**
 * @description : 通过正则表达式匹配 html 中所有的 h 标签 并转换为 HeadingType 数组
 * @param html  : html 字符串
 * @return      : 匹配到的 h 标签数组
 */
export function matchAllHeadingToList(html: string): HeadingType[] {
    const { hTagRegex, hTagLevelRegex, hTagAnchorRegex, htmlTagRegex } = regexCache
    const matches = html.match(hTagRegex) || [] // 匹配到的 h 标签数组
    const headingList: HeadingType[] = [] // h 标签数组

    matches.forEach((item) => {
        // 遍历匹配到的 h 标签数组
        const level = Number(item.match(hTagLevelRegex)?.[1]) || 0 // h 标签的等级
        const text = item.replace(htmlTagRegex, "") // h 标签的文本
        const anchor = item.match(hTagAnchorRegex)?.[1] // h 标签的锚点
        headingList.push({
            level,
            text,
            anchor,
        })
    })

    return headingList
}

/**
 * @description: 从 markdown 字符串中获取所有标题行号
 * @param markdownStr 源字符串
 * @return       标题,行号数组
 */
export function getMarkdownHeadingLines(markdownStr: string): MarkdownHeadingLineType[] {
    const { markdownHeadingRegex } = regexCache
    const lines = markdownStr.split("\n")
    const targetLines: MarkdownHeadingLineType[] = []

    for (let i = 0; i < lines.length; i++) {
        const matchArray = lines[i].match(markdownHeadingRegex)
        if (matchArray) {
            targetLines.push({
                markdownHeading: lines[i],
                markdownLineNumber: i + 1,
            })
        }
    }

    return targetLines
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
