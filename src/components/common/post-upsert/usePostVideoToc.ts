/*
 * FilePath    : blog-client\src\components\common\post-upsert\usePostVideoToc.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 视频目录逻辑
 */
import { computed, type Reactive } from "vue"

import type { PostVideoTocTree } from "@/api/post/common"

import type { UpsertPostForm } from "./types"

/**
 * 使用开关项
 * @param postInfoForm 文章表单
 */
export function usePostVideoToc(postInfoForm: Reactive<UpsertPostForm>) {
    // 默认目录
    const defaultToc = (): PostVideoTocTree[] => {
        return [
            {
                id: 1,
                label: "目录",
                is_chapter: true,
            },
        ]
    }

    // 是否显示添加目录按钮
    const isShowAddTocBtn = computed(() => postInfoForm.video_toc.length === 0 && postInfoForm.video_file_id_hash_list.length === 0)

    // 添加默认目录
    const addDefaultToc = () => {
        if (postInfoForm.video_toc.length === 0) {
            postInfoForm.video_toc = defaultToc()
        }
    }

    // 更新目录
    const handleUpdate = (val: PostVideoTocTree[], fileIdHashList: string[]) => {
        postInfoForm.video_toc = val
        postInfoForm.video_file_id_hash_list = fileIdHashList
    }

    return {
        defaultToc,
        handleUpdate,
        isShowAddTocBtn,
        addDefaultToc,
    }
}
