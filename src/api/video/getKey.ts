/**
 * @Author       : jiaopengzi
 * @Date         : 2024-09-21 15:33:42
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-09-21 15:43:39
 * @FilePath     : \blog-client\src\api\video\getKey.ts
 * @Description  : 获取播放密钥
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export function getKeyAPI(videoId: string): ResPromise<Res<string>> {
    return request({
        url: `${routerGroup}/video/key/${videoId}`,
        method: "get",
    })
}
