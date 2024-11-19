/**
 * @Author       : jiaopengzi
 * @Date         : 2024-01-18 10:05:03
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-19 16:11:14
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\index.ts
 * @Description  :
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

export { default } from "./index.vue"
import { type PgSqlDateTime } from "@/api/common"
import { PostStatusCode, CommentStatusCode } from "@/api/post/insert"

export interface UpsertPostForm {
    id: string // 文章ID
    post_author: string // 文章作者
    post_content: string // 文章内容
    post_title: string // 文章标题
    post_status: PostStatusCode // 文章状态 0 草稿 1 待审核 2 私密 3 定时发布 4 已发布 5 过期 6 回收站
    post_password: string // 文章密码
    comment_status: CommentStatusCode // 评论是否开启 0 关闭 1 开启
    price: number // 价格
    seo_title: string // SEO标题
    seo_keywords: string // SEO关键词
    seo_description: string // SEO描述
    slug: string // 别名
    thumbnail: string // 缩略图
    category_ids: string[] // 分类id
    tag_names: string[] // 标签
    pay_roles: string[] // 付费角色
    post_push_time: PgSqlDateTime // 发布时间
    post_expired_time: PgSqlDateTime // 过期时间
}

// 创建 empty InsertPostRequest
export function createEmptyUpsertPostForm(): UpsertPostForm {
    return {
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
        post_push_time: {
            Time: null,
            Valid: false,
        },
        post_expired_time: {
            Time: null,
            Valid: false,
        },
    }
}
