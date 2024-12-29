/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 16:01:28
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 12:47:22
 * @FilePath     : \blog-client\src\api\postTag\view.ts
 * @Description  : 查看文章标签
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { request, routerGroup } from "@/api/request"
import type { DataWithImg, Pagination, PaginationRequest } from "@/components/common"
import type { Res, ResPromise } from "@/api/response"

// 每行数据类型
export interface PostTag extends DataWithImg {
    id: string // 标签id
    created_at: string // 创建时间
    name: string // tag名称
    description: string // 描述
    slug: string // 别名
    thumbnail: string // 缩略图
    order: string // 排序
    post_count: string // 文章数量
    post_count_admin: string // 文章数量(管理员)
}

// 查看文章标签
export function viewPostTagAPI(
    requestData: PaginationRequest,
): ResPromise<Res<Pagination<PostTag>>> {
    const urlStr = routerGroup + "/post-tag/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
