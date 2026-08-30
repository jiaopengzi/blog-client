/*
 * FilePath    : blog-client-nuxt\src\components\hooks\useParams\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 路由参数解析回响应式变量
 */

import { onBeforeMount, type Reactive, type Ref, ref, watch } from "vue"

import type { PaginationRequest } from "@/api/request"
import type { Pagination } from "@/api/response"

/**
 * @description: 解析路由参数回响应式变量
 * @param params 路由参数
 * @param pagination 分页信息
 * @param search 搜索关键字
 */
export function useParams<T, K extends PaginationRequest>(params: Reactive<K>, pagination: Reactive<Pagination<T>>, search: Ref<string> = ref("")): void {
    // 将路由参数同步回 search 与 pagination
    const update = (p: Reactive<K>) => {
        const { key_word, page_size, current_page } = p
        search.value = key_word || ""
        pagination.page_size = page_size || 10
        pagination.current_page = current_page || 1
    }

    // 监控 params, 变化时重新解析
    watch(
        () => params,
        (newVal) => {
            update(newVal)
        },
        { deep: true },
    )

    onBeforeMount(() => {
        update(params)
    })
}
