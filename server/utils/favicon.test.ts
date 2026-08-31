/*
 * FilePath    : blog-client-nuxt\server\utils\favicon.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : favicon 镜像同步纯函数单测 (bug05 260831-01)
 */

import { describe, expect, it } from "vitest"

import { normalizeFaviconUrl } from "./favicon"

const API_BASE = "http://10.10.2.222:5426"

describe("normalizeFaviconUrl", () => {
    it("1、相对路径拼接 apiBase(后端上传资源常见形态)", () => {
        expect(normalizeFaviconUrl("/api/v1/uploads/2026/06/12/i-1.ico", API_BASE)).toBe(`${API_BASE}/api/v1/uploads/2026/06/12/i-1.ico`)
    })

    it("2、apiBase 尾部斜杠被规范化, 不产生双斜杠", () => {
        expect(normalizeFaviconUrl("/api/v1/uploads/a.ico", "http://10.10.2.222:5426/")).toBe(`${API_BASE}/api/v1/uploads/a.ico`)
    })

    it("3、公网 http/https 绝对地址原样放行", () => {
        expect(normalizeFaviconUrl("https://cdn.example.com/favicon.ico", API_BASE)).toBe("https://cdn.example.com/favicon.ico")
        expect(normalizeFaviconUrl("http://example.com/favicon.ico", API_BASE)).toBe("http://example.com/favicon.ico")
    })

    it("4、非 http/https 协议被拒绝(SSRF 防护: file/javascript 等)", () => {
        expect(normalizeFaviconUrl("file:///etc/passwd", API_BASE)).toBeNull()
        expect(normalizeFaviconUrl("javascript:alert(1)", API_BASE)).toBeNull()
        expect(normalizeFaviconUrl("ftp://example.com/favicon.ico", API_BASE)).toBeNull()
    })

    it("5、环回地址被拒绝(SSRF 防护: 本机服务)", () => {
        expect(normalizeFaviconUrl("http://127.0.0.1:8080/favicon.ico", API_BASE)).toBeNull()
        expect(normalizeFaviconUrl("http://localhost/favicon.ico", API_BASE)).toBeNull()
        expect(normalizeFaviconUrl("http://0.0.0.0/favicon.ico", API_BASE)).toBeNull()
        expect(normalizeFaviconUrl("http://[::1]/favicon.ico", API_BASE)).toBeNull()
    })

    it("6、链路本地段被拒绝(SSRF 防护: 含云元数据 169.254.169.254)", () => {
        expect(normalizeFaviconUrl("http://169.254.169.254/latest/meta-data/", API_BASE)).toBeNull()
        expect(normalizeFaviconUrl("http://169.254.1.1/favicon.ico", API_BASE)).toBeNull()
    })

    it("7、与 apiBase 同源的私网绝对地址放行(后端自身, 私有部署合法形态)", () => {
        expect(normalizeFaviconUrl("http://10.10.2.222:5426/api/v1/uploads/a.ico", API_BASE)).toBe("http://10.10.2.222:5426/api/v1/uploads/a.ico")
    })

    it("8、非 apiBase 同源的私网/保留地址被拒绝(SSRF 防护: 260831-01 收紧)", () => {
        expect(normalizeFaviconUrl("http://192.168.1.10:9000/favicon.ico", API_BASE)).toBeNull()
        expect(normalizeFaviconUrl("http://172.16.0.1/favicon.ico", API_BASE)).toBeNull()
        expect(normalizeFaviconUrl("http://172.31.255.1/favicon.ico", API_BASE)).toBeNull()
        expect(normalizeFaviconUrl("http://10.99.99.99/favicon.ico", API_BASE)).toBeNull()
    })

    it("9、空值与无法解析的 URL 返回 null", () => {
        expect(normalizeFaviconUrl("", API_BASE)).toBeNull()
        expect(normalizeFaviconUrl("   ", API_BASE)).toBeNull()
        expect(normalizeFaviconUrl("http://", API_BASE)).toBeNull()
    })
})
