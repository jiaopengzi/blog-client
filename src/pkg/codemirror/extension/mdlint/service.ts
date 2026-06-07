/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\service.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : Markdown lint 文本校验与自动修复服务
 */

import type { Diagnostic } from "@codemirror/lint"

import { loadEagerRules } from "./ruleRegistry"
import type { DocLike, MarkdownLinterOptions, RuleDefinition } from "./types"
import { buildDocFromText, collectFencedCodeLineNumbers } from "./utils"

const RULES: RuleDefinition<unknown>[] = loadEagerRules()
const MAX_AUTO_FIX_PASSES = 10

export interface MarkdownLintAutofixResult {
    fixedText: string
    diagnostics: Diagnostic[]
    changed: boolean
}

/**
 * 执行 Markdown lint 校验, 返回当前文本对应的诊断结果.
 * @param text Markdown 原始文本.
 * @param options lint 配置项.
 * @returns 诊断结果数组.
 */
export function lintMarkdownText(text: string, options: MarkdownLinterOptions = {}): Diagnostic[] {
    const doc = buildDocFromText(text)
    return runRules(doc, options)
}

/**
 * 对 Markdown 文本执行可安全确定的自动修复, 然后返回复检结果.
 * @param text Markdown 原始文本.
 * @param options lint 配置项.
 * @returns 修复后的文本与剩余诊断结果.
 */
export function autoFixMarkdownText(text: string, options: MarkdownLinterOptions = {}): MarkdownLintAutofixResult {
    let currentText = normalizeLineEndings(text)

    for (let i = 0; i < MAX_AUTO_FIX_PASSES; i++) {
        const nextText = applyAutoFixPass(currentText)
        if (nextText === currentText) {
            break
        }
        currentText = nextText
    }

    return {
        fixedText: currentText,
        diagnostics: lintMarkdownText(currentText, options),
        changed: currentText !== normalizeLineEndings(text),
    }
}

/**
 * 执行所有启用规则, 生成诊断结果.
 * @param doc 文档对象.
 * @param options lint 配置项.
 * @returns 诊断结果数组.
 */
function runRules(doc: DocLike, options: MarkdownLinterOptions): Diagnostic[] {
    const diagnostics: Diagnostic[] = []

    for (const rule of RULES) {
        const cfg = options.rules?.[rule.id]
        if (cfg === false) continue

        const enabled = cfg === undefined ? true : typeof cfg === "object" ? cfg.enabled !== false : Boolean(cfg)
        if (!enabled) continue

        // oxlint-disable-next-line unicorn/no-useless-fallback-in-spread
        const ruleOpts = typeof cfg === "object" ? { ...(rule.defaultOptions || {}), ...cfg } : { ...(rule.defaultOptions || {}) }
        const result = rule.run(doc, ruleOpts)
        if (Array.isArray(result) && result.length > 0) {
            diagnostics.push(...result)
        }
    }

    return diagnostics
}

/**
 * 统一规范换行, 避免修复阶段受不同平台换行符影响.
 * @param text 原始文本.
 * @returns 统一为 \n 的文本.
 */
function normalizeLineEndings(text: string): string {
    return text.replace(/\r\n?/g, "\n")
}

/**
 * 执行单轮自动修复, 仅处理可以确定无歧义的场景.
 * @param text 原始文本.
 * @returns 本轮修复后的文本.
 */
function applyAutoFixPass(text: string): string {
    let nextText = trimTrailingWhitespaceOutsideFencedCode(text)
    nextText = collapseEmptySingleLineTags(nextText)
    nextText = ensureBlankLinesAroundHeadings(nextText)
    nextText = ensureBlankLinesAroundTagLines(nextText)
    return nextText
}

/**
 * 仅在 fenced code block 之外移除行尾空白, 保留代码示例原始内容.
 * @param text Markdown 文本.
 * @returns 移除非代码块行尾空白后的文本.
 */
function trimTrailingWhitespaceOutsideFencedCode(text: string): string {
    const lines = text.split("\n")
    const fencedLineNumbers = collectFencedCodeLineNumbers(buildDocFromText(text))

    return lines
        .map((line, index) => {
            if (fencedLineNumbers.has(index + 1)) {
                return line
            }

            return line.replace(/[ \t]+$/g, "")
        })
        .join("\n")
}

