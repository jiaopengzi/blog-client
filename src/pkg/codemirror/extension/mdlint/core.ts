/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\core.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : Markdown Linter 核心实现
 */

import { type Diagnostic, linter, type LintSource } from "@codemirror/lint"
import type { Extension } from "@codemirror/state"
import type { Text } from "@codemirror/state"
import { type EditorView, keymap, ViewPlugin } from "@codemirror/view"

import { loadEagerRules } from "./ruleRegistry"
import { autoFixMarkdownText } from "./service"
import type { MarkdownLinterOptions, MarkdownRulesConfig, RuleDefinition } from "./types"
import { acquireMarkdownLintWorker, releaseMarkdownLintWorker, requestMarkdownLintByWorker } from "./workerManager"

// 递归扫描当前目录及子目录下以 rule 开头的规则文件并按文件名排序加载, 使用 utils.loadEagerRules() 在主线程同步获取规则模块列表
const RULES: RuleDefinition<unknown>[] = loadEagerRules()

/**
 * 根据传入的选项创建 linter 回调函数
 * @param options - MarkdownLinterOptions 配置选项
 * @param worker - 可选的 Worker 实例, 若提供则使用 Worker 进行 linting
 * @returns linter 回调函数, 可传入 linter() 创建 CodeMirror 扩展
 */
function makeLinterCallback(options: MarkdownLinterOptions = {}, worker?: Worker) {
    // 在 worker 模式下, 为每次请求生成唯一 id 并通过 postMessage 发送文本到 worker, 然后等待带有相同 id 的响应
    if (worker) {
        return (view: EditorView) => {
            const doc = view.state.doc as Text
            const text = doc.toString()

            return requestMarkdownLintByWorker(text, options)
        }
    }

    // 非 worker 模式下的同步实现, 逐条执行规则并收集 Diagnostic
    return (view: EditorView) => {
        const diagnostics: Diagnostic[] = []
        const doc = view.state.doc as Text

        // 遍历预加载规则, 根据 options.rules 决定是否启用, 并合并配置
        for (const r of RULES) {
            const cfg = options.rules?.[r.id]
            if (cfg === false) continue

            const enabled = cfg === undefined ? true : typeof cfg === "object" ? cfg.enabled !== false : Boolean(cfg)
            if (!enabled) continue

            // 使用用户配置覆盖默认配置：若用户提供对象配置则直接采用用户配置, 否则使用默认配置
            // oxlint-disable-next-line unicorn/no-useless-fallback-in-spread
            const ruleOpts = typeof cfg === "object" ? { ...cfg } : { ...(r.defaultOptions || {}) }

            // 执行规则并收集返回的 Diagnostic
            const res = r.run(doc, ruleOpts)
            if (Array.isArray(res) && res.length) diagnostics.push(...(res as unknown as Diagnostic[]))
        }

        return diagnostics
    }
}

/**
 * 创建 Markdown linter 扩展
 * @param options - 配置选项, 包含 useWorker, rules 等
 * @returns CodeMirror 扩展 (Extension), 可直接加入编辑器配置
 */
export function createMarkdownLinter(options: MarkdownLinterOptions = {}): Extension {
    if (options.useWorker) {
        const worker = acquireMarkdownLintWorker()
        const linterExt = linter(makeLinterCallback(options, worker) as unknown as LintSource)

        const plugin = ViewPlugin.fromClass(
            class {
                destroy() {
                    releaseMarkdownLintWorker()
                }
            },
        )

        return [linterExt, plugin]
    }

    return linter(makeLinterCallback(options) as unknown as LintSource)
}

/**
 * 创建保存时自动修复 Markdown lint 问题的扩展
 * 绑定 Mod-s (Ctrl+S / Cmd+S) 快捷键, 执行 autoFixMarkdownText 并将修复后的文本写回编辑器
 * @param options - 配置选项
 * @param options.rules - Markdown 规则配置, 传入 autoFixMarkdownText 用于修复后复检
 * @param options.onSave - 修复完成后的回调, 可用于触发外部保存逻辑
 * @returns CodeMirror 扩展 (Extension)
 */
export function createAutoFixExtension(
    options: {
        rules?: MarkdownRulesConfig
        onSave?: (view: EditorView) => void
    } = {},
): Extension {
    return keymap.of([
        {
            key: "Mod-s",
            run(view: EditorView) {
                const currentText = view.state.doc.toString()
                const { fixedText, changed } = autoFixMarkdownText(currentText, { rules: options.rules })

                // 仅在文本有实际变化时才 dispatch 更新, 避免无意义的 undo 记录
                if (changed) {
                    view.dispatch({
                        changes: { from: 0, to: view.state.doc.length, insert: fixedText },
                    })
                }

                options.onSave?.(view)

                // 返回 true 阻止浏览器默认的保存行为
                return true
            },
        },
    ])
}

export default createMarkdownLinter
