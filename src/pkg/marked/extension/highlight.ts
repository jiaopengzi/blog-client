/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-28 18:31:10
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-13 10:21:59
 * @FilePath     : \blog-client\src\pkg\marked\extension\highlight.ts
 * @Description  : 代码高亮
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */

import type { SynchronousOptions } from 'marked-highlight' // 代码高亮选项
import createHighlighter from '@/pkg/highlight.js/highlight.js' // 自定义代码高亮 js

const optionHighlight: SynchronousOptions = {
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    const language = createHighlighter().getLanguage(lang) ? lang : 'plaintext'
    return createHighlighter().highlight(code, { language }).value
  },
  async: false
}

export default optionHighlight
