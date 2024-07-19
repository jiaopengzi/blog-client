/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-29 12:11:12
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-07-19 15:02:23
 * @FilePath     : \blog-client\src\pkg\marked\extension\sub.ts
 * @Description  : 上标配置
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { Token, TokenizerAndRendererExtension } from 'marked'

export const subExtensionInline: TokenizerAndRendererExtension = {
  name: 'sub',
  level: 'inline',
  start(src: string): number | undefined {
    return src.match(/~[^~\n]/)?.index
  },
  tokenizer(src: string): Token | undefined {
    const rule = /^~([^~]+)~/
    const match = rule.exec(src)
    if (match) {
      const token: Token = {
        type: 'sub',
        raw: match[0],
        text: match[1],
        tokens: [],
      }
      this.lexer.inline(token.text, token.tokens)
      return token
    }
  },
  renderer(token): string {
    return `<sub>${this.parser.parseInline(token.tokens || [])}</sub>`
  },
}
