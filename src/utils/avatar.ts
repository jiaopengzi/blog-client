/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-18 18:11:58
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-18 18:18:28
 * @FilePath     : \blog-client\src\utils\avatar.ts
 * @Description  : 头像逻辑
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { UserInfo } from '@/api/user/getUserInfo'

/**
 * @description: 获取头像地址 优先使用UserInfo.user.user_avatar 如果没有则使用 UserInfo.user_qq.avatar 或者 UserInfo.user_wechat.Avatar 无则返回空字符串
 * @param userInfo 用户信息
 * @return 头像地址
 */
export function getAvatarUrl(userInfo: UserInfo): string {
  return (
    userInfo?.user?.user_avatar || userInfo?.user_wechat?.avatar || userInfo?.user_qq?.avatar || ''
  )
}
