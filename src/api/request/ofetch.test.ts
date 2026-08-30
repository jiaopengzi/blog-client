/*
 * FilePath    : blog-client-nuxt\src\api\request\ofetch.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 请求层测试: XHR 上传进度路径 (onUploadProgress)
 */

/*
 * 补充说明:
 * fetch/ofetch 无上传进度事件, 调用方传入 onUploadProgress 时请求层改走 XHR
 * 本测试用假 XHR 验证进度上报、响应/错误塑形、请求头行为
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { request } from "./ofetch"

// 模块级可变的 user store 状态 (vi.mock 工厂内可访问)
const userStoreState = vi.hoisted(() => ({ accessToken: "" }))

vi.mock("@/stores/user", () => ({
    useUserStore: () => userStoreState,
}))

// 假 XHR: 记录调用参数并允许测试手动触发 upload/load/error/timeout 事件
class FakeXhr {
    static instances: FakeXhr[] = []

    method = ""
    url = ""
    timeout = 0
    requestHeaders: Record<string, string> = {}
    sentBody: unknown = null
    status = 0
    statusText = ""
    responseText = ""
    responseHeaders = ""

    private listeners: Record<string, Array<(ev?: unknown) => void>> = {}

    upload = {
        listeners: {} as Record<string, Array<(ev?: unknown) => void>>,
        addEventListener: (type: string, fn: (ev?: unknown) => void) => {
            ;(this.upload.listeners[type] ??= []).push(fn)
        },
    }

    constructor() {
        FakeXhr.instances.push(this)
    }

    open(method: string, url: string): void {
        this.method = method
        this.url = url
    }

    setRequestHeader(key: string, value: string): void {
        this.requestHeaders[key] = value
    }

    send(body: unknown): void {
        this.sentBody = body
    }

    addEventListener(type: string, fn: (ev?: unknown) => void): void {
        ;(this.listeners[type] ??= []).push(fn)
    }

    getAllResponseHeaders(): string {
        return this.responseHeaders
    }

    // ---- 测试辅助方法 ----
    emitUploadProgress(loaded: number, total: number, lengthComputable: boolean = true): void {
        for (const fn of this.upload.listeners["progress"] ?? []) {
            fn({ loaded, total, lengthComputable })
        }
    }

    emitLoad(status: number, responseText: string): void {
        this.status = status
        this.statusText = status >= 200 && status < 300 ? "OK" : "Error"
        this.responseText = responseText
        for (const fn of this.listeners["load"] ?? []) {
            fn()
        }
    }

    emitError(): void {
        for (const fn of this.listeners["error"] ?? []) {
            fn()
        }
    }

    emitTimeout(): void {
        for (const fn of this.listeners["timeout"] ?? []) {
            fn()
        }
    }
}

describe("request XHR 上传进度路径", () => {
    beforeEach(() => {
        FakeXhr.instances = []
        userStoreState.accessToken = ""
        vi.stubGlobal("XMLHttpRequest", FakeXhr)
    })

    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it("传入 onUploadProgress 时走 XHR, 上报进度并返回 axios 风格响应", async () => {
        const onUploadProgress = vi.fn()
        const data = new FormData()
        data.append("file", new Blob(["abc"]), "a.txt")

        const promise = request<{ code: number; data: string }>({
            url: "/api/v1/upload/file",
            method: "post",
            data,
            onUploadProgress,
        })

        const xhr = FakeXhr.instances[0]
        expect(xhr.method).toBe("POST")
        expect(xhr.url).toBe("/api/v1/upload/file")
        expect(xhr.sentBody).toBe(data)

        xhr.emitUploadProgress(50, 100)
        expect(onUploadProgress).toHaveBeenCalledWith({
            loaded: 50,
            total: 100,
            lengthComputable: true,
            progress: 0.5,
        })

        xhr.emitLoad(200, JSON.stringify({ code: 0, data: "ok" }))
        const res = await promise
        expect(res.status).toBe(200)
        expect(res.data).toEqual({ code: 0, data: "ok" })
    })

    it("total 未知时 progress 为 undefined", async () => {
        const onUploadProgress = vi.fn()
        const promise = request({
            url: "/api/v1/upload/file",
            method: "post",
            data: new FormData(),
            onUploadProgress,
        })

        const xhr = FakeXhr.instances[0]
        xhr.emitUploadProgress(30, 0, false)
        expect(onUploadProgress).toHaveBeenCalledWith({
            loaded: 30,
            total: 0,
            lengthComputable: false,
            progress: undefined,
        })

        xhr.emitLoad(200, "{}")
        await promise
    })

    it("FormData 请求不显式设置 Content-Type（交由浏览器生成 multipart boundary）", async () => {
        const promise = request({
            url: "/api/v1/upload/file",
            method: "post",
            data: new FormData(),
            headers: { "Content-Type": "multipart/form-data" },
            onUploadProgress: () => {},
        })

        const xhr = FakeXhr.instances[0]
        expect(Object.keys(xhr.requestHeaders).map((k) => k.toLowerCase())).not.toContain("content-type")

        xhr.emitLoad(200, "{}")
        await promise
    })

    it("HTTP 错误塑形为 axios 风格错误（含 response）", async () => {
        const promise = request({
            url: "/api/v1/upload/file",
            method: "post",
            data: new FormData(),
            onUploadProgress: () => {},
        })

        const xhr = FakeXhr.instances[0]
        xhr.emitLoad(500, JSON.stringify({ code: 500, msg: "server error" }))

        await expect(promise).rejects.toMatchObject({
            response: {
                status: 500,
                data: { code: 500, msg: "server error" },
            },
        })
    })

    it("网络错误无 response 字段", async () => {
        const promise = request({
            url: "/api/v1/upload/file",
            method: "post",
            data: new FormData(),
            onUploadProgress: () => {},
        })

        const xhr = FakeXhr.instances[0]
        xhr.emitError()

        await expect(promise).rejects.toMatchObject({ response: undefined })
    })

    it("已登录时附加 Authorization 请求头", async () => {
        userStoreState.accessToken = "test-token"
        const promise = request({
            url: "/api/v1/upload/file",
            method: "post",
            data: new FormData(),
            onUploadProgress: () => {},
        })

        const xhr = FakeXhr.instances[0]
        expect(xhr.requestHeaders.Authorization).toBe("Bearer test-token")

        xhr.emitLoad(200, "{}")
        await promise
    })
})
