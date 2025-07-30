/*
 * FilePath    : blog-client\src\components\common\post-detail\hooks\useHeading.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 标题相关的hook
 */

import { ref } from "vue"

import { type HeadingObject } from "@/components/editor/components/preview"

export function useHeading() {
    // 是否更新目录
    const updateHeadingFlag = ref(false)

    // 文章的所有 h 标签
    const allHeadingMap: Map<string, HeadingObject> = new Map()

    // 更新目录
    const updateHeadingMap = (val: Map<string, HeadingObject>) => {
        allHeadingMap.clear()
        val.forEach((item) => {
            allHeadingMap.set(item.id, item)
        })
        updateHeadingFlag.value = true // 更新目录
    }

    return {
        allHeadingMap,
        updateHeadingFlag,
        updateHeadingMap,
    }
}
