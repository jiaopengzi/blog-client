/**
 * @FilePath     : \blog-client\src\components\hooks\useBaseTable\index.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 基础表格钩子
 */

import { onBeforeMount, type Reactive, reactive, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"

import type { StreamsStatusRes } from "@/api/helper/getStreamIDsStatus"
import { type PaginationRequest, type QueryParamsOptions } from "@/api/request"
import { getEmptyPagination, handleResErr, type Pagination, type Res, ResponseCode, type ResPromise } from "@/api/response"
import type { TableImg } from "@/components/common"
import { type FormatTableData, formatTableData, type TableData } from "@/components/common/base-table"
import { usePagination } from "@/components/hooks/usePagination"
import { routerPushByParams } from "@/router"
import { pollingGetStreamIDsStatus } from "@/utils/getStreamIDsStatus"
import { MessageUtil } from "@/utils/message"
import { parseRouteQuery } from "@/utils/queryParam"

// 可选参数类型定义
export interface Options<T> extends QueryParamsOptions<T> {
    tableImg?: TableImg // 表格图片配置
}

// 基础表格钩子选项
export interface BaseTableOptions<T extends FormatTableData, K extends PaginationRequest, Q> {
    routeName: string // 路由名称
    viewAPI: (params: K) => ResPromise<Res<Pagination<T>>> // 获取数据的 API
    viewResCode: ResponseCode // 获取数据的响应码
    queryParams: Reactive<K> // 查询参数
    deleteAPI?: (params: Q) => ResPromise<Res<StreamsStatusRes | void>> // 删除数据的 API
    deleteResCode?: ResponseCode // 删除数据的响应码
    options?: Options<K> // 可选参数
}

/**
 * @description: 基础表格钩子
 * @param ctx 上下文对象，包含路由名称、获取数据的 API、响应码、查询参数、删除 API 和可选参数等
 */
export function useBaseTable<T extends FormatTableData, K extends PaginationRequest, Q>(ctx: BaseTableOptions<T, K, Q>) {
    const { routeName, viewAPI, viewResCode, queryParams, deleteAPI, deleteResCode, options } = ctx

    const route = useRoute()
    const router = useRouter()

    const pagination = reactive<Pagination<T>>(getEmptyPagination<T>())

    const addItemDialogVisible = ref(false) // 添加对话框是否可见
    const editItemDialogVisible = ref(false) // 编辑对话框是否可见
    const search = ref("") // 搜索关键字

    const loadingDelete = ref<boolean>(false)

    /**
     * @description: 更新和路由
     */
    const updateRouterPush = async () => {
        await routerPushByParams(router, routeName, queryParams)
    }

    // 是否请求
    const { updateCurrentPage, updatePageSize, updatePaginate } = usePagination(pagination, getPaginate, queryParams, updateRouterPush)

    // 更新查询参数
    const updateQueryParams = async () => {
        const { hasQuery, result } = await parseRouteQuery(route.query, options as QueryParamsOptions<K>)

        // 清空 queryParams
        Object.keys(queryParams).forEach((key) => delete queryParams[key as keyof typeof queryParams])

        if (hasQuery) {
            Object.assign(queryParams, result)
        }
    }

    // 切换是否添加对话框
    const toggleAddDialog = () => {
        addItemDialogVisible.value = !addItemDialogVisible.value
    }

    // 切换是否编辑对话框
    const toggleEditDialog = () => {
        editItemDialogVisible.value = !editItemDialogVisible.value
    }

    // 新增对话框
    const addItemUpdateDialogVisible = (val: boolean) => {
        addItemDialogVisible.value = val
    }

    // 编辑对话框
    const editItemUpdateDialogVisible = (val: boolean) => {
        editItemDialogVisible.value = val
    }

    // 更新搜索关键字, 是否更新路由, 默认更新路由
    const updateSearch = async (val: string, isUpdateRouter: boolean = true) => {
        search.value = val
        queryParams.key_word = val
        if (val === "" && isUpdateRouter) {
            await updateRouterPush()
        }
    }

    // 更新添加状态
    const addStatus = async (status: boolean) => {
        if (status) {
            await updatePaginate()
        }
    }

    // 更新编辑状态
    const editStatus = async (status: boolean) => {
        if (status) {
            await updatePaginate()
        }
    }

    // 获取分页
    async function getPaginate(req: K): Promise<Pagination<T>> {
        // 遍历 options.NoRequest 中的参数，如果 req 中的参数值等于 options.NoRequest 中的值则删除,不请求
        for (const key in options?.noRequestKeys) {
            if (key in req && req[key as keyof K] === options.noRequestKeys[key]) {
                delete req[key as keyof K]
            }
        }

        // 获取标签列表
        const res = await viewAPI(req)
        if (res.data.code === viewResCode) {
            res.data.data.records = res.data.data.records.map((row: T) =>
                formatTableData(row as T, options?.tableImg?.width, options?.tableImg?.height, options?.tableImg?.imgFit, options?.tableImg?.svgFontSize),
            )

            // 无数据时不更新
            if (res.data.data.total === 0) {
                MessageUtil.warning("没有查询到数据", 6000)
                return res.data.data
            }

            return res.data.data
        }

        // 显示错误信息
        const msg = handleResErr(res)
        MessageUtil.warning(msg, 6000)
        return getEmptyPagination<T>()
    }

    const deleteRows = async (rows: TableData[]) => {
        if (!deleteAPI || !deleteResCode) {
            MessageUtil.error("未配置删除 API 或响应码", 3000)
            return
        }

        loadingDelete.value = true // 显示加载动画

        // 将 rows 中的id 组成新的 list
        const ids = rows.flatMap((item) => ("id" in item ? item.id.toString() : []))

        const deleteRequest = { id_list: ids } as Q

        // 删除
        const res = await deleteAPI(deleteRequest)

        if (res.data.code === deleteResCode) {
            if (res.data.data && "items" in res.data.data) {
                // 如果响应中包含 items，则轮询获取状态
                await pollingGetStreamIDsStatus(res.data.data.stream_items)
            }

            loadingDelete.value = false // 隐藏加载动画
            // 删除成功后重新获取列表
            await updatePaginate()
            MessageUtil.success(res.data.msg, 3000)
        } else {
            loadingDelete.value = false // 隐藏加载动画
            // 显示错误信息
            MessageUtil.error(res.data.msg, 3000)
        }
    }

    // 监控路由变化
    watch(
        () => route.fullPath,
        async () => {
            await updateQueryParams()
            await updatePaginate()
        },
    )

    // 监控对话框或加载状态变化
    function watchDialogOrLoading(refValue: typeof addItemDialogVisible | typeof editItemDialogVisible | typeof loadingDelete) {
        watch(
            () => refValue.value,
            async (newVal, oldVal) => {
                if (oldVal && newVal === false) {
                    if (options?.refreshFns?.length) {
                        options.refreshFns.forEach((fn) => fn())
                    }
                    if (options?.refreshPromiseFns?.length) {
                        await Promise.all(options.refreshPromiseFns.map((fn) => fn()))
                    }
                }
            },
        )
    }

    watchDialogOrLoading(loadingDelete)
    watchDialogOrLoading(addItemDialogVisible)
    watchDialogOrLoading(editItemDialogVisible)

    onBeforeMount(async () => {
        await updateQueryParams()
        await updatePaginate()
    })

    return {
        addItemDialogVisible, // 添加对话框是否可见
        editItemDialogVisible, // 编辑对话框是否可见
        search, // 搜索关键字
        toggleAddDialog, // 切换添加对话框
        toggleEditDialog, // 切换编辑对话框
        pagination, // 分页数据
        updateCurrentPage, // 更新当前页
        updatePageSize, // 更新每页显示条数
        updateSearch, // 更新搜索关键字
        addStatus, // 添加状态
        editStatus, // 编辑状态
        addItemUpdateDialogVisible, // 新增对话框
        editItemUpdateDialogVisible, // 编辑对话框
        updatePaginate, // 更新分页数据
        deleteRows, // 删除行
        updateRouterPush, // 更新路由
        loadingDelete, // 删除加载状态
    }
}
