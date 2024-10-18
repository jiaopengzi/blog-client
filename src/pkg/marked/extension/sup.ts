/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-29 12:04:35
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-07-19 15:01:35
 * @FilePath     : \blog-client\src\pkg\marked\extension\sup.ts
 * @Description  : 上标配置
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { Token, TokenizerAndRendererExtension } from "marked"

export const supExtensionInline: TokenizerAndRendererExtension = {
    name: "sup",
    level: "inline",
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
                type: "sup",
                raw: match[0],
                text: match[1],
                tokens: [],
            }
            this.lexer.inline(token.text, token.tokens)
            return token
        }
    },
    renderer(token): string {
        return `<sup>${this.parser.parseInline(token.tokens || [])}</sup>`
    },
}
