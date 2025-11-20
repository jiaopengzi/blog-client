/**
 * @FilePath     : \blog-client\src\router\routeAdmin.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : admin 路由配置
 */

import type { RouteRecordRaw } from "vue-router"

import { toKebabCase } from "@/utils/namingConversion"
import { adminMenuItemMapWithIndex } from "@/views/admin/component/aside"

import { RouteNames, RouteNamesAdmin } from "./types"

// 生成管理后台路由
function generateAdminRoutes() {
    const routesAdmin: RouteRecordRaw[] = [
        {
            path: "/admin",
            name: RouteNames.Admin,
            component: () => import("@/views/admin"),
            redirect: { name: RouteNamesAdmin.Dashboard }, // 显式重定向到默认子路由
            meta: {
                requiresAuth: true,
            },
            children: [
                // 其他子路由
                ...Object.keys(adminMenuItemMapWithIndex).map((key) => {
                    const menuItem = adminMenuItemMapWithIndex[key as RouteNamesAdmin]
                    // 判断是否单独设置父级菜单默认是显示子菜单的组件,
                    let component = toKebabCase(key)
                    if (menuItem.components) {
                        component = toKebabCase(menuItem.components)
                    }

                    return {
                        path: menuItem.index,
                        name: key,
                        component: () => import(`@/views/admin/component/main/${component}/index.vue`), // 需要具体到文件拓展名
                        meta: {
                            requiresAuth: true,
                        },
                    }
                }),
            ],
        },
    ]

    return routesAdmin
}

export const adminRoutes = generateAdminRoutes()
