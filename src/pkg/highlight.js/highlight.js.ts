/**
 * @FilePath     : \blog-client\src\pkg\highlight.js\highlight.js.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 封装 highlight.js
 */

import hljs from "highlight.js"

import DAX from "@/pkg/highlight.js/language/dax"
// import 'highlight.js/styles/atom-one-dark.min.css'
// import 'highlight.js/styles/atom-one-light.min.css'
// import 'highlight.js/styles/github-dark.min.css'
// import 'highlight.js/styles/dark.min.css'
// import '@/assets/highlight/highlight.js.jpz.css'

// 创建一个工厂函数来生成新的 hljs 实例
const createHighlighter = () => {
    // 在 hljs 实例上注册语言和其他配置
    hljs.registerLanguage("dax", DAX)

    return hljs
}

// 将工厂函数作为默认导出
export default createHighlighter
