/*
 * FilePath    : blog-client\src\components\hooks\usePagination\usePaginationNoRouter.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 评论分页请求
 */

import { type Reactive } from "vue"

import { type PaginationWithoutKeyWord } from "@/api/request"
import { type Pagination } from "@/api/response"

/**
 * 评论分页请求
 *
 * @param pagination 分页数据
 * @param paginateAPI 分页 API
 * @param queryParams 查询参数
 */
export function usePaginationNoRouter<T, K extends PaginationWithoutKeyWord>(
    pagination: Reactive<Pagination<T>>,
    paginateAPI: (params: K) => Promise<Pagination<T>>,
    queryParams: Reactive<K>,
) {
    //  更新分页数据
    const updatePaginate = async (): Promise<void> => {
        const data = await paginateAPI(queryParams as K)
        Object.assign(pagination, data)
    }

    /**
     * 更新当前页
     * @param val 当前页
     */
    const updateCurrentPage = async (val: number) => {
        queryParams.current_page = val

        await updatePaginate()
    }

    /**
     * 更新每页显示条数
     * @param val 每页显示条数
     */
    const updatePageSize = async (val: number) => {
        queryParams.page_size = val

        await updatePaginate()
    }

    return {
        updateCurrentPage,
        updatePageSize,
        updatePaginate,
    }
}
