/**
 * @FilePath     : \blog-client\src\components\hooks\useHome\index.ts
 * @Author       : jiaopengzi
 * @Blog         : https://jiaopengzi.com
 * @Copyright    : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * @Description  : 首页 hooks
 */

import { storeToRefs } from "pinia"
import { type Reactive, type Ref, watch } from "vue"
import { useRouter } from "vue-router"

import { type ViewPostByIDRequest } from "@/api/post/viewByID"
import { type QueryParamsOptions } from "@/api/request"
import { PostDetailType } from "@/components/common/post-detail"
import { queryKey as queryKeyUpsert } from "@/components/common/post-upsert"
import { EditorStateManager } from "@/components/editor"
import { RouteNames } from "@/router"
import { useBreadcrumbStore } from "@/stores/breadcrumb"
import { useOptionsStore } from "@/stores/options"
import { useUserStore } from "@/stores/user"

import { useRootUtils } from "../useRootUtils"
import { useGetData } from "./api"

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

    // 字符串类型的key
    const stringKeys: StringKeys<ViewPostByIDRequest>[] = ["post_id"]

    const options: Reactive<QueryParamsOptions<ViewPostByIDRequest>> = {
        stringKeys,
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
    const updateByRoute = async () => {
        if (detailType.value === PostDetailType.Post) {
            await updateQueryParams()
            await getPrevNext({ post_id: queryParams.post_id })
            if (isLogin.value) {
                await updatePostInteraction(queryParams)
            }
        }
        await getPostDetail(queryParams)
        updateBreadcrumb()
    }

    // 更新文章详情(不使用监控路由更新)
    const updatePostDetail = async (id: string) => {
        queryParams.post_id = id
        if (detailType.value === PostDetailType.Post) {
            clearParamsExcept(["post_id"])
            await updateRouterPush()
        }
        await updateByRoute()
        await updateHeadInfo()
    }

    // 点击作者
    const clickAuthorId = (val: string) => {
        // console.log("============>author", val)
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
        // 编辑文章
        router.push({
            name: routeName,
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
        manager, // 详情页状态管理器
        state, // 编辑器状态
        postMeta, // 文章元数据
        copyright, // 版权信息
        prevNext, // 上一篇和下一篇文章信息
        updatedAt, // 更新时间
        categoryTag, // 分类和标签
        commentStatus, // 评论状态
        clickAuthorId, // 点击作者
        editPost, // 编辑文章
        setPostLike, // 设置文章点赞
        setPostStar, // 设置文章收藏
    }
}
