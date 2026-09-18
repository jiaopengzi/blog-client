/**
 * FilePath    : blog-client\src\api\post\common.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : getPostDisplayTime / isValidPostId 的单元测试
 */

import { describe, expect, it } from "vitest"

import { getPostDisplayTime, isValidPostId, type PostResCommon, PostStatusCode } from "./common"

const basePost = (): PostResCommon => ({
    id: "1",
    created_at: "2026-05-01 08:00:00",
    comment_count: "0",
    view_count: "0",
    like_count: "0",
    star_count: "0",
    post_status: PostStatusCode.Publish,
    post_title: "测试文章",
    slug: "test-post",
    thumbnail: "",
    is_pinned: 0,
    is_recommended: 0,
})

describe("getPostDisplayTime", () => {
    it("优先返回有效发布时间", () => {
        const post = basePost()
        post.post_push_time = {
            Time: new Date("2026-05-29 09:30:00"),
            Valid: true,
        }

        expect(getPostDisplayTime(post)).toBe(String(post.post_push_time.Time))
    })

    it("无有效发布时间时回退创建时间", () => {
        const post = basePost()
        post.post_push_time = { Time: null, Valid: false }

        expect(getPostDisplayTime(post)).toBe(post.created_at)
    })
})

describe("isValidPostId", () => {
    it("正整数字符串通过校验", () => {
        expect(isValidPostId("1")).toBe(true)
        expect(isValidPostId("123")).toBe(true)
    })

    it("零值与空串视为未就绪", () => {
        expect(isValidPostId("0")).toBe(false)
        expect(isValidPostId("")).toBe(false)
    })

    it("可空输入 (null/undefined) 不通过校验", () => {
        expect(isValidPostId(null)).toBe(false)
        expect(isValidPostId(undefined)).toBe(false)
    })

    it("字符串化的可空值与非法形态不通过校验", () => {
        // bugfix 260918-02: JS null 经模板拼接/URL 序列化会得到字面量 "null", 必须拦截
        expect(isValidPostId("null")).toBe(false)
        expect(isValidPostId("undefined")).toBe(false)
        expect(isValidPostId("abc")).toBe(false)
        expect(isValidPostId("12a")).toBe(false)
        expect(isValidPostId("-1")).toBe(false)
        expect(isValidPostId("1.5")).toBe(false)
        expect(isValidPostId(" 1")).toBe(false)
    })
})
