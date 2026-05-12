/**
 * FilePath    : blog-client\src\views\md\component\customize-style.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : /md 页面自定义样式相关工具函数
 */

import type { MdCustomState } from "@/stores/md-custom"

export const MD_PREVIEW_SCOPE_SELECTOR = ".md-page-preview"

const AUTO_GENERATED_BLOCK_START = "/******************** 左侧面板自动生成区起始行 ********************/\n"
const AUTO_GENERATED_BLOCK_DEFAULT = "/******************** 当前状态未设置保持默认值 ********************/\n"
const AUTO_GENERATED_BLOCK_END = "/******************** 左侧面板自动生成区结束行 ********************/\n"
const USER_CUSTOM_BLOCK_MARKER = "/******************** 用户自定义区 ********************/\n"

/**
 * @description: 将声明列表格式化为一个完整的 CSS 规则块.
 * @param selector 目标选择器.
 * @param declarations CSS 声明列表.
 * @return 拼接完成的规则块.
 */
function buildCssRule(selector: string, declarations: string[]): string {
    if (declarations.length === 0) {
        return ""
    }

    return `${selector} {\n${declarations.map((declaration) => `    ${declaration}`).join("\n")}\n}`
}

/**
 * @description: 根据 /md 页面设置构造自动生成的预设样式.
 * @param state 当前 /md 自定义配置.
 * @return 自动生成的预设 CSS 文本.
 */
export function buildMdPresetCss(state: MdCustomState): string {
    const rootDeclarations: string[] = []
    const paragraphDeclarations: string[] = []
    const codeBlockDeclarations: string[] = []
    const codeLineNumberDeclarations: string[] = []

    if (state.fontFamily) {
        rootDeclarations.push(`font-family: ${state.fontFamily} !important;`)
    }
    if (state.fontSize && state.fontSize !== "16px") {
        rootDeclarations.push(`font-size: ${state.fontSize} !important;`)
    }
    if (state.themeColor) {
        rootDeclarations.push(`--jpz-color-primary: ${state.themeColor} !important;`)
        rootDeclarations.push(`--horizontal-divider-color: ${state.themeColor} !important;`)
    }
    if (state.paragraphIndent === "0") {
        paragraphDeclarations.push("text-indent: 0 !important;")
    }
    if (!state.showLineNumbers) {
        codeBlockDeclarations.push("padding-left: 1rem !important;")
        codeLineNumberDeclarations.push("display: none !important;")
    }

    return [
        buildCssRule(MD_PREVIEW_SCOPE_SELECTOR, rootDeclarations),
        buildCssRule(`${MD_PREVIEW_SCOPE_SELECTOR} p`, paragraphDeclarations),
        buildCssRule(`${MD_PREVIEW_SCOPE_SELECTOR} .pre-code`, codeBlockDeclarations),
        buildCssRule(`${MD_PREVIEW_SCOPE_SELECTOR} .pre-code code::before`, codeLineNumberDeclarations),
    ]
        .filter(Boolean)
        .join("\n\n")
}

/**
 * @description: 构造右侧编辑器展示用的完整 CSS 文档.
 * 左侧控件会覆盖自动生成区, 手动区内容会被保留.
 * @param state 当前 /md 自定义配置.
 * @return 展示给编辑器的完整 CSS 文本.
 */
export function buildMdCustomizerEditorDoc(state: MdCustomState): string {
    const presetCss = buildMdPresetCss(state) || AUTO_GENERATED_BLOCK_DEFAULT
    const trimmedCustomCss = state.customCss.trim()

    return [
        "/* 左侧面板自动生成区, 每次调整配置时都会覆盖本区块。 */\n",
        AUTO_GENERATED_BLOCK_START,
        presetCss,
        AUTO_GENERATED_BLOCK_END,
        "",
        USER_CUSTOM_BLOCK_MARKER,
        "/* 可以点击右上角【插入示例】后，据需求进行修改。*/\n",
        trimmedCustomCss,
    ]
        .join("\n")
        .trimEnd()
        .concat("\n")
}

/**
 * @description: 从右侧编辑器文档中提取用户手动维护的 CSS 区块.
 * @param editorDoc 编辑器中的完整 CSS 文档.
 * @return 用户自定义的 CSS 文本.
 */
export function extractMdCustomUserCss(editorDoc: string): string {
    const markerIndex = editorDoc.indexOf(USER_CUSTOM_BLOCK_MARKER)

    if (markerIndex === -1) {
        return editorDoc.trim()
    }

    return editorDoc
        .slice(markerIndex + USER_CUSTOM_BLOCK_MARKER.length)
        .replace(/^\r?\n/, "")
        .trim()
}
