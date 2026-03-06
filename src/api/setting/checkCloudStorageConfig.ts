/**
 * @FilePath     : \blog-client\src\api\setting\checkCloudStorageConfig.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 校验云存储配置
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 校验指定类型的云存储配置
export function checkCloudStorageConfigAPI(cloudType: "oss" | "cos"): ResPromise<Res<null>> {
    return request({
        url: routerGroup + "/setting/check-cloud-storage-config",
        method: "get",
        params: { cloud_type: cloudType },
    })
}
