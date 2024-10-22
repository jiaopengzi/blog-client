/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-05 11:12:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-10-22 14:49:22
 * @FilePath     : \blog-client\src\pkg\marked\extension\renderer.ts
 * @Description  : 自定义 renderer 主要是为了加类名
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { Tokens } from "marked"

import { Parser } from "marked"

export const renderer = {
    parser: new Parser(),
    // listitem 函数重写
    listitem(item: Tokens.ListItem): string {
        let itemBody = ""
        if (item.task) {
            const checkbox = this.checkbox({ checked: !!item.checked })
            if (item.loose) {
                if (item.tokens.length > 0 && item.tokens[0].type === "paragraph") {
                    item.tokens[0].text = checkbox + " " + item.tokens[0].text
                    if (
                        item.tokens[0].tokens &&
                        item.tokens[0].tokens.length > 0 &&
                        item.tokens[0].tokens[0].type === "text"
                    ) {
                        item.tokens[0].tokens[0].text =
                            checkbox + " " + item.tokens[0].tokens[0].text
                    }
                } else {
                    item.tokens.unshift({
                        type: "text",
                        raw: checkbox + " ",
                        text: checkbox + " ",
                    })
                }
            } else {
                itemBody += checkbox + " "
            }
        }

        itemBody += this.parser.parse(item.tokens, !!item.loose)

        // 选中状态和未选中状态添加类名
        if (item.task) {
            if (item.checked) {
                return `<li class="task-list-item task-list-item-checked">${itemBody}</li>\n` // 选中状态
            }
            return `<li class="task-list-item task-list-item-unchecked">${itemBody}</li>\n` // 未选中状态
        }

        // 非 checkbox 项
        return `<li>${itemBody}</li>\n`
    },

    // checkbox 函数重写
    checkbox({ checked }: Tokens.Checkbox) {
        return (
            "<input class='task-list-item-checkbox' " + // 添加类名
            (checked ? 'checked="" ' : "") +
            'disabled="" type="checkbox">'
        )
    },

    // code 函数重写
    code({ text, lang, escaped }: Tokens.Code) {
        const langString = (lang || "").match(/^\S*/)?.[0]
        const code = text.replace(/\n$/, "") + "\n"
        if (!langString) {
            const result = "<pre><code>" + (escaped ? code : escape(code, true)) + "</code></pre>\n" // marked 源码默认代码块

            return constructWeChatPreCode(replaceAllHljsStringSpanTag(result)) // 自定义代码块
        }
        const result =
            '<pre><code class="language-' +
            escape(langString, true) +
            '">' +
            (escaped ? code : escape(code, true)) +
            "</code></pre>\n" // marked 源码默认代码块
        return constructWeChatPreCode(replaceAllHljsStringSpanTag(result)) // 自定义代码块
    },
}

/**
 * @description: 将 marked 默认代码块转换为微信代码块
 * @param lines: string[] 按照换行符分割的字符串数组
 * @return string 符合微信代码块的字符串
 */
