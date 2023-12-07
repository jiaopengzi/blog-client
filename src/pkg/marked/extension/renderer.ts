/**
 * @Author       : jiaopengzi
 * @Date         : 2023-12-05 11:12:27
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-06 15:17:08
 * @FilePath     : \blog-client\src\pkg\marked\extension\renderer.ts
 * @Description  : 自定义 renderer 主要是为了加类名
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

export const renderer = {
  // listitem 函数重写
  listitem(text: string, task: boolean, checked: boolean) {
    if (task) {
      if (checked) {
        return `<li class="task-list-item task-list-item-checked">${text}</li>\n` // 选中状态
      }
      return `<li class="task-list-item task-list-item-unchecked">${text}</li>\n` // 未选中状态
    }
    return `<li>${text}</li>\n`
  },
  // checkbox 函数重写
  checkbox(checked: boolean) {
    return (
      "<input class='task-list-item-checkbox' " + // 添加类名
      (checked ? 'checked="" ' : '') +
      'disabled="" type="checkbox">'
    )
  },
  // code 函数重写
  code(code: string, infostring: string | undefined, escaped: boolean) {
    const lang = (infostring || '').match(/^\S*/)?.[0]
    code = code.replace(/\n$/, '') + '\n'
    if (!lang) {
      const result = '<pre><code>' + (escaped ? code : escape(code, true)) + '</code></pre>\n' // marked 源码默认代码块
      return constructWeChatPreCode(result.split('\n')) // 自定义代码块
    }
    const result =
      '<pre><code class="language-' +
      escape(lang, true) +
      '">' +
      (escaped ? code : escape(code, true)) +
      '</code></pre>\n' // marked 源码默认代码块
    return constructWeChatPreCode(result.split('\n')) // 自定义代码块
  },
}

/**
 * @description: 将 marked 默认代码块转换为微信代码块
 * @param lines: string[] 按照换行符分割的字符串数组
 * @return string 符合微信代码块的字符串
 */
function constructWeChatPreCode(lines: string[]): string {
  let wechtPreCode = '' // 微信 pre 代码块内容
  let wechtPreCodeLang = '' // 微信 pre 代码块语言
  const regexLang = /language-(\w+)/ // 正则匹配 pre 代码块语言
  // 正则匹配出 `<pre><code class="language-???">` 或 `<pre><code>` 问号是占位符
  const regexStart = /<pre><code(?: class="language-(\w+)")?>/
  const regexEnd = /<\/code><\/pre>/ // 正则匹配 pre 结束标签
  lines.forEach((item) => {
    if (item) {
      const matchStart = item.match(regexStart)
      const matchEnd = item.match(regexEnd)
      if (matchStart) {
        item = item.replace(matchStart[0], '') // 删除 pre 开始标签
        const matchLang = matchStart[0].match(regexLang) // 匹配 pre 代码块语言
        if (matchLang) {
          wechtPreCodeLang = matchLang[0] // 保存 pre 代码块语言
        }
      }

      if (matchEnd) {
        item = item.replace(matchEnd[0], '') // 删除 pre 结束标签
        if (item === '') {
          return // 保证最后一行不是多余的空行
        }
      }
      item = '<code>' + item + '</code>\n' // 拼接 code 标签
      wechtPreCode = wechtPreCode + item
    }
  })

  // 微信代码块行号类名 code-snippet code-snippet_nowrap code-snippet__js
  const divStart = '<div class="pre-code">'
  const divEnd = '</div>'
  const copyBtnStart = '<button class="copy-button">'
  const copyBtnEnd = '</button>'
  let copyBtn = ''
  if (wechtPreCodeLang) {
    wechtPreCodeLang = ' ' + wechtPreCodeLang
    const btnLangText = wechtPreCodeLang.replace('language-', '').toUpperCase()
    copyBtn = copyBtnStart + btnLangText + copyBtnEnd
  } else {
    copyBtn = copyBtnStart + 'TEXT' + copyBtnEnd
  }
  const wechtPreCodeStart =
    '<pre class="code-snippet code-snippet_nowrap code-snippet__js' + wechtPreCodeLang + '">' // 微信 pre 代码块开始标签添 加类名和语言
  const wechtPreCodeEnd = '</pre>'
  return divStart + copyBtn + wechtPreCodeStart + wechtPreCode + wechtPreCodeEnd + divEnd // 拼接微信代码块
}

// =============================================== marked 源码中内容 copy 开始
/**
 * Helpers
 */
const escapeTest = /[&<>"']/
const escapeReplace = new RegExp(escapeTest.source, 'g')
const escapeTestNoEncode = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/
const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g')
const escapeReplacements: { [index: string]: string } = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
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
