/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-04 16:01:28
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-04 18:28:14
 * @FilePath     : \blog-client\src\api\postTag\view.ts
 * @Description  : 查看文章标签
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import request from "@/api/request"
import { routerGroup } from "@/api/routerGroup"
import type { AxiosPromise } from "axios"
import type { DataWithImg, Pagination } from "@/components/common"
import { type Res } from "@/api/responseCode"

export interface ViewPostTagRequest {
    current_page: number // 当前页
    page_size: number // 每页显示条数
    key_word?: string // 关键字
}

// 每行数据类型
export interface PostTag extends DataWithImg {
    id: number // 标签id
    created_at: string // 创建时间
    name: string // tag名称
    description: string // 描述
    slug: string // 别名
    thumbnail: string // 缩略图
    order: number // 排序
    post_count: number // 文章数量
}

// 获取用户信息响应类型
export interface ViewPostTagResponse extends Res {
    data: Pagination<PostTag> // 您可以根据实际返回的数据结构替换为更具体的类型
}

// 查看文章标签
export function viewPostTagAPI(requestData: ViewPostTagRequest): AxiosPromise<ViewPostTagResponse> {
    const urlStr = routerGroup + "/post-tag/view"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
