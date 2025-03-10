/**
 * @FilePath     : \blog-client\src\utils\metaInfo.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取 meta 信息
 */

import type { UserInfo } from "@/api/user/getUserInfo"

/**
 * @description: 获取用户元数据列表中信息
 * @return {string | undefined}
 */
// 获取用户元数据列表中信息
export function getUserMetaValue(key: string, userInfo: UserInfo): string | undefined {
    const meta = userInfo.user_meta.find((item) => item.meta_key === key)
    return meta ? meta.meta_value : undefined
}
