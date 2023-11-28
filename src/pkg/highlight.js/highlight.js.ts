/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-26 13:53:14
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-11-26 19:36:57
 * @FilePath     : \blog-client\src\pkg\highlight.js\highlight.js.ts
 * @Description  : 封装 highlight.js
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
// myHighlighter.ts
import hljs from 'highlight.js'
import DAX from '@/pkg/highlight.js/language/dax'

hljs.registerLanguage('dax', DAX)

export default hljs