function constructWeChatPreCode(htmlStr: string): string {
    const lines = htmlStr.split("\n") || []
    let wechatPreCode = "" // 微信 pre 代码块内容
    let wechatPreCodeLang = "" // 微信 pre 代码块语言
    const regexLang = /language-(\w+)/ // 正则匹配 pre 代码块语言
    // 正则匹配出 `<pre><code class="language-???">` 或 `<pre><code>` 问号是占位符
    const regexStart = /<pre><code(?: class="language-(\w+)")?>/
    const regexEnd = /<\/code><\/pre>/ // 正则匹配 pre 结束标签

    lines.forEach((item) => {
        if (item) {
            const matchStart = item.match(regexStart)
            const matchEnd = item.match(regexEnd)
            if (matchStart) {
                item = item.replace(matchStart[0], "") // 删除 pre 开始标签
                const matchLang = matchStart[0].match(regexLang) // 匹配 pre 代码块语言
                if (matchLang) {
                    wechatPreCodeLang = matchLang[0] // 保存 pre 代码块语言
                }
            }

            if (matchEnd) {
                item = item.replace(matchEnd[0], "") // 删除 pre 结束标签
                if (item === "") {
                    return // 保证最后一行不是多余的空行
                }
            }
            item = "<code>" + item + "</code>\n" // 拼接 code 标签
            wechatPreCode = wechatPreCode + item
        }
    })

    // 微信代码块行号类名 code-snippet code-snippet_nowrap code-snippet__js
    const divStart = '<div class="pre-code">'
    const divEnd = "</div>"
    const copyBtnStart = '<button class="copy-button">'
    const copyBtnEnd = "</button>"
    let copyBtn = ""
    if (wechatPreCodeLang) {
        wechatPreCodeLang = " " + wechatPreCodeLang
        const btnLangText = wechatPreCodeLang.replace("language-", "").toUpperCase()
        copyBtn = copyBtnStart + btnLangText + copyBtnEnd
    } else {
        copyBtn = copyBtnStart + "TEXT" + copyBtnEnd
    }
    const wechatPreCodeStart =
        '<pre class="code-snippet code-snippet_nowrap code-snippet__js' + wechatPreCodeLang + '">' // 微信 pre 代码块开始标签添 加类名和语言
    const wechatPreCodeEnd = "</pre>"
    const preBlock =
        divStart + copyBtn + wechatPreCodeStart + wechatPreCode + wechatPreCodeEnd + divEnd // 拼接微信代码块
    return preBlock // 拼接微信代码块
}

/**
 * @description: 处理 hljs-string span 标签 多行情况
 * @param hljsStringSpanTagStr hljs-string span 标签内容 源
 * @return hljs-string span 标签内容 目标处理多一行
 */
function handleHljsStringSpanTag(hljsStringSpanTagStr: string): string {
    const lines = hljsStringSpanTagStr.split("\n") || []

    let hljsStringSpanTagTargetStr = "" // 目标 hljs-string span 标签内容
    const hljsStringSpanTagStart = '<span class="hljs-string">' // hljs-string span 开始标签
    let hljsStringSpanTagEnd = "</span>\n" // hljs-string span 结束标签 默认是换行符
    const regexStart = /<span class="hljs-string">/ // hljs-string span 开始标签
    const regexEnd = /<\/span>/ // hljs-string span 结束标签

    lines.forEach((item) => {
        if (item) {
            const matchStart = item.match(regexStart)
            const matchEnd = item.match(regexEnd)
            if (matchStart) {
                item = item.replace(matchStart[0], "") // 删除 span 开始标签
            }

            if (matchEnd) {
                item = item.replace(matchEnd[0], "") // 删除 span 结束标签
                hljsStringSpanTagEnd = "</span>" // 注意：[末尾是没有匹配换行符]
            }
            item = hljsStringSpanTagStart + item + hljsStringSpanTagEnd // 拼接 span 标签

            hljsStringSpanTagTargetStr += item
        }
    })
    return hljsStringSpanTagTargetStr // 拼接结果
}

/**
 * @description: 处理 hljs-string span 标签 多行情况
 * @param html  marked 渲染后的 html 字符串
 * @return      处理后的 html 字符串
 */
function replaceAllHljsStringSpanTag(html: string): string {
    const regex = /<span class="hljs-string">([\s\S]*?)<\/span>/g
    return html.replace(regex, (match) => {
        return handleHljsStringSpanTag(match) // 处理 hljs-string span 标签
    })
}

// =============================================== marked 源码中内容 copy 开始

/**
 * Helpers
 */
const escapeTest = /[&<>"']/
const escapeReplace = new RegExp(escapeTest.source, "g")
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, "g")
const escapeReplacements: { [index: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
}
const getEscapeReplacement = (ch: string) => escapeReplacements[ch]

export function escape(html: string, encode?: boolean) {
    if (encode) {
        if (escapeTest.test(html)) {
            return html.replace(escapeReplace, getEscapeReplacement)
        }
    } else {
        if (escapeTestNoEncode.test(html)) {
            return html.replace(escapeReplaceNoEncode, getEscapeReplacement)
        }
    }

    return html
}
// =============================================== marked 源码中内容 copy 结束
