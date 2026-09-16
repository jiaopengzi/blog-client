/**
 * FilePath    : blog-client\src\stores\permissionRole.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 权限角色模块测试
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { createPinia, setActivePinia } from "pinia"

import { ResponseCode } from "@/api/response"

import { LocalStorageKey } from "./local"
import { PostDetailEditCacheScope, usePermissionRoleStore } from "./permissionRole"

const { hasPermissionAPIMock } = vi.hoisted(() => ({
    hasPermissionAPIMock: vi.fn(),
}))

vi.mock("@/api/permissionRole/hasPermission", () => ({
    hasPermissionAPI: hasPermissionAPIMock,
}))

describe("usePermissionRoleStore.postDetailEditEnable", () => {
    beforeEach(() => {
        setActivePinia(createPinia())
        localStorage.clear()
        hasPermissionAPIMock.mockReset()
    })

    afterEach(() => {
        localStorage.clear()
        hasPermissionAPIMock.mockReset()
    })

    it("会忽略匿名作用域的旧布尔缓存, 并为已认证作用域重新请求权限", async () => {
        localStorage.setItem(LocalStorageKey.PostDetailEditEnable, JSON.stringify(false))
        hasPermissionAPIMock.mockResolvedValue({
            data: {
                code: ResponseCode.HasPermission,
            },
        })

        const store = usePermissionRoleStore()
        const enabled = await store.postDetailEditEnable(PostDetailEditCacheScope.Authenticated)

        expect(enabled).toBe(true)
        expect(hasPermissionAPIMock).toHaveBeenCalledTimes(1)
        expect(JSON.parse(localStorage.getItem(LocalStorageKey.PostDetailEditEnable) || "null")).toEqual({
            scope: PostDetailEditCacheScope.Authenticated,
            enabled: true,
        })
    })

    it("命中相同作用域缓存时不会重复请求权限接口", async () => {
        localStorage.setItem(
            LocalStorageKey.PostDetailEditEnable,
            JSON.stringify({
                scope: PostDetailEditCacheScope.Authenticated,
                enabled: true,
            }),
        )

        const store = usePermissionRoleStore()
        const enabled = await store.postDetailEditEnable(PostDetailEditCacheScope.Authenticated)

        expect(enabled).toBe(true)
        expect(hasPermissionAPIMock).not.toHaveBeenCalled()
    })
})
