// @vitest-environment node
/*
 * FilePath    : blog-client\server\middleware\normalize-path.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 路径重定向的真实 h3 解码与 Node 响应头校验, 编码边界并行验证及 SWR 缓存 key 回归 (bugfix 261007-02)
 */

import { IncomingMessage, ServerResponse } from "node:http"
import { Socket } from "node:net"

import { createApp, createEvent, defineEventHandler, getRequestURL } from "h3"
import { describe, expect, it, vi } from "vitest"

const fetchPostId = vi.hoisted(() => vi.fn())

// 仅隔离后端网络, h3 路径解析与 Node 响应头校验始终使用真实实现.
vi.mock("ofetch", () => ({ $fetch: fetchPostId }))

import legacyRedirect from "./legacy-redirect"
import normalizePath from "./normalize-path"

/**
 * 执行生产顺序的中间件链, 保留真实 h3 路径解码和 Node 响应头字符校验.
 * @param url - 原始编码的请求 URL.
 * @returns 响应对象与处理后的请求, 用于校验重定向和缓存 key.
 * @throws 中间件或 Node 响应头写入异常时向测试传播, 不 mock 或过滤错误.
 */
async function runRequest(url: string) {
    const socket = new Socket()
    const req = new IncomingMessage(socket)
    req.url = url
    req.method = "GET"
    req.headers.host = "test.local"
    const res = new ServerResponse(req)
    const event = createEvent(req, res)
    const app = createApp()
    const loggedUrl = getRequestURL(event).href
    app.use(legacyRedirect)
    app.use(normalizePath)
    app.use(defineEventHandler(() => "ok"))
    try {
        await app.handler(event)
        return { res, req: event.node.req, path: event.path, loggedUrl }
    } finally {
        res.destroy()
        socket.destroy()
    }
}

describe("normalize-path 重定向编码 (bugfix 261007-02)", () => {
    it.each(["//\\outside.example/a", "//\\/outside.example/a", "/\\outside.example/a", "\\\\outside.example/a"])(
        "%s 的混合前导分隔符只能重定向到同源路径",
        async (url) => {
            const { res } = await runRequest(url)
            expect(res.statusCode).toBe(301)
            expect(res.getHeader("location")).toBe("/outside.example/a")
            expect(new URL(String(res.getHeader("location")), "http://test.local").origin).toBe("http://test.local")
        },
    )

    it("日志会折叠前导斜杠, 但重定向仍基于原始 URL", async () => {
        const { res, loggedUrl } = await runRequest("//bin///wcm///search///gql.json;%0aa.html")
        expect(loggedUrl).toBe("http://test.local/bin///wcm///search///gql.json;%0aa.html")
        expect(res.getHeader("location")).toBe("/bin///wcm///search///gql.json;%0aa.html")
    })

    it("所有单字节编码保留原样, 包括控制字符与不完整 UTF-8", async () => {
        // 每次请求独立创建 h3 事件和 Node 响应, 可并行校验全部字节而不共享状态.
        await Promise.all(
            Array.from({ length: 256 }, async (_, code) => {
                const encoded = `%${code.toString(16).padStart(2, "0")}`
                const { res } = await runRequest(`//probe/${encoded}tail?value=${encoded}`)
                expect(res.statusCode, encoded).toBe(301)
                expect(res.getHeader("location"), encoded).toBe(`/probe/${encoded}tail?value=${encoded}`)
            }),
        )
    })

    it.each([
        ["//p/123", "/p/123"],
        ["///tag/%E4%B8%AD%E6%96%87", "/tag/%E4%B8%AD%E6%96%87"],
        ["//tag/%F0%9F%98%80", "/tag/%F0%9F%98%80"],
        ["//tag/%2520", "/tag/%2520"],
        ["//tag/a%23b%3Fc%2Fd", "/tag/a%23b%3Fc%2Fd"],
        ["//tag/%ZZ", "/tag/%ZZ"],
        ["//p/123?next=https://example.com//a&x=%0a&page=2", "/p/123?next=https://example.com//a&x=%0a&page=2"],
        [
            "//bin///wcm///search///gql.json;%0aa.html?query=type:base%20limit:..1&pathPrefix",
            "/bin///wcm///search///gql.json;%0aa.html?query=type:base%20limit:..1&pathPrefix",
        ],
    ])("%s 保留原始编码且只规范化开头斜杠", async (url, location) => {
        const { res } = await runRequest(url)
        expect(res.statusCode).toBe(301)
        expect(res.getHeader("location")).toBe(location)
    })

    it.each(["%00", "%09", "%0a", "%0D", "%0d%0a", "%7f"])("路径中的 %s 不会变成响应头控制字符", async (encoded) => {
        const { res } = await runRequest(`//probe/${encoded}tail`)
        expect(res.statusCode).toBe(301)
        expect(res.getHeader("location")).toBe(`/probe/${encoded}tail`)
    })

    it("日志中的原始扫描路径不触发本站前导双斜杠重定向", async () => {
        const { res, path } = await runRequest("/bin///wcm///search///gql.json;%0aa.html?query=type:base%20limit:..1&pathPrefix")
        expect(path).toContain("\n")
        expect(res.statusCode).toBe(200)
        expect(res.getHeader("location")).toBeUndefined()
    })

    it.each([
        ["//?post_id=123&utm_source=x", "/p/123?utm_source=x"],
        ["//?post_tag_slug=%E4%B8%AD%E6%96%87", "/tag/%E4%B8%AD%E6%96%87"],
        ["//?author=1", "/"],
    ])("%s 保留旧链接中间件优先级", async (url, location) => {
        const { res } = await runRequest(url)
        expect(res.statusCode).toBe(301)
        expect(res.getHeader("location")).toBe(location)
    })
})

