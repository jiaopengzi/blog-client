/*
 * FilePath    : blog-client\src\stores\md-draft.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 公用 Markdown 页面草稿存储工具
 */

import { LocalStorageKey } from "@/stores/local"

export interface PublicMdDraft {
    content: string
    updatedAt: string
}

/**
 * loadPublicMdDraft 读取公用 Markdown 页面草稿。
 * @returns PublicMdDraft 或 null。
 */
export function loadPublicMdDraft(): PublicMdDraft | null {
    const raw = localStorage.getItem(LocalStorageKey.PublicMdDraft)
    if (!raw) {
        return null
    }

    try {
        return JSON.parse(raw) as PublicMdDraft
    } catch {
        return null
    }
}

/**
 * savePublicMdDraft 保存公用 Markdown 页面草稿。
 * @param content - 当前 Markdown 内容。
 * @returns 已保存的草稿对象。
 */
export function savePublicMdDraft(content: string): PublicMdDraft {
    const draft: PublicMdDraft = {
        content,
        updatedAt: new Date().toISOString(),
    }

    localStorage.setItem(LocalStorageKey.PublicMdDraft, JSON.stringify(draft))

    return draft
}

/**
 * clearPublicMdDraft 清空公用 Markdown 页面草稿。
 * @returns 无返回值。
 */
export function clearPublicMdDraft(): void {
    localStorage.removeItem(LocalStorageKey.PublicMdDraft)
}
