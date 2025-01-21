/**
 * @Author       : jiaopengzi
 * @Date         : 2025-01-03 15:39:05
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-04 10:43:53
 * @FilePath     : \blog-client\src\components\hooks\usePagination\index.ts
 * @Description  : 分页内容是否请求
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 */

import { type Reactive, ref } from "vue"

import { type PaginationRequest } from "@/api/request"
import { type Pagination } from "@/api/response"

/**
 * 分页内容是否请求
 *
 * @param pagination 分页数据
 * @param paginateAPI 分页 API
 * @param queryParams 查询参数
 * @param servicePageSize 业务逻辑(每页显示条数)
 * @param serviceCurrentPage 业务逻辑(当前页)
 * @param updateRouterPush 更新路由
 */
export function usePagination<T, K extends PaginationRequest>(
    pagination: Reactive<Pagination<T>>,
    paginateAPI: (params: K) => Promise<Pagination<T>>,
    queryParams: Reactive<K>,
    servicePageSize: () => Promise<void>,
    serviceCurrentPage: () => Promise<void>,
    updateRouterPush: () => Promise<void>,
) {
    /**
     * 是否请求
     * 主要是在分页组件中，页码和每页显示条数变化时，根据总记录数判断是否需要再次请求
     * 减少不必要的请求
     */
    const isRequest = ref(true)

    /**
     * 更新是否请求
     * @param newPageSize 新的每页显示条数
     * @param newCurrentPage 新的当前页
     */
    const updateIsRequest = ({ newPageSize = 10, newCurrentPage = 1 }) => {
        // 超过请记录数则不请求
        if (pagination.current_page !== 1) {
            isRequest.value = true
            return
        }
        const isMaxPageSizeOld = pagination.total < pagination.page_size * pagination.current_page
        const isMaxPageSizeNew = pagination.total < newPageSize * newCurrentPage
        isRequest.value = !(isMaxPageSizeOld && isMaxPageSizeNew)
    }

    // 更新路由参数
    const updatePaginationParams = async () => {
        queryParams.page_size = pagination.page_size
        queryParams.current_page = pagination.current_page
        await updateRouterPush()
    }

    /**
     * 更新当前页
     * @param val 当前页
     */
    const updateCurrentPageWithIsRequest = async (val: number) => {
        updateIsRequest({ newPageSize: pagination.page_size, newCurrentPage: val })
        queryParams.current_page = val

        if (!isRequest.value) {
            await updateRouterPush()
            return
        }

        await serviceCurrentPage()
        await updatePaginationParams()
    }

    /**
     * 更新每页显示条数
     * @param val 每页显示条数
     */
    const updatePageSizeWithIsRequest = async (val: number) => {
        updateIsRequest({ newPageSize: val, newCurrentPage: pagination.current_page })
        queryParams.page_size = val

        if (!isRequest.value) {
            await updateRouterPush()
            return
        }
        await servicePageSize()
        await updatePaginationParams()
    }

    //  更新分页携带是否请求标志
    const updatePaginateWithIsRequest = async () => {
        if (!isRequest.value) {
            isRequest.value = true // 重置为 true
            return
        }

        const data = await paginateAPI(queryParams as K)
        Object.assign(pagination, data)

        isRequest.value = true // 重置为 true
    }

    return {
        isRequest,
        updateIsRequest,
        updateCurrentPageWithIsRequest,
        updatePageSizeWithIsRequest,
        updatePaginateWithIsRequest,
    }
}
