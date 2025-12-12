/**
 * FilePath    : blog-client-dev\src\utils\escape.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 转义 HTML 文本内容中的空白字符
 */

/**
 * 将HTML字符串中文本内容部分的空白字符转义, 不影响标签内部的空白字符
 * @param html 要处理的HTML字符串
 * @param options 配置选项
 * @returns 处理后的HTML字符串
 */
export function escapeWhitespaceInHtmlContent(
    html: string,
    options: {
        /**
         * 是否将普通空格 ' ' 转义为 &nbsp;
         * 默认: true
         */
        escapeSpaces?: boolean
        /**
         * 是否将制表符 \t 转义为 &nbsp; 的组合(例如 4 个 &nbsp;)
         * 默认: false
         */
        escapeTabs?: boolean
    } = {},
): string {
    const { escapeSpaces = true, escapeTabs = false } = options

    return html.replace(/(^|>)([^<]+)(?=<|$)/g, (_match, prefix, textContent) => {
        let escapedText = textContent

        if (escapeSpaces) {
            escapedText = escapedText.replace(/ /g, "&nbsp;")
        }

        if (escapeTabs) {
            escapedText = escapedText.replace(/\t/g, "&nbsp;&nbsp;&nbsp;&nbsp;")
        }

        return prefix + escapedText
    })
}
