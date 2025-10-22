/*
 * FilePath    : blog-client\src\components\hooks\usePostView\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 文章查看 hooks
 */

import { useRouter } from "vue-router"

import { RouteNames } from "@/router"

export enum queryKey {
    PostID = "post_id",
}

export function usePostView() {
    const router = useRouter()

    // 处理查看文章详情
    const handleViewPost = (postID: string) => {
        router.push({
            name: RouteNames.Home,
            query: { [queryKey.PostID]: postID },
        })
    }

    return {
        handleViewPost, // 处理查看文章详情
    }
}
