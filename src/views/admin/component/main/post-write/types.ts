/**
 * @FilePath     : \blog-client\src\views\admin\component\main\post-write\types.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 类型
 */

import { type PgSqlDateTime } from "@/api/common"
import { CommentStatusCode, PostStatusCode, type UpdateFields } from "@/api/post/common"

// 查询参数
export const queryKey = {
    ID: "id",
}

export interface UpsertPostForm {
    id: string // 文章ID
    post_author: string // 文章作者
    post_content: string // 文章内容
    post_title: string // 文章标题
    post_status: PostStatusCode // 文章状态 0 草稿 1 待审核 2 私密 3 定时发布 4 已发布 5 过期 6 回收站
    post_password: string // 文章密码
    comment_status: CommentStatusCode // 评论是否开启 0 关闭 1 开启
    price: string // 价格
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
    is_pinned: number // 是否置顶
    is_recommended: number // 是否推荐阅读
}

export interface UpdatePostForm extends UpsertPostForm {
    update_fields: UpdateFields[]
}

export interface PostInfoAboutTime {
    created_at?: Date // 创建时间
    updated_at?: Date // 更新时间
}
