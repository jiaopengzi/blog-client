/**
 * @FilePath     : \blog-client\src\pkg\highlight.js\highlight.js.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 封装 highlight.js
 */

import hljs from "highlight.js" // 完整版，已内置全部 ~190 个官方语言，无需手动 registerLanguage

import "highlight.js/styles/tokyo-night-light.min.css"
import dax from "highlightjs-dax"
import m from "highlightjs-m"
import "highlightjs-dax/theme.css"
import "highlightjs-m/theme.css"
import "@/assets/scss/highlight.js.jpz.scss" // 必须在主题 CSS 之后导入，确保覆盖规则优先级生效

let highlighterReady = false
let highlighterInstance: typeof hljs | null = null

/**
 * registerExtraLanguages 为共享高亮器补充项目依赖的扩展语言.
 */
const registerExtraLanguages = () => {
    if (highlighterReady) {
        return
    }

    // 官方内置语言已通过完整版 import 全部注册，此处仅补充外部扩展语言。
    hljs.registerLanguage("dax", dax)
    hljs.registerLanguage("m", m)
    hljs.registerLanguage("pq", m)
    highlighterReady = true
}

/**
 * createHighlighter 返回按需初始化的共享 highlight.js 实例.
 * @returns 已注册项目扩展语言的 highlight.js 实例.
 */
const createHighlighter = (): typeof hljs => {
    if (!highlighterInstance) {
        registerExtraLanguages()
        highlighterInstance = hljs
    }

    return highlighterInstance
}

// 将工厂函数作为默认导出
export default createHighlighter
