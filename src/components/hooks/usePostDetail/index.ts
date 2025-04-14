/**
 * @FilePath     : \blog-client\src\components\hooks\useHome\index.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 首页 hooks
 */

import { type Reactive } from "vue"

import { type ViewPostByIDRequest } from "@/api/post/viewByID"
import { type QueryParamsOptions } from "@/api/request"
import { EditorStateManager } from "@/components/editor"
import { useBreadcrumbStore } from "@/stores/breadcrumb"

import { useRootUtils } from "../useRootUtils"
import { useGetData } from "./api"

export function usePostDetail(
    queryParams: Reactive<ViewPostByIDRequest>, // 查询参数
) {
    // 字符串类型的key
    const stringKeys: StringKeys<ViewPostByIDRequest>[] = ["post_id"]

    const options: QueryParamsOptions<ViewPostByIDRequest> = {
        stringKeys,
    }

    const breadcrumbStore = useBreadcrumbStore()

    const manager = new EditorStateManager({ isRemoveFirstH1: true })
    const state = manager.getState()

    const { postMeta, getPostDetail } = useGetData(manager)

    const {
        updateRouterPush, // 更新查询参数和路由
        updateQueryParams, // 从URL中解析参数
        clearParamsExcept, // 清空除了指定参数的查询条件
        generateBreadcrumbPath, // 生成面包屑路径
    } = useRootUtils(queryParams, options)

    // 通过路由更新数据
    const updateByRoute = async () => {
        await updateQueryParams()
        await getPostDetail(queryParams)
        updateBreadcrumb()
    }

    // 更新文章详情(不使用监控路由更新)
    const updatePostDetail = async (id: string) => {
        clearParamsExcept(["post_id"])
        queryParams.post_id = id
        await updateRouterPush()
        await updateByRoute()
    }

    // 点击作者
    const clickAuthorId = (val: string) => {
        console.log("============>author", val)
    }

    // 点击文章
    const editPost = (val: string) => {
        console.log("============>edit", val)
    }

    // 更新面包屑
    const updateBreadcrumb = () => {
        const { post_id } = queryParams

        // 解析关键字
        if (post_id) {
            breadcrumbStore.updateItems(post_id, generateBreadcrumbPath())
        }

        // 清空面包屑
        if (!post_id) {
            breadcrumbStore.init()
        }
    }

    return {
        updateRouterPush, // 更新查询参数和路由
        updateByRoute, // 通过路由更新数据
        clearParamsExcept, // 清空除了指定参数的查询条件
        updatePostDetail, // 更新文章详情
        manager, // 详情页状态管理器
        state, // 编辑器状态
        postMeta, // 文章元数据
        clickAuthorId, // 点击作者
        editPost, // 编辑文章
    }
}
