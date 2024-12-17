/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-17 16:05:54
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-17 18:34:06
 * @FilePath     : \blog-client\src\components\hooks\useGetHomeData\index.ts
 * @Description  : 首页数据获取
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { reactive, watch, onBeforeMount, type Reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
import { type Pagination, NumberParamsFromURL, getEmptyPagination } from "@/components/common"
import { ResponseCode } from "@/api/responseCode"

import type { NumberKeys, PaginationRequest } from "@/components/common"

import { viewPostAPI } from "@/api/post/view"
import { type PostResPagination } from "@/api/post/common"

export type QueryRecord<T extends string | number | symbol> = { [key in T]?: string | number }

export interface Options<K> {
    queryNumberParams?: NumberKeys<K>[] // 查询参数中的数字参数
    noRequest?: QueryRecord<keyof K> // 不请求的参数值比如全部,只显示在路由中，不请求.
}

export function useGetHomeData(
    queryParams: Reactive<PaginationRequest>, // 查询参数
    options?: Options<PaginationRequest>,
) {
    const route = useRoute()
    const router = useRouter()

    const pagination =
        reactive<Pagination<PostResPagination>>(getEmptyPagination<PostResPagination>())

    // 类型别名 KeyType 为 queryParams 的 key
    type KeyType = keyof PaginationRequest

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

    // 获取分页用户
    async function getPaginate(req: PaginationRequest) {
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
            updatePaginate()
        },
    )

    onBeforeMount(async () => {
        // 获取路由参数 并更新 query
        updateByQuery()
        await getPaginate(queryParams)
    })

    return {
        pagination, // 分页数据
        updateCurrentPage, // 更新当前页
        updatePageSize, // 更新每页显示条数
        updatePaginate, // 更新分页数据
        updateQueryAndRouter, // 更新查询参数和路由
    }
}
