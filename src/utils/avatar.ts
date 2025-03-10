/**
 * @FilePath     : \blog-client\src\utils\avatar.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 头像逻辑
 */

import type { UserInfo } from "@/api/user/getUserInfo"

/**
 * @description: 获取头像地址 优先使用UserInfo.user.user_avatar 如果没有则使用 UserInfo.user_qq.avatar 或者 UserInfo.user_wechat.Avatar 无则返回空字符串
 * @param userInfo 用户信息
 * @return 头像地址
 */
export function getAvatarUrl(userInfo: UserInfo): string {
    return userInfo?.user?.user_avatar || userInfo?.user_wechat?.avatar || userInfo?.user_qq?.avatar || ""
}
