/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-17 16:05:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-04 11:24:47
 * @FilePath     : \blog-client\src\components\hooks\useHome\index.ts
 * @Description  : 首页hooks
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { onBeforeMount, type Reactive, ref, watch } from "vue"
import { useRouter } from "vue-router"

import { type ViewPostRequest } from "@/api/post/view"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { type QueryParamsOptions } from "@/api/request"
import { type MonthArchiveData } from "@/components/common/month-archive"
import { usePagination } from "@/components/hooks/usePagination"

import { useGetData } from "./api"
import { useUtils } from "./utils"

export function useHome(
    queryParams: Reactive<ViewPostRequest>, // 查询参数
    options?: QueryParamsOptions<ViewPostRequest>,
) {
    const router = useRouter()

    const isShowPostListLoading = ref(false) // 是否显示文章列表加载中

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
        isBreadcrumbClick, // 是否点击面包屑
        breadcrumbItems, // 面包屑
        clickBreadcrumb, // 点击面包屑
        hasPaginationParamsInURL, // URL 中是否有分页参数
        updateRouterPush, // 更新查询参数和路由
        updateQueryParams, // 从URL中解析参数
        updateBreadcrumbItems, // 更新面包屑
        updatePageBreadcrumb, // 更新分页面包屑
        clearParamsExcept, // 清空除了指定参数的查询条件
        paginationBlockVisibleCount, // 分页块出现次数
        pageSizeTemp, // 临时每页显示条数
        reSetPaginationConf, // 重置分页配置
    } = useUtils(queryParams, options)

    /**
     * @description: 通过路由更新数据
     * @param isUpdateRouterPush 是否更新路由 默认 true 即更新路由
     */
    const updateByRoute = async (isUpdateRouterPush: boolean = true) => {
        // 更新路由
        if (isUpdateRouterPush) {
            await updateRouterPush()
        }

        reSetPaginationConf()
        await updateQueryParams()
        await updatePaginate()
        updateBreadcrumbFromPagination()
    }

    // 分页 hooks
    const { isRequest, updateIsRequest, updateCurrentPageWithIsRequest, updatePageSizeWithIsRequest, updatePaginateWithIsRequest } = usePagination(
        pagination,
        getPaginate,
        queryParams,
        updateByRoute,
        updateByRoute,
        updateRouterPush,
    )

    // 更新当前页
    const updateCurrentPage = async (val: number) => {
        await updateCurrentPageWithIsRequest(val)
    }

    // 更新每页显示条数
    const updatePageSize = async (val: number) => {
        await updatePageSizeWithIsRequest(val)
    }

    // 点击分类
    const clickCategory = (category: PostCategory) => {
        clearParamsExcept(["post_category_id"])
        queryParams.post_category_id = category.id
        updateByRoute()
    }

    // 点击标签
    const clickTag = (tag: PostTag) => {
        clearParamsExcept(["post_tag_id"])
        queryParams.post_tag_id = tag.id
        updateByRoute()
    }

    // 点击月份归档
    const clickMonthArchive = (row: MonthArchiveData) => {
        clearParamsExcept(["year", "month"])
        queryParams.year = row.year
        queryParams.month = row.month
        updateByRoute()
    }

    // 点击文章
    const handlePostId = (id: string) => {
        router.push({
            name: "post",
            params: { id },
        })
    }

    // 更新分页数据
    const updatePaginate = async () => {
        await updatePaginateWithIsRequest()
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
        () => isBreadcrumbClick.value,
        async (newVal) => {
            if (newVal) {
                await updateByRoute(false)

                // 重置面包屑点击状态
                isBreadcrumbClick.value = false
            }
        },
    )

    onBeforeMount(async () => {
        await updateByRoute(false)
        await getHostPost()
        await getRecommendedPost()
        await getPostCountByMonth()
    })

    return {
        pagination, // 分页数据
        updateCurrentPage, // 更新当前页
        updatePageSize, // 更新每页显示条数
        updatePaginate, // 更新分页数据
        updateRouterPush, // 更新查询参数和路由
        hotPost, // 热门文章
        recommendedPost, // 推荐文章
        monthArchiveProps, // 月份归档
        clickCategory, // 点击分类
        clickTag, // 点击标签
        clickMonthArchive, // 点击月份归档
        handlePostId, // 点击文章
        breadcrumbItems, // 面包屑
        clickBreadcrumb, // 点击面包屑
        paginationBlockVisibleChange, // 分页块显示次数变化
        isShowPostListLoading, // 是否显示文章列表加载中
    }
}
