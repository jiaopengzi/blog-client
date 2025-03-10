/**
 * @FilePath     : \blog-client\src\pkg\marked\extension\highlight.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 代码高亮
 */

import type { SynchronousOptions } from "marked-highlight" // 代码高亮选项

import createHighlighter from "@/pkg/highlight.js/highlight.js" // 自定义代码高亮 js

const optionHighlight: SynchronousOptions = {
    langPrefix: "hljs language-",
    highlight(code, lang) {
        const language = createHighlighter().getLanguage(lang) ? lang : "plaintext"
        return createHighlighter().highlight(code, { language }).value
    },
    async: false,
}

export default optionHighlight
