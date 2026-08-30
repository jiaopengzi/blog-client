/*
 * FilePath    : blog-client-nuxt\src\components\hooks\usePostDetail\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章详情 hooks
 */

import { storeToRefs } from "pinia"
import { type Reactive, type Ref, watch } from "vue"

import { type ViewPostByIDRequest } from "@/api/post/viewByID"
import { type QueryParamsOptions } from "@/api/request"
import { PostDetailType } from "@/components/common/post-detail"
// Nuxt 适配: 仅需 queryKey 常量, 直接指向 types 文件 (避免引入 post-upsert 编辑器组件树)
import { queryKey as queryKeyUpsert } from "@/components/common/post-upsert/types"
// Nuxt 适配 (feature02): 直接指向 state 文件, 避免引入编辑器 barrel (Editor/index.vue/CodeMirror/工具栏组件树) 进入 SSR 图
import { EditorStateManager } from "@/components/editor/state"
import { RouteNames } from "@/router"
import { useBreadcrumbStore } from "@/stores/breadcrumb"
import { useOptionsStore } from "@/stores/options"
import { useUserStore } from "@/stores/user"

import { useRootUtils } from "../useRootUtils"
import { useGetData } from "./api"

/**
 * @description: 在正文已经可展示后, 再异步执行非首屏关键副作用, 避免阻塞详情正文先出现
 * @param tasks 需要延后执行的任务列表
 * @return {void}
 */
export const runPostDetailSideEffects = (tasks: Array<Promise<unknown>>): void => {
    if (tasks.length === 0) {
        return
    }

    void Promise.allSettled(tasks).then((results) => {
        results.forEach((result) => {
            if (result.status === "rejected") {
                console.warn("文章详情副作用任务执行失败", result.reason)
            }
        })
    })
}

