/*
 * FilePath    : blog-client\src\api\membership\getRoles.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 查看角色列表
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

export function getMembershipRolesAPI(): ResPromise<Res<string[]>> {
    const urlStr = routerGroup + "/membership/roles"
    return request({
        url: urlStr,
        method: "get",
    })
}
