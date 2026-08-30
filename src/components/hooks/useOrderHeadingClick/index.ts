/*
 * FilePath    : blog-client-nuxt\src\components\hooks\useOrderHeadingClick\index.ts
 * Author      : jiaopengzi
 * Blog        : https://jiaopengzi.com
 * Copyright   : Copyright (c) 2025 by jiaopengzi, All Rights Reserved.
 * Description : 订单标题点击跳转 hook
 */

import { type OrderGetByIDRes, ProductType } from "@/api/order/common"
import type { TableData } from "@/components/common/base-table"
import { usePostView } from "@/components/hooks/usePostView"

function getOrderPostId(row: OrderGetByIDRes): string | undefined {
    if (row.items?.length !== 1) {
        return undefined
    }

    // noUncheckedIndexedAccess 下 items[0] 类型为 T | undefined, 经长度守卫后仍无法收窄,
    // 用可选链保持原业务语义 (items 长度为 1 时必取到首项)
    const item = row.items[0]
    if (item?.product_type !== ProductType.Post || !item?.related_id) {
        return undefined
    }

    return item.related_id
}

export function useOrderHeadingClick() {
    const { handleViewPost } = usePostView()

    function handleHeadingClick(row: TableData) {
        const orderRow = row as OrderGetByIDRes
        const postId = getOrderPostId(orderRow)

        if (!postId) {
            return
        }

        handleViewPost(postId)
    }

    return { handleHeadingClick }
}
