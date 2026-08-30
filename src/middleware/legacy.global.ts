/*
 * FilePath    : blog-client-nuxt\src\middleware\legacy.global.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 老链接重定向的客户端软导航兜底 (阶段 3 起保留其余 query 参数)
 */

/*
 * 补充说明:
 * 硬导航 (新开页面/爬虫) 由 Nitro 中间件 server/middleware/legacy-redirect.ts 处理;
 * 本中间件处理已打开页面内的 SPA 软导航 (vue-router 层), 保证老链接在站内跳转同样 301
 * 260829-05: 老用户主页 /:username → /user/:username 的重定向已整体移除(该形态外链量极少,
 * 用户主页统一走 /user/:username); 现在 /:username 直接落到兜底路由 pages/[...slug].vue 返回 404
 */

export default defineNuxtRouteMiddleware((to) => {
    // 构建目标: 保留除旧参数外的其余 query (如分页 page/size),
    // 并统一简写翻译 current_page → page、page_size → size (URL 形态语义化, 请求参数名不变)
    const buildTarget = (path: string, excludeKeys: string[]) => {
        const query: Record<string, string> = {}
        for (const key of Object.keys(to.query)) {
            if (excludeKeys.includes(key)) {
                continue
            }
            const value = to.query[key]
            if (typeof value === "string") {
                const urlKey = key === "current_page" ? "page" : key === "page_size" ? "size" : key
                query[urlKey] = value
            }
        }
        return { path, query }
    }

    // /?post_id=:id → /p/:id
    if (to.path === "/" && to.query.post_id) {
        return navigateTo(buildTarget(`/p/${String(to.query.post_id)}`, ["post_id"]), { redirectCode: 301 })
    }

    // /?post_category_slug=:s → /category/:s
    if (to.path === "/" && to.query.post_category_slug) {
        return navigateTo(buildTarget(`/category/${String(to.query.post_category_slug)}`, ["post_category_slug"]), { redirectCode: 301 })
    }

    // /?post_tag_slug=:s → /tag/:s
    if (to.path === "/" && to.query.post_tag_slug) {
        return navigateTo(buildTarget(`/tag/${String(to.query.post_tag_slug)}`, ["post_tag_slug"]), { redirectCode: 301 })
    }

    // /?year=:y&month=:m → /year/:y/month/:m (仅年月双参齐全时翻译)
    if (to.path === "/" && to.query.year && to.query.month) {
        return navigateTo(buildTarget(`/year/${String(to.query.year)}/month/${String(to.query.month)}`, ["year", "month"]), { redirectCode: 301 })
    }

    // /?key_word=:kw → /s/:kw (搜索页新方案, 纯 CSR; 中文关键字由路由自动转义)
    if (to.path === "/" && to.query.key_word) {
        return navigateTo(buildTarget(`/s/${String(to.query.key_word)}`, ["key_word"]), { redirectCode: 301 })
    }

    // /?year=:y (无 month) → /year/:y (面包屑年链接新方案)
    if (to.path === "/" && to.query.year && !to.query.month) {
        return navigateTo(buildTarget(`/year/${String(to.query.year)}`, ["year"]), { redirectCode: 301 })
    }

    // /?current_page=:p&page_size=:s → /?page=:p&size=:s (首页分页简写翻译, 无其它旧参数时)
    if (to.path === "/" && (to.query.current_page || to.query.page_size)) {
        return navigateTo(buildTarget("/", []), { redirectCode: 301 })
    }
})
