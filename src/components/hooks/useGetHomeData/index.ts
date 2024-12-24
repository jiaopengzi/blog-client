/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-17 16:05:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-25 00:01:20
 * @FilePath     : \blog-client\src\components\hooks\useGetHomeData\index.ts
 * @Description  : 首页数据获取
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { reactive, watch, onBeforeMount, ref, type Reactive } from "vue"
import type { AxiosPromise } from "axios"
import { useRoute, useRouter } from "vue-router"
import {
    type Pagination,
    type NumberKeys,
    PaginationParamsInURL,
    getEmptyPagination,
} from "@/components/common"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { ResponseCode, type Res } from "@/api/responseCode"
import { viewPostAPI, type ViewPostRequest } from "@/api/post/view"
import { viewHotPostAPI } from "@/api/post/viewHotPost"
import { viewRecommendedPostAPI } from "@/api/post/viewRecommendedPost"
import { getPostCountByMonthAPI } from "@/api/post/getPostCountByMonth"
import { type MonthArchiveData } from "@/components/common/month-archive"
import type { PostResPagination, PostResCommon } from "@/api/post/common"

export type QueryRecord<T extends string | number | symbol> = { [key in T]?: string | number }

export interface BreadcrumbItem {
    display: string // 显示的文字
    to: string // 跳转的路由
}

export interface Options<K> {
    queryNumberParams?: NumberKeys<K>[] // 查询参数中的数字参数
    noRequest?: QueryRecord<keyof K> // 不请求的参数值比如全部,只显示在路由中，不请求.
}

