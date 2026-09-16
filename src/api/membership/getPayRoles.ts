/*
 * FilePath    : blog-client\src\api\membership\getPayRoles.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 查看付费角色列表
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import type { MembershipRes } from "./common"

export function getMembershipPayRolesAPI(): ResPromise<Res<MembershipRes[]>> {
    const urlStr = routerGroup + "/membership/pay-roles"
    return request({
        url: urlStr,
        method: "get",
    })
}
