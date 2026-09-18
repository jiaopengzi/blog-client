/**
 * FilePath    : blog-client\src\components\hooks\useHome\api.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : useGetData.getPaginate 的请求参数拦截与 slug 归一测试 (bugfix 260918-03)
 */

import { createPinia, setActivePinia } from "pinia"
import { beforeEach, describe, expect, it, vi } from "vitest"

import { viewPostAPI } from "@/api/post/view"
import { getEmptyPagination, ResponseCode } from "@/api/response"

import { useGetData } from "./api"

// mock 文章列表接口: 只关心 viewPostAPI 实际收到的请求参数, 返回成功码与空分页
vi.mock("@/api/post/view", () => ({
    viewPostAPI: vi.fn(async () => ({
        data: { code: ResponseCode.PostViewSuccess, data: getEmptyPagination() },
    })),
}))

beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
})

// 取 viewPostAPI 最近一次调用收到的请求体
const lastRequestBody = (): Record<string, unknown> => {
    const calls = vi.mocked(viewPostAPI).mock.calls
    expect(calls.length).toBeGreaterThan(0)
    return calls[calls.length - 1]![0] as unknown as Record<string, unknown>
}

describe("getPaginate 非法 id 拦截 (bugfix 260918-03)", () => {
    it("post_tag_id 为字符串 '0' 时被拦截不发送", async () => {
        const { getPaginate } = useGetData()
        await getPaginate({ post_tag_id: "0" })

        expect(lastRequestBody()).not.toHaveProperty("post_tag_id")
    })

    it("post_category_id 为字符串 '0' 时被拦截不发送", async () => {
        const { getPaginate } = useGetData()
        await getPaginate({ post_category_id: "0" })

        expect(lastRequestBody()).not.toHaveProperty("post_category_id")
    })

    it("post_tag_id 为 null 形态字符串时被拦截不发送", async () => {
        const { getPaginate } = useGetData()
        await getPaginate({ post_tag_id: "null" })

        expect(lastRequestBody()).not.toHaveProperty("post_tag_id")
    })

    it("合法的正整数 id 保留发送", async () => {
        const { getPaginate } = useGetData()
        await getPaginate({ post_tag_id: "12", post_category_id: "34" })

        const body = lastRequestBody()
        expect(body.post_tag_id).toBe("12")
        expect(body.post_category_id).toBe("34")
    })
})

describe("getPaginate slug 归一 (bugfix 260918-03)", () => {
    it("明文 slug 编码一次后发送", async () => {
        const { getPaginate } = useGetData()
        await getPaginate({ post_tag_slug: "Tabular+Editor" })

        expect(lastRequestBody().post_tag_slug).toBe("Tabular%2BEditor")
    })

    it("多层编码 slug (爬虫循环形态) 归一到单层后发送", async () => {
        const { getPaginate } = useGetData()
        // 对 Tabular+Editor 反复编码 380 层, 复现生产日志形态
        let layered = "Tabular+Editor"
        for (let i = 0; i < 380; i++) {
            layered = encodeURIComponent(layered)
        }
        await getPaginate({ post_tag_slug: layered })

        expect(lastRequestBody().post_tag_slug).toBe("Tabular%2BEditor")
    })

    it("单层编码 slug 保持单层不二次编码", async () => {
        const { getPaginate } = useGetData()
        await getPaginate({ post_category_slug: "%E5%88%86%E8%AF%8D" })

        expect(lastRequestBody().post_category_slug).toBe("%E5%88%86%E8%AF%8D")
    })

    it("中文多层编码 slug 归一到单层后发送", async () => {
        const { getPaginate } = useGetData()
        await getPaginate({ post_tag_slug: "%2525E5%252588%252586%2525E8%2525AF%25258D" })

        expect(lastRequestBody().post_tag_slug).toBe("%E5%88%86%E8%AF%8D")
    })
})
