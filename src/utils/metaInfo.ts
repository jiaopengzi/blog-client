/**
 * @Author       : jiaopengzi
 * @Date         : 2024-06-18 16:33:22
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-06-18 16:34:26
 * @FilePath     : \blog-client\src\utils\metaInfo.ts
 * @Description  : 获取 meta 信息
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import type { UserInfo } from '@/api/user/getUserInfo'

/**
 * @description: 获取用户元数据列表中信息
 * @return {string | undefined}
 */
// 获取用户元数据列表中信息
export function getUserMetaValue(key: string, userInfo: UserInfo): string | undefined {
  const meta = userInfo.user_meta.find((item) => item.meta_key === key)
  return meta ? meta.meta_value : undefined
}
