/*
 * FilePath    : blog-client-nuxt\src\api\dashboard\postVisitTop.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 获取面板文章(page)访问排行
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

import { TimeDimension } from "./common"

// 获取面板文章访问排行请求类型
export interface PostVisitTopRequest {
    dimension: TimeDimension // 时间维度(仅支持 day/week/month)
    is_current?: boolean // 是否为当期
    top_n?: number // 排行数量, 1-100, 缺省 10
}

// 文章类型(post=文章, page=页面)
export type PostType = "post" | "page"

// 文章访问排行条目
export interface PostVisitTopItem {
    post_id: string // 文章ID(字符串防精度丢失)
    post_title: string // 文章标题
    post_type: PostType // 文章类型
    post_url_path: string // 前台跳转路径(post=/p/{id}, page=/page/{slug})
    pv: number // 期间浏览量
}

// 获取面板文章访问排行响应类型
export interface PostVisitTopRes {
    dimension: TimeDimension // 维度值
    is_current: boolean // 是否为当期
    top_n: number // 排行数量
    items: PostVisitTopItem[] // 排行条目(按浏览量降序)
}

// 获取面板文章访问排行
export function getPostVisitTopAPI(requestData: PostVisitTopRequest): ResPromise<Res<PostVisitTopRes>> {
    const urlStr = routerGroup + "/dashboard/post-visit-top"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
