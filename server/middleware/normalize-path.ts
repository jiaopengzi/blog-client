/*
 * FilePath    : blog-client\server\middleware\normalize-path.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 请求路径规范化与缓存 key 治理 (Nitro 服务端中间件, 按文件名字典序排在
 *               legacy-redirect 之后执行——双斜杠规范化晚于旧链接重定向无碍, h3 的
 *               getRequestURL 自带同类规范化; 而缓存 key 覆写必须在其后, 否则
 *               legacy-redirect 经 getRequestURL 读不到原始 query, 旧链接重定向会失效):
 *               1) 双斜杠路径防御 (bugfix 260916-02): `//?author=1` 形态的请求会使 Nuxt
 *                  buildPayloadURL 的 new URL(url, "http://localhost") 因空 host 抛
 *                  ERR_INVALID_URL, 命中 swr 规则的页面直接 500. 处理方式为 301 重定向到
 *                  单斜杠规范化 URL——不能静默改写 event._path/req.url: h3 的
 *                  createAppEventHandler 在 app 入口一次性捕获原始 path, 且每进入下一个
 *                  layer 前都会重置这两个字段, middleware 内的改写必然被覆盖(实证);
 *                  301 与 legacy-redirect 同款机制(middleware return 短路), `//p/:id`
 *                  重定向后正常 200, 与 SPA 客户端路由的最终行为一致;
 *               2) swr 页面缓存 key 治理 (bugfix 260916-02): nitro cachedEventHandler 的
 *                  key 取 req.originalUrl(含全部 query), 扫描器/爬虫的 query 变体会无限
 *                  增生缓存条目(生产 SWR 缓存默认落 unstorage 根 memory driver, 无 TTL
 *                  无上限, 已两次引发约 4.6 天周期的 2GB OOM); query 中仅分页参数
 *                  page/size 具业务意义需独立缓存, 其余一律剥离——覆写 req.originalUrl
 *                  为 pathname + 规范化的分页 query 后, 同一路径的无关 query 变体共享
 *                  一份缓存(与 SPA 语义一致: SSR 渲染只依赖 route.params 不读 query,
 *                  列表/分页数据由客户端拉取).
 */

// 显式 import(260916-02): nitro 自动导入声明依赖 IDE 对 tsconfig.server.json 的归属,
// 显式引用后任意环境(IDE/CLI)均可类型检查; h3 为本项目直接依赖(版本对齐 nuxt 4.5.2 锁定值)
import { defineEventHandler, sendRedirect } from "h3"

// swr(swr/isr)页面路由前缀, 与 nuxt.config.ts routeRules 的 swr 规则一一对应
// (/, /category/**, /tag/**, /p/**); /p/:id/_payload.json 派生路径同样命中
const SWR_PAGE_RE = /^\/(?:$|category\/|tag\/|p\/)/

// 分页参数名(对齐 legacy-redirect 的简写翻译产物 ?page=&size=), 缓存 key 中唯一保留的 query 项
const PAGINATION_KEYS = new Set(["page", "size"])

/**
 * extractPaginationQuery 从原始 query 串中提取分页参数并规范化输出.
 * @param queryString - 原始 query 串(不含前导 `?`).
 * @returns 规范化的分页 query(含前导 `?`, 形如 `?page=2&size=20`); 无有效分页参数时返回空串.
 * @remarks 仅保留 page/size 各自首个非空取值, 按 page → size 固定顺序拼接, 使同参数
 *          异顺序(如 ?size=20&page=2)与混杂无关参数的变体(如 ?page=2&utm_source=x)
 *          归一到同一缓存 key; 取值保持原始字符串形态, 不做解码与类型转换.
 */
function extractPaginationQuery(queryString: string): string {
    let page: string | null = null
    let size: string | null = null
    for (const pair of queryString.split("&")) {
        const eqIndex = pair.indexOf("=")
        if (eqIndex <= 0) {
            continue
        }
        const key = pair.slice(0, eqIndex)
        const value = pair.slice(eqIndex + 1)
        if (!value || !PAGINATION_KEYS.has(key)) {
            continue
        }
        if (key === "page" && page === null) {
            page = value
        }
        if (key === "size" && size === null) {
            size = value
        }
    }
    const parts: string[] = []
    if (page !== null) {
        parts.push(`page=${page}`)
    }
    if (size !== null) {
        parts.push(`size=${size}`)
    }
    return parts.length > 0 ? `?${parts.join("&")}` : ""
}

export default defineEventHandler((event) => {
    // 1) 双斜杠规范化: 301 到单斜杠形态(保留其余 path 与 query), middleware return 短路
    //    后续 layer——静默改写 event._path/req.url 会被 h3 app 循环在进入下一 layer 前
    //    用入口捕获的原始 path 重置, 不可行(见文件头说明)
    if (event.path.startsWith("//")) {
        return sendRedirect(event, event.path.replace(/^\/+/, "/"), 301)
    }

    // 2) swr 页面缓存 key 治理: 覆写 originalUrl(cachedEventHandler 的 key 优先读它,
    //    该字段由 h3 初始化为原始 req.url 且不会被 app 循环重置), 不动 event.path/req.url
    //    ——渲染与水合所需的 query 语义完整保留.
    //    注意必须基于 originalUrl 自身(请求原始编码形态)重建: event.path 已被 h3 的
    //    _decodePath 解码(中文等非 ASCII 路径), 若用解码形态拼接, 同一路径的编码/解码
    //    形态会 hash 出两个不同缓存 key, 中文 slug 的分类/标签页将失去 query 变体共享
    const req = event.node.req as { originalUrl?: string }
    const rawUrl = req.originalUrl ?? ""
    const rawQueryIndex = rawUrl.indexOf("?")
    if (rawQueryIndex > 0) {
        const rawPathname = rawUrl.slice(0, rawQueryIndex)
        if (SWR_PAGE_RE.test(rawPathname)) {
            req.originalUrl = rawPathname + extractPaginationQuery(rawUrl.slice(rawQueryIndex + 1))
        }
    }
})