/**
 * 将只包含空白内容的单行要求标签折叠为单行, 以修复无意义换行.
 * @param text Markdown 文本.
 * @returns 修复后的文本.
 */
function collapseEmptySingleLineTags(text: string): string {
    return transformOutsideFencedCodeBlocks(text, (segmentText) => {
        return segmentText
            .replace(/<(pay-membership|pay-key)(\s+[^>]*)?>\s*\n\s*<\/\1>/g, "<$1$2></$1>")
            .replace(/<video-player(\s+[^>]*)?>\s*\n\s*<\/video-player>/g, "<video-player$1></video-player>")
            .replace(/<power-bi(\s+[^>]*)?>\s*\n\s*<\/power-bi>/g, "<power-bi$1></power-bi>")
    })
}

/**
 * 为 Markdown 标题补齐前后空行.
 * @param text Markdown 文本.
 * @returns 修复后的文本.
 */
function ensureBlankLinesAroundHeadings(text: string): string {
    return ensureBlankLinesAroundMatchedLines(text, (line) => /^(#{1,6})\s+/.test(line.trim()))
}

/**
 * 为受规则 005 和 006 约束的标签行补齐前后空行.
 * @param text Markdown 文本.
 * @returns 修复后的文本.
 */
function ensureBlankLinesAroundTagLines(text: string): string {
    return ensureBlankLinesAroundMatchedLines(text, (line) => {
        const trimmedLine = line.trim()
        return [
            /^<(pay-(video|membership|read|download|key))(\s+[^>]*)?><\/\1>$/.test(trimmedLine),
            /^<(pay-(video|membership|read|download|key))(\s+[^>]*)?>$/.test(trimmedLine),
            /^<\/(pay-(video|membership|read|download|key))>$/.test(trimmedLine),
            /^<video-player(\s+[^>]*)?><\/video-player>$/.test(trimmedLine),
            /^<video-player(\s+[^>]*)?>$/.test(trimmedLine),
            /^<\/video-player>$/.test(trimmedLine),
            /^<power-bi(\s+[^>]*)?><\/power-bi>$/.test(trimmedLine),
            /^<power-bi(\s+[^>]*)?>$/.test(trimmedLine),
            /^<\/power-bi>$/.test(trimmedLine),
            /^<wechat-captcha(\s+[^>]*)?>$/.test(trimmedLine),
            /^<\/wechat-captcha>$/.test(trimmedLine),
            /^<login-view>$/.test(trimmedLine),
            /^<\/login-view>$/.test(trimmedLine),
        ].some(Boolean)
    })
}

/**
 * 为命中的行补齐前后空行, 同时避免重复插入空行.
 * @param text Markdown 文本.
 * @param matcher 行匹配函数.
 * @returns 修复后的文本.
 */
function ensureBlankLinesAroundMatchedLines(text: string, matcher: (line: string) => boolean): string {
    const fencedLineNumbers = collectFencedCodeLineNumbers(buildDocFromText(text))
    const lines = text.split("\n")
    const result: string[] = []

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? ""
        const matched = !fencedLineNumbers.has(i + 1) && matcher(line)
        const previousLine = result[result.length - 1] ?? ""
        const nextLine = lines[i + 1] ?? undefined

        if (matched && result.length > 0 && previousLine.trim() !== "") {
            result.push("")
        }

        result.push(line)

        if (matched && nextLine !== undefined && nextLine.trim() !== "") {
            result.push("")
        }
    }

    return result.join("\n")
}

/**
 * 仅对 fenced code block 之外的文本分段执行变换, 保留代码围栏与内部内容原样.
 * @param text Markdown 文本.
 * @param transformer 非代码块文本变换函数.
 * @returns 保留 fenced code block 原文后的变换结果.
 */
function transformOutsideFencedCodeBlocks(text: string, transformer: (text: string) => string): string {
    const lines = text.split("\n")
    const fencedLineNumbers = collectFencedCodeLineNumbers(buildDocFromText(text))
    const result: string[] = []
    let buffer: string[] = []

    const flushBuffer = () => {
        if (buffer.length === 0) {
            return
        }

        result.push(...transformer(buffer.join("\n")).split("\n"))
        buffer = []
    }

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i] ?? ""

        if (fencedLineNumbers.has(i + 1)) {
            flushBuffer()
            result.push(line)
            continue
        }

        buffer.push(line)
    }

    flushBuffer()

    return result.join("\n")
}
