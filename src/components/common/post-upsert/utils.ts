/*
 * FilePath    : blog-client\src\components\common\post-upsert\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 工具
 */

import { CommentStatusCode, PayStrategy, PostStatusCode, PostType, PostTypeDisplay } from "@/api/post/common"
import { type PgSqlDateTime } from "@/api/common"
import { handleResErr, ResponseCode } from "@/api/response"
import { RouteNames, type RouteNames as RouteName } from "@/router"
import { MessageUtil } from "@/utils/message"
import { type UpsertPostForm } from "./types"

export interface PostEditLoadErrorResolution {
    showNoPermission: boolean
    redirectRouteName?: RouteName
    message?: string
}

/**
 * 创建默认展示时间.
 * @returns 有效的当前时间对象.
 */
export function createDefaultPostPushTime(): PgSqlDateTime {
    return {
        Time: new Date(),
        Valid: true,
    }
}

// 创建 empty InsertPostRequest
export function createEmptyUpsertPostForm(postType: PostType): UpsertPostForm {
    const emptyForm: UpsertPostForm = {
        id: "",
        post_author: "",
        post_content: "",
        post_title: "",
        post_status: PostStatusCode.Draft,
        post_password: "",
        comment_status: CommentStatusCode.Open,
        price: 0,
        seo_title: "",
        seo_keywords: "",
        seo_description: "",
        slug: "",
        thumbnail: "",
        category_ids: [],
        tag_names: [],
        pay_roles: [],
        pay_strategy: PayStrategy.Buy,
        post_push_time: createDefaultPostPushTime(),
        post_expired_time: {
            Time: null,
            Valid: false,
        },
        is_pinned: 0,
        is_recommended: 0,
        post_type: PostType.Post,
        video_toc: [],
        video_file_id_hash_list: [],
    }

    emptyForm.post_type = postType
    if (postType === PostType.Page || postType === PostType.Video) {
        emptyForm.comment_status = CommentStatusCode.Close
    }

    return emptyForm
}

/**
 * 统一处理文章新增和编辑时的错误提示.
 * @param res 接口响应对象.
 */
export function handlePostUpsertError(res: { data: { code: number; msg: string; data?: unknown } }) {
    if (res.data.code === ResponseCode.PayStrategyValidateFailed) {
        const detailMsg =
            res.data.data && typeof res.data.data === "object" && "msg" in res.data.data && typeof res.data.data.msg === "string" ? res.data.data.msg : ""

        if (detailMsg) {
            MessageUtil.error(`${res.data.msg}，${detailMsg}`, 0)
            return
        }
        MessageUtil.error(res.data.msg, 0)
        return
    }

    MessageUtil.error(handleResErr(res as never), 0)
}

/**
 * 根据编辑页初始化接口的错误码，决定后续页面行为。
 * @param code 接口响应码。
 * @param msg 接口响应消息。
 * @param postType 当前编辑对象类型。
 * @returns 初始化失败后的页面处理方案。
 */
export function resolvePostEditLoadError(code: number, msg: string, postType: PostType): PostEditLoadErrorResolution {
    if (code === ResponseCode.NoPermission) {
        return {
            showNoPermission: true,
        }
    }

    if (code === ResponseCode.ValidatorRequestError) {
        return {
            showNoPermission: false,
            redirectRouteName: postType === PostType.Page ? RouteNames.PageAll : RouteNames.PostAll,
            message: msg,
        }
    }

    return {
        showNoPermission: false,
    }
}

/**
 * 生成编辑页无权限时展示的资源名称, 让页面语义指向具体对象而不是组件名.
 * @param postType 当前编辑对象类型.
 * @param postID 当前编辑对象 ID.
 * @returns 适合展示在无权限页面中的资源名称.
 */
export function getPostEditNoPermissionResourceLabel(postType: PostType, postID: string): string {
    const postTypeText = PostTypeDisplay[postType]

    if (!postID) {
        return `该${postTypeText}`
    }

    return `${postTypeText} ID ${postID}`
}
