/*
 * FilePath    : blog-client-nuxt\src\composables\useSeo.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2026 by jiaopengzi, All Rights Reserved.
 * Description : SEO 层 composables (阶段 5: useHomeSeo / usePostSeo / useTaxonomySeo; 文章空壳 noindex)
 */

/*
 * 补充说明:
 * 参照旧 SPA head-tag (src/components/common/head-tag/index.vue) 的 meta 元素集合;
 * canonical 固定 public.baseUrl (不用请求 Host, 避免反向代理下 canonical 错乱);
 * 文章页附 JSON-LD Article、分类页附 BreadcrumbList
 */

import { storeToRefs } from "pinia"

import { getPostDisplayTime, type PostResByID } from "@/api/post/common"
import type { HeadProps } from "@/components/common/head-tag/types"
import { useOptionsStore } from "@/stores/options"

// 站点基准 URL (canonical/og:url/JSON-LD 使用; 生产环境由 NUXT_PUBLIC_BASE_URL 覆盖为正式域名)
const useBaseUrl = (): string => {
    const config = useRuntimeConfig()
    return config.public.baseUrl || "http://localhost:7364"
}

/**
 * resolveSeoImage 解析页面 SEO 分享图(feature01).
 * 优先级: 文章缩略图 → 站点配置 logo → 默认 logo(demo-logo.svg, 未配置 logo 时的最终兜底).
 * og:image 需要绝对地址, 相对路径统一以站点 baseUrl 兜底解析; 解析失败时原样返回候选值.
 * @param thumbnail 文章缩略图地址.
 * @param logo 站点配置的 logo 地址.
 * @param baseUrl 站点基准 URL.
 * @returns 解析后的 SEO 图片绝对地址, 无任何候选值时返回空字符串.
 */
export const resolveSeoImage = (thumbnail: string | undefined, logo: string | undefined, baseUrl: string): string => {
    const candidate = (thumbnail || logo || "/demo-logo.svg").trim()
    if (!candidate) {
        return ""
    }

    try {
        return new URL(candidate, baseUrl + "/").toString()
    } catch {
        return candidate
    }
}

// 按 SPA head-tag 的 meta 元素集合生成 meta 列表 (字段映射: seo_title 优先、缺失回退)
type SeoMeta = { name: string; content: string } | { property: string; content: string }

const buildHeadMeta = (head: HeadProps, baseUrl: string, siteLogo: string = ""): SeoMeta[] => {
    const metas: SeoMeta[] = []
    if (head.description) metas.push({ name: "description", content: head.description })
    if (head.keywords) metas.push({ name: "keywords", content: head.keywords })
    if (head.type) metas.push({ property: "og:type", content: head.type })
    if (head.locale) metas.push({ property: "og:locale", content: head.locale })
    if (head.title) metas.push({ property: "og:title", content: head.title })
    if (head.author) metas.push({ property: "og:author", content: head.author })
    // feature01: 默认使用文章缩略图, 缺失时回退主站 logo(再回退默认 logo)
    const seoImage = resolveSeoImage(head.image, siteLogo, baseUrl)
    if (seoImage) metas.push({ property: "og:image", content: seoImage })
    if (head.siteName) metas.push({ property: "og:site_name", content: head.siteName })
    if (head.description) metas.push({ property: "og:description", content: head.description })
    if (head.url) metas.push({ property: "og:url", content: head.url })
    else metas.push({ property: "og:url", content: baseUrl })
    if (head.releaseDate) metas.push({ property: "og:release_date", content: head.releaseDate })
    return metas
}

/**
 * @description: 首页 SEO (custom_home_title + separator + custom_home_subtitle 已在 optionsStore.formatHeadInfo 生成)
 * @returns 无返回值
 */
export const useHomeSeo = (): void => {
    const optionsStore = useOptionsStore()
    const { head } = storeToRefs(optionsStore)
    const baseUrl = useBaseUrl()
    const siteLogo = computed(() => optionsStore.getLogo)

    useHead({
        title: () => head.value.title || "",
        meta: () => buildHeadMeta(head.value, baseUrl, siteLogo.value),
        link: () => [{ rel: "canonical", href: `${baseUrl}/` }],
    })
}

/**
 * @description: 分类/标签页 SEO (title 含分类/标签 slug, 附 BreadcrumbList JSON-LD)
 * @param kind taxonomy 类型 (category/tag)
 * @param slug 路径 slug (URL 转义形态)
 * @returns 无返回值
 */
export const useTaxonomySeo = (kind: "category" | "tag", slug: string): void => {
    const optionsStore = useOptionsStore()
    const { head } = storeToRefs(optionsStore)
    const baseUrl = useBaseUrl()
    const displaySlug = computed(() => decodeURIComponent(slug))
    const pageTitle = computed(() => `${displaySlug.value} | ${head.value.siteName ?? head.value.title ?? "焦棚子"}`)
    const pageUrl = computed(() => `${baseUrl}/${kind}/${encodeURIComponent(slug)}`)
    const siteLogo = computed(() => optionsStore.getLogo)

    useHead({
        title: () => pageTitle.value,
        meta: () => [
            ...buildHeadMeta(head.value, baseUrl, siteLogo.value).filter((m) => !("property" in m && (m.property === "og:title" || m.property === "og:url"))),
            { property: "og:title", content: pageTitle.value },
            { property: "og:url", content: pageUrl.value },
        ],
        link: () => [{ rel: "canonical", href: pageUrl.value }],
        script: () =>
            kind === "category"
                ? [
                      {
                          type: "application/ld+json",
                          innerHTML: JSON.stringify({
                              "@context": "https://schema.org",
                              "@type": "BreadcrumbList",
                              itemListElement: [
                                  { "@type": "ListItem", position: 1, name: "首页", item: `${baseUrl}/` },
                                  { "@type": "ListItem", position: 2, name: displaySlug.value, item: pageUrl.value },
                              ],
                          }),
                      },
                  ]
                : [],
    })
}

