/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-29 12:04:35
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-01 21:50:20
 * @FilePath     : \blog-client\src\pkg\marked\extension\sup-ext.ts
 * @Description  : 上标配置
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

type Token = {
  type: string
  raw: string
  text: string
  tokens: any[]
}
import type { TokenizerAndRendererExtension } from 'marked'

export const supExtensionInline: TokenizerAndRendererExtension = {
  name: 'sup',
  level: 'inline',
  start(src: string): number | undefined {
    // eslint-disable-next-line no-useless-escape
    return src.match(/\^([^\^\n]+)\^/)?.index
  },
  tokenizer(src: string): Token | undefined {
    // eslint-disable-next-line no-useless-escape
    const rule = /^\^([^\^\n]+)\^/
    const match = rule.exec(src)
    if (match) {
      const token: Token = {
        type: 'sup',
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
    return `<sup>${(this as any).parser.parseInline(customToken.tokens)}</sup>` // 使用 "as any" 来解决不存在属性 'parser'
  },
}
