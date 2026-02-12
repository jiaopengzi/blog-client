/**
 * @FilePath     : \blog-client\src\pkg\marked\extension\sup.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 上标配置
 */

import type { Token, TokenizerAndRendererExtension } from "marked"

export const supExtensionInline: TokenizerAndRendererExtension = {
    name: "sup",
    level: "inline",
    start(src: string): number | undefined {
        return src.match(/\^([^\n^]+)\^/)?.index
    },
    tokenizer(src: string): Token | undefined {
        const rule = /^\^([^\n^]+)\^/
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