describe("legacy-redirect 编码边界", () => {
    it.each(["123", "中文", "a\r\nX-Injected: yes", "%0a", "a/b?c#d"])("别名查询返回的 %s 作为单个路径段编码", async (postId) => {
        fetchPostId.mockResolvedValueOnce({ code: 2045, data: postId })
        const { res } = await runRequest("/ps/%E4%B8%AD%E6%96%87?keep=%0a")
        expect(res.statusCode).toBe(301)
        expect(res.getHeader("location")).toBe(`/p/${encodeURIComponent(postId)}?keep=%0A`)
        expect(res.getHeader("x-injected")).toBeUndefined()
        expect(fetchPostId).toHaveBeenLastCalledWith(expect.stringContaining("/api/v1/post/post-id"), {
            method: "POST",
            body: { slug: "%E4%B8%AD%E6%96%87" },
        })
    })

    it("别名查询失败沿用受控 404", async () => {
        fetchPostId.mockRejectedValueOnce(new Error("network failure"))
        await expect(runRequest("/ps/missing")).rejects.toMatchObject({ statusCode: 404 })
    })

    it.each(["%31", "%E4%B8%AD%E6%96%87", "%0a", "%2F", "%252F", "%ZZ"])("/post/%s 不会再次编码路径段", async (segment) => {
        const { res } = await runRequest(`/post/${segment}?page=2`)
        expect(res.statusCode).toBe(301)
        expect(res.getHeader("location")).toBe(`/p/${segment}?page=2`)
    })

    it.each([
        ["post_id", "/p/"],
        ["post_category_slug", "/category/"],
        ["post_tag_slug", "/tag/"],
        ["year", "/year/"],
        ["key_word", "/s/"],
        ["s", "/s/"],
    ])("%s 分支对 ASCII 字节和 Unicode 均保持安全编码", async (key, prefix) => {
        const values = [...Array.from({ length: 128 }, (_, code) => `a${String.fromCharCode(code)}z`), "中文", "😀", "%0a", "%ZZ", "//outside.example"]
        await Promise.all(
            values.map(async (value) => {
                const encoded = encodeURIComponent(value)
                const { res } = await runRequest(`/?${key}=${encoded}&size=20`)
                const location = String(res.getHeader("location"))
                expect(res.statusCode, value).toBe(301)
                expect(location, value).toBe(`${prefix}${encoded}?size=20`)
                expect(new URL(location, "http://test.local").origin).toBe("http://test.local")
            }),
        )
    })

    it("年月与分页翻译分支编码控制字符和保留字符", async () => {
        const archive = await runRequest("/?year=20%0a26&month=a%2Fb%3Fc%23d")
        expect(archive.res.getHeader("location")).toBe("/year/20%0A26/month/a%2Fb%3Fc%23d")
        const pagination = await runRequest("/?current_page=%0a&page_size=%23%26%3D")
        expect(pagination.res.getHeader("location")).toBe("/?page=%0A&size=%23%26%3D")
    })
})

describe("normalize-path SWR 缓存 key 回归", () => {
    it.each([
        ["/?size=10&page=2", "/?page=2&size=10"],
        ["/tag/%E4%B8%AD%E6%96%87?utm_source=x&size=10&page=2", "/tag/%E4%B8%AD%E6%96%87?page=2&size=10"],
        ["/p/123/_payload.json?x=1&page=&page=2&page=3", "/p/123/_payload.json?page=2"],
        ["/year/2026?x=1", "/year/2026"],
        ["/category/a?size=%32%30&x=1", "/category/a?size=%32%30"],
        ["/login?redirect=%2Fadmin", "/login?redirect=%2Fadmin"],
    ])("%s 的缓存 key 为 %s, 渲染请求保持不变", async (url, originalUrl) => {
        const { res, req } = await runRequest(url)
        expect(res.statusCode).toBe(200)
        expect(res.getHeader("location")).toBeUndefined()
        expect(req.originalUrl).toBe(originalUrl)
        expect(req.url).toBe(url)
    })
})
