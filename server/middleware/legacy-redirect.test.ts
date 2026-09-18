/**
 * FilePath    : blog-client\server\middleware\legacy-redirect.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 老链接 301 重定向中间件单测 (bugfix 260918-05: /?s= 搜索形态与首页未知 query 清洗)
 */

import { describe, expect, it, vi } from "vitest"

import handler from "./legacy-redirect"

// h3 事件最小替身: getRequestURL 仅读 node.req.originalUrl 与 host 头,
// sendRedirect 仅写 node.res.statusCode/location 并经 send 调 res.end
const createEvent = (url: string) => {
    const res = {
        statusCode: 200,
        setHeader: vi.fn(),
        hasHeader: vi.fn(() => false),
        getHeader: vi.fn(() => undefined),
        getHeaders: vi.fn(() => ({})),
        end: vi.fn(),
    }
    return {
        node: {
            req: { originalUrl: url, headers: { host: "test.local" } },
            res,
        },
        path: url,
        handled: false,
    } as unknown as Parameters<typeof handler>[0]
}

// 执行中间件并断言 301 重定向目标; 无重定向时返回 undefined
const runRedirect = async (url: string): Promise<string | undefined> => {
    const event = createEvent(url)
    await handler(event)
    const res = event.node.res as unknown as { statusCode: number; setHeader: ReturnType<typeof vi.fn> }
    if (res.statusCode !== 301) {
        return undefined
    }
    const location = res.setHeader.mock.calls.find((call) => call[0] === "location")?.[1]
    return location as string | undefined
}

describe("legacy-redirect /?s= 与首页 query 清洗 (bugfix 260918-05)", () => {
    it("1、/?s=中文关键字 → 301 /s/:keyword, 加号解码为空格后以 %20 重新编码", async () => {
        expect(await runRedirect("/?s=%E6%B0%B4%E9%8A%80+%E8%8B%B1%E8%AA%9E")).toBe("/s/%E6%B0%B4%E9%8A%80%20%E8%8B%B1%E8%AA%9E")
    })

    it("2、/?s= 与其余合法参数共存时, 重定向保留 page/size 分页参数", async () => {
        expect(await runRedirect("/?s=test&page=2")).toBe("/s/test?page=2")
    })

    it("3、/?s= 空值不触发搜索重定向, 由未知 query 清洗规则剥离为干净的 /", async () => {
        expect(await runRedirect("/?s=")).toBe("/")
    })

    it("4、首页未知参数(utm/fbclid 等)被 301 剥离, 不进入 SSR 渲染污染 swr 缓存", async () => {
        expect(await runRedirect("/?utm_source=x&utm_medium=y")).toBe("/")
    })

    it("5、未知参数与白名单分页参数共存时, 仅保留 page/size", async () => {
        expect(await runRedirect("/?page=2&utm_source=x")).toBe("/?page=2")
        expect(await runRedirect("/?page=2&size=10&foo=bar")).toBe("/?page=2&size=10")
    })

    it("6、纯白名单分页参数 /?page=&size= 不重定向, 正常 SSR 渲染", async () => {
        expect(await runRedirect("/?page=2&size=10")).toBeUndefined()
    })

    it("7、无 query 的首页不重定向", async () => {
        expect(await runRedirect("/")).toBeUndefined()
    })
})

describe("legacy-redirect 既有规则回归", () => {
    it("8、/?key_word=:kw → /s/:kw 保持不变", async () => {
        expect(await runRedirect("/?key_word=kw")).toBe("/s/kw")
    })

    it("9、/?post_id=:id → /p/:id 保持不变", async () => {
        expect(await runRedirect("/?post_id=5")).toBe("/p/5")
    })

    it("10、/?current_page=:p → 简写翻译为 /?page=:p", async () => {
        expect(await runRedirect("/?current_page=3")).toBe("/?page=3")
    })
})
