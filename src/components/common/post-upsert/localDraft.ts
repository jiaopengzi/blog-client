/*
 * FilePath    : blog-client\src\components\common\post-upsert\localDraft.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 文章编辑器本地草稿存储工具
 */

import { type PgSqlDateTime } from "@/api/common"
import { PostType, type SimplePostVideoTocTree } from "@/api/post/common"
import { LocalStorageKey } from "@/stores/local"
import { loadLocalStorageRecord, removeLocalStorageJson, saveLocalStorageJson } from "@/utils/localStorageJson"

import type { UpsertPostForm } from "./types"

export const POST_UPSERT_LOCAL_DRAFT_VERSION = 1

const POST_UPSERT_LOCAL_DRAFT_NEW_ID = "__new__"

export interface PostUpsertLocalDraft {
    version: number
    postType: PostType
    postId: string
    form: UpsertPostForm
    formSignature: string
    remoteSaved: boolean
    updatedAt: string
}

export interface SavePostUpsertLocalDraftOptions {
    postType: PostType
    postId: string
    form: UpsertPostForm
    remoteSaved: boolean
    lastSavedSignature?: string
    force?: boolean
}

export interface SavePostUpsertLocalDraftResult {
    draft: PostUpsertLocalDraft
    saved: boolean
    signature: string
}

export type PostUpsertDraftResolution = "none" | "prompt"

type PostUpsertLocalDraftCollection = Record<string, PostUpsertLocalDraft>

/**
 * normalizePostUpsertDraftPostId 统一本地草稿的目标 ID.
 * @param postId - 当前文章 ID, 新增文章为空字符串.
 * @returns 可用于 localStorage 集合的稳定 ID.
 */
export function normalizePostUpsertDraftPostId(postId: string): string {
    return postId || POST_UPSERT_LOCAL_DRAFT_NEW_ID
}

/**
 * getPostUpsertLocalDraftKey 生成文章编辑器草稿集合中的业务键.
 * @param postType - 文章类型.
 * @param postId - 当前文章 ID, 新增文章为空字符串.
 * @returns 本地草稿业务键.
 */
export function getPostUpsertLocalDraftKey(postType: PostType, postId: string): string {
    return `${postType}:${normalizePostUpsertDraftPostId(postId)}`
}

/**
 * normalizePostUpsertDraftForm 将响应式表单转为可序列化的稳定结构.
 * @param form - 当前文章编辑表单.
 * @returns 字段顺序稳定且时间字段已归一化的表单副本.
 */
export function normalizePostUpsertDraftForm(form: UpsertPostForm): UpsertPostForm {
    return {
        id: form.id || "",
        post_author: form.post_author || "",
        post_content: form.post_content || "",
        post_title: form.post_title || "",
        post_status: form.post_status,
        post_password: form.post_password || "",
        comment_status: form.comment_status,
        price: Number(form.price) || 0,
        seo_title: form.seo_title || "",
        seo_keywords: form.seo_keywords || "",
        seo_description: form.seo_description || "",
        slug: form.slug || "",
        thumbnail: form.thumbnail || "",
        category_ids: [...(form.category_ids || [])],
        tag_names: [...(form.tag_names || [])],
        pay_roles: [...(form.pay_roles || [])],
        pay_strategy: form.pay_strategy,
        post_push_time: normalizePgSqlDateTime(form.post_push_time),
        post_expired_time: normalizePgSqlDateTime(form.post_expired_time),
        is_pinned: Number(form.is_pinned) || 0,
        is_recommended: Number(form.is_recommended) || 0,
        post_type: form.post_type,
        video_toc: cloneVideoToc(form.video_toc || []),
        video_file_id_hash_list: [...(form.video_file_id_hash_list || [])],
    }
}

/**
 * getPostUpsertDraftSignature 生成表单内容签名, 用于判断是否需要重新写入本地存储.
 * @param form - 当前文章编辑表单.
 * @returns 稳定 JSON 签名.
 */
export function getPostUpsertDraftSignature(form: UpsertPostForm): string {
    return JSON.stringify(normalizePostUpsertDraftForm(form))
}

/**
 * loadPostUpsertLocalDraft 读取指定文章编辑器本地草稿.
 * @param postType - 文章类型.
 * @param postId - 当前文章 ID, 新增文章为空字符串.
 * @returns 匹配的本地草稿, 不存在或格式非法时返回 null.
 */
export function loadPostUpsertLocalDraft(postType: PostType, postId: string): PostUpsertLocalDraft | null {
    const draft = loadPostUpsertLocalDraftCollection()[getPostUpsertLocalDraftKey(postType, postId)]

    if (!isPostUpsertLocalDraft(draft)) {
        return null
    }

    return draft
}

/**
 * savePostUpsertLocalDraft 保存文章编辑器本地草稿, 内容签名未变化时跳过写入.
 * @param options - 保存目标, 表单内容与上一轮签名.
 * @returns 保存结果, 包含是否真正写入 localStorage.
 */
export function savePostUpsertLocalDraft(options: SavePostUpsertLocalDraftOptions): SavePostUpsertLocalDraftResult {
    const form = normalizePostUpsertDraftForm(options.form)
    const signature = JSON.stringify(form)
    const draft = createPostUpsertLocalDraft(options.postType, options.postId, form, signature, options.remoteSaved)

    if (!options.force && options.lastSavedSignature === signature) {
        return {
            draft,
            saved: false,
            signature,
        }
    }

    const collection = loadPostUpsertLocalDraftCollection()
    collection[getPostUpsertLocalDraftKey(options.postType, options.postId)] = draft
    saveLocalStorageJson(LocalStorageKey.PostUpsertDrafts, collection)

    return {
        draft,
        saved: true,
        signature,
    }
}

