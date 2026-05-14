/**
 * FilePath    : blog-client\src\components\common\post-upsert\utils.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : post-upsert 工具函数测试
 */

import { describe, expect, it } from "vitest"

import { PostType } from "@/api/post/common"
import { ResponseCode } from "@/api/response"
import { RouteNames } from "@/router"

import { getPostEditNoPermissionResourceLabel, resolvePostEditLoadError } from "./utils"

describe("post-upsert utils", () => {
    it("8306 应切换到无权限视图", () => {
        const result = resolvePostEditLoadError(ResponseCode.NoPermission, "无权限", PostType.Post)

        expect(result).toEqual({
            showNoPermission: true,
        })
    })

    it("9003 编辑文章时应提示并回到文章列表", () => {
        const result = resolvePostEditLoadError(ResponseCode.ValidatorRequestError, "校验请求参数失败", PostType.Post)

        expect(result).toEqual({
            showNoPermission: false,
            redirectRouteName: RouteNames.PostAll,
            message: "校验请求参数失败",
        })
    })

    it("9003 编辑页面时应提示并回到页面列表", () => {
        const result = resolvePostEditLoadError(ResponseCode.ValidatorRequestError, "校验请求参数失败", PostType.Page)

        expect(result).toEqual({
            showNoPermission: false,
            redirectRouteName: RouteNames.PageAll,
            message: "校验请求参数失败",
        })
    })

    it("其他错误码不应覆盖原有错误处理", () => {
        const result = resolvePostEditLoadError(ResponseCode.ERROR, "服务异常", PostType.Post)

        expect(result).toEqual({
            showNoPermission: false,
        })
    })

    it("无权限页应展示具体文章 ID", () => {
        expect(getPostEditNoPermissionResourceLabel(PostType.Post, "81355993295946462")).toBe("文章 ID 81355993295946462")
    })

    it("无权限页在缺少 ID 时应回退到对象类型", () => {
        expect(getPostEditNoPermissionResourceLabel(PostType.Page, "")).toBe("该页面")
    })
})
