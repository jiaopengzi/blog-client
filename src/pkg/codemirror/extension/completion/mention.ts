/*
 * FilePath    : blog-client\src\pkg\codemirror\extension\completion\mention.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : @提及补全
 */

import type { Completion, CompletionResult } from "@codemirror/autocomplete"
import { CompletionContext } from "@codemirror/autocomplete"

/**
 * @description: 组合补全
 * @param data 补全数据
 * @return {CompletionResult | null} 补全结果
 */
export function mentionOverride(data: Completion[] = []): (context: CompletionContext) => CompletionResult | null {
    return (context: CompletionContext): CompletionResult | null => {
        const keyword = context.matchBefore(/@([\u4e00-\u9fa5\w]+)?/) // 匹配以@开头后的任意字符，包括中文、英文、数字等

        if (!keyword) return null // 如果没有匹配到则不补全
        if (keyword.from === keyword.to && !context.explicit) return null // 如果没有输入内容则不补全

        return {
            from: keyword.from,
            options: data,
        }
    }
}