/**
 * clearPostUpsertLocalDraft 清理指定文章编辑器本地草稿.
 * @param postType - 文章类型.
 * @param postId - 当前文章 ID, 新增文章为空字符串.
 * @returns 无返回值.
 */
export function clearPostUpsertLocalDraft(postType: PostType, postId: string): void {
    const collection = loadPostUpsertLocalDraftCollection()
    delete collection[getPostUpsertLocalDraftKey(postType, postId)]

    if (Object.keys(collection).length === 0) {
        removeLocalStorageJson(LocalStorageKey.PostUpsertDrafts)
        return
    }

    saveLocalStorageJson(LocalStorageKey.PostUpsertDrafts, collection)
}

/**
 * resolvePostUpsertLocalDraftConflict 判断本地草稿与当前远端/空白表单是否需要用户选择.
 * @param draft - 已读取的本地草稿.
 * @param currentForm - 当前页面初始化后的表单.
 * @returns none 表示无需提示, prompt 表示需要用户选择使用哪一份.
 */
export function resolvePostUpsertLocalDraftConflict(draft: PostUpsertLocalDraft | null, currentForm: UpsertPostForm): PostUpsertDraftResolution {
    if (!draft) {
        return "none"
    }

    if (draft.remoteSaved) {
        return "none"
    }

    if (draft.formSignature === getPostUpsertDraftSignature(currentForm)) {
        return "none"
    }

    return "prompt"
}

/**
 * createPostUpsertLocalDraft 创建标准化的本地草稿对象.
 * @param postType - 文章类型.
 * @param postId - 当前文章 ID, 新增文章为空字符串.
 * @param form - 已标准化的文章编辑表单.
 * @param signature - 表单内容签名.
 * @param remoteSaved - true 表示该草稿已成功远端保存.
 * @returns 本地草稿对象.
 */
function createPostUpsertLocalDraft(postType: PostType, postId: string, form: UpsertPostForm, signature: string, remoteSaved: boolean): PostUpsertLocalDraft {
    return {
        version: POST_UPSERT_LOCAL_DRAFT_VERSION,
        postType,
        postId: normalizePostUpsertDraftPostId(postId),
        form,
        formSignature: signature,
        remoteSaved,
        updatedAt: new Date().toISOString(),
    }
}

/**
 * loadPostUpsertLocalDraftCollection 读取并清洗文章编辑器草稿集合.
 * @returns 只包含有效草稿的集合.
 */
function loadPostUpsertLocalDraftCollection(): PostUpsertLocalDraftCollection {
    return loadLocalStorageRecord(LocalStorageKey.PostUpsertDrafts, isPostUpsertLocalDraft)
}

/**
 * isPostUpsertLocalDraft 判断未知数据是否为可恢复的文章编辑器草稿.
 * @param value - 待校验数据.
 * @returns true 表示数据结构可用于恢复.
 */
function isPostUpsertLocalDraft(value: unknown): value is PostUpsertLocalDraft {
    if (!value || typeof value !== "object" || Array.isArray(value)) {
        return false
    }

    const draft = value as Partial<PostUpsertLocalDraft>
    if (draft.version !== POST_UPSERT_LOCAL_DRAFT_VERSION || !Object.values(PostType).includes(draft.postType as PostType)) {
        return false
    }

    if (typeof draft.postId !== "string" || typeof draft.formSignature !== "string" || typeof draft.remoteSaved !== "boolean") {
        return false
    }

    if (typeof draft.updatedAt !== "string" || !draft.form) {
        return false
    }

    const form = normalizePostUpsertDraftForm(draft.form)
    draft.form = form
    draft.formSignature = JSON.stringify(form)

    return true
}

/**
 * normalizePgSqlDateTime 将本地存储中的时间字段恢复为 Date 或 null.
 * @param value - 待归一化的 PostgreSQL 时间对象.
 * @returns 可直接回填到表单的时间对象.
 */
function normalizePgSqlDateTime(value: PgSqlDateTime): PgSqlDateTime {
    return {
        Time: normalizeDate(value?.Time),
        Valid: Boolean(value?.Valid),
    }
}

/**
 * normalizeDate 将 Date 或 ISO 字符串归一化为 Date.
 * @param value - Date, ISO 字符串或空值.
 * @returns 有效 Date 或 null.
 */
function normalizeDate(value: Date | string | null | undefined): Date | null {
    if (!value) {
        return null
    }

    if (value instanceof Date) {
        return Number.isNaN(value.getTime()) ? null : new Date(value)
    }

    const date = new Date(value)
    return Number.isNaN(date.getTime()) ? null : date
}

/**
 * cloneVideoToc 深拷贝视频目录, 防止响应式对象直接写入 localStorage.
 * @param videoToc - 当前视频目录.
 * @returns 视频目录副本.
 */
function cloneVideoToc(videoToc: SimplePostVideoTocTree[]): SimplePostVideoTocTree[] {
    return JSON.parse(JSON.stringify(videoToc)) as SimplePostVideoTocTree[]
}
