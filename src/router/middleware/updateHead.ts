/*
 * FilePath    : blog-client\src\router\middleware\updateHead.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 更新 head 标签
 */

import { type RouteLocationNormalized } from "vue-router"

import { type HeadProps } from "@/components/common/head-tag"
import { updateHead } from "@/utils/updateHead"

export const updateHeadMiddleware = async (to: RouteLocationNormalized, from: RouteLocationNormalized) => {
    // 获取协议（例如 "http:" 或 "https:"）
    const protocol = window.location.protocol

    // 获取域名
    const domain = window.location.hostname

    // 获取端口
    const port = window.location.port

    // 获取当前路由的完整路径
    const fullPath = to.fullPath

    // 拼接完整的 URL
    const fullUrl = `${protocol}//${domain}${port ? `:${port}` : ""}${fullPath}`

    const head: HeadProps = {
        url: fullUrl,
    }
    await updateHead(head)

    return true
}