export function usePostDetail(
    detailType: Ref<PostDetailType>, // 页面类型
    queryParams: Reactive<ViewPostByIDRequest>, // 查询参数
    hash: Ref<string>, // hash值
) {
    const userStore = useUserStore()
    const optionsStore = useOptionsStore()

    const { isLogin } = storeToRefs(userStore)
    const { is_remove_first_h1 } = storeToRefs(optionsStore)

    const router = useRouter()
    const route = useRoute()

    // 字符串类型的 key
    const stringKeys: StringKeys<ViewPostByIDRequest>[] = ["post_id"]

    const options: Reactive<QueryParamsOptions<ViewPostByIDRequest>> = {
        stringKeys,
        // Nuxt 适配: /p/[id] 的 post_id 来自路径参数, updateQueryParams 清空时保留
        persistKeys: ["post_id"],
        hash: hash.value, // 文章标题 hash 值
    }

    watch(
        () => hash.value,
        (newHash) => {
            options.hash = newHash
        },
        { immediate: true },
    )

    const breadcrumbStore = useBreadcrumbStore()

    const manager = new EditorStateManager({ isRemoveFirstH1: is_remove_first_h1.value })
    const state = manager.getState()

    const {
        postMeta, // 文章元数据
        isPasswordPost, // 是否是密码保护文章
        applyPostData, // 应用文章数据(feature02: SSR/客户端共用入口)
        setIsPasswordPost, // 设置密码保护标记(feature02: 页面 SSR 数据流驱动)
        latestViewCount, // 最近一次接口返回的浏览量(feature02: 水合后回填)
        copyright, // 版权信息
        prevNext, // 上一篇和下一篇文章信息
        updatedAt, // 更新时间
        categoryTag, // 分类和标签
        commentStatus, // 评论状态
        getPostDetail, // 获取文章详情
        updatePostInteraction, // 更新文章交互状态
        setPostLike, // 设置文章点赞
        setPostStar, // 设置文章收藏
        updateHeadInfo, // 更新头部信息
        getPrevNext, // 获取上一篇和下一篇文章信息
    } = useGetData(manager, hash)

    const {
        updateRouterPush, // 更新查询参数和路由
        updateQueryParams, // 从URL中解析参数
        clearParamsExcept, // 清空除了指定参数的查询条件
        generateBreadcrumbPath, // 生成面包屑路径
    } = useRootUtils(queryParams, options)

    // 通过路由更新数据
    const updateByRoute = async (password: string = "") => {
        if (detailType.value === PostDetailType.Post) {
            await updateQueryParams()
        }

        // 如果是密码保护文章, 则传递密码
        if (password) {
            queryParams.password = password
        }

        await getPostDetail(queryParams)
        updateBreadcrumb()

        if (detailType.value === PostDetailType.Post && queryParams.post_id) {
            const sideEffects: Array<Promise<unknown>> = [getPrevNext({ post_id: queryParams.post_id })]

            if (isLogin.value) {
                sideEffects.push(updatePostInteraction(queryParams))
            }

            runPostDetailSideEffects(sideEffects)
        }
    }

    // 更新文章详情(不使用监控路由更新)
    const updatePostDetail = async (id: string, password: string = "") => {
        queryParams.post_id = id
        if (detailType.value === PostDetailType.Post && route.name === "post") {
            clearParamsExcept(["post_id"])
            // Nuxt 适配: 已在文章路由 /p/:id 上时, 无需再经首页 query 中转 (避免 legacy 301 重定向循环)
            const onPostRoute = route.name === "post" && String(route.params.id ?? "") === String(id)
            if (!onPostRoute) {
                await updateRouterPush()
            }
        }
        await updateByRoute(password)
        void updateHeadInfo().catch((error) => {
            console.warn("更新文章头部信息失败", error)
        })
    }

    // 点击作者
    const clickAuthorUserName = (val: string) => {
        router.push({
            name: RouteNames.UserPublicProfile,
            params: { username: val },
        })
    }

    // 编辑文章
    const editPost = (val: string) => {
        let routeName
        switch (detailType.value) {
            case PostDetailType.Post:
                routeName = RouteNames.PostWrite
                break
            case PostDetailType.Page:
                routeName = RouteNames.PageWrite
                break
            default:
                routeName = RouteNames.PostWrite
        }
        // Nuxt 适配: admin 子页为 [...slug] catch-all, SPA 命名路由不存在, 改按路径跳转
        router.push({
            path: `/admin/${routeName}`,
            query: { [queryKeyUpsert.ID]: val },
        })
    }

    // 更新面包屑
    const updateBreadcrumb = () => {
        const { post_id } = queryParams

        // 解析关键字
        if (post_id) {
            breadcrumbStore.updateItems(postMeta.value.post_title!, generateBreadcrumbPath())
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
        applyPostData, // 应用文章数据(feature02: SSR/客户端共用入口)
        setIsPasswordPost, // 设置密码保护标记(feature02: 页面 SSR 数据流驱动)
        latestViewCount, // 最近一次接口返回的浏览量(feature02: 水合后回填)
        updateBreadcrumb, // 更新面包屑(feature02: 客户端水合后同步)
        manager, // 详情页状态管理器
        state, // 编辑器状态
        postMeta, // 文章元数据
        isPasswordPost, // 是否是密码保护文章
        copyright, // 版权信息
        prevNext, // 上一篇和下一篇文章信息
        updatedAt, // 更新时间
        categoryTag, // 分类和标签
        commentStatus, // 评论状态
        clickAuthorUserName, // 点击作者
        editPost, // 编辑文章
        setPostLike, // 设置文章点赞
        setPostStar, // 设置文章收藏
        getPrevNext, // 获取上一篇和下一篇文章信息(feature02: prop 驱动流程补拉)
        updatePostInteraction, // 更新文章交互状态(feature02: prop 驱动流程补拉)
        runPostDetailSideEffects, // 详情副作用统一入口(feature02: prop 驱动流程复用)
    }
}
