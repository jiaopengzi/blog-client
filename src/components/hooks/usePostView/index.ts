/*
 * FilePath    : blog-client\src\components\hooks\usePostView\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章查看 hooks
 */

import { useRouter } from "vue-router"

import { Target } from "@/api/common"
import { PostStatusCode } from "@/api/post/common"
import { type ViewPostByIDRequest, viewPostByIDWithoutContentAPI } from "@/api/post/viewByID"
import { ResponseCode } from "@/api/response"
import { RouteNames } from "@/router"
import { useUserStore } from "@/stores/user"
import { MessageUtil } from "@/utils/message"

export enum queryKey {
    PostID = "post_id",
}

// 文章查看 hooks
export function usePostView() {
    const router = useRouter()
    const userStore = useUserStore()

    // 检查文章状态是否合法可查看
    const checkPostStatus = async (postID: string): Promise<boolean> => {
        // 边界情况,postID 为空
        if (!postID) {
            router.push({ name: RouteNames.NotFound })
            return false
        }

        // 请求查看文章(不含内容)
        const req: ViewPostByIDRequest = {
            post_id: postID,
        }
        const res = await viewPostByIDWithoutContentAPI(req)

        // 处理返回结果
        if (
            res.data.code === ResponseCode.PostViewByIDSuccess ||
            res.data.code === ResponseCode.PostViewPasswordIsEmpty ||
            res.data.code === ResponseCode.PostViewPasswordIsError
        ) {
            const postData = res.data.data

            // 如果是草稿、定时发布、过期 则不能前台查看
            if (
                postData.post_status === PostStatusCode.Draft ||
                postData.post_status === PostStatusCode.Future ||
                postData.post_status === PostStatusCode.Expired
            ) {
                MessageUtil.warning("草稿、定时发布、过期 状态的文章不能前台查看")
                return false
            }

            // 如果是私密文章且当前用户不是作者，则不能前台查看
            if (postData.post_status === PostStatusCode.Private && postData.author_info.id !== userStore.data.user.id.toString()) {
                MessageUtil.warning("他人的私密文章不能前台查看")
                return false
            }
        } else {
            router.push({ name: RouteNames.NotFound })
            return false
        }

        return true
    }

    // 处理查看文章详情
    const handleViewPost = async (postID: string, target: Target = Target.Self) => {
        // 先检查文章状态是否合法可查看
        if (!(await checkPostStatus(postID))) {
            return
        }

        // 根据 target 进行跳转
        if (target === Target.Blank) {
            const postUrl = `/?${queryKey.PostID}=${postID}`
            window.open(postUrl, "_blank")
            return
        }

        router.push({
            name: RouteNames.Home,
            query: { [queryKey.PostID]: postID },
        })
    }

    return {
        handleViewPost, // 处理查看文章详情
    }
}
