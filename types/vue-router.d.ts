/**
 * @FilePath     : \blog-client\types\vue-router.d.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 路由元信息 参考：https://router.vuejs.org/zh/guide/advanced/meta.html
 */

import "vue-router"

declare module "vue-router" {
    interface RouteMeta {
        // 是否是面包屑
        isBreadcrumb?: boolean
        // 每个路由都必须声明
        requiresAuth: boolean
    }
}
