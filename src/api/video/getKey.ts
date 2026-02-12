/**
 * @FilePath     : \blog-client\src\api\video\getKey.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取播放密钥
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export function getKeyAPI(fileIdHash: string, postId: string = ""): ResPromise<Res<string>> {
    if (postId) {
        fileIdHash += `/post-id/${postId}`
    } else {
        fileIdHash += `/post-id/0`
    }

    return request({
        url: `${routerGroup}/video/key/${fileIdHash}`,
        method: "get",
    })
}

// 管理员获取， postId 作为占位符无实际意义，保证接口统一
export function getKeyAdminAPI(fileIdHash: string, _postId: string = ""): ResPromise<Res<string>> {
    return request({
        url: `${routerGroup}/video/admin/key/${fileIdHash}`,
        method: "get",
    })
}
