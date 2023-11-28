/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-06 23:28:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-26 11:11:43
 * @FilePath     : \blog-client\src\utils\marked\mark-extension.ts
 * @Description  :  扩展 marked 的解析器，支持 ==mark== 标记
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
// 抽象出 markExtension 到新的 '.ts' 文件，例如: `mark-extension.ts`
type Token = {
  type: string
  raw: string
  text: string
  tokens: any[]
}
import type { TokenizerAndRendererExtension } from 'marked'

export const markExtensionInline: TokenizerAndRendererExtension = {
  name: 'mark',
  level: 'inline',
  start(src: string): number | undefined {
    return src.match(/==[^=\n]/)?.index
  },
  tokenizer(src: string): Token | undefined {
    const rule = /^==([^=]+)==/
    const match = rule.exec(src)
    if (match) {
      const token: Token = {
        type: 'mark',
        raw: match[0],
        text: match[1],
        tokens: [],
      }
      ;(this as any).lexer.inline(token.text, token.tokens) // 使用 "as any" 来解决不存在属性 'lexer'
      return token
    }
  },
  renderer(token): string {
    const customToken = token as Token // 将 Generic 类型转换为自定义 Token 类型
    return `<mark>${(this as any).parser.parseInline(customToken.tokens)}</mark>` // 使用 "as any" 来解决不存在属性 'parser'
  },
}
