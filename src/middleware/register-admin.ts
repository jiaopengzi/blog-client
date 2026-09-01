/*
 * FilePath    : blog-client-nuxt\src\middleware\register-admin.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 注册管理员路由守卫 (复刻 SPA registerAdminMiddleware)
 */

/*
 * 补充说明:
 * 首次管理员注册是系统初始化流程的一部分, 不能作为常规公开注册入口:
 * - 进入 /register-admin 时, 后端已存在管理员则跳转站内 404;
 * - 从 /register-admin 离开时, 后端仍不存在管理员则返回注册页, 防止初始化未完成时绕过创建流程.
 * register-admin 模板整体在 ClientOnly 中, 但管理员存在性检查必须在服务端与客户端均执行:
 * 直链访问时服务端直接返回 404, 避免先渲染注册页空壳再由客户端跳转造成闪烁与 hydration mismatch.
 */

import { hasAdminAPI } from "@/api/setting/hasAdmin"
import { ResponseCode } from "@/api/response"

/**
 * registerAdminMiddleware 约束首次管理员注册路由的访问与离开行为.
 * @param to 即将进入的目标路由.
 * @param from 当前离开的来源路由.
 * @returns 重定向目标或 void.
 */
export default defineNuxtRouteMiddleware(async (to, from) => {
    if (to.name === "register-admin") {
        const res = await hasAdminAPI()
        if (res.data.code === ResponseCode.HasAdmin) {
            return navigateTo("/not-found", { replace: true })
        }
    }

    if (from.name === "register-admin") {
        const res = await hasAdminAPI()
        if (res.data.code === ResponseCode.NoAdmin) {
            return navigateTo({ name: "register-admin" }, { replace: true })
        }
    }
})
