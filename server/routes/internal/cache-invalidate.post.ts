/*
 * FilePath    : blog-client-nuxt\server\routes\internal\cache-invalidate.post.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : SSR 渲染缓存失效接口 (feature01 260829-08)
 */

/*
 * 补充说明:
 * routeRules 的 swr 渲染缓存 (/ 300s, /category /tag 300s, /p 3600s) 由 nitro 的
 * cachedEventHandler(group: "nitro/routes") 写入 cache 存储挂载点; 后台修改站点配置
 * (app-option/app-nav)或文章/自定义页 (新增/编辑/删除)后, 需立即清空该组缓存,
 * 保证下次请求按新数据重新 SSR (nuxt.config.ts 的 swr 配置保持不变).
 * 路径刻意避开 /api 前缀——/api/** 在 dev 由 devProxy、preview/生产由 routeRules proxy
 * 优先转发到后端, 放在 /api 下本接口永远不可达.
 * 鉴权: 转发调用方 Authorization 到后端 has-permission 校验 LoginAdmin 权限
 * (与 /admin 访问门槛一致, 能在后台执行保存操作的账号必然具备), 防止匿名刷缓存穿透.
 * 常量引用 (feature01 260829-08 反馈): ResponseCode 与 PermissionNames 均为
 * 零依赖纯枚举文件, Nitro 打包链可解析 @/ alias 并内联(dev/preview/build 三态已实证),
 * 与客户端共用同一事实来源, 后端改码值/权限名时不会出现 server 侧字面量被遗漏.
 */

import { createError, getHeader } from "h3"

import { PermissionNames } from "@/api/permissionRole/permissionNames"
import { ResponseCode } from "@/api/response/code"

// routeRules swr 渲染缓存的存储分组前缀 (nitro cachedEventHandler 的 group 选项).
// 键形态随驱动而异: 写入键为 "nitro/routes:..."(原始形态, 生产内存驱动返回此形态),
// dev 的 fs 驱动(Windows 禁止文件名含 ":")把 "/" 与 ":" 互换后返回 "nitro:routes:...",
// 两种前缀都匹配, 不依赖具体驱动实现
const RENDER_CACHE_GROUP_PREFIXES = ["nitro:routes", "nitro/routes"]

export default defineEventHandler(async (event) => {
    const { apiBase } = useRuntimeConfig()

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

    // 清空 swr 渲染缓存: cache 挂载点下 nitro/routes 分组的全部条目
    const storage = useStorage("cache")
    const keys = await storage.getKeys()
    const renderKeys = keys.filter((key) => RENDER_CACHE_GROUP_PREFIXES.some((prefix) => key.startsWith(prefix)))
    await Promise.all(renderKeys.map((key) => storage.removeItem(key)))

    return { ok: true, cleared: renderKeys.length }
})
