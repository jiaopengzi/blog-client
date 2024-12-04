/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 08:57:02
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-12-04 19:45:59
 * @FilePath     : \blog-client\src\components\hooks\useBaseTable\index.ts
 * @Description  : 基础表格钩子
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ref, reactive, watch, onBeforeMount, type Reactive } from "vue"
import router from "@/router"
import { debounce } from "throttle-debounce"
import type { AxiosPromise } from "axios"
import {
    type Pagination,
    type PaginationRequest,
    URLQueryIsNumberKeys,
    getEmptyPagination,
} from "@/components/common"
import { type Res, ResponseCode } from "@/api/responseCode"
import {
    formatTableData,
    type FormatTableData,
    type TableData,
} from "@/components/common/base-table"
import { ShowMsgTip } from "@/utils/message"
import { type TableImg } from "@/components/common"

export type QueryRecord<T extends keyof any> = { [key in T]?: string | number }

export interface Options<K> {
    queryParams?: Reactive<K> // 查询参数
    tableImg?: TableImg // 表格图片配置
    noRequest?: QueryRecord<keyof any> // 不请求的参数值比如全部,只显示在路由中，不请求.
}

/**
 * @description: 基础表格钩子
 * @param routeName 路由名称
 * @param viewAPI 获取数据的 API
 * @param viewResCode 获取数据的响应码
 * @param deleteAPI 删除数据的 API
 * @param deleteResCode 删除数据的响应码
 * @param options 可选参数
 */
export function useBaseTable<T extends FormatTableData, K extends PaginationRequest, Q>(
    routeName: string,
    viewAPI: (params: K) => AxiosPromise<Res>,
    viewResCode: ResponseCode,
    deleteAPI: (params: Q) => AxiosPromise<Res>,
    deleteResCode: ResponseCode,
    options?: Options<K>,
) {
    const pagination = reactive<Pagination<T>>(getEmptyPagination<T>())

    const addItemDialogVisible = ref(false) // 添加对话框是否可见
    const editItemDialogVisible = ref(false) // 编辑对话框是否可见
    const search = ref("") // 搜索关键字

    // 查询参数
    const query: Record<string, string | number> = reactive<K>({} as K)
    if (options?.queryParams) {
        Object.assign(query, options.queryParams)
    }

    // 更新查询参数
    const updateQueryAndRouter = (isUpdateRouter: boolean = true) => {
        query.page_size = pagination.page_size
        query.current_page = pagination.current_page
        if (!query.key_word) {
            delete query.key_word
        }

        // 判断是否更新路由
        if (isUpdateRouter) {
            router.push({
                name: routeName,
                query: query,
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
                // 判断 key 是否在 URLQueryIsNumberKeys 中，如果在则解析为数字，否则保持原样
                query[key] = key in URLQueryIsNumberKeys ? Number(value) : (value as string)
            }
            return
        }
        updateQueryAndRouter(false)
    }

    // 更新分页内容
    const updatePaginate = async (): Promise<void> => {
        updateQueryAndRouter(false)
        await getPaginate(query as unknown as K)
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
        updateQueryAndRouter()
    }

    // 更新每页显示条数
    const updatePageSize = async (val: number) => {
        pagination.page_size = val
        updateQueryAndRouter()
    }

    // 更新搜索关键字
    const updateSearch = async (val: string) => {
        search.value = val
        query.key_word = val
        if (val === "") {
            await getPaginate(query as unknown as K)
            updateQueryAndRouter()
        }
    }

    // 执行搜索
    const runSearch = debounce(200, async () => {
        await getPaginate(query as unknown as K)
        updateQueryAndRouter()
    })

    // 更新添加状态
    const addStatus = async (status: boolean) => {
        if (status) {
            // getValueFromQuery()
            await getPaginate(query as unknown as K)
        }
    }

    // 更新编辑状态
    const editStatus = async (status: boolean) => {
        if (status) {
            // getValueFromQuery()
            await getPaginate(query as unknown as K)
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
        await viewAPI(req).then((res) => {
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
                Object.assign(pagination, res.data.data)
            } else {
                Object.assign(pagination, getEmptyPagination<T>())
            }
        })
    }

    const deleteRows = async (rows: TableData[]) => {
        // 将 rows 中的id 组成新的 list
        const ids = rows.flatMap((item) => ("id" in item ? item.id.toString() : []))

        const deleteUserRequest = { id_list: ids } as Q

        // 删除
        await deleteAPI(deleteUserRequest).then((res) => {
            if (res.data.code === deleteResCode) {
                // 删除成功后重新获取列表
                updatePaginate()
                ShowMsgTip(ShowMsgTip.MsgType.success, res.data.msg, 3000)
            } else {
                // 显示错误信息
                ShowMsgTip(ShowMsgTip.MsgType.error, res.data.msg, 3000)
            }
        })
    }

    watch(
        () => options?.queryParams,
        (newVal) => {
            console.log("use queryParams", newVal)
            Object.assign(query, newVal)
            updateQueryAndRouter()
        },
        { deep: true },
    )

    onBeforeMount(async () => {
        // 获取路由参数 并更新 query
        updateByQuery()
        await getPaginate(query as unknown as K)
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
        runSearch, // 执行搜索
        addStatus, // 添加状态
        editStatus, // 编辑状态
        addItemUpdateDialogVisible, // 新增对话框
        editItemUpdateDialogVisible, // 编辑对话框
        updatePaginate, // 更新分页数据
        deleteRows, // 删除行
    }
}
