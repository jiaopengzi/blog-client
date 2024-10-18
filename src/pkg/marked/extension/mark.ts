/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-06 23:28:40
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-07-19 14:59:08
 * @FilePath     : \blog-client\src\pkg\marked\extension\mark.ts
 * @Description  :  扩展 marked 的解析器，支持 ==mark== 标记
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { Token, TokenizerAndRendererExtension } from "marked"

export const markExtensionInline: TokenizerAndRendererExtension = {
    name: "mark",
    level: "inline",
    start(src: string): number | undefined {
        return src.match(/==([^=]+)==/)?.index
    },
    tokenizer(src: string): Token | undefined {
        const rule = /^==([^=]+)==/
        const match = rule.exec(src)
        if (match) {
            const token: Token = {
                type: "mark",
                raw: match[0],
                text: match[1],
                tokens: [],
            }
            this.lexer.inline(token.text, token.tokens)
            return token
        }
    },
    renderer(token): string {
        return `<mark>${this.parser.parseInline(token.tokens || [])}</mark>`
    },
}
