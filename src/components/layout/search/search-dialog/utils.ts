/**
 * FilePath    : blog-client\src\components\layout\search\search-dialog\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 搜索历史纯逻辑 (解析与写入计算), 自 index.vue 抽离以支撑单测 (bugfix 260918-06)
 */

import type { SearchHistoryItem } from "./types"

// 搜索历史最多保留条数
export const SEARCH_HISTORY_MAX_COUNT = 20

/**
 * parseSearchHistory 解析 localStorage 中的搜索历史原始字符串.
 * @remarks 存储内容损坏 (JSON 解析失败 / 非数组 / 项缺 value) 时回退为空列表, 保证弹窗不被脏数据卡死.
 * @param raw - localStorage 取出的原始字符串, 可为 null.
 * @returns 解析出的搜索历史列表, 异常时为空数组.
 */
export function parseSearchHistory(raw: string | null): SearchHistoryItem[] {
    try {
        const parsed = JSON.parse(raw || "[]") as SearchHistoryItem[]
        if (!Array.isArray(parsed)) {
            return []
        }
        return parsed.filter((item): item is SearchHistoryItem => typeof item?.value === "string")
    } catch {
        return []
    }
}

/**
 * buildNextSearchHistory 计算写入一条搜索词后的新历史列表 (不改入参).
 * @remarks 逻辑等价移植自 index.vue 的 updateHistory:
 *  1. 已存在则更新时间并移到最前;
 *  2. 不存在则新增到最前;
 *  3. 限制搜索历史的长度, 只保留 SEARCH_HISTORY_MAX_COUNT 条.
 *  修正：新增项 id 原取数组长度, 删除中间项后再新增会产生重复 id, 点叉时按 findIndex 命中首项导致删错条目;
 *  现改用时间戳生成 id, 与已有 id 不会冲突 (bugfix 260918-06).
 * @param list - 当前历史列表.
 * @param keyword - 本次搜索词, 调用方保证非空字符串.
 * @param now - 可注入的当前时间戳, 默认 Date.now(), 便于测试.
 * @returns 新的历史列表.
 */
export function buildNextSearchHistory(list: SearchHistoryItem[], keyword: string, now: number = Date.now()): SearchHistoryItem[] {
    const index = list.findIndex((item) => item.value === keyword)
    if (index === -1) {
        const next: SearchHistoryItem[] = [{ id: now, value: keyword, time: now }, ...list]
        return next.slice(0, SEARCH_HISTORY_MAX_COUNT)
    }
    // 已存在则更新时间并移到最前
    const target = list[index]!
    const rest = list.filter((_, i) => i !== index)
    return [{ ...target, time: now }, ...rest]
}
