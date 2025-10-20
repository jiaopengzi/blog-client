/*
 * FilePath    : blog-client\src\api\post\starGetOwn.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 获取自己星标、收藏的文章
 */

import { type PaginationRequest, request, routerGroup } from "@/api/request"
import type { Pagination, Res, ResPromise } from "@/api/response"
import { type DataWithImg } from "@/components/common" // 图片填充方式

import { type PostStatusCode } from "./common"

// 文章
export interface PostStarRes extends DataWithImg {
    id: string // 标签id
    post_status: PostStatusCode // 文章状态
    post_title: string // 文章标题
    slug: string // 别名
    thumbnail: string // 缩略图
}

// 获取自己星标、收藏的文章
export function postStarGetOwnAPI(requestData: PaginationRequest): ResPromise<Res<Pagination<PostStarRes>>> {
    const urlStr = routerGroup + "/post/star-get-own"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
