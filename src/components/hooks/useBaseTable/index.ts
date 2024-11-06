/**
 * @Author       : jiaopengzi
 * @Date         : 2024-11-06 08:57:02
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2024-11-06 17:54:38
 * @FilePath     : \blog-client\src\components\hooks\useBaseTable\index.ts
 * @Description  : 基础表格钩子
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */

import { ref, reactive } from "vue"
import router from "@/router"
import { debounce } from "throttle-debounce"
import type { AxiosPromise } from "axios"
import type { Pagination, PaginationRequest } from "@/components/common"
import { type Res, ResponseCode } from "@/api/responseCode"
import {
    formatTableData,
    type FormatTableData,
    type TableData,
} from "@/components/common/base-table"
import { ShowMsgTip } from "@/utils/message"

/**
 * @description: 基础表格钩子
 * @param routeName 路由名称
 * @param viewAPI 获取数据的 API
 * @param viewResCode 获取数据的响应码
 * @param initParams 初始化参数,可选
 */
export function useBaseTable<T extends FormatTableData, K extends PaginationRequest, Q>(
    routeName: string,
    viewAPI: (params: K) => AxiosPromise<Res>,
    viewResCode: ResponseCode,
    deleteAPI: (params: Q) => AxiosPromise<Res>,
    deleteResCode: ResponseCode,
    initParams: K = {} as K, // 默认值处理
) {
    const pagination = reactive<Pagination<T>>({
        total: 0,
        current_page: 1,
        page_size: 10,
        page_count: 1,
        page_sizes: [10, 20, 50, 100],
        records: [],
    })

    const addItemDialogVisible = ref(false) // 添加对话框是否可见
    const editItemDialogVisible = ref(false) // 编辑对话框是否可见
    const search = ref("") // 搜索关键字

    // 查询参数
    const query: Record<string, string | number> = reactive<K>({ ...initParams })

    // 更新查询参数
    const updateQueryAndRouter = (isUpdateRouter: boolean = true) => {
        query.page_size = pagination.page_size
        query.current_page = pagination.current_page
        if (search.value) {
            query.key_word = search.value
        }

        if (!search.value && query.key_word) {
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
                if (Array.isArray(value)) {
                    continue // 丢弃数组
                } else if (value !== null) {
                    query[key] = isNaN(Number(value)) ? value : Number(value)
                }
            }
            return
        }
        updateQueryAndRouter(false)
    }

    // 更新分页内容 在组件挂载之前,主要是为了链接跳转时能够获取到参数
    const updatePaginateOnBeforeMount = async (): Promise<void> => {
        updateByQuery()
        await getPaginate(query as unknown as K)
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

    const updateSearch = debounce(500, async (val: string) => {
        search.value = val
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
        // 如果 key_word 为空 则不传 key_word
        if (!req.key_word) {
            delete req.key_word
        }

        // 获取标签列表
        await viewAPI(req).then((res) => {
            if (res.data.code === viewResCode) {
                res.data.data.records = res.data.data.records.map((row: T) =>
                    formatTableData(row as T),
                )

                Object.assign(pagination, res.data.data)
            }
        })
    }

    const deleteRows = async (rows: TableData[]) => {
        // 将 rows 中的id 组成新的 list
        const ids = rows.flatMap((item) => ("id" in item ? Number(item.id) : []))

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
        updatePaginateOnBeforeMount, // 在组件挂载之前更新分页数据
    }
}
