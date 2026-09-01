/*
 * FilePath    : blog-client-nuxt\server\routes\internal\favicon-sync.post.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : favicon.ico 镜像同步接口 (bug05 260831-01 重构)
 */

/*
 * 补充说明:
 * admin 保存 app-option 成功后由前端调用(与 invalidateSsrRenderCache 并排, 见 app-option/index.vue),
 * 服务端按最新配置拉取 favicon 落盘 <public>/favicon.ico; 同步逻辑见 server/utils/favicon.ts 文件头.
 * 鉴权与 server/routes/internal/cache-invalidate.post.ts 同模式: 转发调用方 Authorization 到后端
 * has-permission 校验 LoginAdmin 权限, 防止匿名触发服务端向外拉取文件(SSRF 面收窄到管理员);
 * 路径同样刻意避开 /api 前缀(会被代理规则转发到后端, 本接口不可达).
 */

import { createError, getHeader } from "h3"

import { PermissionNames } from "@/api/permissionRole/permissionNames"
import { ResponseCode } from "@/api/response/code"

import { syncFaviconMirror } from "../../utils/favicon"

export default defineEventHandler(async (event) => {
    const { apiBase, public: publicConfig } = useRuntimeConfig()

    // 未配置后端地址: 明确失败(与 server/routes/api/[...].ts 同语义)
    if (!apiBase) {
        throw createError({ statusCode: 502, message: "未配置后端 API 地址（NUXT_API_BASE）" })
    }

    const authorization = getHeader(event, "authorization")
    if (!authorization) {
        throw createError({ statusCode: 401, message: "未登录" })
    }

    // 转发 token 到后端校验 LoginAdmin 权限(校验失败/网络异常统一 401, 不向调用方暴露内部细节)
    let hasPermission = false
    try {
        const res = await $fetch<{ code: number; data?: boolean }>(`${apiBase}/api/v1/permission/has-permission`, {
            method: "POST",
            headers: { authorization },
            body: { permission_name: PermissionNames.LoginAdmin },
        })
        hasPermission = res.code === ResponseCode.HasPermission && res.data === true
    } catch {
        hasPermission = false
    }
    if (!hasPermission) {
        throw createError({ statusCode: 401, message: "无权限" })
    }

    const result = await syncFaviconMirror(apiBase, publicConfig.baseUrl)
    if (!result.ok) {
        // 同步失败用 502 语义(依赖后端/远端资源不可用), reason 供 admin 排查配置问题
        throw createError({ statusCode: 502, message: `favicon 镜像同步失败: ${result.reason ?? "unknown"}` })
    }

    return { ok: true, action: result.action }
})
