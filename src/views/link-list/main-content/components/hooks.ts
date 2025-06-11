/*
 * FilePath    : blog-client\src\views\home\main-content\post-detail\components\link-list\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 链接列表
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

    const isShowLoading = ref<boolean>(false) // 是否显示加载动画

    const pagination = reactive<Pagination<LinkRes>>(getEmptyPagination<LinkRes>()) // 分页数据

    async function getPaginate(): Promise<Pagination<LinkRes>> {
        isShowLoading.value = true // 显示加载动画
        // 获取列表
        const res = await viewLinkAPI(queryParams)
        if (res.data.code === ResponseCode.LinkViewSuccess) {
            isShowLoading.value = false // 隐藏加载动画
            return res.data.data
        }

        isShowLoading.value = false // 隐藏加载动画

        return getEmptyPagination<LinkRes>()
    }

    // 更新查询参数
    const updateRouterPush = async () => {
        await routerPushByParams(router, RouteNames.LinkList, queryParams)
    }

    // 更新查询参数
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
        pagination, // 分页数据
        updateCurrentPage, // 更新当前页
        updatePageSize, // 更新每页显示条数
        updatePaginate, // 更新分页
        updateRouterPush, // 更新路由参数
        updateQueryParams, // 更新查询参数
        isShowLoading, // 是否显示加载动画
    }
}
