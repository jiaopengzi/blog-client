/**
 * @FilePath     : \blog-client\src\utils\lineNumbers.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 行号工具类
 */

// markdown 标题行号类型
export interface MarkdownHeadingLineType {
    markdownHeading: string // markdown 标题
    markdownLineNumber: number // markdown行号
}

/**
 * @description: 从 markdown 字符串中获取所有标题行号
 * @param markdownStr 源字符串
 * @return       标题,行号数组
 */
export function getMarkdownHeadingLines(markdownStr: string): MarkdownHeadingLineType[] {
    // console.log('markdownStr====>length', markdownStr.length)
    const lines = markdownStr.split("\n")
    const targetLines = []

    for (let i = 0; i < lines.length; i++) {
        // const matchArray = lines[i].match(/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/)
        const matchArray = lines[i].match(/^ {0,3}(#{1,6})\s+(.*)(?:\n+|$)/)
        if (matchArray) {
            targetLines.push({
                markdownHeading: lines[i],
                markdownLineNumber: i + 1,
            })
        }
    }
    return targetLines
}