/**
 * @description: 归档页 SEO (年份 / 年月; title 为 归档: 2026年8月 | 主站主标题, 附 BreadcrumbList JSON-LD)
 * @param year 年份 (路径参数)
 * @param month 月份 (可选, 年月归档页传入)
 * @returns 无返回值
 */
export const useArchiveSeo = (year: string, month?: string): void => {
    const optionsStore = useOptionsStore()
    const { head } = storeToRefs(optionsStore)
    const baseUrl = useBaseUrl()

    const label = computed(() => (month ? `${year}年${month}月` : `${year}年`))
    const pageTitle = computed(() => `归档：${label.value} | ${head.value.siteName ?? "焦棚子"}`)
    const pageUrl = computed(() => `${baseUrl}/year/${year}${month ? `/month/${month}` : ""}`)
    const siteLogo = computed(() => optionsStore.getLogo)

    useHead({
        title: () => pageTitle.value,
        meta: () => [
            ...buildHeadMeta(head.value, baseUrl, siteLogo.value).filter((m) => !("property" in m && (m.property === "og:title" || m.property === "og:url"))),
            { property: "og:title", content: pageTitle.value },
            { property: "og:url", content: pageUrl.value },
        ],
        link: () => [{ rel: "canonical", href: pageUrl.value }],
        script: () => [
            {
                type: "application/ld+json",
                innerHTML: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "BreadcrumbList",
                    itemListElement: [
                        { "@type": "ListItem", position: 1, name: "首页", item: `${baseUrl}/` },
                        { "@type": "ListItem", position: 2, name: label.value, item: pageUrl.value },
                    ],
                }),
            },
        ],
    })
}

/**
 * @description: 搜索页 SEO (/s/:keyword, 纯 CSR; title 为 搜索: 关键字 | 主站主标题)
 * @param keyword 搜索关键字 (路由参数, 已解码形态)
 * @returns 无返回值
 */
export const useSearchSeo = (keyword: string): void => {
    const optionsStore = useOptionsStore()
    const { head } = storeToRefs(optionsStore)
    const baseUrl = useBaseUrl()

    const pageTitle = computed(() => `搜索：${keyword} | ${head.value.siteName ?? "焦棚子"}`)
    const pageUrl = computed(() => `${baseUrl}/s/${encodeURIComponent(keyword)}`)
    const siteLogo = computed(() => optionsStore.getLogo)

    useHead({
        title: () => pageTitle.value,
        meta: () => [
            ...buildHeadMeta(head.value, baseUrl, siteLogo.value).filter((m) => !("property" in m && (m.property === "og:title" || m.property === "og:url"))),
            { property: "og:title", content: pageTitle.value },
            { property: "og:url", content: pageUrl.value },
        ],
        link: () => [{ rel: "canonical", href: pageUrl.value }],
    })
}

/**
 * @description: 文章详情页 SEO (seo_title 优先回退 post_title; 附 JSON-LD Article)
 * @param post 文章元数据 (SSR 经 view-by-id-without-content 获取, 无正文)
 * @returns 无返回值
 */
export const usePostSeo = (post: () => PostResByID | null | undefined): void => {
    const baseUrl = useBaseUrl()
    const optionsStore = useOptionsStore()
    // feature01: SEO 分享图回退链 (文章缩略图 → 站点 logo → 默认 logo)
    const siteLogo = computed(() => optionsStore.getLogo)

    const seoTitle = computed(() => {
        const p = post()
        return p?.seo_title || p?.post_title || "文章"
    })
    const pageUrl = computed(() => `${baseUrl}/p/${post()?.id ?? ""}`)
    const displayTime = computed(() => {
        const p = post()
        if (!p) return ""
        return getPostDisplayTime({ created_at: p.created_at, post_push_time: p.post_push_time })
    })

    useHead({
        title: () => `${seoTitle.value} | 焦棚子`,
        meta: () => {
            const p = post()
            // bug02(260903-02): 详情空壳(私密/不存在/取数失败)已由 SSR 404 改为 200 壳 + 客户端复检,
            // 此处以 noindex 阻断收录, 对齐原 404 的 SEO 效果 (私密不外泄, 死链不建索引)
            if (!p) return [{ name: "robots", content: "noindex, nofollow" }]
            return buildHeadMeta(
                {
                    title: seoTitle.value,
                    description: p.seo_description || "",
                    keywords: p.seo_keywords || "",
                    type: "article",
                    locale: "zh-CN",
                    author: p.author_info?.user_display_name || "jiaopengzi",
                    // feature01: 默认使用文章缩略图, 缺失时回退主站 logo(buildHeadMeta 内统一解析)
                    image: p.thumbnail || "",
                    siteName: "焦棚子",
                    url: pageUrl.value,
                    releaseDate: displayTime.value,
                },
                baseUrl,
                siteLogo.value,
            )
        },
        link: () => [{ rel: "canonical", href: pageUrl.value }],
        script: () => {
            const p = post()
            if (!p) return []
            return [
                {
                    type: "application/ld+json",
                    innerHTML: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Article",
                        headline: seoTitle.value,
                        datePublished: p.created_at || "",
                        dateModified: p.updated_at || "",
                        author: { "@type": "Person", name: p.author_info?.user_display_name || "jiaopengzi" },
                        // feature01: JSON-LD 图片与 og:image 使用同一回退链
                        image: resolveSeoImage(p.thumbnail, siteLogo.value, baseUrl),
                        url: pageUrl.value,
                    }),
                },
            ]
        },
    })
}
