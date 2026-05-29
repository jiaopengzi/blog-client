import { describe, expect, it } from "vitest"

import { getPostDisplayTime, type PostResCommon, PostStatusCode } from "./common"

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
