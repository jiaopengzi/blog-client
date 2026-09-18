/**
 * FilePath    : blog-client\server\middleware\legacy-redirect.ts
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
 *              5c) /?key_word=:kw           → /s/:kw
 *              5d) /?s=:kw                  → /s/:kw(WordPress 形态搜索链接)
 *              6) /?current_page=:p&page_size=:s → /?page=:p&size=:s(首页分页简写)
 *              8) 首页未知 query 参数清洗 → 301 剥离(白名单仅 page/size)
 *              7) /ps/:slug                 → 服务端解析 post_id → /p/:id
 *              阶段 3 起: 重定向时保留其余 query 参数, 并统一简写翻译
 *              current_page → page、page_size → size(URL 形态语义化, 请求参数名不变)
 *              客户端软导航兜底见 middleware/legacy.global.ts
 *              260916-02: nitro 自动导入符号改为显式 import, 摆脱 IDE 对
 *              tsconfig.server.json 归属的依赖, 任意环境可类型检查(行为不变)
 */

// 显式 import(260916-02): h3/ofetch 均为本项目直接依赖且为主入口子路径,
// 包主入口 import 在任意 tsconfig 归属(含 IDE 游离文件)下均可解析;
// 刻意不用 nitropack/runtime 的 useRuntimeConfig——其子路径 export 依赖
// bundler 解析, IDE 游离项目(node10 解析)会报"找不到模块"
import { createError, defineEventHandler, getRequestURL, sendRedirect } from "h3"
import { $fetch } from "ofetch"

/**
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

    // 5d) 首页 WordPress 形态搜索参数 → /s/:keyword(bugfix 260918-05)
    // 垃圾爬虫按 WordPress 站点惯例批量探测 /?s=:kw; 此前该形态直接落到 SSR 渲染出
    // path 为 /?s=:kw 的首页, 而 nitro 的 swr 渲染缓存(nitro/routes 组)按路径建 key、
    // 忽略 query, 该渲染结果会写进 / 的共享缓存条目——随后 600s 内所有访问 / 的浏览器
    // 拿到的 payload.path 均为 /?s=:kw, 客户端水合时 vue-router 以 payload 路径为
    // 初始路由并 replace, 表现为"访问首页地址栏自动变成 /?s=关键字". 重定向到搜索页
    // 后既不再产生带 query 的首页渲染(缓存无法被污染), 又让 WP 形态搜索链接真正可用
    if (pathname === "/" && searchParams.has("s")) {
        const keyword = searchParams.get("s")
        if (keyword) {
            return sendRedirect(event, buildRedirectUrl(`/s/${encodeURIComponent(keyword)}`, ["s"]), 301)
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

    // 8) 首页未知 query 参数清洗(bugfix 260918-05, 白名单仅 page/size)
    // 上面的老参数规则各自重定向后, 首页仅剩分页简写 page/size 是合法 query;
    // 其余任意参数(utm_*、fbclid、垃圾爬虫探测串等)一律 301 剥离, 不进入 SSR 渲染.
    // 原因: nitro 的 swr 渲染缓存按路径建 key、忽略 query, 任何带 query 的首页 200 渲染
    // 都会写进 / 的共享缓存条目, 把访问 / 的浏览器的地址栏改写成带该 query 的形态
    // (机制见 5d 注释). 白名单参数自身的同源污染面可忽略——分页组件 ClientOnly 渲染,
    // SSR HTML 不产出 /?page= 链接, 爬虫无从发现, 仅能盲猜命中
    if (pathname === "/") {
        const unknownKeys = [...searchParams.keys()].filter((key) => key !== "page" && key !== "size")
        if (unknownKeys.length > 0) {
            return sendRedirect(event, buildRedirectUrl("/", unknownKeys), 301)
        }
    }

    // 7) /ps/:slug 别名链接 → 服务端解析 → /p/:id
    const slugMatch = pathname.match(/^\/ps\/([^/]+)$/)
    if (slugMatch) {
        // useRuntimeConfig().apiBase 的值源即 NUXT_API_BASE 环境变量(nuxt.config 的
        // runtimeConfig.apiBase 默认为空串, 生产/开发均由 env 注入), 此处直读 env 等价,
        // 同时避免引入 nitropack/runtime 子路径 import(见文件头 import 说明)
        const apiBase = process.env.NUXT_API_BASE || ""
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
