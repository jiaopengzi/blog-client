/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-25 19:50:13
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-25 20:21:15
 * @FilePath     : \blog-client\src\utils\getUpdatedFields.test.ts
 * @Description  : 测试获取更新字段
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { describe, it, expect } from "vitest"
import { getUpdatedFields } from "./getUpdatedFields"

// 文章状态
enum PostStatusCode {
    Draft = 1, // 草稿
    Private = 2, // 私密
    Future = 3, // 定时
    Password = 4, // 密码
    Publish = 5, // 发布
    Expired = 6, // 过期
}

// 文章状态选项
enum CommentStatusCode {
    Close = 1, // 关闭
    Open = 2, // 开启
}

interface PgSqlDateTime {
    Time: Date | null // 禁用到期时间
    Valid: boolean
}

interface UpsertPostForm {
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
}

describe("getUpdatedFields", () => {
    it("相等", () => {
        const fixedDate = new Date("2024-11-25T12:13:38.231Z")

        const oldForm: UpsertPostForm = {
            id: "1",
            post_author: "1",
            post_content: "content",
            post_title: "title",
            post_status: PostStatusCode.Publish,
            post_password: "password",
            comment_status: CommentStatusCode.Open,
            price: "100",
            seo_title: "seo_title",
            seo_keywords: "seo_keywords",
            seo_description: "seo_description",
            slug: "slug",
            thumbnail: "thumbnail",
            category_ids: ["1"],
            tag_names: ["tag"],
            pay_roles: ["role"],
            post_push_time: { Time: fixedDate, Valid: true },
            post_expired_time: { Time: fixedDate, Valid: true },
        }

        const newForm: UpsertPostForm = {
            id: "1",
            post_author: "1",
            post_content: "content",
            post_title: "title",
            post_status: PostStatusCode.Publish,
            post_password: "password",
            comment_status: CommentStatusCode.Open,
            price: "100",
            seo_title: "seo_title",
            seo_keywords: "seo_keywords",
            seo_description: "seo_description",
            slug: "slug",
            thumbnail: "thumbnail",
            category_ids: ["1"],
            tag_names: ["tag"],
            pay_roles: ["role"],
            post_push_time: { Time: fixedDate, Valid: true },
            post_expired_time: { Time: fixedDate, Valid: true },
        }

        const updatedFields = getUpdatedFields(oldForm, newForm, "id")

        expect(updatedFields).toEqual({})
    })

    it("不相等", () => {
        const fixedDate = new Date("2024-11-25T12:13:38.231Z")
        const newFixedDate = new Date("2024-11-25T12:13:38.230Z")

        const oldForm: UpsertPostForm = {
            id: "1",
            post_author: "1",
            post_content: "content",
            post_title: "title",
            post_status: PostStatusCode.Publish,
            post_password: "password",
            comment_status: CommentStatusCode.Open,
            price: "100",
            seo_title: "seo_title",
            seo_keywords: "seo_keywords",
            seo_description: "seo_description",
            slug: "slug",
            thumbnail: "thumbnail",
            category_ids: ["1"],
            tag_names: ["tag"],
            pay_roles: ["role"],
            post_push_time: { Time: fixedDate, Valid: true },
            post_expired_time: { Time: fixedDate, Valid: true },
        }

        const newForm: UpsertPostForm = {
            id: "1",
            post_author: "1",
            post_content: "content2",
            post_title: "title",
            post_status: PostStatusCode.Publish,
            post_password: "password",
            comment_status: CommentStatusCode.Open,
            price: "100",
            seo_title: "seo_title",
            seo_keywords: "seo_keywords",
            seo_description: "seo_description",
            slug: "slug",
            thumbnail: "thumbnail",
            category_ids: ["1"],
            tag_names: ["tag"],
            pay_roles: ["role"],
            post_push_time: { Time: fixedDate, Valid: true },
            post_expired_time: { Time: newFixedDate, Valid: false },
        }

        const updatedFields = getUpdatedFields(oldForm, newForm, "id")

        expect(updatedFields).toEqual({
            post_content: "content2",
            post_expired_time: { Time: newFixedDate, Valid: false },
        })
    })
})
