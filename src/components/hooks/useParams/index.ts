/**
 * @Author       : jiaopengzi
 * @Date         : 2024-12-05 19:00:17
 * @LastEditors  : jiaopengzi
 * @LastEditTime : 2025-01-03 12:39:20
 * @FilePath     : \blog-client\src\components\hooks\useParams\index.ts
 * @Description  : 路由参数解析回响应式变量
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2024 by jiaopengzi, All Rights Reserved.
 */
import { onBeforeMount, type Reactive, type Ref, watch } from "vue"

import type { PaginationRequest } from "@/api/request"
import type { Pagination } from "@/api/response"

/**
 * @description: 解析路由参数回响应式变量
 * @param params 路由参数
 * @param search 搜索关键字
 * @param pagination 分页信息
 */
export function useParams<T, K extends PaginationRequest>(params: Reactive<K>, search: Ref<string>, pagination: Reactive<Pagination<T>>) {
    // 监听搜索关键字
    const update = (p: Reactive<K>) => {
        const { key_word, page_size, current_page } = p
        search.value = key_word || ""
        pagination.page_size = page_size || 10
        pagination.current_page = current_page || 1
    }

    const updateWatch = (newVal: Reactive<K>) => {
        update(newVal)
        stop()
    }

    // 监控 queryParams
    const { stop } = watch(
        () => params,
        (newVal) => {
            updateWatch(newVal)
        },
        { deep: true },
    )

    onBeforeMount(() => {
        update(params)
    })
}
