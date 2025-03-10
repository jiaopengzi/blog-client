/**
 * @FilePath     : \blog-client\src\api\postTag\view.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 查看文章标签
 */

import { type PaginationRequest, request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"
import type { DataWithImg } from "@/components/common"

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
export function viewPostTagAPI(requestData: PaginationRequest): ResPromise<Res<Pagination<PostTag>>> {
    const urlStr = routerGroup + "/post-tag/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
