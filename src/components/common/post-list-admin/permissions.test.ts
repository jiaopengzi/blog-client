/**
 * FilePath    : blog-client\src\components\common\post-list-admin\permissions.test.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 后台文章列表角色权限工具测试
 */

import { describe, expect, it } from "vitest"

import { PostType } from "@/api/post/common"
import { emptyUserInfo } from "@/api/user/getUserInfo"

import { canUseAdvancedPostAdminTools, getPostAdminRoleName, shouldShowAdvancedPostAdminTools, shouldShowPostAdminMutationTools } from "./permissions"

/**
 * buildUserInfoWithRole 构造带指定角色的用户信息。
 * @param roleName - 目标角色名。
 * @returns 带 role_name 元数据的用户信息。
 */
function buildUserInfoWithRole(roleName: string) {
    const userInfo = emptyUserInfo()
    userInfo.user_meta = [{ user_id: "1", meta_key: "role_name", meta_value: roleName }]
    return userInfo
}

describe("post-list-admin permissions", () => {
    it("应从用户元数据中读取后台文章角色", () => {
        expect(getPostAdminRoleName(buildUserInfoWithRole("Author"))).toBe("Author")
    })

    it("仅管理员和编辑可使用后台文章高级控件", () => {
        expect(canUseAdvancedPostAdminTools("Administrator")).toBe(true)
        expect(canUseAdvancedPostAdminTools("Editor")).toBe(true)
        expect(canUseAdvancedPostAdminTools("Author")).toBe(false)
        expect(canUseAdvancedPostAdminTools("Contributor")).toBe(false)
        expect(canUseAdvancedPostAdminTools("Subscriber")).toBe(false)
        expect(canUseAdvancedPostAdminTools()).toBe(false)
    })

    it("仅文章页且具备全量后台视图角色时展示高级控件", () => {
        expect(shouldShowAdvancedPostAdminTools(PostType.Post, "Administrator")).toBe(true)
        expect(shouldShowAdvancedPostAdminTools(PostType.Post, "Editor")).toBe(true)
        expect(shouldShowAdvancedPostAdminTools(PostType.Post, "Author")).toBe(false)
        expect(shouldShowAdvancedPostAdminTools(PostType.Page, "Administrator")).toBe(false)
    })

    it("文章页和页面页在具备全量后台角色时展示修改控件", () => {
        expect(shouldShowPostAdminMutationTools(PostType.Post, "Administrator")).toBe(true)
        expect(shouldShowPostAdminMutationTools(PostType.Page, "Administrator")).toBe(true)
        expect(shouldShowPostAdminMutationTools(PostType.Page, "Editor")).toBe(true)
        expect(shouldShowPostAdminMutationTools(PostType.Page, "Author")).toBe(false)
        expect(shouldShowPostAdminMutationTools(PostType.Video, "Administrator")).toBe(false)
    })
})
