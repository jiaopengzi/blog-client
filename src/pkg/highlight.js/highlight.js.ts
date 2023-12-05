/**
 * @Author       : jiaopengzi
 * @Date         : 2023-11-26 13:53:14
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2023-12-05 14:52:10
 * @FilePath     : \blog-client\src\pkg\highlight.js\highlight.js.ts
 * @Description  : 封装 highlight.js
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2023 by jiaopengzi, All Rights Reserved.
 */
// myHighlighter.ts
import hljs from 'highlight.js'
import DAX from '@/pkg/highlight.js/language/dax'
// import 'highlight.js/styles/atom-one-dark.min.css'
// import 'highlight.js/styles/atom-one-light.min.css'
// import 'highlight.js/styles/github-dark.min.css'
// import 'highlight.js/styles/dark.min.css'
import '@/assets/highlight/highlight.js.jpz.css'

hljs.registerLanguage('dax', DAX)

export default hljs
