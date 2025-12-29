/**
 * FilePath    : blog-client-dev\src\pkg\codemirror\extension\mdlint\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 工具函数
 */

import type { RuleDefinition } from "./types"

// 在主线程同步加载模块并同时保留延迟加载器的占位映射
// 规则文件已统一放入本目录下的 "rule" 子目录, 文件名不再包含前缀, 例如 "001.ts", "002.ts"
const _eagerModules = import.meta.glob("./rule/*.ts", { eager: true }) as Record<string, unknown>

// 从已加载的模块映射派生出 lazy loader 映射, loader 会返回已加载的模块
// 这样保持导入路径一致, 并避免重复写 glob 模式
const lazyLoaders = Object.fromEntries(Object.keys(_eagerModules).map((p) => [p, async () => _eagerModules[p]])) as Record<string, () => Promise<unknown>>

// eagerModules 供同步加载使用, 直接引用已加载的模块映射
const eagerModules = _eagerModules

/**
 * 在主线程同步加载规则模块, 并按文件名排序返回 RuleModule 数组
 * @returns RuleModule[] 已加载并筛选后的规则模块数组
 */
export function loadEagerRules(): RuleDefinition<unknown>[] {
    return Object.keys(eagerModules)
        .sort()
        .map((p) => {
            const m = eagerModules[p]
            if (!m || typeof m !== "object") return undefined
            const candidate = (m as { default?: unknown }).default ?? m
            if (candidate && typeof (candidate as { run?: unknown }).run === "function") return candidate as RuleDefinition<unknown>
            return undefined
        })
        .filter((x): x is RuleDefinition<unknown> => Boolean(x))
}

/**
 * 获取延迟加载器映射, 每个 loader 返回对应的 RuleModule
 * @returns Record<string, () => Promise<RuleModule | undefined>>
 */
export function getLazyRuleLoaders() {
    const map: Record<string, () => Promise<RuleDefinition<unknown> | undefined>> = {}
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

export default { loadEagerRules, getLazyRuleLoaders }
