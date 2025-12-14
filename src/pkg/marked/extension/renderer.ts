/**
 * @FilePath     : \blog-client\src\pkg\marked\extension\renderer.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 自定义 renderer 主要是为了加类名
 */

import type { Tokens } from "marked"
import { Parser } from "marked"

import { escapeWhitespaceInHtmlContent } from "@/utils/escape"

import { taskListIcon, TaskListStatus } from "./todo-list"

export const renderer = {
    parser: new Parser(),

    // listitem 函数重写
    listitem(item: Tokens.ListItem): string {
        // 解析 listitem 内部内容
        let itemContent = this.parser.parse(item.tokens)

        // 选中状态和未选中状态添加类名
        if (item.task) {
            // 替换掉 itemContent 中的 checkbox 输入框 `<input checked="" disabled="" type="checkbox"/>` 或 `<input disabled="" type="checkbox"/>`
            // 注意 input 标签后面有空格
            itemContent = itemContent.replace(/<input (?:checked="" )?disabled="" type="checkbox"\/?> /, "")
            if (item.checked) {
                return `<li class="task-list-item task-list-item-checked">${taskListIcon[TaskListStatus.Checked]}${itemContent}</li>\n` // 选中状态
            }
            return `<li class="task-list-item task-list-item-unchecked">${taskListIcon[TaskListStatus.Unchecked]}${itemContent}</li>\n` // 未选中状态
        }

        // 非 checkbox 项
        return `<li>${itemContent}</li>\n`
    },

    // code 函数重写
    code({ text, lang, escaped }: Tokens.Code) {
        const langString = (lang || "").match(/^\S*/)?.[0]
        const code = text.replace(/\n$/, "") + "\n"
        if (!langString) {
            const result = "<pre><code>" + (escaped ? code : escape(code, true)) + "</code></pre>\n" // marked 源码默认代码块

            return constructWeChatPreCode(replaceAllHljsStringSpanTag(result)) // 自定义代码块
        }
        const result = '<pre><code class="language-' + escape(langString, true) + '">' + (escaped ? code : escape(code, true)) + "</code></pre>\n" // marked 源码默认代码块
        return constructWeChatPreCode(replaceAllHljsStringSpanTag(result)) // 自定义代码块
    },

    // 将源码中 table 相关函数 copy 过来并添加类名

    tablerow({ text }: Tokens.TableRow) {
        return `<tr>\n${text}</tr>\n`
    },

    tablecell(token: Tokens.TableCell) {
        const content = this.parser.parseInline(token.tokens)
        const type = token.header ? "th" : "td"
        const tag = token.align ? `<${type} align="${token.align}">` : `<${type}>`
        return tag + content + `</${type}>\n`
    },

    table(token: Tokens.Table) {
        let header = ""

        // header
        let cell = ""
        for (let j = 0; j < token.header.length; j++) {
            cell += this.tablecell(token.header[j]!)
        }
        header += this.tablerow({ text: cell })

        let body = ""
        for (let j = 0; j < token.rows.length; j++) {
            const row = token.rows[j]

            cell = ""
            for (let k = 0; k < row!.length; k++) {
                cell += this.tablecell(row![k]!)
            }

            body += this.tablerow({ text: cell })
        }
        if (body) body = `<tbody>${body}</tbody>`

        // return "<table>\n" + "<thead>\n" + header + "</thead>\n" + body + "</table>\n"
        const _table = `<table>\n<thead>\n${header}</thead>\n${body}</table>\n`
        // 在 table 外套一个 div 添加类名 以便于样式控制
        return `<div class="jpz-marked-table-container">${_table}</div>\n`
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
    let lineNumber = 0 // 行号计数器

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

            // 转义代码行中的内容部分的空白字符, 保证在主站和微信中显示一致
            item = escapeWhitespaceInHtmlContent(item)

            item = `<code>${item}</code>\n` // 拼接 code 标签
            wechatPreCode = wechatPreCode + item
            lineNumber += 1
        }
    })

    // 计算行号宽度，最小宽度 2em
    const lineNumberWidth = lineNumber.toString().length * 1 || 2

    // 微信代码块行号类名 code-snippet code-snippet_nowrap; 不要添加 code-snippet__js, 会操作样式丢失
    const tagStart = `<section class="pre-code-container" style="--line-number-width: ${lineNumberWidth}em;">`
    const tagEnd = `</section>`
    const copyBtnStart = `<button type="button" class="copy-button">`
    const copyBtnEnd = `</button>`
    let copyBtn = ""
    if (wechatPreCodeLang) {
        wechatPreCodeLang = " " + wechatPreCodeLang
        const btnLangText = wechatPreCodeLang.replace("language-", "").toUpperCase()
        copyBtn = copyBtnStart + btnLangText + copyBtnEnd
    } else {
        copyBtn = copyBtnStart + "TEXT" + copyBtnEnd
    }

    // 微信 pre 代码块开始标签添 加类名和语言
    const lang = wechatPreCodeLang.replace("language-", "").toLowerCase()
    const wechatPreCodeStart = `<pre class="pre-code pre-code_nowrap ${wechatPreCodeLang}" data-lang="${lang}">`
    const wechatPreCodeEnd = `</pre>`

    // 拼接微信代码块
    const preBlock = tagStart + copyBtn + wechatPreCodeStart + wechatPreCode + wechatPreCodeEnd + tagEnd

    return preBlock
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
const getEscapeReplacement = (ch: string) => escapeReplacements[ch]!

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
