/*
 * FilePath    : blog-client\src\components\hooks\usePostDetail\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章详情
 */

import { onBeforeMount, type Reactive, watch } from "vue"

import { type ViewPostByIDRequest } from "@/api/post/viewByID"
import { EditorStateManager } from "@/components/editor"
import { useBreadcrumbStore } from "@/stores/breadcrumb"

import { useGetData } from "./api"
import { useUtils } from "./utils"

export function usePostDetail(
    queryParams: Reactive<ViewPostByIDRequest>, // 查询参数
) {
    const manager = new EditorStateManager({ isRemoveFirstH1: true })
    let state = manager.getState()

    const breadcrumbStore = useBreadcrumbStore()
    const { postMeta, getPostDetail } = useGetData(manager)

    const { updateRouterPush, updateQueryParams, generateBreadcrumbPath } = useUtils(queryParams)

    // 点击作者
    const clickAuthorId = (val: string) => {
        console.log("============>author", val)
    }

    // 点击文章
    const editPost = (val: string) => {
        console.log("============>edit", val)
    }

    //  解析参数并更新面包屑
    const updateBreadcrumbFromPostId = () => {
        const { post_id } = queryParams

        // 解析关键字
        if (post_id) {
            breadcrumbStore.updateItems(post_id, generateBreadcrumbPath())
        }

        if (!post_id) {
            // 清空面包屑
            breadcrumbStore.init()
        }
    }

    // 通过路由更新数据
    const updateByRoute = async () => {
        await updateRouterPush()
        await updateQueryParams()
        await getPostDetail(queryParams)
        state = manager.getState()
        updateBreadcrumbFromPostId()
    }

    watch(
        () => queryParams,
        async () => {
            await updateByRoute()
        },

        { deep: true },
    )

    onBeforeMount(async () => {
        await updateByRoute()
    })

    return {
        manager,
        state,
        postMeta,
        clickAuthorId,
        editPost,
    }
}
