/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\core.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : Markdown Linter 核心实现
 */

import { type Diagnostic, linter, type LintSource } from "@codemirror/lint"
import type { Extension } from "@codemirror/state"
import type { Text } from "@codemirror/state"
import { type EditorView, ViewPlugin } from "@codemirror/view"

import type { MarkdownLinterOptions, RuleDefinition } from "./types"
import { loadEagerRules } from "./utils"

// 递归扫描当前目录及子目录下以 rule 开头的规则文件并按文件名排序加载, 使用 utils.loadEagerRules() 在主线程同步获取规则模块列表
const RULES: RuleDefinition<unknown>[] = loadEagerRules()

/**
 * 根据传入的选项创建 linter 回调函数
 * @param options - MarkdownLinterOptions 配置选项
 * @param worker - 可选的 Worker 实例, 若提供则使用 Worker 进行 linting
 * @returns linter 回调函数, 可传入 linter() 创建 CodeMirror 扩展
 */
function makeLinterCallback(options: MarkdownLinterOptions = {}, worker?: Worker) {
    let counter = 0

    // 在 worker 模式下, 为每次请求生成唯一 id 并通过 postMessage 发送文本到 worker, 然后等待带有相同 id 的响应
    if (worker) {
        return (view: EditorView) => {
            const doc = view.state.doc as Text
            const text = doc.toString()
            const id = ++counter

            // 创建 Promise 等待 worker 返回 diagnostics, 并在收到匹配 id 的消息后移除监听器
            return new Promise<Diagnostic[]>((resolve) => {
                const onMessage = (ev: MessageEvent) => {
                    // 边界检查
                    if (!ev.data) return
                    if (ev.data.id !== id) return

                    // 收到匹配的响应后, 清理监听并返回 diagnostics
                    worker.removeEventListener("message", onMessage)
                    resolve(ev.data.diagnostics || [])
                }

                worker.addEventListener("message", onMessage)

                // 发送文本到 worker, worker 会处理并返回 diagnostics
                // 仅发送可序列化的字段, 避免将 Vue 响应式对象或函数传入 worker 导致 DataCloneError
                try {
                    const safeOptions = { useWorker: options?.useWorker, rules: options?.rules }
                    worker.postMessage({ id, text, options: safeOptions })
                } catch {
                    // 最后兜底：若仍然失败, 发送最小负载以保证不阻塞编辑器
                    worker.postMessage({ id, text, options: { useWorker: false } })
                }
            })
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
        const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" })
        const linterExt = linter(makeLinterCallback(options, worker) as unknown as LintSource)

        const plugin = ViewPlugin.fromClass(
            class {
                constructor() {}
                destroy() {
                    try {
                        worker.terminate()
                    } catch {
                        /* ignore */
                    }
                }
            },
        )

        return [linterExt, plugin]
    }

    return linter(makeLinterCallback(options) as unknown as LintSource)
}

export default createMarkdownLinter
