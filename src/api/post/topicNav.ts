/**
 * FilePath    : blog-client\src\api\post\topicNav.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 专题导航 (文章所属专题的完整分类树与树内可见文章列表)
 */

import { request, routerGroup } from "@/api/request"
import type { Res, ResPromise } from "@/api/response"

// 专题导航文章条目 (后端瘦响应, 只含导航所需字段)
export interface PostTopicNavPost {
    id: string // 文章 ID (字符串防精度丢失)
    post_title: string // 文章标题
}

// 专题导航分类节点 (树形, 同规则递归)
export interface PostTopicNavCategory {
    id: string // 分类 ID
    name: string // 分类名称
    slug: string // 分类别名
    order: number // 排序
    is_topic: boolean // 是否专题根(根节点为 true)
    posts: PostTopicNavPost[] | null // 本分类直属文章(可见口径, 时间正序), 后端空切片序列化为 null
    children: PostTopicNavCategory[] | null // 子分类, 后端空切片序列化为 null
}

// 专题导航响应
export interface PostTopicNav {
    root_category: PostTopicNavCategory // 专题根分类, 根直属文章挂其 posts
    current_post_id: string // 当前文章 ID
}

export interface ViewTopicNavRequest {
    post_id: string // 文章 ID
}

/**
 * viewTopicNavAPI 按文章 ID 获取专题导航.
 * @remarks 公开接口; 匿名为公开口径(Publish+Password), 携带登录 token 时后端叠加本人私密文章.
 */
export function viewTopicNavAPI(requestData: ViewTopicNavRequest): ResPromise<Res<PostTopicNav>> {
    const urlStr = routerGroup + "/post/topic-nav"
    return request({
        url: urlStr,
        method: "post",
        data: requestData,
    })
}
