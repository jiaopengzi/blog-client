/*
 * FilePath    : blog-client-nuxt\src\components\views\admin\component\main\dashboard\post-visit-top\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 内容访问排行本地持久化辅助方法
 */

import { LocalStorageKey } from "@/stores/local"

import { alignPostVisitTopN, type PostVisitTopSelectionStorage, POST_VISIT_TOP_N_DEFAULT, PostVisitRange } from "./types"

/**
 * 判断值是否为合法的排行时间范围.
 * @param value 待校验的原始值.
 * @returns 合法时返回 true, 否则返回 false.
 */
const isPostVisitRange = (value: unknown): value is PostVisitRange => {
    return typeof value === "string" && Object.values(PostVisitRange).includes(value as PostVisitRange)
}

/**
 * 读取本地缓存的排行筛选项.
 * @returns 返回合法的筛选项, 无缓存或缓存非法时返回 null.
 */
export const getSavedPostVisitTopSelection = (): PostVisitTopSelectionStorage | null => {
    const savedSelection = localStorage.getItem(LocalStorageKey.DashboardPostVisitTopSelection)

    if (!savedSelection) {
        return null
    }

    try {
        const parsedSelection = JSON.parse(savedSelection) as Partial<PostVisitTopSelectionStorage>

        if (!isPostVisitRange(parsedSelection.range)) {
            return null
        }

        return {
            range: parsedSelection.range,
            topN: alignPostVisitTopN(Number(parsedSelection.topN ?? POST_VISIT_TOP_N_DEFAULT)),
        }
    } catch {
        return null
    }
}

/**
 * 持久化当前排行筛选项到本地缓存.
 * @param range 时间范围.
 * @param topN 排行数量.
 */
export const persistPostVisitTopSelection = (range: PostVisitRange, topN: number): void => {
    localStorage.setItem(LocalStorageKey.DashboardPostVisitTopSelection, JSON.stringify({ range, topN: alignPostVisitTopN(topN) }))
}
