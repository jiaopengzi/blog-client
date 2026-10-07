/**
 * FilePath    : blog-client\src\middleware\legacy.global.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 老链接软导航兜底 (261007-02: 动态路径段显式编码, 保留其余 query 参数)
 */

import { defineNuxtRouteMiddleware, navigateTo } from "#app"

/**
 * 补充说明:
 * 硬导航 (新开页面/爬虫) 由 Nitro 中间件 server/middleware/legacy-redirect.ts 处理;
 * 本中间件处理已打开页面内的 SPA 软导航 (vue-router 层), 保证老链接在站内跳转同样 301
 * 260829-05: 老用户主页 /:username → /user/:username 的重定向已整体移除(该形态外链量极少,
 * 用户主页统一走 /user/:username); 现在 /:username 直接落到兜底路由 pages/[...slug].vue 返回 404
 */

/**
 * 将首页旧查询参数转换为新路由, 已解码的参数按独立路径段编码.
 * @param to 即将进入的路由, query 已由路由器解码.
 * @returns 命中旧链接时返回导航结果, 否则不干预导航.
 * @throws 路由导航本身的错误由 Nuxt 统一处理.
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
        return navigateTo(buildTarget(`/p/${encodeURIComponent(String(to.query.post_id))}`, ["post_id"]), { redirectCode: 301 })
    }

    // /?post_category_slug=:s → /category/:s
    if (to.path === "/" && to.query.post_category_slug) {
        return navigateTo(buildTarget(`/category/${encodeURIComponent(String(to.query.post_category_slug))}`, ["post_category_slug"]), { redirectCode: 301 })
    }

    // /?post_tag_slug=:s → /tag/:s
    if (to.path === "/" && to.query.post_tag_slug) {
        return navigateTo(buildTarget(`/tag/${encodeURIComponent(String(to.query.post_tag_slug))}`, ["post_tag_slug"]), { redirectCode: 301 })
    }

    // /?year=:y&month=:m → /year/:y/month/:m (仅年月双参齐全时翻译)
    if (to.path === "/" && to.query.year && to.query.month) {
        return navigateTo(
            buildTarget(`/year/${encodeURIComponent(String(to.query.year))}/month/${encodeURIComponent(String(to.query.month))}`, ["year", "month"]),
            { redirectCode: 301 },
        )
    }

    // /?key_word=:kw → /s/:kw (搜索页新方案, 纯 CSR; 中文关键字由路由自动转义)
    // 修正: 显式 path 不会自动编码动态段; 必须先编码 query, 防止 ?/# 变成路径分隔符或 % 被再次解码.
    if (to.path === "/" && to.query.key_word) {
        return navigateTo(buildTarget(`/s/${encodeURIComponent(String(to.query.key_word))}`, ["key_word"]), { redirectCode: 301 })
    }

    // /?s=:kw → /s/:kw (bugfix 260918-05: WordPress 形态搜索链接, 与 key_word 规则同构;
    // 服务端硬导航通道见 legacy-redirect.ts 规则 5d, 此处保证站内软导航同样 301)
    if (to.path === "/" && to.query.s) {
        return navigateTo(buildTarget(`/s/${encodeURIComponent(String(to.query.s))}`, ["s"]), { redirectCode: 301 })
    }

    // /?year=:y (无 month) → /year/:y (面包屑年链接新方案)
    if (to.path === "/" && to.query.year && !to.query.month) {
        return navigateTo(buildTarget(`/year/${encodeURIComponent(String(to.query.year))}`, ["year"]), { redirectCode: 301 })
    }

    // /?current_page=:p&page_size=:s → /?page=:p&size=:s (首页分页简写翻译, 无其它旧参数时)
    if (to.path === "/" && (to.query.current_page || to.query.page_size)) {
        return navigateTo(buildTarget("/", []), { redirectCode: 301 })
    }
})
