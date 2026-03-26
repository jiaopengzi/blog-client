/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 工具函数
 */

import type { DocLike, RuleDefinition } from "./types"
import type { InnerContentContext, PairContext, SingleLineContext, SurroundingContext } from "./types"

// 在主线程同步加载模块并同时保留延迟加载器的占位映射
// 规则文件已统一放入本目录下的 "rule" 子目录, 文件名不再包含前缀, 例如 "001.ts", "002.ts"
const _eagerModules = import.meta.glob("./rule/*.ts", { eager: true }) as Record<string, unknown>

// 从已加载的模块映射派生出 lazy loader 映射, loader 会返回已加载的模块
// 这样保持导入路径一致, 并避免重复写 glob 模式
const lazyLoaders = Object.fromEntries(Object.keys(_eagerModules).map((p) => [p, async () => _eagerModules[p]])) as Record<string, () => Promise<unknown>>

// eagerModules 供同步加载使用, 直接引用已加载的模块映射
const eagerModules = _eagerModules
const CUSTOM_TAG_REGEX = /<\/?(?:pay-(?:video|membership|read|download|key)|video-player|power-bi|wechat-captcha)(?:\s+[^>]*)?>/g
const FENCE_REGEX = /^```/

/**
 * 将纯文本构建为规则可消费的 DocLike 对象.
 * @param text Markdown 原始文本.
 * @returns 兼容规则执行的文档对象.
 */
export function buildDocFromText(text: string): DocLike {
    const lines = text.split(/\r?\n/)
    const offsets: number[] = [0]

    for (let i = 0; i < lines.length; i++) {
        offsets.push((offsets[i] ?? 0) + (lines[i] ?? "").length + 1)
    }

    return {
        lines: lines.length,
        line(i: number) {
            const idx = i - 1
            const lineText = lines[idx] ?? ""
            const from = offsets[idx] ?? 0
            const to = from + lineText.length
            return { from, to, text: lineText }
        },
    }
}

/**
 * 在主线程同步加载规则模块, 并按文件名排序返回 RuleModule 数组
 * @returns RuleModule[] 已加载并筛选后的规则模块数组
 */
export function loadEagerRules(): RuleDefinition<unknown>[] {
    return (
        Object.keys(eagerModules)
            // oxlint-disable-next-line unicorn/no-array-sort
            .sort()
            .map((p) => {
                const m = eagerModules[p]
                if (!m || typeof m !== "object") return undefined
                const candidate = (m as { default?: unknown }).default ?? m
                if (candidate && typeof (candidate as { run?: unknown }).run === "function") return candidate as RuleDefinition<unknown>
                return undefined
            })
            .filter((x): x is RuleDefinition<unknown> => Boolean(x))
    )
}

/**
 * 获取延迟加载器映射, 每个 loader 返回对应的 RuleModule
 * @returns Record<string, () => Promise<RuleModule | undefined>>
 */
export function getLazyRuleLoaders() {
    const map: Record<string, () => Promise<RuleDefinition<unknown> | undefined>> = {}
    // oxlint-disable-next-line unicorn/no-array-sort
    for (const p of Object.keys(lazyLoaders).sort()) {
        const loader = lazyLoaders[p]
        map[p] = async () => {
            if (typeof loader !== "function") return undefined
            const m = await loader()
            const candidate = (m as { default?: unknown }).default ?? m
            if (candidate && typeof (candidate as { run?: unknown }).run === "function") return candidate as RuleDefinition<unknown>
            return undefined
        }
    }
    return map
}

/**
 * 收集 fenced code block 中的所有行号, 供规则跳过代码示例内容.
 * @param doc 文档对象.
 * @returns 代码块内行号集合.
 */
export function collectFencedCodeLineNumbers(doc: DocLike): Set<number> {
    const fencedLineNumbers = new Set<number>()
    let isInsideFence = false

    for (let lineNum = 1; lineNum <= doc.lines; lineNum++) {
        const lineText = doc.line(lineNum).text
        if (FENCE_REGEX.test(lineText)) {
            fencedLineNumbers.add(lineNum)
            isInsideFence = !isInsideFence
            continue
        }

        if (isInsideFence) {
            fencedLineNumbers.add(lineNum)
        }
    }

    return fencedLineNumbers
}

/**
 * 校验标签前后不应有其它内容
 * @param ctx - 上下文对象
 * @return void
 */
export function validateNoSurroundingContent(ctx: SurroundingContext) {
    const { doc, lineText, lineNum, matchIndex, fullLength, tagOrFullMatch, isClosing, diagnostics, sourceId } = ctx
    const ln = doc.line(lineNum)
    if (isClosing) {
        const after = lineText.slice(matchIndex + fullLength)
        if (after.trim() !== "") {
            diagnostics.push({
                from: ln.from + matchIndex + fullLength,
                to: ln.from + lineText.length,
                severity: "error",
                message: `标签后不应有内容: ${tagOrFullMatch}`,
                source: sourceId,
            })
        }
    } else {
        const before = lineText.slice(0, matchIndex)
        if (before.trim() !== "") {
            diagnostics.push({
                from: ln.from,
                to: ln.from + matchIndex,
                severity: "error",
                message: `标签前不应有内容: <${tagOrFullMatch}>`,
                source: sourceId,
            })
        }
    }
}

/**
 * 校验标签中内容应为空
 * @param ctx - 上下文对象
 * @return void
 */
export function validateEmptyContent(ctx: SingleLineContext) {
    // 解构参数
    const { doc, openLine, openFromIndex, openLength, closeMatchIndex, tagName, diagnostics, sourceId } = ctx

    // 提取标签内内容
    const lineText = doc.line(openLine).text
    const innerStart = openFromIndex + openLength
    const innerEnd = closeMatchIndex
    const inner = lineText.slice(innerStart, innerEnd)

    // 检查内容是否为空
    if (inner.trim() !== "") {
        diagnostics.push({
            from: doc.line(openLine).from + innerStart,
            to: doc.line(openLine).from + innerEnd,
            severity: "error",
            message: `${tagName} 标签内不应包含内容: ${inner.trim()}`,
            source: sourceId,
        })
    }
}

/**
 * 校验成对标签前后应有空行
 * @param ctx - 上下文对象
 * @return void
 */
export function validateBlankLinesForPair(ctx: PairContext) {
    // 解构参数
    const { doc, lineCount, openLine, closeLine, tagName, openFrom, openTo, closeFrom, closeTo, diagnostics, sourceId } = ctx

    // 检查开始标签前一行
    if (openLine > 1) {
        const prev = doc.line(openLine - 1).text
        if (prev.trim() !== "") {
            diagnostics.push({ from: openFrom, to: openTo, severity: "error", message: `标签前应有空行: <${tagName}>`, source: sourceId })
        }
    }

    // 检查结束标签后一行
    if (closeLine < lineCount) {
        const next = doc.line(closeLine + 1).text
        if (next.trim() !== "") {
            diagnostics.push({ from: closeFrom, to: closeTo, severity: "error", message: `标签后应有空行: </${tagName}>`, source: sourceId })
        }
    }
}

/**
 * 校验成对标签应为单行
 * @param ctx - 上下文对象
 * @return void
 */
export function validateSingleLineForPair(ctx: PairContext) {
    const { openLine, closeLine, tagName, openFrom, closeTo, diagnostics, sourceId } = ctx
    // 调用方负责判断该 tag 是否属于单行要求，此处仅检查是否为单行
    if (openLine !== closeLine) {
        diagnostics.push({
            from: openFrom,
            to: closeTo,
            severity: "error",
            message: `${tagName} 标签内容应为单行: <${tagName} ...></${tagName}>`,
            source: sourceId,
        })
    }
}

/**
 * 校验标签内部不允许嵌套项目自定义标签.
 * @param ctx - 上下文对象.
 * @returns boolean 是否检测到嵌套的自定义标签.
 */
export function validateNoNestedCustomTags(ctx: InnerContentContext): boolean {
    const { doc, openLine, closeLine, openFromIndex, openLength, closeMatchIndex, tagName, diagnostics, sourceId, ignoredLineNumbers } = ctx
    let hasNestedTag = false

    for (let lineNum = openLine; lineNum <= closeLine; lineNum++) {
        if (ignoredLineNumbers?.has(lineNum)) {
            continue
        }

        const line = doc.line(lineNum)
        const start = lineNum === openLine ? openFromIndex + openLength : 0
        const end = lineNum === closeLine ? closeMatchIndex : line.text.length
        const segment = line.text.slice(start, end)

        if (!segment) {
            continue
        }

        CUSTOM_TAG_REGEX.lastIndex = 0
        let match: RegExpExecArray | null

        while ((match = CUSTOM_TAG_REGEX.exec(segment)) !== null) {
            hasNestedTag = true
            diagnostics.push({
                from: line.from + start + match.index,
                to: line.from + start + match.index + match[0].length,
                severity: "error",
                message: `${tagName} 标签内不允许嵌套自定义标签: ${match[0]}`,
                source: sourceId,
            })
        }
    }

    return hasNestedTag
}

export default {
    buildDocFromText,
    loadEagerRules,
    getLazyRuleLoaders,
    collectFencedCodeLineNumbers,
    validateNoSurroundingContent,
    validateEmptyContent,
    validateBlankLinesForPair,
    validateSingleLineForPair,
    validateNoNestedCustomTags,
}
