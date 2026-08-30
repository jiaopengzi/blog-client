/*
 * FilePath    : blog-client-nuxt\src\utils\updateHead.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 更新 store 中的 head 信息
 */

// Nuxt 适配: 仅需 HeadProps 类型, 直接指向 types 文件(head-tag 组件由阶段 5 useSeo 替代)
import { type HeadProps } from "@/components/common/head-tag/types"
import { useOptionsStore } from "@/stores/options"

export const updateHead = async (head: HeadProps) => {
    const optionsStore = useOptionsStore()
    await optionsStore.updateFavicon()
    await optionsStore.updateHead(head)
}
