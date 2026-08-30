/*
 * FilePath    : blog-client-nuxt\server\middleware\legacy-redirect.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 老链接 301 重定向(Nitro 服务端中间件, 爬虫优先于 SSR 命中):
 *              1) /?post_id=:id            → /p/:id
 *              2) /post/:id                 → /p/:id
 *              3) /?post_category_slug=:s   → /category/:s
 *              4) /?post_tag_slug=:s        → /tag/:s
 *              5) /?year=:y&month=:m        → /year/:y/month/:m
 *              5b) /?year=:y(无 month)      → /year/:y
 *              6) /?current_page=:p&page_size=:s → /?page=:p&size=:s(首页分页简写)
 *              7) /ps/:slug                 → 服务端解析 post_id → /p/:id
 *              阶段 3 起: 重定向时保留其余 query 参数, 并统一简写翻译
 *              current_page → page、page_size → size(URL 形态语义化, 请求参数名不变)
 *              客户端软导航兜底见 middleware/legacy.global.ts
 */

/*
 * 补充说明(260829-05, 站点上线量小, 两条老链接规则整体移除, 现均落兜底路由返回 404):
 * 1) 原 6b) /t404 → /not-found: SPA 旧 404 路由, 不再保留, /t404 直接 404.
 * 2) 原 6c) /:username → /user/:username: 该形态外链量极少, 用户主页统一走 /user/:username,
 *    /:username 直接 404; 移除后同步删除了双端共用的排除名单 src/router/legacyRoutes.ts.
 * 兜底 404 由 pages/[...slug].vue 承接(真 404 状态码, 非 200).
 */

export default defineEventHandler((event) => {
    const url = getRequestURL(event)
    const { pathname, searchParams } = url

    // 构建重定向地址: 保留除旧参数外的其余 query,
    // 并统一简写翻译 current_page → page、page_size → size(URL 形态语义化, 请求参数名不变)
    const buildRedirectUrl = (path: string, excludeKeys: string[]): string => {
        const parts: string[] = []
        searchParams.forEach((value, key) => {
            if (!excludeKeys.includes(key)) {
                const urlKey = key === "current_page" ? "page" : key === "page_size" ? "size" : key
                parts.push(`${encodeURIComponent(urlKey)}=${encodeURIComponent(value)}`)
            }
        })
        return parts.length > 0 ? `${path}?${parts.join("&")}` : path
    }

    // 1) 首页 ?post_id= 参数形式(旧文章链接)
    if (pathname === "/" && searchParams.has("post_id")) {
        const postId = searchParams.get("post_id")
        if (postId) {
            return sendRedirect(event, buildRedirectUrl(`/p/${encodeURIComponent(postId)}`, ["post_id"]), 301)
        }
    }

    // 2) /post/:id 路径形式(SPA 旧 redirect 路由)
    const postMatch = pathname.match(/^\/post\/([^/]+)$/)
    if (postMatch) {
        return sendRedirect(event, buildRedirectUrl(`/p/${encodeURIComponent(postMatch[1])}`, []), 301)
    }

    // 3) 首页分类查询参数 → 独立分类页
    if (pathname === "/" && searchParams.has("post_category_slug")) {
        const slug = searchParams.get("post_category_slug")
        if (slug) {
            return sendRedirect(event, buildRedirectUrl(`/category/${encodeURIComponent(slug)}`, ["post_category_slug"]), 301)
        }
    }

    // 4) 首页标签查询参数 → 独立标签页
    if (pathname === "/" && searchParams.has("post_tag_slug")) {
        const slug = searchParams.get("post_tag_slug")
        if (slug) {
            return sendRedirect(event, buildRedirectUrl(`/tag/${encodeURIComponent(slug)}`, ["post_tag_slug"]), 301)
        }
    }

    // 5) 首页年月归档查询参数 → /year/:year/month/:month(仅年月双参齐全时翻译)
    if (pathname === "/" && searchParams.has("year") && searchParams.has("month")) {
        const year = searchParams.get("year")
        const month = searchParams.get("month")
        if (year && month) {
            return sendRedirect(event, buildRedirectUrl(`/year/${encodeURIComponent(year)}/month/${encodeURIComponent(month)}`, ["year", "month"]), 301)
        }
    }

    // 5c) 首页搜索关键字 → /s/:keyword(搜索页新方案, 纯 CSR)
    if (pathname === "/" && searchParams.has("key_word")) {
        const keyword = searchParams.get("key_word")
        if (keyword) {
            return sendRedirect(event, buildRedirectUrl(`/s/${encodeURIComponent(keyword)}`, ["key_word"]), 301)
        }
    }

    // 5b) 首页仅年份归档查询参数(无 month)→ /year/:year(面包屑年链接新方案)
    if (pathname === "/" && searchParams.has("year") && !searchParams.has("month")) {
        const year = searchParams.get("year")
        if (year) {
            return sendRedirect(event, buildRedirectUrl(`/year/${encodeURIComponent(year)}`, ["year"]), 301)
        }
    }

    // 6) 首页分页参数简写翻译: /?current_page=:p&page_size=:s → /?page=:p&size=:s(无其它旧参数时)
    if (pathname === "/" && (searchParams.has("current_page") || searchParams.has("page_size"))) {
        return sendRedirect(event, buildRedirectUrl("/", []), 301)
    }

    // 7) /ps/:slug 别名链接 → 服务端解析 → /p/:id
    const slugMatch = pathname.match(/^\/ps\/([^/]+)$/)
    if (slugMatch) {
        const { apiBase } = useRuntimeConfig()
        return $fetch<{ code: number; data: string }>(`${apiBase}/api/v1/post/post-id`, {
            method: "POST",
            body: { slug: slugMatch[1] },
        })
            .then((res) => {
                if (res.code === 2045 && res.data) {
                    return sendRedirect(event, buildRedirectUrl(`/p/${encodeURIComponent(res.data)}`, []), 301)
                }
                throw createError({ statusCode: 404, message: "文章不存在" })
            })
            .catch((error: unknown) => {
                // $fetch 网络异常等: 统一 404(不向爬虫暴露内部错误)
                if (error && typeof error === "object" && "statusCode" in error) {
                    throw error
                }
                throw createError({ statusCode: 404, message: "文章不存在" })
            })
    }
})
