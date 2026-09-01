/*
 * FilePath    : blog-client-nuxt\src\composables\useSeo.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : resolveSeoImage 回退链单元测试(feature01)
 */

/*
 * 补充说明:
 * 文章缩略图 → 站点配置 logo → 默认 logo(demo-logo.svg),
 * og:image 需要绝对地址
 */

import { describe, expect, it } from "vitest"

import { resolveSeoImage } from "./useSeo"

describe("resolveSeoImage 回退链(feature01)", () => {
    const baseUrl = "https://jiaopengzi.com"

    it("默认使用文章缩略图", () => {
        const thumbnail = "https://cdn.example.com/cover.png"
        expect(resolveSeoImage(thumbnail, "https://cdn.example.com/logo.png", baseUrl)).toBe(thumbnail)
    })

    it("缩略图缺失且 logo 已配置时使用配置 URL(SPA 对齐, bug01 260901-01 反馈第3轮)", () => {
        expect(resolveSeoImage("", "https://cdn.example.com/logo.png", baseUrl)).toBe("https://cdn.example.com/logo.png")
        expect(resolveSeoImage(undefined, "https://cdn.example.com/logo.png", baseUrl)).toBe("https://cdn.example.com/logo.png")
    })

    it("缩略图与 logo 均缺失时回退默认 logo", () => {
        expect(resolveSeoImage("", "", baseUrl)).toBe("https://jiaopengzi.com/demo-logo.svg")
        expect(resolveSeoImage(undefined, undefined, baseUrl)).toBe("https://jiaopengzi.com/demo-logo.svg")
    })

    it("相对路径以站点 baseUrl 兜底解析为绝对地址", () => {
        expect(resolveSeoImage("/api/v1/uploads/a.png", undefined, baseUrl)).toBe("https://jiaopengzi.com/api/v1/uploads/a.png")
    })

    it("解析失败时原样返回候选值, 不抛异常", () => {
        expect(resolveSeoImage("not a url", undefined, "bad base")).toBe("not a url")
    })
})
