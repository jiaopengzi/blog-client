/**
 * FilePath    : blog-client\src\components\common\post-list-admin\permissions.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 后台文章列表角色权限工具
 */

import { PostType } from "@/api/post/common"
import type { UserInfo } from "@/api/user/getUserInfo"
import { getUserMetaValue } from "@/utils/metaInfo"

const fullAccessRoleNames = new Set(["Administrator", "Editor"])

/**
 * getPostAdminRoleName 获取当前用户在后台文章列表中的角色名。
 * @param userInfo - 当前登录用户信息。
 * @returns 当前角色名; 未命中时返回 undefined。
 */
export function getPostAdminRoleName(userInfo: UserInfo): string | undefined {
    return getUserMetaValue("role_name", userInfo)
}

/**
 * canUseAdvancedPostAdminTools 判断当前角色是否可以使用后台文章页的高级控件。
 * @param roleName - 当前登录用户角色名。
 * @returns true 表示允许展示分类统计, 日期筛选, 自定义筛选和批量操作。
 */
export function canUseAdvancedPostAdminTools(roleName?: string): boolean {
    return typeof roleName === "string" && fullAccessRoleNames.has(roleName)
}

/**
 * shouldShowAdvancedPostAdminTools 判断当前页面是否应展示后台文章页的高级控件。
 * @param postType - 当前文章类型。
 * @param roleName - 当前登录用户角色名。
 * @returns true 表示当前页面允许展示后台文章页的高级控件。
 */
export function shouldShowAdvancedPostAdminTools(postType: PostType, roleName?: string): boolean {
    return (postType === PostType.Post || postType === PostType.Page) && canUseAdvancedPostAdminTools(roleName)
}

/**
 * shouldShowPostAdminMutationTools 判断当前页面是否应展示后台文章或页面修改控件.
 * @param postType - 当前文章类型.
 * @param roleName - 当前登录用户角色名.
 * @returns true 表示允许展示删除, 批量变更等修改控件.
 */
export function shouldShowPostAdminMutationTools(postType: PostType, roleName?: string): boolean {
    return (postType === PostType.Post || postType === PostType.Page) && canUseAdvancedPostAdminTools(roleName)
}
