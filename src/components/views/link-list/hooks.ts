/*
 * FilePath    : blog-client-nuxt\src\components\views\link-list\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 链接列表 hooks
 */

import { type Reactive, reactive, ref } from "vue"
import { useRoute, useRouter } from "vue-router"

import { type LinkRes } from "@/api/link/common"
import { viewLinkAPI, type ViewLinkRequest } from "@/api/link/view"
import { getEmptyPagination, type Pagination, ResponseCode } from "@/api/response"
import { usePagination } from "@/components/hooks/usePagination"
import { RouteNames, routerPushByParams } from "@/router"
import { parseRouteQuery } from "@/utils/queryParam"

export function useLinkList(queryParams: Reactive<ViewLinkRequest>) {
    const route = useRoute()
    const router = useRouter()

    const isShowLoading = ref<boolean>(false)

    const pagination = reactive<Pagination<LinkRes>>(getEmptyPagination<LinkRes>())

    async function getPaginate(): Promise<Pagination<LinkRes>> {
        isShowLoading.value = true
        const res = await viewLinkAPI(queryParams)
        if (res.data.code === ResponseCode.LinkViewSuccess) {
            isShowLoading.value = false
            return res.data.data
        }

        isShowLoading.value = false

        return getEmptyPagination<LinkRes>()
    }

    // 更新路由参数并跳转
    const updateRouterPush = async () => {
        await routerPushByParams(router, RouteNames.LinkList, queryParams)
    }

    const updateQueryParams = async () => {
        const { hasQuery, result } = await parseRouteQuery(route.query)

        // 清空 queryParams
        Object.keys(queryParams).forEach((key) => delete queryParams[key as keyof typeof queryParams])

        if (hasQuery) {
            Object.assign(queryParams, result)
        }
    }

    // 分页 hooks
    const { updateCurrentPage, updatePageSize, updatePaginate } = usePagination(pagination, getPaginate, queryParams, updateRouterPush, true)

    return {
        pagination,
        updateCurrentPage,
        updatePageSize,
        updatePaginate,
        updateRouterPush,
        updateQueryParams,
        isShowLoading,
    }
}
