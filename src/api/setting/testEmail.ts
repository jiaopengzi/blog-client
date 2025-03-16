/**
 * @FilePath     : \blog-client\src\api\setting\testEmail.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 测试邮箱配置链接
 */

import type { SendTestEmailRequest } from "@/api/common" // 复用类型
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 发送测试邮件
export function testEmailAPI(requestData: SendTestEmailRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/setting/test-email"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
