/*
 * FilePath    : blog-client\src\components\common\post-list-admin\api.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : api 请求参数添加必要的 postType
 */

import { PostType } from "@/api/post/common"
import { viewPostByAdminAPI, type ViewPostByAdminRequest } from "@/api/post/viewByAdmin"

// 添加 postType 到请求参数中
export function useAPI(postType: PostType) {
    const viewAPIByPostType = async (req: ViewPostByAdminRequest) => {
        // 将 postType 添加到请求参数中
        req.post_type = postType
        return await viewPostByAdminAPI(req)
    }

    return {
        viewAPIByPostType,
    }
}
