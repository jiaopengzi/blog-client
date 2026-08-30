/*
 * FilePath    : blog-client-nuxt\src\components\hooks\useHome\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 首页 hooks
 */

export * from "./types"

import { storeToRefs } from "pinia"
import { type Reactive, ref } from "vue"

import { type ViewPostRequest } from "@/api/post/view"
import type { PostResPagination } from "@/api/post/common"
import type { Pagination } from "@/api/response"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { viewPostTagTopNAPI } from "@/api/postTag/viewPostTagTopN"
import { ResponseCode } from "@/api/response"
import { type QueryParamsOptions } from "@/api/request"
import { type MonthArchiveData } from "@/components/common/month-archive"
import { usePagination } from "@/components/hooks/usePagination"
import { useBreadcrumbStore } from "@/stores/breadcrumb"
import { useStatusStore } from "@/stores/status"

import { useRootUtils } from "../useRootUtils"
import { useGetData } from "./api"
import { useUtils } from "./utils"

export function useHome(
    queryParams: Reactive<ViewPostRequest>, // 查询参数
) {
    // 字符串类型的 key
    const stringKeys: StringKeys<ViewPostRequest>[] = [
        "post_author",
        "post_category_id",
        "post_category_slug",
        "post_tag_id",
        "post_tag_slug",
        "key_word",
        "pre_tags",
        "post_tags",
    ]

    // 数字类型的 key
    const numberKeys: NumberKeys<ViewPostRequest>[] = ["year", "month", "current_page", "page_size"]

    // 不需要路由同步的 key
    const noRouteKeys: (keyof ViewPostRequest)[] = ["highlight_fields", "pre_tags", "post_tags"]

    const highlightKey = "post_title" // 高亮的 key

    const options: QueryParamsOptions<ViewPostRequest> = {
        stringKeys,
        numberKeys,
        noRouteKeys,
        // Nuxt 适配: /category/[slug]、/tag/[slug]、/year/[year]/month/[month] 注入的筛选参数在路由同步时保留
        // key_word: /s/[keyword] 搜索页由路径段注入, updateQueryParams 清空时保留
        persistKeys: ["post_category_slug", "post_tag_slug", "year", "month", "key_word"],
        highlight_fields: [highlightKey], // 高亮字段
        pre_tags: "<span class='highlight-title'>", // 高亮前缀
        post_tags: "</span>", // 高亮后缀
    }

    const isShowPostListLoading = ref(false) // 是否显示文章列表加载中
    const breadcrumbStore = useBreadcrumbStore()

    const statusStore = useStatusStore()
    const { isShowPostList, isShowSearchList } = storeToRefs(statusStore)

    const {
        pagination, // 分页数据
        hotPost, // 热门文章
        recommendedPost, // 推荐文章
        monthArchiveProps, // 月份归档
        getHostPost, // 热门文章
        getRecommendedPost, // 推荐文章
        getPostCountByMonth, // 月份归档
        getPaginate, // 获取分页
    } = useGetData(options)

    const {
        hasPaginationInURL, // URL 中是否有分页参数
        updateRouterPush, // 更新查询参数和路由
        updateQueryParams, // 从URL中解析参数
        clearParamsExcept, // 清空除了指定参数的查询条件
        generateBreadcrumbPath, // 生成面包屑路径
    } = useRootUtils(queryParams, options)

    const {
        paginationBlockVisibleCount, // 分页块出现次数
        pageSizeTemp, // 临时每页显示条数
        resetPaginationConf, // 重置分页配置
    } = useUtils()

    // 通过路由更新数据
    // @param skipPaginate 是否跳过列表分页请求(feature01: 匿名首屏已有 SSR 数据时仅补面包屑/查询参数, 避免重复请求)
    const updateByRoute = async (skipPaginate: boolean = false) => {
        // bugfix(260825-02 bug03): 后端 /post/view 对匿名与登录态返回不同的记录集与排序
        // (登录态含 "多内容测试" 等记录, "置顶文章" 排位也不同). SPA 由 auth 中间件在首帧渲染前
        // await initStores, 首屏列表请求即为登录态; Nuxt 为修复 hydration mismatch 将 initStores
        // 推迟到水合完成后, 首屏列表请求先于登录态完成, 拿到匿名态排序, 站内导航回到首页时
        // 又变为登录态排序, 表现为列表顺序不稳定. 首次拉取前等待共享 initStores 完成,
        // 与 SPA 语义对齐; initStores 完成后该 Promise 立即 resolve, 后续导航无额外开销
        if (import.meta.client) {
            try {
                const { getInitStoresPromise } = await import("@/stores/init")
                await getInitStoresPromise()
            } catch {
                // initStores 异常不阻塞列表加载(与 init-stores.client 插件容错语义一致)
            }
        }

        resetPaginationConf()

        await updateQueryParams()

        if (!skipPaginate && (isShowPostList.value || isShowSearchList.value)) {
            await updatePaginate()
        }

        await updateBreadcrumb()
    }

    /**
     * getListDataForSsr 获取 SSR 首屏列表数据(feature01, 02-plan).
     * 复刻 updateByRoute 的取数链路(解析 URL 查询参数 + 分页请求), 但不等待客户端 initStores,
     * 不更新面包屑(面包屑 store 不注水, 由客户端水合后 updateByRoute 补写).
     * @returns 分页数据; 非列表展示态返回 null.
     */
    const getListDataForSsr = async (): Promise<Pagination<PostResPagination> | null> => {
        resetPaginationConf()

        await updateQueryParams()

        if (isShowPostList.value || isShowSearchList.value) {
            return await getPaginate({ ...queryParams })
        }

        return null
    }

    // 分页 hooks
    const { updateCurrentPage, updatePageSize, updatePaginate } = usePagination(pagination, getPaginate, queryParams, updateRouterPush)

    // 点击分类
    const clickCategory = async (category: PostCategory) => {
        clearParamsExcept(["post_category_slug"])
        queryParams.post_category_slug = category.slug
        await updateRouterPush()
    }

    // 点击标签
    const clickTag = async (tag: PostTag) => {
        clearParamsExcept(["post_tag_slug"])
        queryParams.post_tag_slug = tag.slug
        await updateRouterPush()
    }

    // 点击月份归档
    const clickMonthArchive = async (row: MonthArchiveData) => {
        clearParamsExcept(["year", "month"])
        queryParams.year = row.year
        queryParams.month = row.month
        await updateRouterPush()
    }

    // 分页块显示次数变化
    const paginationBlockVisibleChange = async (visible: boolean) => {
        // 如果是关键字搜索则不请求
        if (queryParams.key_word) {
            return
        }

        // 如果分页块不可见, 或 URL 中有分页参数, 或分页块显示次数超过 5, 则不请求
        if (!visible || hasPaginationInURL.value || paginationBlockVisibleCount.value >= 5) {
            return
        }

        // 累加分页块显示次数
        paginationBlockVisibleCount.value++

        // 构造后续数据请求
        const req = {
            ...queryParams,
            current_page: paginationBlockVisibleCount.value,
        }

        isShowPostListLoading.value = true

        const data = await getPaginate(req)

        // 更新分页数据
        if (data.records.length > 0) {
            pagination.records.push(...data.records) // 追加数据
            pageSizeTemp.value += 10 // 每页显示条数增加 10
            pagination.page_size = pageSizeTemp.value // 更新每页显示条数
            pagination.page_count = Math.ceil(pagination.total / pagination.page_size) // 更新总页数
        }

        // 恢复状态
        isShowPostListLoading.value = false
    }

    // 更新面包屑
    const updateBreadcrumb = async () => {
        const { key_word, current_page, post_tag_slug, post_category_slug, year, month } = queryParams

        // 解析关键字
        if (key_word) {
            breadcrumbStore.updateItems(key_word, generateBreadcrumbPath())
        }

        // 解析分类
        if (post_category_slug) {
            categoryLoop: for (const item of pagination.records) {
                for (const category of item.categories ?? []) {
                    if (category.slug === post_category_slug) {
                        breadcrumbStore.updateItems(category.name, generateBreadcrumbPath())
                        break categoryLoop
                    }
                }
            }
        }

        // 解析标签
        if (post_tag_slug) {
            let tagFound = false
            tagLoop: for (const item of pagination.records) {
                for (const tag of item.tags ?? []) {
                    if (tag.slug === post_tag_slug) {
                        breadcrumbStore.updateItems(tag.name, generateBreadcrumbPath())
                        tagFound = true
                        break tagLoop
                    }
                }
            }
            // 后端 view 记录仅回传部分标签, 命中标签可能不在 records 的 tags 中 (如中文标签):
            // 依次用 标签 topN 与 slug 本身兜底面包屑名称 (topN 仅前 10, 任意标签最终以 slug 兜底)
            if (!tagFound) {
                const topNName = await viewPostTagTopNAPI().then((res) => {
                    if (res.data.code === ResponseCode.PostTagViewTopNSuccess) {
                        const hit = (res.data.data ?? []).find((tag) => tag.slug === post_tag_slug)
                        if (hit) return hit.name
                    }
                    return ""
                })
                breadcrumbStore.updateItems(topNName || post_tag_slug, generateBreadcrumbPath())
            }
        }

        // 解析年份和月份 (阶段 3 新方案: 年 crumb → /year/:year, 月 crumb → /year/:year/month/:month)
        if (year) {
            // 先移除 month
            queryParams.month = void 0
            breadcrumbStore.updateItems(`${year}`, generateBreadcrumbPath("year"))
        }
        if (month) {
            // 添加 month
            queryParams.month = month
            breadcrumbStore.updateItems(`${month}`, generateBreadcrumbPath("month"), false)
        }

        // 清空面包屑
        if (!key_word && !post_category_slug && !post_tag_slug && !year && !month) {
            breadcrumbStore.init()
        }

        if (current_page === undefined || current_page === null || current_page <= 0) {
            return
        }
        breadcrumbStore.updatePage(current_page)
    }

    return {
        pagination, // 分页数据
        updateCurrentPage, // 更新当前页
        updatePageSize, // 更新每页显示条数
        updatePaginate, // 更新分页数据
        updateRouterPush, // 更新查询参数和路由
        updateByRoute, // 通过路由更新数据
        hotPost, // 热门文章
        recommendedPost, // 推荐文章
        monthArchiveProps, // 月份归档
        getHostPost, // 热门文章
        getRecommendedPost, // 推荐文章
        getPostCountByMonth, // 月份归档
        clickCategory, // 点击分类
        clickTag, // 点击标签
        clickMonthArchive, // 点击月份归档
        paginationBlockVisibleChange, // 分页块显示次数变化
        isShowPostListLoading, // 是否显示文章列表加载中
        clearParamsExcept, // 清空除了指定参数的查询条件
        highlightKey, // 高亮的 key
        getPaginate, // 分页请求函数(feature01: SSR 首屏取数复用)
        getListDataForSsr, // SSR 首屏列表取数(feature01: 服务端直出列表)
    }
}
