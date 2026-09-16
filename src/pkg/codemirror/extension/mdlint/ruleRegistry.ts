/**
 * FilePath    : blog-client\src\pkg\codemirror\extension\mdlint\ruleRegistry.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : Markdown lint 主线程规则注册表
 */

import type { RuleDefinition } from "./types"

const eagerRuleModules = import.meta.glob("./rule/*.ts", { eager: true }) as Record<string, unknown>

/**
 * resolveRuleDefinition 从模块导出中提取规则定义.
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
 * loadEagerRules 在主线程同步加载规则模块, 供非 worker 场景与自动修复流程复用.
 * @returns 按文件名排序后的规则定义数组.
 */
export function loadEagerRules(): RuleDefinition<unknown>[] {
    return (
        Object.keys(eagerRuleModules)
            // oxlint-disable-next-line unicorn/no-array-sort
            .sort()
            .map((path) => resolveRuleDefinition(eagerRuleModules[path]))
            .filter((item): item is RuleDefinition<unknown> => Boolean(item))
    )
}
