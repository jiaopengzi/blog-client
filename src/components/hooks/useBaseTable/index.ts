/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 08:57:02
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-29 15:04:21
 * @FilePath     : \blog-client\src\components\hooks\useBaseTable\index.ts
 * @Description  : 基础表格钩子
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ref, reactive, watch, onBeforeMount, type Reactive } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
    type Pagination,
    type PaginationRequest,
    PaginationParamsInURL,
    getEmptyPagination,
} from "@/components/common"
import { type Res, type ResPromise, ResponseCode, handleResErr } from "@/api/response"
import {
    formatTableData,
    type FormatTableData,
    type TableData,
} from "@/components/common/base-table"
import { MessageUtil } from "@/utils/message"
import type { TableImg, NumberKeys, BooleanKeys } from "@/components/common"

export type QueryRecord<T extends string | number | symbol> = { [key in T]?: string | number }

export interface Options<K> {
    queryNumberParams?: NumberKeys<K>[] // 查询参数中的数字参数
    tableImg?: TableImg // 表格图片配置
    noRequest?: QueryRecord<keyof K> // 不请求的参数值比如全部,只显示在路由中，不请求.
    queryBooleanParams?: BooleanKeys<K>[] // 查询参数中的布尔参数
}

/**
 * @description: 基础表格钩子
 * @param routeName 路由名称
 * @param viewAPI 获取数据的 API
 * @param viewResCode 获取数据的响应码
 * @param deleteAPI 删除数据的 API
 * @param deleteResCode 删除数据的响应码
 * @param queryParams 查询参数
 * @param options 可选参数
 */
