/**
 * @FilePath     : \blog-client\src\api\video\getKey.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 获取播放密钥
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export function getKeyAPI(fileIdHash: string): ResPromise<Res<string>> {
    return request({
        url: `${routerGroup}/video/key/${fileIdHash}`,
        method: "get",
    })
}
