/*
 * FilePath    : blog-client\src\pkg\codemirror\extension\completions.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 补全扩展, 注意只能有一个补全扩展
 */

import type { Completion } from "@codemirror/autocomplete"
import { autocompletion } from "@codemirror/autocomplete"
import { Compartment, type Extension } from "@codemirror/state"

import { emojiOverride } from "./emoji"
import { mentionOverride } from "./mention"

/**
 * 生成一个统一的 CodeMirror 自动补全扩展.
 *
 * @param mentions - 用于 \@提及 补全的 Completion 对象数组
 * @param options - 可选配置对象.
 * @param options.enableMention - 是否启用 \@提及 补全，默认为 `true`.
 * @param options.enableEmoji - 是否启用 emoji 补全，默认为`true`.
 * @returns 返回配置好的 CodeMirror 自动补全扩展.
 * @example
 * ```typescript
 * const extension = unifiedCompletion(userMentions, { enableMention: true, enableEmoji: false });
 * ```
 */
export function unifiedCompletion(
    mentions: Completion[] = [],
    options?: {
        enableMention?: boolean
        enableEmoji?: boolean
    },
): Extension {
    // 默认开启情况
    const { enableMention = true, enableEmoji = true } = options || {}

    // 如果都不开启则返回空
    const overrides = []

    // @提及补全
    if (enableMention) {
        overrides.push(mentionOverride(mentions))
    }

    // emoji 补全
    if (enableEmoji) {
        overrides.push(emojiOverride)
    }

    // 统一补全
    return autocompletion({
        override: overrides,
    })
}

/**
 * @description: 补全 compartment
 * @description: 该 compartment 用于动态加载补全扩展
 */
export const completionCompartment = new Compartment()
