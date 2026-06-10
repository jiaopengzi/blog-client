/*
 * FilePath    : blog-client\src\components\common\post-upsert\insertPostContent.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 编辑器插入文章或页面链接的工具函数
 */

import { PostType, type PostResPaginationByAdmin } from "@/api/post/common"

/**
 * PostLinkInsertOptions 文章或页面链接插入配置.
 */
export interface PostLinkInsertOptions {
    /** origin, 站点源地址, 例如 https://jiaopengzi.com. */
    origin?: string
}

/**
 * getPostLinkOrigin 获取生成链接时使用的站点源地址.
 * @param options - 链接生成配置.
 * @returns 站点源地址, 非浏览器环境且未传入时返回空字符串.
 */
function getPostLinkOrigin(options?: PostLinkInsertOptions): string {
    if (options?.origin) {
        return options.origin
    }

    if (typeof window !== "undefined" && window.location?.origin) {
        return window.location.origin
    }

    return ""
}

/**
 * escapeMarkdownLinkText 转义 Markdown 链接标题中的特殊字符.
 * @param text - 原始标题文本.
 * @returns 可安全放入 Markdown 链接方括号中的文本.
 */
function escapeMarkdownLinkText(text: string): string {
    return text.replace(/\\/g, "\\\\").replace(/\[/g, "\\[").replace(/\]/g, "\\]")
}

/**
 * createPostLinkUrl 根据文章或页面类型生成前台访问链接.
 * 文章使用首页 post_id 查询参数, 页面使用 /page/:slug 路径.
 * @param row - 后台文章或页面列表行.
 * @param origin - 站点源地址, 为空时生成相对链接.
 * @returns 前台访问链接.
 */
function createPostLinkUrl(row: PostResPaginationByAdmin, origin: string): string {
    if (row.post_type === PostType.Page) {
        const pageSlug = row.slug || row.id
        const pagePath = `/page/${encodeURIComponent(pageSlug)}`
        return origin ? new URL(pagePath, origin).toString() : pagePath
    }

    if (!origin) {
        return `/?post_id=${encodeURIComponent(row.id)}`
    }

    const postUrl = new URL("/", origin)
    postUrl.searchParams.set("post_id", row.id)
    return postUrl.toString()
}

/**
 * createPostLinkInsertText 生成插入编辑器的文章或页面 Markdown 链接.
 * 会过滤缺少 ID 的数据, 多个链接之间保留一个空行, 并在末尾补换行, 避免和后续输入粘连.
 * @param rows - 待插入的文章或页面列表行.
 * @param options - 链接生成配置.
 * @returns 可直接传给 CodeMirror 的插入文本.
 */
export function createPostLinkInsertText(rows: PostResPaginationByAdmin[], options?: PostLinkInsertOptions): string {
    const origin = getPostLinkOrigin(options)
    const links = rows.flatMap((row) => {
        if (!row.id) {
            return []
        }

        const title = escapeMarkdownLinkText(row.post_title || row.id)
        return [`[${title}](${createPostLinkUrl(row, origin)})`]
    })

    if (links.length === 0) {
        return ""
    }

    return `${links.join("\n\n")}\n`
}
