/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-28 18:31:10
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-28 18:50:14
 * @FilePath     : \blog-client\src\pkg\marked\highlight.ts
 * @Description  : 代码高亮
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved. 
 */


import type { SynchronousOptions } from 'marked-highlight' // 代码高亮选项
import hljs from '@/pkg/highlight.js/highlight.js' // 自定义代码高亮 js

const optionsHighlight:SynchronousOptions= {
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }

export default optionsHighlight