export function useBaseTable<T extends FormatTableData, K extends PaginationRequest, Q>(
    routeName: string,
    viewAPI: (params: K) => ResPromise<Res<Pagination<T>>>,
    viewResCode: ResponseCode,
    deleteAPI: (params: Q) => ResPromise<Res<void>>,
    deleteResCode: ResponseCode,
    queryParams: Reactive<K>, // 查询参数
    options?: Options<K>,
) {
    const route = useRoute()
    const router = useRouter()

    const pagination = reactive<Pagination<T>>(getEmptyPagination<T>())

    const addItemDialogVisible = ref(false) // 添加对话框是否可见
    const editItemDialogVisible = ref(false) // 编辑对话框是否可见
    const search = ref("") // 搜索关键字

    // 类型别名 KeyType 为 queryParams 的 key
    type KeyType = keyof typeof queryParams

    const numberParamSet = new Set<string>(Object.values(PaginationParamsInURL))
    const booleanParamSet = new Set<string>()

    // 如果 options.queryNumberParams 不为空 将 options.queryNumberParams key 增加到 numberParamSet 中
    if ((options?.queryNumberParams?.length ?? 0) > 0) {
        options?.queryNumberParams?.forEach((key) => {
            numberParamSet.add(key)
        })
    }

    // 如果 options.queryBooleanParams 不为空 将 options.queryBooleanParams key 增加到 booleanParamSet 中
    if ((options?.queryBooleanParams?.length ?? 0) > 0) {
        options?.queryBooleanParams?.forEach((key) => {
            booleanParamSet.add(key as string)
        })
    }

    /**
     * @description: 更新查询参数和路由
     * @param isUpdateRouter 是否更新路由 默认为 true 更新路由
     */
    const updateQueryParamsAndRouter = (isUpdateRouter: boolean = true) => {
        queryParams.page_size = pagination.page_size
        queryParams.current_page = pagination.current_page
        if (!queryParams.key_word) {
            delete queryParams.key_word
        }
        // 判断是否更新路由
        if (isUpdateRouter) {
            router.push({
                name: routeName,
                query: queryParams,
            })
        }
    }

    // 从路由中获取参数
    const parseParamsFromURL = () => {
        // 清空 queryParams
        Object.keys(queryParams).forEach((key) => delete queryParams[key as KeyType])

        // 判断路由中是否有参数
        const queryUrl = router.currentRoute.value.query
        // 如果 queryUrl 不为空 则将 queryUrl 赋值给 query
        if (Object.keys(queryUrl).length) {
            // 赋值给到 query, 如果 key 对应的值能解析为数字则解析为数字
            for (const key in queryUrl) {
                const value = queryUrl[key]
                // 判断 key 是否在 numberParamSet 或者 booleanParamSet 中，如果在则解析为数字或者布尔，否则保持原样
                if (numberParamSet.has(key)) {
                    ;(queryParams as any)[key as KeyType] = Number(value)
                } else if (booleanParamSet.has(key)) {
                    ;(queryParams as any)[key as KeyType] = value === "true"
                } else {
                    ;(queryParams as any)[key as KeyType] = value as string
                }
            }
        } else {
            // 默认每页显示 10 条 页码为 1
            queryParams.page_size = 10
            queryParams.current_page = 1
        }
    }

    // 更新分页内容
    const updatePaginate = async (): Promise<void> => {
        await getPaginate(queryParams as K)
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

    // 更新当前页
    const updateCurrentPage = async (val: number) => {
        pagination.current_page = val
        updateQueryParamsAndRouter()
    }

    // 更新每页显示条数
    const updatePageSize = async (val: number) => {
        pagination.page_size = val
        updateQueryParamsAndRouter()
    }

    // 更新搜索关键字
    const updateSearch = async (val: string) => {
        search.value = val
        queryParams.key_word = val
        if (val === "") {
            updateQueryParamsAndRouter()
        }
    }

    // 更新添加状态
    const addStatus = async (status: boolean) => {
        if (status) {
            await getPaginate(queryParams as K)
        }
    }

    // 更新编辑状态
    const editStatus = async (status: boolean) => {
        if (status) {
            await getPaginate(queryParams as K)
        }
    }

    // 获取分页用户
    async function getPaginate(req: K) {
        // 遍历 options.NoRequest 中的参数，如果 req 中的参数值等于 options.NoRequest 中的值则删除,不请求
        for (const key in options?.noRequest) {
            if (key in req && req[key as keyof K] === options.noRequest[key]) {
                delete req[key as keyof K]
            }
        }

        // 如果 key_word 为空 则不传 key_word
        if (!req.key_word) {
            delete req.key_word
        }

        // 获取标签列表
        const res = await viewAPI(req)
        if (res.data.code === viewResCode) {
            res.data.data.records = res.data.data.records.map((row: T) =>
                formatTableData(
                    row as T,
                    options?.tableImg?.width,
                    options?.tableImg?.height,
                    options?.tableImg?.imgFit,
                    options?.tableImg?.svgFontSize,
                ),
            )

            // 无数据时不更新
            if (res.data.data.total === 0) {
                MessageUtil.warning("没有查询到数据", 6000)
                return
            }
            Object.assign(pagination, res.data.data)
        } else {
            const msg = handleResErr(res)
            MessageUtil.warning(msg, 6000)
        }
    }

    const deleteRows = async (rows: TableData[]) => {
        // 将 rows 中的id 组成新的 list
        const ids = rows.flatMap((item) => ("id" in item ? item.id.toString() : []))

        const deleteUserRequest = { id_list: ids } as Q

        // 删除
        const res = await deleteAPI(deleteUserRequest)

        if (res.data.code === deleteResCode) {
            // 删除成功后重新获取列表
            updatePaginate()
            MessageUtil.success(res.data.msg, 3000)
        } else {
            // 显示错误信息
            MessageUtil.error(res.data.msg, 3000)
        }
    }

    // 监控 route.fullPath 的变化并执行操作
    watch(
        () => route.fullPath,
        async (newVal, oldVal) => {
            console.log("watch=====>oldVal", oldVal)
            console.log("watch=====>newVal", newVal)
            parseParamsFromURL()
            await updatePaginate()
        },
    )

    onBeforeMount(async () => {
        // 获取路由参数 并更新 query
        console.log("onBeforeMount")
        parseParamsFromURL()
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
        updateQueryParamsAndRouter, // 更新查询参数和路由
    }
}
