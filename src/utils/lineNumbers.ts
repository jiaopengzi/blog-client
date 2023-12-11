/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-10 17:55:55
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-11 15:32:28
 * @FilePath     : \blog-client\src\utils\lineNumbers.ts
 * @Description  : 行号工具类
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
import { marked } from 'marked'
/**
 * @description: 从源字符串中查找标题字符串所在的行号
 * @param targetStr  目标字符串
 * @param srcStr    源字符串
 * @return        目标字符串所在的行号数组 存在多个相同字符串时，返回多个行号
 */
export function findHeadingLines(srcStr: string, headingStr: string): number[] {
  const lineNumbers = []
  const lines = srcStr.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const mathcArray = lines[i].match(/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/)
    const htmlStr = marked.parse(lines[i]).toString()
    if (mathcArray) {
      if (htmlStr.includes(headingStr)) {
        lineNumbers.push(i + 1)
      }
    }
  }

  return lineNumbers
}

// markdown 标题行号类型
export interface MarkdownHeadingLineType {
  markdownheading: string // markdown 标题
  markdownLineNumber: number // markdown行号
}

/**
 * @description: 从 markdown 字符串中获取所有标题行号
 * @param markdownStr 源字符串
 * @return       标题,行号数组
 */
export function getMarkdownHeadingLines(markdownStr: string): MarkdownHeadingLineType[] {
  const targetLines = []
  const lines = markdownStr.split('\n')

  for (let i = 0; i < lines.length; i++) {
    const mathcArray = lines[i].match(/^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/)
    if (mathcArray) {
      targetLines.push({
        markdownheading: lines[i],
        markdownLineNumber: i + 1,
      })
    }
  }

  return targetLines
}

