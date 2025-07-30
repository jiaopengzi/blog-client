/*
 * FilePath    : blog-client\src\components\layout\main-content\hooks.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : hooks
 */

import { useStatusStore } from "@/stores/status"

// 设置文章详情
export function usePostDetail() {
    const statusStore = useStatusStore()

    const handlePostId = async (postID: string) => {
        await statusStore.setPostId(postID)
        await statusStore.setPostDetail()

        // 滚动到顶部
        window.scrollTo({
            top: 0,
            behavior: "auto",
        })
    }

    return {
        handlePostId,
    }
}
