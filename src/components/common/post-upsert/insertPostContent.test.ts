/**
 * FilePath    : blog-client\src\components\common\post-upsert\insertPostContent.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 插入文章或页面链接工具函数测试
 */

import { describe, expect, it } from "vitest"

import { PostType, type PostResPaginationByAdmin } from "@/api/post/common"

import { createPostLinkInsertText } from "./insertPostContent"

/**
 * createPostRow 生成插入链接测试所需的后台文章或页面行.
 * @param row - 文章或页面行局部字段.
 * @returns 可传给链接生成函数的列表行.
 */
function createPostRow(row: Partial<PostResPaginationByAdmin>): PostResPaginationByAdmin {
    return row as PostResPaginationByAdmin
}

describe("createPostLinkInsertText", () => {
    it("应生成文章标题加 post_id 前台链接", () => {
        const row = createPostRow({ id: "7691892531658753", post_title: "我写了一套博客系统", post_type: PostType.Post })

        expect(createPostLinkInsertText([row], { origin: "https://jiaopengzi.com" })).toBe(
            "[我写了一套博客系统](https://jiaopengzi.com/?post_id=7691892531658753)\n",
        )
    })

    it("应生成页面标题加 slug 前台链接", () => {
        const row = createPostRow({ id: "42", post_title: "关于我", post_type: PostType.Page, slug: "about" })

        expect(createPostLinkInsertText([row], { origin: "https://jiaopengzi.com" })).toBe("[关于我](https://jiaopengzi.com/page/about)\n")
    })

    it("应按当前站点 origin 生成 page 加 slug 的页面链接", () => {
        const row = createPostRow({ id: "42", post_title: "VIP", post_type: PostType.Page, slug: "vip" })

        expect(createPostLinkInsertText([row], { origin: "http://10.10.2.222:7364" })).toBe("[VIP](http://10.10.2.222:7364/page/vip)\n")
    })

    it("多条链接之间应保留一个空行", () => {
        const rows = [
            createPostRow({ id: "1", post_title: "第一篇", post_type: PostType.Post }),
            createPostRow({ id: "2", post_title: "第二篇", post_type: PostType.Post }),
        ]

        expect(createPostLinkInsertText(rows, { origin: "https://jiaopengzi.com" })).toBe(
            "[第一篇](https://jiaopengzi.com/?post_id=1)\n\n[第二篇](https://jiaopengzi.com/?post_id=2)\n",
        )
    })

    it("应转义 Markdown 链接标题中的方括号", () => {
        const row = createPostRow({ id: "1", post_title: "标题 [草稿]", post_type: PostType.Post })

        expect(createPostLinkInsertText([row], { origin: "https://jiaopengzi.com" })).toBe("[标题 \\[草稿\\]](https://jiaopengzi.com/?post_id=1)\n")
    })

    it("缺少 ID 时应返回空字符串", () => {
        expect(createPostLinkInsertText([createPostRow({ post_title: "无 ID", post_type: PostType.Post })], { origin: "https://jiaopengzi.com" })).toBe("")
    })
})
