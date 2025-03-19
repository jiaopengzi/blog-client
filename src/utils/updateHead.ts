/*
 * FilePath    : blog-client\src\utils\updateHead.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 更新 store 中的 head 信息
 */

import { type HeadProps } from "@/components/common/head-tag"
import { useOptionsStore } from "@/stores/options"

export const updateHead = async (head: HeadProps) => {
    const optionsStore = useOptionsStore()
    await optionsStore.updateHead(head)
}
