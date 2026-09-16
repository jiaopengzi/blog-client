/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\lazyRuleRegistry.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Markdown lint Worker 规则延迟加载注册表
 */

import type { RuleDefinition } from "./types"

const lazyRuleLoaders = import.meta.glob("./rule/*.ts") as Record<string, () => Promise<unknown>>

/**
 * resolveRuleDefinition 从异步模块导出中提取规则定义.
 * @param moduleValue 规则模块导出值.
 * @returns 可执行的规则定义, 提取失败时返回 undefined.
 */
function resolveRuleDefinition(moduleValue: unknown): RuleDefinition<unknown> | undefined {
    if (!moduleValue || typeof moduleValue !== "object") {
        return undefined
    }

    const candidate = (moduleValue as { default?: unknown }).default ?? moduleValue
    if (candidate && typeof (candidate as { run?: unknown }).run === "function") {
        return candidate as RuleDefinition<unknown>
    }

    return undefined
}

/**
 * getLazyRuleLoaders 返回按文件名排序的延迟规则加载器映射.
 * @returns key 为模块路径, value 为规则异步加载函数的映射.
 */
export function getLazyRuleLoaders() {
    const map: Record<string, () => Promise<RuleDefinition<unknown> | undefined>> = {}

    // oxlint-disable-next-line unicorn/no-array-sort
    for (const path of Object.keys(lazyRuleLoaders).sort()) {
        const loader = lazyRuleLoaders[path]
        map[path] = async () => {
            if (typeof loader !== "function") {
                return undefined
            }

            const moduleValue = await loader()
            return resolveRuleDefinition(moduleValue)
        }
    }

    return map
}
