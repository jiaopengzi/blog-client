/**
 * @FilePath     : \blog-client\src\components\hooks\usePagination\index.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 分页内容是否请求
 */

import { type Reactive } from "vue"

import { type PaginationRequest } from "@/api/request"
import { type Pagination } from "@/api/response"

/**
 * 分页内容是否请求
 *
 * @param pagination 分页数据
 * @param paginateAPI 分页 API
 * @param queryParams 查询参数
 * @param updateRouterPush 更新路由
 */
export function usePagination<T, K extends PaginationRequest>(
    pagination: Reactive<Pagination<T>>,
    paginateAPI: (params: K) => Promise<Pagination<T>>,
    queryParams: Reactive<K>,
    updateRouterPush: () => Promise<void>,
) {
    /**
     * 更新当前页
     * @param val 当前页
     */
    const updateCurrentPage = async (val: number) => {
        queryParams.current_page = val

        await updateRouterPush()
    }

    /**
     * 更新每页显示条数
     * @param val 每页显示条数
     */
    const updatePageSize = async (val: number) => {
        queryParams.page_size = val

        await updateRouterPush()
    }

    //  更新分页数据
    const updatePaginate = async (): Promise<void> => {
        const data = await paginateAPI(queryParams as K)
        Object.assign(pagination, data)
    }

    return {
        updateCurrentPage,
        updatePageSize,
        updatePaginate,
    }
}
