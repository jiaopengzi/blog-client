/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-12 16:41:11
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-17 16:33:21
 * @FilePath     : \blog-client\src\api\post\view.ts
 * @Description  : 查看文章
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import { type Res } from "@/api/responseCode"
import { type PostResPagination } from "./common"
import type { Pagination, PaginationRequest } from "@/components/common"

// 查看文章
export function viewPostAPI(
    requestData: PaginationRequest,
): AxiosPromise<Res<Pagination<PostResPagination>>> {
    const urlStr = routerGroup + "/post/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
