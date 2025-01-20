/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-20 16:48:45
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-20 16:50:06
 * @FilePath     : \blog-client\src\api\setting\testEmail.ts
 * @Description  : 测试邮箱配置链接
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import type { SendTestEmailRequest } from "@/api/common" // 复用类型
import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 发送测试邮件
export function testEmailAPI(requestData: SendTestEmailRequest): ResPromise<Res<unknown>> {
    const urlStr = routerGroup + "/option/test-email"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
