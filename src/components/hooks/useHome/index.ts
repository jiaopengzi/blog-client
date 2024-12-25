/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-17 16:05:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-25 17:51:56
 * @FilePath     : \blog-client\src\components\hooks\useHome\index.ts
 * @Description  : 首页hooks
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { watch, onBeforeMount, ref, type Reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { type ViewPostRequest } from "@/api/post/view"
import { type MonthArchiveData } from "@/components/common/month-archive"
import type { Options } from "./types"
import { useUtils } from "./utils"
import { useGetData } from "./api"

export function useHome(
    queryParams: Reactive<ViewPostRequest>, // 查询参数
    options?: Options<ViewPostRequest>,
) {
    const route = useRoute()
    const router = useRouter()

    const isShowPostListLoading = ref(false) // 是否显示文章列表加载中

    const {
        pagination, // 分页数据
        hotPost, // 热门文章
        recommendedPost, // 推荐文章
        monthArchiveProps, // 月份归档
        updatePaginate, // 更新分页内容
        getHostPost, // 热门文章
        getRecommendedPost, // 推荐文章
        getPostCountByMonth, // 月份归档
        getPaginate, // 获取分页
        isRequest, // 是否请求
    } = useGetData(queryParams, options)

    const {
        breadcrumbItems, // 面包屑
        hasPaginationParamsInURL, // URL 中是否有分页参数
        updateQueryParamsAndRouter, // 更新查询参数和路由
        parseParamsFromURL, // 从URL中解析参数
        updateIsRequest, // 更新不请求标志
        updateBreadcrumbItems, // 更新面包屑
        updatePageBreadcrumb, // 更新分页面包屑
        clearParamsExcept, // 清空除了指定参数的查询条件
        paginationBlockVisibleCount, // 分页块出现次数
        pageSizeTemp, // 临时每页显示条数
        reSetPaginationConf, // 重置分页配置
    } = useUtils(pagination, isRequest, queryParams, options)

    // 更新当前页
    const updateCurrentPage = (val: number) => {
        updateIsRequest({ newPageSize: pagination.page_size, newCurrentPage: val })
        queryParams.current_page = val
        updateQueryParamsAndRouter()
    }

    // 更新每页显示条数
    const updatePageSize = (val: number) => {
        updateIsRequest({ newPageSize: val, newCurrentPage: pagination.current_page })
        queryParams.page_size = val
        updateQueryParamsAndRouter()
    }

    // 点击分类
    const clickCategory = (category: PostCategory) => {
        clearParamsExcept(["post_category_id"])
        queryParams.post_category_id = category.id
        updateQueryParamsAndRouter()
    }

    // 点击标签
    const clickTag = (tag: PostTag) => {
        clearParamsExcept(["post_tag_id"])
        queryParams.post_tag_id = tag.id
        updateQueryParamsAndRouter()
    }

    // 点击月份归档
    const clickMonthArchive = (row: MonthArchiveData) => {
        clearParamsExcept(["year", "month"])
        queryParams.year = row.year
        queryParams.month = row.month
        updateQueryParamsAndRouter()
    }

    // 点击文章
    const handlePostId = (id: string) => {
        router.push({
            name: "post",
            params: { id },
        })
    }

    // 分页块显示次数变化
    const paginationBlockVisibleChange = async (visible: boolean) => {
        // 如果分页块不可见 或者 URL 中有分页参数 或者 分页块显示次数超过 5 则不请求
        if (!visible || hasPaginationParamsInURL.value || paginationBlockVisibleCount.value >= 5) {
            return
        }

        // 累加分页块显示次数
        paginationBlockVisibleCount.value++

        // 构造后续数据请求
        const req = {
            ...queryParams,
            current_page: paginationBlockVisibleCount.value,
        }

        // 更新不请求标志
        updateIsRequest({ newPageSize: req.page_size, newCurrentPage: req.current_page })

        if (!isRequest.value) {
            isRequest.value = true
            isShowPostListLoading.value = false
            return
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
        isRequest.value = true
        isShowPostListLoading.value = false
    }

    // 从 pagination.records 中解析参数并更新面包屑
    const updateBreadcrumbFromPagination = () => {
        const { current_page, page_size, post_tag_id, post_category_id, year, month } = queryParams
        // 清空分页的 current_page 和 page_size 参数，保证生成面包屑路径正确
        queryParams.current_page = undefined
        queryParams.page_size = undefined

        // 解析分类
        if (post_category_id) {
            categoryLoop: for (const item of pagination.records) {
                for (const category of item.categories) {
                    if (category.id === post_category_id) {
                        updateBreadcrumbItems(category.name)
                        break categoryLoop
                    }
                }
            }
        }

        // 解析标签
        if (post_tag_id) {
            tagLoop: for (const item of pagination.records) {
                for (const tag of item.tags) {
                    if (tag.id === post_tag_id) {
                        updateBreadcrumbItems(tag.name)
                        break tagLoop
                    }
                }
            }
        }

        // 解析年份和月份
        if (year) {
            // 先移除 month
            queryParams.month = undefined
            updateBreadcrumbItems(`${year}`)
        }
        if (month) {
            // 添加 month
            queryParams.month = month
            updateBreadcrumbItems(`${month}`, false)
        }

        if (!post_category_id && !post_tag_id && !year && !month) {
            // 清空面包屑
            breadcrumbItems.length = 0
        }

        // 更新页码面包屑前设置回原来的值
        queryParams.current_page = current_page
        queryParams.page_size = page_size

        updatePageBreadcrumb()
    }

    watch(
        () => route.fullPath,
        async () => {
            reSetPaginationConf()
            parseParamsFromURL()
            await updatePaginate()
            updateBreadcrumbFromPagination()
        },
    )

    onBeforeMount(async () => {
        // 获取路由参数 并更新 query
        parseParamsFromURL()
        await updatePaginate()
        updateBreadcrumbFromPagination()
        await getHostPost()
        await getRecommendedPost()
        await getPostCountByMonth()
    })

    return {
        pagination, // 分页数据
        updateCurrentPage, // 更新当前页
        updatePageSize, // 更新每页显示条数
        updatePaginate, // 更新分页数据
        updateQueryParamsAndRouter, // 更新查询参数和路由
        hotPost, // 热门文章
        recommendedPost, // 推荐文章
        monthArchiveProps, // 月份归档
        clickCategory, // 点击分类
        clickTag, // 点击标签
        clickMonthArchive, // 点击月份归档
        handlePostId, // 点击文章
        breadcrumbItems, // 面包屑
        paginationBlockVisibleChange, // 分页块显示次数变化
        isShowPostListLoading, // 是否显示文章列表加载中
    }
}
