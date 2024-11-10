/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-29 10:52:39
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-10 17:48:27
 * @FilePath     : \blog-client\src\api\post\insert.ts
 * @Description  : 插入文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"
import { type PgSqlDateTime } from "@/api/common"

export enum PostStatusCode {
    Draft = 0, // 草稿
    Private = 1, // 私密
    Future = 2, // 定时发布
    Password = 3, // 密码保护
    Publish = 4, // 公开发布
}

// 获取文章状态选项
export const gegPostStatusOptions = () => {
    return [
        { label: "草稿", value: PostStatusCode.Draft },
        { label: "私密", value: PostStatusCode.Private },
        { label: "定时发布", value: PostStatusCode.Future },
        { label: "密码保护", value: PostStatusCode.Password },
        { label: "公开发布", value: PostStatusCode.Publish },
    ]
}

export enum CommentStatusCode {
    Open = 1, // 开启
    Close = 0, // 关闭
}

export interface InsertPostRequest {
    id?: string // 文章ID
    post_author: string // 文章作者
    post_content: string // 文章内容
    post_title: string // 文章标题
    post_status: PostStatusCode // 文章状态 0 草稿 1 待审核 2 私密 3 定时发布 4 已发布 5 过期 6 回收站
    post_password: string // 文章密码
    comment_status: CommentStatusCode // 评论是否开启 0 关闭 1 开启
    price?: number // 价格
    seo_title: string // SEO标题
    seo_keywords: string // SEO关键词
    seo_description: string // SEO描述
    slug: string // 别名
    thumbnail: string // 缩略图
    categories: number[] // 分类id
    tags: string[] // 标签
    pay_roles: string[] // 付费角色
    post_push_time: PgSqlDateTime // 发布时间
    post_expired_time: PgSqlDateTime // 过期时间
}

// 插入文章
export function insertPostRequestAPI(requestData: InsertPostRequest): AxiosPromise<Res> {
    const urlStr = routerGroup + "/post/insert"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}

// 创建 empty InsertPostRequest
export function createEmptyInsertPostRequest(): InsertPostRequest {
    return {
        post_author: "",
        post_content: "",
        post_title: "",
        post_status: PostStatusCode.Draft,
        post_password: "",
        comment_status: CommentStatusCode.Open,
        seo_title: "",
        seo_keywords: "",
        seo_description: "",
        slug: "",
        thumbnail: "",
        categories: [],
        tags: [],
        pay_roles: [],
        post_push_time: {
            time: null,
            valid: false,
        },
        post_expired_time: {
            time: null,
            valid: false,
        },
    }
}