export function useGetHomeData(
    queryParams: Reactive<ViewPostRequest>, // 查询参数
    options?: Options<ViewPostRequest>,
) {
    const route = useRoute()
    const router = useRouter()

    const pagination =
        reactive<Pagination<PostResPagination>>(getEmptyPagination<PostResPagination>()) // 分页数据

    const breadcrumbItems = reactive<BreadcrumbItem[]>([]) // 面包屑
    const hotPost = reactive<PostResCommon[]>([]) // 热门文章
    const recommendedPost = reactive<PostResCommon[]>([]) // 推荐文章
    const monthArchiveProps = reactive<MonthArchiveData[]>([]) // 月份归档
    const stopWatchFlag = ref(false) // 停止监听标志
    const paginationBlockVisibleCount = ref(0) // 分页块出现次数
    const hasPaginationParamsInURL = ref(false) // URL 中是否有分页参数
    const noRequest = ref(false) // 不请求标志

    // 类型别名 KeyType 为 queryParams 的 key
    type KeyType = keyof ViewPostRequest

    const paginationParamSet = new Set<string>(Object.values(PaginationParamsInURL))
    const numberParamSet = new Set<string>(Object.values(PaginationParamsInURL))
    // 如果 options.queryNumberParams 不为空 将 options.queryNumberParams key 增加到 numberParamSet 中
    if ((options?.queryNumberParams?.length ?? 0) > 0) {
        options?.queryNumberParams?.forEach((key) => {
            numberParamSet.add(key || "")
        })
    }

    // 更新查询参数
    const updateQueryParamsAndRouter = (isUpdateRouter: boolean = true) => {
        if (!queryParams.key_word) {
            delete queryParams.key_word
        }

        // 判断是否更新路由
        if (isUpdateRouter) {
            router.push({
                name: "home",
                query: queryParams,
            })
        }
    }

    // 从URL中解析参数
    const parseParamsFromURL = () => {
        // 清空 queryParams
        Object.keys(queryParams).forEach((key) => delete queryParams[key as KeyType])

        // 判断路由中是否有参数
        const queryUrl = router.currentRoute.value.query
        // 如果 queryUrl 不为空 则将 queryUrl 赋值给 query
        if (Object.keys(queryUrl).length) {
            // 赋值给到 query, 如果 key 对应的值能解析为数字则解析为数字
            for (const key in queryUrl) {
                // 判断是否有分页参数
                if (paginationParamSet.has(key)) {
                    hasPaginationParamsInURL.value = true
                }

                const value = queryUrl[key]
                if (value !== undefined && value !== null) {
                    // 判断 key 是否在 numberParamSet 中，如果在则解析为数字，否则保持原样
                    if (numberParamSet.has(key)) {
                        ;(queryParams as any)[key as KeyType] = Number(value)
                    } else {
                        ;(queryParams as any)[key as KeyType] = value as string
                    }
                }
            }
        } else {
            hasPaginationParamsInURL.value = false
        }
    }

    // 更新分页内容
    const updatePaginate = async (): Promise<void> => {
        if (noRequest.value) {
            noRequest.value = false
            return
        }
        const data = await getPaginate(queryParams)
        Object.assign(pagination, data)
    }

    // 更新当前页
    const updateCurrentPage = (val: number) => {
        queryParams.current_page = val
        updateQueryParamsAndRouter()
    }

    // 更新每页显示条数
    const updatePageSize = (val: number) => {
        // 判断是是否已经超过了总条数
        const isMaxPageSizeOld = pagination.total < pagination.page_size * pagination.current_page
        const isMaxPageSizeNew = pagination.total < val * pagination.current_page
        noRequest.value = isMaxPageSizeOld && isMaxPageSizeNew
        queryParams.page_size = val
        updateQueryParamsAndRouter()
    }

    // 获取分页
    async function getPaginate(req: ViewPostRequest): Promise<Pagination<PostResPagination>> {
        // 遍历 options.NoRequest 中的参数，如果 req 中的参数值等于 options.NoRequest 中的值则删除,不请求
        for (const key in options?.noRequest) {
            if (key in req && req[key as KeyType] === options.noRequest[key as KeyType]) {
                delete req[key as KeyType]
            }
        }

        // 获取标签列表
        const res = await viewPostAPI(req)
        if (res.data.code === ResponseCode.PostViewSuccess) {
            return res.data.data
        }
        return getEmptyPagination<PostResPagination>()
    }

    // 通用返回为 PostResCommon[] 的 API
    const getPostResCommons = async (
        apiFunc: () => AxiosPromise<Res<PostResCommon[]>>,
        targetArray: PostResCommon[],
        successCode: number,
    ) => {
        const res = await apiFunc()
        if (res.data.code === successCode) {
            Object.assign(targetArray, res.data.data)
        }
    }

    // 热门文章
    const getHostPost = async () => {
        await getPostResCommons(viewHotPostAPI, hotPost, ResponseCode.PostViewHotSuccess)
    }

    // 推荐文章
    const getRecommendedPost = async () => {
        await getPostResCommons(
            viewRecommendedPostAPI,
            recommendedPost,
            ResponseCode.PostViewRecommendedSuccess,
        )
    }

    // 推荐文章
    async function getPostCountByMonth() {
        // 获取标签列表
        const res = await getPostCountByMonthAPI()
        if (res.data.code === ResponseCode.PostCountByMonthSuccess) {
            // 清空现有的 monthArchiveProps
            monthArchiveProps.length = 0
            // 遍历 res.data.data 并更新 monthArchiveProps
            res.data.data.forEach((item) => {
                // 创建新的对象并添加 year_month 字段
                const newItem = {
                    ...item,
                    year_month: `${item.year}-${item.month}`,
                }
                // 将 newItem 添加到 monthArchiveProps
                monthArchiveProps.push(newItem)
            })

            // 按照 year 和 month 进行降序排序
            monthArchiveProps.sort((a, b) => {
                if (a.year !== b.year) {
                    return b.year - a.year // 年份降序
                }
                return a.month - b.month // 月份降序
            })
        }
    }

    // 清空查询参数中的特定字段
    const clearParamsExcept = (fieldsToKeep: JpzOptionalKeys<ViewPostRequest>[]) => {
        const keysToClear: JpzOptionalKeys<ViewPostRequest>[] = [
            "key_word",
            "year",
            "month",
            "post_author",
            "post_category_id",
            "post_tag_id",
        ]

        keysToClear.forEach((key) => {
            if (!fieldsToKeep.includes(key)) {
                delete queryParams[key as KeyType]
            }
        })
    }

    // 生成面包屑路径
    const generateBreadcrumbPath = () => {
        return router.resolve({
            name: "home",
            query: queryParams,
        }).href
    }

    // 生成面包屑路径
    const updateBreadcrumbItems = (text: string, isClear: boolean = true) => {
        // 清空面包屑
        if (isClear) {
            breadcrumbItems.length = 0
        }

        // 更新面包屑
        const breadcrumbItem: BreadcrumbItem = {
            display: text,
            to: generateBreadcrumbPath(),
        }

        breadcrumbItems.push(breadcrumbItem)
    }

    // 点击分类
    const clickCategory = (category: PostCategory) => {
        // 清空其他查询条件
        clearParamsExcept(["post_category_id"])
        queryParams.post_category_id = category.id
        updateQueryParamsAndRouter()
        updateBreadcrumbItems(category.name)
    }

    // 点击标签
    const clickTag = (tag: PostTag) => {
        // 清空其他查询条件
        clearParamsExcept(["post_tag_id"])
        queryParams.post_tag_id = tag.id
        updateQueryParamsAndRouter()
        updateBreadcrumbItems(tag.name)
    }

    // 点击月份归档
    const clickMonthArchive = (row: MonthArchiveData) => {
        // 清空其他查询条件
        clearParamsExcept(["year", "month"])
        queryParams.year = row.year
        updateBreadcrumbItems(`${row.year}`)
        queryParams.month = row.month
        updateBreadcrumbItems(`${row.month}`, false)
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
        if (!visible) {
            return
        }

        // 如果 URL 中有分页参数则不请求
        if (hasPaginationParamsInURL.value) {
            return
        }

        // 累加分页块显示次数
        paginationBlockVisibleCount.value++

        // 分页块显示次数超过 5 则不请求
        if (paginationBlockVisibleCount.value >= 5) {
            return
        }

        // 构造后续数据请求
        const req = {
            ...queryParams,
            current_page: paginationBlockVisibleCount.value,
        }

        // 超过请记录数则不请求
        if (pagination.total < req.current_page * (req.page_size || 10)) {
            return
        }

        const data = await getPaginate(req)
        // 将 data.records 追加到 pagination.records 中
        pagination.records.push(...data.records)

        // 更新分页信息
        if (data.records.length > 0) {
            pagination.page_size += 10
            pagination.page_count = Math.ceil(pagination.total / pagination.page_size)
        }
    }

    // 从 pagination.records 中解析参数并更新面包屑
    const updateBreadcrumbFromPagination = () => {
        const { current_page, page_size, post_tag_id, post_category_id, year, month } = queryParams
        // 设置默认页码为 1,在最后设置页码的面包屑的时候再设置为原来的值，为了其他靠前的面包屑能够正常跳转到默认页码
        if (current_page && current_page > 1) {
            queryParams.current_page = 1
        }
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
        // 解析分页
        if (current_page && page_size) {
            pagination.current_page = current_page as number
            pagination.page_size = page_size as number
            // 当 current_page 为 1 时不显示
            if (current_page !== 1) {
                queryParams.current_page = current_page
                updateBreadcrumbItems(`第 ${current_page} 页`, false)
            }
        }
        if (stopWatchFlag.value) {
            stopParseParams()
            stopWatchFlag.value = false
        }
    }

    // 当 pagination.records 有数据时，解析 params,只需要执行一次
    const { stop: stopParseParams } = watch(
        () => pagination.records.length,
        (newVal) => {
            if (newVal > 0) {
                stopWatchFlag.value = true
                updateBreadcrumbFromPagination()
            }
        },
    )

    watch(
        () => route.fullPath,
        async () => {
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
    }
}
