/*
 * FilePath    : blog-client-nuxt\server\routes\robots.txt.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : 阶段 5: robots.txt(Sitemap 指向 + Disallow 管理/登录等)
 */

export default defineEventHandler((event) => {
    const config = useRuntimeConfig(event)
    const baseUrl = (config.public.baseUrl || "http://localhost:7364").replace(/\/$/, "")

    const content = [
        "User-agent: *",
        "Disallow: /admin",
        "Disallow: /login",
        "Disallow: /register",
        "Disallow: /checkout",
        "Disallow: /user-info",
        "Disallow: /setup",
        "Disallow: /md",
        "",
        `Sitemap: ${baseUrl}/sitemap.xml`,
        "",
    ].join("\n")

    setHeader(event, "content-type", "text/plain; charset=utf-8")
    return content
})
