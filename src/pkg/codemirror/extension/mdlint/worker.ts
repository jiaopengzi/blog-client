/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\worker.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : Markdown Linter Worker 脚本
 */

import type { Diagnostic } from "@codemirror/lint"

import type { RuleDefinition } from "./types"
import { getLazyRuleLoaders } from "./utils"

// 延迟加载器集合, 以及模块缓存用于避免重复加载
const loaders = getLazyRuleLoaders()
const moduleCache: Record<string, RuleDefinition<unknown> | undefined> = {}

// 辅助函数: 根据 loader 加载模块并根据 forceUpdate 决定是否更新缓存
async function loadModuleAndCache(key: string, loader: (() => Promise<RuleDefinition<unknown> | undefined>) | undefined, forceUpdate = false) {
    if (!loader) return undefined
    try {
        const mod = await loader()
        if (forceUpdate || !moduleCache[key]) moduleCache[key] = mod
        return mod
    } catch {
        return undefined
    }
}

/**
 * 将纯文本构建为与编辑器文档兼容的 doc 对象
 * @param text - 文本内容
 * @returns doc 对象, 含 lines 和 line(i) 方法, 用于规则函数读取行信息
 */
function buildDocFromText(text: string) {
    // 按照行拆分文本并计算每行的起始偏移量
    const lines = text.split(/\r?\n/)
    const offsets: number[] = [0]
    for (let i = 0; i < lines.length; i++) {
        offsets.push((offsets[i] ?? 0) + (lines[i] ?? "").length + 1)
    }

    // 返回符合 DocLike 接口的对象
    return {
        lines: lines.length,
        line(i: number) {
            const idx = i - 1
            const t = lines[idx] ?? ""
            const from = offsets[idx] ?? 0
            const to = from + t.length
            return { from, to, text: t }
        },
    }
}

/**
 * Worker 消息处理入口, 支持执行规则收集 diagnostics, 以及接收控制消息清理缓存
 */
self.addEventListener("message", async (ev) => {
    const { id, text, options, action, rulePath } = ev.data || {}
    // 支持控制消息: clearCache 用于清理指定规则的缓存, 或全部清理
    if (action === "clearCache") {
        if (typeof rulePath === "string") {
            delete moduleCache[rulePath]
            type LocalSelf = { postMessage: (data: unknown) => void }
            ;(self as unknown as LocalSelf).postMessage({ action: "clearCache", rulePath, ok: true })
            return
        }

        // 清空所有缓存
        for (const k of Object.keys(moduleCache)) delete moduleCache[k]
        type LocalSelf = { postMessage: (data: unknown) => void }
        ;(self as unknown as LocalSelf).postMessage({ action: "clearCache", ok: true })
        return
    }

    // 构建 doc 对象供规则使用
    const doc = buildDocFromText(text || "")

    // 收集所有规则执行结果的 diagnostics
    const diagnostics: Diagnostic[] = []

    // 按 loader 的 key 顺序迭代加载器, 并根据缓存策略加载模块
    for (const p of Object.keys(loaders)) {
        let r = moduleCache[p]
        const loader = loaders[p]
        if (options?.devHotReload) {
            // devHotReload 开启时, 强制重新加载并更新缓存
            r = await loadModuleAndCache(p, loader, true)
        } else {
            // 正常模式下, 仅在缓存缺失时加载
            if (!r) {
                r = await loadModuleAndCache(p, loader, false)
            }
        }
        if (!r) continue

        // 规则启用判断与配置合并
        const cfg = options?.rules?.[r.id]
        if (cfg === false) continue

        // 规则启用状态判断
        const enabled = cfg === undefined ? true : typeof cfg === "object" ? cfg.enabled !== false : Boolean(cfg)
        if (!enabled) continue

        // 合并默认配置与用户传入配置
        let ruleOpts = { ...(r.defaultOptions || {}) }
        if (typeof cfg === "object") ruleOpts = { ...ruleOpts, ...cfg }
        if (options?.maxLineLength != null && r.id === "rule002") {
            ruleOpts = { ...ruleOpts, maxLineLength: options.maxLineLength }
        }

        // 执行规则并收集返回结果, 异常时记录为 error 类型 diagnostic
        try {
            const runFn = (r as { run: (d: unknown, o?: unknown) => Diagnostic[] }).run
            const res = runFn(doc, ruleOpts)
            if (Array.isArray(res) && res.length) diagnostics.push(...res)
        } catch (e) {
            diagnostics.push({ from: 0, to: 0, severity: "error", message: `规则 ${r.id} 执行异常: ${String(e)}`, source: r.id })
        }
    }

    // 返回收集到的 diagnostics
    type LocalSelf = { postMessage: (data: unknown) => void }
    ;(self as unknown as LocalSelf).postMessage({ id, diagnostics })
})
