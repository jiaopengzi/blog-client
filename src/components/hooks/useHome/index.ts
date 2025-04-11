/**
 * @FilePath     : \blog-client\src\components\hooks\useHome\index.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 首页 hooks
 */

export * from "./types"

import { storeToRefs } from "pinia"
import { type Reactive, ref } from "vue"

import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { type QueryParamsOptions } from "@/api/request"
import { type MonthArchiveData } from "@/components/common/month-archive"
import { EditorStateManager } from "@/components/editor"
import { usePagination } from "@/components/hooks/usePagination"
import { useBreadcrumbStore } from "@/stores/breadcrumb"
import { useStatusStore } from "@/stores/status"

import { useGetData } from "./api"
import type { ReqQuery } from "./types"
import { useUtils } from "./utils"

export function useHome(
    queryParams: Reactive<ReqQuery>, // 查询参数
) {
    // 字符串类型的key
    const stringKeys: StringKeys<ReqQuery>[] = [
        "post_author",
        "post_category_id",
        "post_category_slug",
        "post_tag_id",
        "post_tag_slug",
        "key_word",
        "pre_tags",
        "post_tags",
        "post_id",
    ]

    // 字符串类型的key
    const numberKeys: NumberKeys<ReqQuery>[] = ["year", "month", "current_page", "page_size"]

    // 不需要路由的key
    const noRouteKeys: (keyof ReqQuery)[] = ["highlight_fields", "pre_tags", "post_tags"]

    const highlightKey = "post_title" // 高亮的key

    const options: QueryParamsOptions<ReqQuery> = {
        stringKeys,
        numberKeys,
        noRouteKeys,
        highlight_fields: [highlightKey], // 高亮字段
        pre_tags: "<span class='highlight-title'>", // 高亮前缀
        post_tags: "</span>", // 高亮后缀
    }

    const isShowPostListLoading = ref(false) // 是否显示文章列表加载中
    const breadcrumbStore = useBreadcrumbStore()

    const statusStore = useStatusStore()
    const { showPostList, showSearchList, showPostDetail } = storeToRefs(statusStore)

    const manager = new EditorStateManager({ isRemoveFirstH1: true })
    const state = manager.getState()

    const {
        pagination, // 分页数据
        hotPost, // 热门文章
        recommendedPost, // 推荐文章
        monthArchiveProps, // 月份归档
        getHostPost, // 热门文章
        getRecommendedPost, // 推荐文章
        getPostCountByMonth, // 月份归档
        getPaginate, // 获取分页
        postMeta,
        getPostDetail,
    } = useGetData(manager, options)

    const {
        hasPaginationInURL, // URL 中是否有分页参数
        updateRouterPush, // 更新查询参数和路由
        updateQueryParams, // 从URL中解析参数
        clearParamsExcept, // 清空除了指定参数的查询条件
        paginationBlockVisibleCount, // 分页块出现次数
        pageSizeTemp, // 临时每页显示条数
        resetPaginationConf, // 重置分页配置
        generateBreadcrumbPath, // 生成面包屑路径
    } = useUtils(queryParams, options)

    // 通过路由更新数据
    const updateByRoute = async () => {
        resetPaginationConf()

        await updateQueryParams()

        if (showPostDetail.value) {
            await getPostDetail(queryParams)
        }

        if (showPostList.value || showSearchList.value) {
            await updatePaginate()
        }

        updateBreadcrumb()
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

    // 点击文章
    const clickPost = async (id: string) => {
        clearParamsExcept(["post_id"])
        queryParams.post_id = id
        await updateRouterPush()
    }

    // 点击作者
    const clickAuthorId = (val: string) => {
        console.log("============>author", val)
    }

    // 点击文章
    const editPost = (val: string) => {
        console.log("============>edit", val)
    }

    // 分页块显示次数变化
    const paginationBlockVisibleChange = async (visible: boolean) => {
        // 如果是关键字搜索则不请求
        if (queryParams.key_word) {
            return
        }

        // 如果分页块不可见 或者 URL 中有分页参数 或者 分页块显示次数超过 5 则不请求
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
    const updateBreadcrumb = () => {
        const { key_word, current_page, page_size, post_tag_slug, post_category_slug, year, month, post_id } = queryParams
        // 清空分页的 current_page 和 page_size 参数，保证生成面包屑路径正确
        queryParams.current_page = undefined
        queryParams.page_size = undefined

        // 解析关键字
        if (key_word) {
            breadcrumbStore.updateItems(key_word, generateBreadcrumbPath())
        }

        // 解析分类
        if (post_category_slug) {
            categoryLoop: for (const item of pagination.records) {
                for (const category of item.categories) {
                    if (category.slug === post_category_slug) {
                        breadcrumbStore.updateItems(category.name, generateBreadcrumbPath())
                        break categoryLoop
                    }
                }
            }
        }

        // 解析标签
        if (post_tag_slug) {
            tagLoop: for (const item of pagination.records) {
                for (const tag of item.tags) {
                    if (tag.slug === post_tag_slug) {
                        breadcrumbStore.updateItems(tag.name, generateBreadcrumbPath())
                        break tagLoop
                    }
                }
            }
        }

        // 解析年份和月份
        if (year) {
            // 先移除 month
            queryParams.month = undefined
            breadcrumbStore.updateItems(`${year}`, generateBreadcrumbPath())
        }
        if (month) {
            // 添加 month
            queryParams.month = month
            breadcrumbStore.updateItems(`${month}`, generateBreadcrumbPath(), false)
        }

        // 解析关键字
        if (post_id) {
            breadcrumbStore.updateItems(post_id, generateBreadcrumbPath())
        }

        // 清空面包屑
        if (!key_word && !post_category_slug && !post_tag_slug && !year && !month && !post_id) {
            breadcrumbStore.init()
        }

        // 更新页码面包屑前设置回原来的值
        queryParams.current_page = current_page
        queryParams.page_size = page_size

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

        // 文章详情
        clickPost, // 点击文章
        manager, // 详情页状态管理器
        state, // 编辑器状态
        postMeta, // 文章元数据
        clickAuthorId, // 点击作者
        editPost, // 编辑文章
        highlightKey, // 高亮的key
    }
}
