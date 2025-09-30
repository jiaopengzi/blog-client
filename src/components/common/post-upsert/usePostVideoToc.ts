/*
 * FilePath    : blog-client\src\components\common\post-upsert\usePostVideoToc.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 视频目录逻辑
 */
import { type Reactive } from "vue"

import type { PostVideoTocTree } from "@/api/post/common"

import type { UpsertPostForm } from "./types"

/**
 * 使用开关项
 * @param postInfoForm 文章表单
 */
export function usePostVideoToc(postInfoForm: Reactive<UpsertPostForm>) {
    const handleUpdate = (val: PostVideoTocTree[]) => {
        postInfoForm.video_toc = val
    }

    return {
        handleUpdate,
    }
}
