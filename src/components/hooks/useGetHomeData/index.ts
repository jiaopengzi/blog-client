/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-17 16:05:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-22 13:45:47
 * @FilePath     : \blog-client\src\components\hooks\useGetHomeData\index.ts
 * @Description  : 首页数据获取
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { reactive, watch, onBeforeMount, type Reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
import { type Pagination, NumberParamsFromURL, getEmptyPagination } from "@/components/common"
import { type PostCategory } from "@/api/postCategory/view"
import { type PostTag } from "@/api/postTag/view"
import { ResponseCode } from "@/api/responseCode"

import type { NumberKeys } from "@/components/common"

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
        reactive<Pagination<PostResPagination>>(getEmptyPagination<PostResPagination>())

    const breadcrumbItems = reactive<BreadcrumbItem[]>([])

    // 类型别名 KeyType 为 queryParams 的 key
    type KeyType = keyof ViewPostRequest

    const numberParamSet = new Set<string>(Object.values(NumberParamsFromURL))
    // 如果 options.queryNumberParams 不为空 将 options.queryNumberParams key 增加到 numberParamSet 中
    if ((options?.queryNumberParams?.length ?? 0) > 0) {
        options?.queryNumberParams?.forEach((key) => {
            numberParamSet.add(key || "")
        })
    }

    // 更新查询参数
    const updateQueryAndRouter = (isUpdateRouter: boolean = true) => {
        queryParams.page_size = pagination.page_size
        queryParams.current_page = pagination.current_page
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

    // 从路由中获取参数
    const updateByQuery = () => {
        // 判断路由中是否有参数
        const queryUrl = router.currentRoute.value.query
        // 如果 queryUrl 不为空 则将 queryUrl 赋值给 query
        if (Object.keys(queryUrl).length) {
            // 赋值给到 query, 如果 key 对应的值能解析为数字则解析为数字
            for (const key in queryUrl) {
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
            return
        }
        updateQueryAndRouter(false)
    }

    // 更新分页内容
    const updatePaginate = async (): Promise<void> => {
        await getPaginate(queryParams)
    }

    // 更新当前页
    const updateCurrentPage = async (val: number) => {
        pagination.current_page = val
        updateQueryAndRouter()
    }

    // 更新每页显示条数
    const updatePageSize = async (val: number) => {
        pagination.page_size = val
        updateQueryAndRouter()
    }

    // 获取分页
    async function getPaginate(req: ViewPostRequest) {
        // 遍历 options.NoRequest 中的参数，如果 req 中的参数值等于 options.NoRequest 中的值则删除,不请求
        for (const key in options?.noRequest) {
            if (key in req && req[key as KeyType] === options.noRequest[key as KeyType]) {
                delete req[key as KeyType]
            }
        }

        // 如果 key_word 为空 则不传 key_word
        if (!req.key_word) {
            delete req.key_word
        }

        // 获取标签列表
        await viewPostAPI(req).then((res) => {
            if (res.data.code === ResponseCode.PostViewSuccess) {
                Object.assign(pagination, res.data.data)
            } else {
                Object.assign(pagination, getEmptyPagination<PostResPagination>())
            }
        })
    }

    // 热门文章
    const hotPost = reactive<PostResCommon[]>([])
    async function getHostPost() {
        // 获取标签列表
        await viewHotPostAPI().then((res) => {
            if (res.data.code === ResponseCode.PostViewHotSuccess) {
                Object.assign(hotPost, res.data.data)
            }
        })
    }

    // 推荐文章
    const recommendedPost = reactive<PostResCommon[]>([])
    async function getRecommendedPost() {
        // 获取标签列表
        await viewRecommendedPostAPI().then((res) => {
            if (res.data.code === ResponseCode.PostViewRecommendedSuccess) {
                Object.assign(recommendedPost, res.data.data)
            }
        })
    }

    // 推荐文章
    const monthArchiveProps = reactive<MonthArchiveData[]>([])
    async function getPostCountByMonth() {
        // 获取标签列表
        await getPostCountByMonthAPI().then((res) => {
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
        })
    }

    // 清空查询参数中的特定字段
    const clearParamsExcept = (fieldsToKeep: KeyType[]) => {
        const keysToClear: KeyType[] = [
            "key_word",
            "year",
            "month",
            "post_author",
            "post_category_id",
            "post_tag_id",
        ]

        keysToClear.forEach((key) => {
            if (!fieldsToKeep.includes(key)) {
                delete queryParams[key]
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

    // 点击分类
    const clickCategory = (category: PostCategory) => {
        // 清空其他查询条件
        clearParamsExcept(["post_category_id"])
        queryParams.post_category_id = category.id
        updateQueryAndRouter()

        // 清空面包屑
        breadcrumbItems.length = 0

        // 更新面包屑
        const breadcrumbItem: BreadcrumbItem = {
            display: category.name,
            to: generateBreadcrumbPath(),
        }

        breadcrumbItems.push(breadcrumbItem)
    }

    // 点击标签
    const clickTag = (tag: PostTag) => {
        // 清空其他查询条件
        clearParamsExcept(["post_tag_id"])
        queryParams.post_tag_id = tag.id
        updateQueryAndRouter()
        // 清空面包屑
        breadcrumbItems.length = 0

        // 更新面包屑
        const breadcrumbItem: BreadcrumbItem = {
            display: tag.name,
            to: generateBreadcrumbPath(),
        }
        breadcrumbItems.push(breadcrumbItem)
    }

    // 点击月份归档
    const clickMonthArchive = (row: MonthArchiveData) => {
        // 清空其他查询条件
        clearParamsExcept(["year", "month"])
        queryParams.year = row.year

        // 清空面包屑
        breadcrumbItems.length = 0

        // 更新面包屑
        const breadcrumbItemYear: BreadcrumbItem = {
            display: `${row.year}`,
            to: generateBreadcrumbPath(),
        }
        breadcrumbItems.push(breadcrumbItemYear)

        queryParams.month = row.month

        const breadcrumbItemMonth: BreadcrumbItem = {
            display: `${row.month}`,
            to: generateBreadcrumbPath(),
        }
        breadcrumbItems.push(breadcrumbItemMonth)
        updateQueryAndRouter()
    }

    // 点击文章
    const handlePostId = (id: string) => {
        router.push({
            name: "post",
            params: { id },
        })
    }

    // 判断 queryParams 中 key 是否在 numberParamSet 中，如果在则解析为数字，否则保持原样
    watch(
        () => queryParams,
        (newVal) => {
            // 判断 newVal 中 key 是否在 numberParamSet 中，如果在则解析为数字，否则保持原样
            for (const key in newVal) {
                ;(queryParams as any)[key as KeyType] = numberParamSet.has(key)
                    ? Number(newVal[key as KeyType])
                    : (newVal[key as KeyType] as any)
            }
        },
        { deep: true },
    )

    // 监控 route.fullPath 的变化并执行操作
    watch(
        () => route.fullPath,
        () => {
            console.log("route.fullPath", route.fullPath)
            updatePaginate()
        },
    )

    onBeforeMount(async () => {
        // 获取路由参数 并更新 query
        updateByQuery()
        await getPaginate(queryParams)
        await getHostPost()
        await getRecommendedPost()
        await getPostCountByMonth()
    })

    return {
        pagination, // 分页数据
        updateCurrentPage, // 更新当前页
        updatePageSize, // 更新每页显示条数
        updatePaginate, // 更新分页数据
        updateQueryAndRouter, // 更新查询参数和路由
        hotPost, // 热门文章
        recommendedPost, // 推荐文章
        monthArchiveProps, // 月份归档
        clickCategory, // 点击分类
        clickTag, // 点击标签
        clickMonthArchive, // 点击月份归档
        handlePostId, // 点击文章
        breadcrumbItems, // 面包屑
    }
}
