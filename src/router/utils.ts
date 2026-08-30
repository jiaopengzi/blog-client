/*
 * FilePath    : blog-client-nuxt\src\router\utils.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 路由工具 (阶段 3 迁入; SSR 守卫版)
 */

/*
 * 补充说明:
 * 计划 7.7: router.resolve/push 依赖浏览器路由上下文,
 * Nuxt SSR 下 SPA 路由名不存在且无需同步, 直接跳过; 浏览器端行为不变。
 * 类型用结构类型替代 vue-router (Nuxt 内置, 非直接依赖)。
 */

// vue-router 结构类型 (避免直接依赖 vue-router 包)
type LocationQueryRaw = Record<string, string | number | null | undefined>
interface ResolvedTarget {
    fullPath: string
    matched: Array<unknown>
}
interface RouterLike {
    resolve: (target: { name?: string; path?: string; query: LocationQueryRaw; hash: string }) => ResolvedTarget
    currentRoute: { value: { fullPath: string } }
    push: (target: string) => Promise<unknown>
}

/**
 * @description: 解析目标路由。Nuxt 的 admin 子页为 pages/admin/[...slug].vue 单一 catch-all
 * (name 为文件派生名), SPA 的 admin 路由名 (RouteNamesAdmin 枚举值, 如 "post-all") 不在
 * Nuxt 路由表中, 按 name resolve 会得到空匹配; 此时降级为 /admin/<routeName> 路径解析
 * ([...slug] 按路径匹配), 保证 admin 表格筛选/分页/编辑跳转等路由同步生效。
 */
function resolveTarget(router: RouterLike, routeName: string, query: LocationQueryRaw, hash: string): ResolvedTarget {
    // vue-router 5 对不存在的 name 直接抛 No match 错误 (非返回空匹配), 需捕获后降级
    try {
        const byName = router.resolve({
            name: routeName,
            query,
            hash,
        })

        if (byName.matched && byName.matched.length > 0) {
            return byName
        }
    } catch {
        // name 不存在 (admin [...slug] catch-all 场景), 降级 path 解析
    }

    return router.resolve({
        path: `/admin/${routeName}`,
        query,
        hash,
    })
}

/**
 * @description: 比较目标路由是否与当前路由完全一致, 避免同路由冗余 push 带来的额外导航成本
 * @param router 路由实例
 * @param routeName 路由名称
 * @param query 目标查询参数
 * @param hash 目标 hash
 * @return {boolean} 是否与当前路由一致。
 */
function isSameRouteTarget(router: RouterLike, routeName: string, query: LocationQueryRaw, hash: string): boolean {
    return resolveTarget(router, routeName, query, hash).fullPath === router.currentRoute.value.fullPath
}

/**
 * @description: 分页路由跳转
 * @param router 路由实例
 * @param routeName 路由名称
 * @param queryParams 查询参数
 * @param hash 路由 hash, 默认值为空字符串
 */
export async function routerPushByParams(router: RouterLike, routeName: string, queryParams: LocationQueryRaw, hash: string = ""): Promise<void> {
    // SSR 守卫: 路由同步 (resolve/push) 依赖浏览器路由上下文;
    // Nuxt SSR 下 SPA 路由名 (如 "home") 不存在且无需同步, 直接跳过。浏览器端行为不变
    if (typeof window === "undefined") {
        return
    }

    const query: LocationQueryRaw = {}

    // 过滤掉值为空字符串的参数
    Object.keys(queryParams).forEach((key) => {
        const value = queryParams[key]
        if (value !== "" && value !== undefined) {
            query[key] = value
        }
    })

    // 如果 query 中有 password 参数, 则删除
    if ("password" in query) {
        delete query.password
    }

    if (isSameRouteTarget(router, routeName, query, hash)) {
        return
    }

    await router.push(resolveTarget(router, routeName, query, hash).fullPath)
}
