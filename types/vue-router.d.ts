/**
 * @FilePath     : \blog-client\types\vue-router.d.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 路由元信息 参考：https://router.vuejs.org/zh/guide/advanced/meta.html
 */

import "vue-router"

// 为了确保这个文件被当作一个模块，添加至少一个 `export` 声明
export {}

declare module "vue-router" {
    interface RouteMeta {
        // 是否是面包屑
        isBreadcrumb?: boolean
        // 每个路由都必须声明
        requiresAuth: boolean
    }
}
